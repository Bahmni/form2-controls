import {
  FHIR_OBSERVATION_INTERPRETATION_SYSTEM,
  FHIR_OBSERVATION_FORM_NAMESPACE_PATH_URL,
  FHIR_OBSERVATION_COMPLEX_DATA_URL,
  CONCEPT_DATATYPE_NUMERIC,
  CONCEPT_DATATYPE_COMPLEX,
  FHIR_OBSERVATION_STATUS_FINAL,
  FHIR_RESOURCE_TYPE_OBSERVATION,
  DATE_REGEX_PATTERN,
  INTERPRETATION_TO_CODE,
} from 'src/constants/fhir';
import { NUMBER, STRING, BOOLEAN, OBJECT } from 'src/constants';

const createCoding = (code, systemURL, display) => {
  const coding = { code };
  if (systemURL) {
    coding.system = systemURL;
  }
  if (display) {
    coding.display = display;
  }
  return coding;
};

/**
 * Creates a FHIR CodeableConcept object
 * @param {Array} coding - Array of Coding objects
 * @param {string} [displayText] - Display text for the concept
 * @returns {Object} FHIR CodeableConcept object
 */
const createCodeableConcept = (coding, displayText) => {
  const concept = { coding };
  if (displayText) {
    concept.text = displayText;
  }
  return concept;
};

/**
 * Generates a UUID v4
 * @returns {string} UUID string
 */
const generateUUID = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for environments without crypto.randomUUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Handles string value conversion for FHIR observation
 * @param {string} value - The string value
 * @param {Object} observation - The FHIR observation being built
 * @param {string} [conceptDatatype] - The concept datatype
 */
const handleStringValue = (value, observation, conceptDatatype) => {
  const trimmedValue = value.trim();

  if (trimmedValue === '') {
    return;
  }

  if (DATE_REGEX_PATTERN.test(trimmedValue)) {
    const dateValue = new Date(trimmedValue);
    if (!isNaN(dateValue.getTime())) {
      observation.valueDateTime = dateValue.toISOString();
      return;
    }
  }

  if (conceptDatatype === CONCEPT_DATATYPE_NUMERIC) {
    const numericValue = parseFloat(trimmedValue);
    if (!isNaN(numericValue)) {
      observation.valueQuantity = { value: numericValue };
      return;
    }
  }

  observation.valueString = value;
};

/**
 * Creates a single FHIR Observation resource from a form2 observation
 * @param {Object} observationPayload - The form2 observation data
 * @param {Object} options - Configuration options
 * @param {Object} options.patientReference - FHIR Reference to patient
 * @param {Object} options.encounterReference - FHIR Reference to encounter
 * @param {Object} options.performerReference - FHIR Reference to performer
 * @returns {Object} FHIR Observation resource
 */
const createObservationResource = (observationPayload, options) => {
  const { patientReference, encounterReference, performerReference } = options;

  const conceptUuid =
    typeof observationPayload.concept === 'object'
      ? observationPayload.concept.uuid
      : observationPayload.concept;

  const observation = {
    resourceType: FHIR_RESOURCE_TYPE_OBSERVATION,
    status: FHIR_OBSERVATION_STATUS_FINAL,
    code: createCodeableConcept([createCoding(conceptUuid)]),
    subject: patientReference,
    encounter: encounterReference,
    performer: [performerReference],
    effectiveDateTime:
      observationPayload.obsDatetime ||
      observationPayload.observationDateTime ||
      new Date().toISOString(),
  };

  const value = observationPayload.value;
  const conceptDatatype =
    typeof observationPayload.concept === 'object'
      ? observationPayload.concept.datatype
      : undefined;

  if (value !== null && value !== undefined) {
    switch (typeof value) {
      case NUMBER:
        observation.valueQuantity = { value };
        break;
      case STRING: {
        if (conceptDatatype === CONCEPT_DATATYPE_COMPLEX && value.trim() !== '') {
          observation.extension = observation.extension || [];
          observation.extension.push({
            url: FHIR_OBSERVATION_COMPLEX_DATA_URL,
            valueAttachment: { url: value },
          });
          observation.valueString = value;
        } else {
          handleStringValue(value, observation, conceptDatatype);
        }
        break;
      }
      case BOOLEAN:
        observation.valueBoolean = value;
        break;
      case OBJECT:
        if (value instanceof Date && !isNaN(value.getTime())) {
          observation.valueDateTime = value.toISOString();
        } else if (value && 'uuid' in value) {
          observation.valueCodeableConcept = createCodeableConcept([
            createCoding(value.uuid, undefined, value.display || value.displayString),
          ]);
        }
        break;
    }
  }

  if (observationPayload.interpretation) {
    const interpretationString = String(observationPayload.interpretation);
    const interpretationValue = interpretationString.toUpperCase();
    const mapping =
      INTERPRETATION_TO_CODE[interpretationValue] || INTERPRETATION_TO_CODE.NORMAL;

    observation.interpretation = [
      {
        coding: [
          {
            system: FHIR_OBSERVATION_INTERPRETATION_SYSTEM,
            code: mapping.code,
            display: mapping.display,
          },
        ],
      },
    ];
  }

  if (observationPayload.formNamespace && observationPayload.formFieldPath) {
    observation.extension = observation.extension || [];
    observation.extension.push({
      url: FHIR_OBSERVATION_FORM_NAMESPACE_PATH_URL,
      valueString: `${observationPayload.formNamespace}^${observationPayload.formFieldPath}`,
    });
  }

  if (observationPayload.comment) {
    observation.note = [
      {
        text: observationPayload.comment,
      },
    ];
  }

  return observation;
};

/**
 * Transforms Container observations to FHIR Observation resources
 *
 * @example
 * const fhirObservations = transformToFhir(observations, {
 *   patientReference: { reference: 'Patient/uuid' },
 *   encounterReference: { reference: 'Encounter/uuid' },
 *   performerReference: { reference: 'Practitioner/uuid' }
 * });
 *
 * @param {Array} observations - Raw observations from Container.getValue() or transformed Form2Observation[]
 * @param {Object} options - Configuration options
 * @param {Object} options.patientReference - FHIR Reference to patient (e.g., { reference: 'Patient/uuid' })
 * @param {Object} options.encounterReference - FHIR Reference to encounter (e.g., { reference: 'Encounter/uuid' })
 * @param {Object} options.performerReference - FHIR Reference to performer (e.g., { reference: 'Practitioner/uuid' })
 * @returns {Array<{resource: Object, fullUrl: string}>} Array of FHIR Observation bundle entries
 */
export function transformToFhir(observations, options) {
  
  if (!options || !options.patientReference || !options.encounterReference || !options.performerReference) {
  throw new Error('transformToFhir requires patientReference, encounterReference, and performerReference in options');
  }

  if (!observations || !Array.isArray(observations)) {
    return [];
  }

  const results = [];

  for (const obs of observations) {
    // Handle voided observations
    if (obs.voided) {
      continue;
    }

    if (obs.groupMembers && obs.groupMembers.length > 0) {
      // Recursively process group members
      const memberResults = transformToFhir(obs.groupMembers, options);
      results.push(...memberResults);

      // Create parent observation with hasMember references
      const parentObservation = createObservationResource(obs, options);
      parentObservation.hasMember = memberResults.map((member) => ({
        reference: member.fullUrl,
        type: 'Observation',
      }));

      const parentUuid = generateUUID();
      const parentFullUrl = `urn:uuid:${parentUuid}`;

      results.push({
        resource: {
          ...parentObservation,
          id: parentUuid,
        },
        fullUrl: parentFullUrl,
      });
    } else {
      const observation = createObservationResource(obs, options);
      const uuid = generateUUID();
      const fullUrl = `urn:uuid:${uuid}`;

      results.push({
        resource: {
          ...observation,
          id: uuid,
        },
        fullUrl,
      });
    }
  }

  return results;
}

export default transformToFhir;
