import {
  FHIR_OBSERVATION_FORM_NAMESPACE_PATH_URL,
  FHIR_OBSERVATION_VALUE_ATTACHMENT_URL,
  CODE_TO_INTERPRETATION,
} from 'src/constants/fhir';

/**
 * Normalise the transformer input into a flat array of Observation resources.
 *
 * Accepts:
 *   - A FHIR Bundle  { resourceType: 'Bundle', entry: [{resource, fullUrl}] }
 *   - An array of bundle entries  [{resource, fullUrl}]
 *   - An array of raw Observation resources  [{resourceType: 'Observation', ...}]
 *
 * Always returns an array of objects with shape { resource, fullUrl }.
 */
// Keep only usable entry objects so downstream indexing never sees null/non-objects.
const isObject = (value) => typeof value === 'object' && value !== null;

const normaliseInput = (input) => {
  if (!input) return [];

  // Full FHIR Bundle
  if (!Array.isArray(input) && input.resourceType === 'Bundle') {
    return Array.isArray(input.entry) ? input.entry.filter(isObject) : [];
  }

  if (!Array.isArray(input)) return [];
  if (input.length === 0) return [];

  // Detect bundle-entry style by checking if elements have 'resource' or 'fullUrl' own keys.
  // We check 'fullUrl' (always present in outbound output) rather than resource value truthiness,
  // because a malformed entry may carry resource: null but still be a bundle entry.
  const first = input.find(isObject);
  if (first && ('fullUrl' in first || 'resource' in first)) {
    return input.filter(isObject);
  }

  // Plain Observation resources — wrap them (skip falsy/non-object resources)
  return input
    .filter(isObject)
    .map((res) => ({ resource: res, fullUrl: `Observation/${res.id || ''}` }));
};

/**
 * Build a multi-key index of all entries so we can resolve hasMember references
 * using any of the common reference forms:
 *   - exact fullUrl match   (e.g. "urn:uuid:abc123")
 *   - "urn:uuid:{id}"
 *   - "Observation/{id}"
 *   - bare resource id
 */
const buildResourceIndex = (entries) => {
  const index = new Map();
  for (const entry of entries) {
    const { resource, fullUrl } = entry;
    if (!resource) continue;

    if (fullUrl) {
      index.set(fullUrl, resource);
    }
    if (resource.id) {
      index.set(`urn:uuid:${resource.id}`, resource);
      index.set(`Observation/${resource.id}`, resource);
      index.set(resource.id, resource);
    }
  }
  return index;
};

/**
 * Extract all fullUrls that are referenced as hasMember children so we can
 * determine which observations are at the top level.
 */
const collectChildRefs = (entries) => {
  const childRefs = new Set();
  for (const entry of entries) {
    const { resource } = entry;
    if (!resource || !Array.isArray(resource.hasMember)) continue;
    for (const ref of resource.hasMember) {
      if (ref && ref.reference) {
        childRefs.add(ref.reference);
      }
    }
  }
  return childRefs;
};

/**
 * Resolve a hasMember reference string to the underlying resource using the index.
 * The reference may be a fullUrl, "urn:uuid:{id}", "Observation/{id}", or bare id.
 */
const resolveReference = (reference, index) => {
  if (!reference) return undefined;
  return (
    index.get(reference) ||
    index.get(`urn:uuid:${reference}`) ||
    index.get(`Observation/${reference}`) ||
    undefined
  );
};

/**
 * Find an attachment-carrying extension.
 * Matches the Bahmni attachment extension URL, and also tolerates an extension
 * that carries a valueAttachment with a missing/undefined url — which is what the
 * outbound transformer currently emits (it references a constant that is not yet
 * exported from constants/fhir.js). This keeps the round-trip working without
 * greedily matching unrelated extensions that declare a different explicit url.
 */
const findAttachmentExtension = (resource) => {
  if (!Array.isArray(resource.extension)) return undefined;
  return resource.extension.find(
    (ext) =>
      ext &&
      ext.valueAttachment &&
      (ext.url === FHIR_OBSERVATION_VALUE_ATTACHMENT_URL || ext.url === undefined)
  );
};

/**
 * Infer the concept datatype from whichever FHIR value[x] field is present.
 */
const inferDatatype = (resource) => {
  if (resource.valueQuantity !== undefined) return 'Numeric';
  if (resource.valueBoolean !== undefined) return 'Boolean';
  if (resource.valueDateTime !== undefined) return 'Date';
  if (resource.valueCodeableConcept !== undefined) return 'Coded';
  if (resource.valueAttachment !== undefined) return 'Complex';
  if (findAttachmentExtension(resource)) return 'Complex';
  return 'Text';
};

/**
 * Extract a form2 value from the FHIR Observation resource.
 * Returns the extracted value, or undefined if nothing is found.
 */
const extractValue = (resource) => {
  // AC1 — numeric
  if (resource.valueQuantity !== undefined) {
    return resource.valueQuantity.value;
  }

  // AC4 — boolean
  if (resource.valueBoolean !== undefined) {
    return resource.valueBoolean;
  }

  // AC5 — date/datetime
  if (resource.valueDateTime !== undefined) {
    return resource.valueDateTime;
  }

  // AC3 — coded
  if (resource.valueCodeableConcept !== undefined) {
    const coding =
      resource.valueCodeableConcept.coding &&
      resource.valueCodeableConcept.coding[0];
    if (coding) {
      return { uuid: coding.code, display: coding.display };
    }
    return undefined;
  }

  // AC6 — native valueAttachment
  if (resource.valueAttachment !== undefined) {
    const att = resource.valueAttachment;
    return {
      url: att.url,
      fileName: att.title,
      contentType: att.contentType,
    };
  }

  // AC6 — attachment stored in an extension (tagged with the attachment URL, or
  // carrying a valueAttachment with a missing url as the outbound currently emits)
  const attachmentExt = findAttachmentExtension(resource);
  if (attachmentExt) {
    const att = attachmentExt.valueAttachment;
    return {
      url: att.url,
      fileName: att.title,
      contentType: att.contentType,
    };
  }

  // AC2 — free text (checked last so attachment extensions take precedence)
  if (resource.valueString !== undefined) {
    return resource.valueString;
  }

  return undefined;
};

/**
 * Map a single FHIR Observation resource to a plain form2 observation object.
 * Recursively resolves hasMember references into groupMembers.
 *
 * @param {Object} resource        - FHIR Observation resource
 * @param {Map}    resourceIndex   - Index built by buildResourceIndex()
 * @returns {Object|null}          - form2 observation, or null on unrecoverable error
 */
const mapObservation = (resource, resourceIndex) => {
  // concept.uuid from code.coding[0].code
  const coding = resource.code && resource.code.coding && resource.code.coding[0];
  const conceptUuid = coding ? coding.code : undefined;

  const conceptDisplay =
    (resource.code && resource.code.text) ||
    (coding && coding.display) ||
    undefined;

  const datatype = inferDatatype(resource);

  const concept = { uuid: conceptUuid, datatype };
  if (conceptDisplay) {
    concept.display = conceptDisplay;
  }

  const obs = { concept };

  // AC12 — timestamp
  if (resource.effectiveDateTime) {
    obs.obsDatetime = resource.effectiveDateTime;
  }

  // AC7/AC8 — group members (hasMember → recursive groupMembers)
  if (Array.isArray(resource.hasMember) && resource.hasMember.length > 0) {
    obs.value = null;
    const groupMembers = [];
    for (const ref of resource.hasMember) {
      const childResource = resolveReference(ref.reference, resourceIndex);
      if (!childResource) {
        console.warn(
          'FhirToObservationTransformer: Could not resolve hasMember reference',
          ref.reference
        );
        continue;
      }
      try {
        const childObs = mapObservation(childResource, resourceIndex);
        if (childObs) {
          groupMembers.push(childObs);
        }
      } catch (err) {
        console.warn(
          'FhirToObservationTransformer: Error mapping hasMember child',
          ref.reference,
          err
        );
      }
    }
    if (groupMembers.length > 0) {
      obs.groupMembers = groupMembers;
    }
  } else {
    // Scalar observation — extract value
    obs.value = extractValue(resource);
    if (obs.value === undefined) {
      obs.value = null;
    }
  }

  // AC11 — form namespace/path extension
  if (Array.isArray(resource.extension)) {
    const formPathExt = resource.extension.find(
      (ext) => ext.url === FHIR_OBSERVATION_FORM_NAMESPACE_PATH_URL
    );
    if (formPathExt && formPathExt.valueString) {
      const caretIdx = formPathExt.valueString.indexOf('^');
      if (caretIdx !== -1) {
        obs.formNamespace = formPathExt.valueString.slice(0, caretIdx);
        obs.formFieldPath = formPathExt.valueString.slice(caretIdx + 1);
      }
    }
  }

  // AC9 — comment. The outbound writes a single note, but a backend observation
  // may carry several; preserve all of them (newline-joined) so nothing is dropped.
  if (Array.isArray(resource.note)) {
    const noteText = resource.note
      .map((note) => note && note.text)
      .filter(Boolean)
      .join('\n');
    if (noteText) {
      obs.comment = noteText;
    }
  }

  // AC10 — interpretation
  if (Array.isArray(resource.interpretation) && resource.interpretation.length > 0) {
    const interpCoding =
      resource.interpretation[0].coding && resource.interpretation[0].coding[0];
    if (interpCoding && interpCoding.code) {
      const word = CODE_TO_INTERPRETATION[interpCoding.code];
      if (word) {
        obs.interpretation = word;
      }
    }
  }

  return obs;
};

/**
 * Transform a FHIR Observation Bundle (or array) back into plain form2 observation
 * objects suitable for pre-populating forms.
 *
 * This is the exact inverse of `getFhirObservations` from FhirObservationTransformer.
 *
 * @example
 *   // From a FHIR $fetch-all Bundle
 *   const observations = getObservationsFromFhir(fhirBundle);
 *
 *   // From a plain array of Observation resources
 *   const observations = getObservationsFromFhir(observationResources);
 *
 * @param {Object|Array|null|undefined} input
 *   - A FHIR Bundle `{ resourceType: 'Bundle', entry: [{resource, fullUrl}] }`
 *   - An array of bundle entries `[{resource, fullUrl}]`
 *   - An array of raw Observation resources
 *   - null/undefined (returns [])
 *
 * @returns {Array} Array of plain form2 observation objects:
 *   `{ concept: {uuid, datatype}, value, obsDatetime?, formNamespace?, formFieldPath?,
 *      comment?, interpretation?, groupMembers? }`
 */
export function getObservationsFromFhir(input) {
  // AC14 — null/undefined/non-array/empty input → return []
  if (input === null || input === undefined) return [];

  let entries;
  try {
    entries = normaliseInput(input);
  } catch (err) {
    console.warn('FhirToObservationTransformer: Failed to normalise input', err);
    return [];
  }

  if (!entries || entries.length === 0) return [];

  const resourceIndex = buildResourceIndex(entries);

  // Determine which entries are children (referenced by some hasMember)
  const childRefs = collectChildRefs(entries);

  // An entry is top-level if its fullUrl is not in childRefs AND none of its
  // id-derived keys are in childRefs.
  const isTopLevel = (entry) => {
    const { fullUrl, resource } = entry;
    if (fullUrl && childRefs.has(fullUrl)) return false;
    if (resource && resource.id) {
      if (childRefs.has(`urn:uuid:${resource.id}`)) return false;
      if (childRefs.has(`Observation/${resource.id}`)) return false;
      if (childRefs.has(resource.id)) return false;
    }
    return true;
  };

  const topLevelEntries = entries.filter(isTopLevel);

  const results = [];
  for (const entry of topLevelEntries) {
    const { resource } = entry;
    if (!resource) continue;
    try {
      const obs = mapObservation(resource, resourceIndex);
      if (obs) {
        results.push(obs);
      }
    } catch (err) {
      // AC14 — malformed observation: warn and skip, don't crash
      console.warn(
        'FhirToObservationTransformer: Error mapping observation, skipping',
        resource && resource.id,
        err
      );
    }
  }

  return results;
}

export default getObservationsFromFhir;
