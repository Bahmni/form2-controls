import getObservationsFromFhir from 'src/helpers/FhirToObservationTransformer';
import getFhirObservations from 'src/helpers/FhirObservationTransformer';
import {
  FHIR_OBSERVATION_FORM_NAMESPACE_PATH_URL,
  FHIR_OBSERVATION_VALUE_ATTACHMENT_URL,
  FHIR_OBSERVATION_INTERPRETATION_SYSTEM,
  CODE_TO_INTERPRETATION,
} from 'src/constants/fhir';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const makeEntry = (resource, id) => {
  const resourceId = id || resource.id || 'test-id';
  return {
    resource: { ...resource, id: resourceId },
    fullUrl: `urn:uuid:${resourceId}`,
  };
};

const makeConcept = (uuid, display) => ({
  coding: [{ code: uuid, display }],
  text: display,
});

const baseResource = (uuid, valueField) => ({
  resourceType: 'Observation',
  status: 'final',
  code: makeConcept(uuid, `Display for ${uuid}`),
  effectiveDateTime: '2024-06-01T10:00:00.000Z',
  ...valueField,
});

// ---------------------------------------------------------------------------
// AC1 — Numeric: valueQuantity.value → number
// ---------------------------------------------------------------------------

describe('AC1 — Numeric observation', () => {
  it('should map valueQuantity.value to a numeric form2 value', () => {
    const resource = baseResource('pulse-uuid', { valueQuantity: { value: 72 } });
    const result = getObservationsFromFhir([makeEntry(resource, 'id-1')]);

    expect(result).toHaveLength(1);
    expect(result[0].concept.uuid).toBe('pulse-uuid');
    expect(result[0].concept.datatype).toBe('Numeric');
    expect(result[0].value).toBe(72);
  });

  it('should preserve decimal numeric values', () => {
    const resource = baseResource('weight-uuid', { valueQuantity: { value: 75.5 } });
    const result = getObservationsFromFhir([makeEntry(resource, 'id-2')]);

    expect(result[0].value).toBe(75.5);
  });
});

// ---------------------------------------------------------------------------
// AC2 — Free-text: valueString → string
// ---------------------------------------------------------------------------

describe('AC2 — Text observation', () => {
  it('should map valueString to a text form2 value', () => {
    const resource = baseResource('cough-uuid', { valueString: 'cough' });
    const result = getObservationsFromFhir([makeEntry(resource, 'id-3')]);

    expect(result).toHaveLength(1);
    expect(result[0].concept.uuid).toBe('cough-uuid');
    expect(result[0].concept.datatype).toBe('Text');
    expect(result[0].value).toBe('cough');
  });

  it('should preserve multi-word string values', () => {
    const resource = baseResource('notes-uuid', { valueString: 'Patient has severe headache' });
    const result = getObservationsFromFhir([makeEntry(resource, 'id-4')]);

    expect(result[0].value).toBe('Patient has severe headache');
  });
});

// ---------------------------------------------------------------------------
// AC3 — Coded: valueCodeableConcept → { uuid, display }
// ---------------------------------------------------------------------------

describe('AC3 — Coded observation', () => {
  it('should map valueCodeableConcept to { uuid, display }', () => {
    const resource = baseResource('gender-uuid', {
      valueCodeableConcept: {
        coding: [{ code: 'male-uuid', display: 'Male' }],
      },
    });
    const result = getObservationsFromFhir([makeEntry(resource, 'id-5')]);

    expect(result).toHaveLength(1);
    expect(result[0].concept.datatype).toBe('Coded');
    expect(result[0].value).toEqual({ uuid: 'male-uuid', display: 'Male' });
  });

  it('should handle coded value without display', () => {
    const resource = baseResource('status-uuid', {
      valueCodeableConcept: {
        coding: [{ code: 'active-uuid' }],
      },
    });
    const result = getObservationsFromFhir([makeEntry(resource, 'id-6')]);

    expect(result[0].value).toEqual({ uuid: 'active-uuid', display: undefined });
  });
});

// ---------------------------------------------------------------------------
// AC4 — Boolean: valueBoolean → boolean
// ---------------------------------------------------------------------------

describe('AC4 — Boolean observation', () => {
  it('should map valueBoolean true to boolean true', () => {
    const resource = baseResource('smoking-uuid', { valueBoolean: true });
    const result = getObservationsFromFhir([makeEntry(resource, 'id-7')]);

    expect(result).toHaveLength(1);
    expect(result[0].concept.datatype).toBe('Boolean');
    expect(result[0].value).toBe(true);
  });

  it('should map valueBoolean false to boolean false', () => {
    const resource = baseResource('smoking-uuid', { valueBoolean: false });
    const result = getObservationsFromFhir([makeEntry(resource, 'id-8')]);

    expect(result[0].value).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// AC5 — Date: valueDateTime → date string
// ---------------------------------------------------------------------------

describe('AC5 — Date observation', () => {
  it('should map valueDateTime to a date string', () => {
    const resource = baseResource('dob-uuid', { valueDateTime: '2000-05-15T00:00:00.000Z' });
    const result = getObservationsFromFhir([makeEntry(resource, 'id-9')]);

    expect(result).toHaveLength(1);
    expect(result[0].concept.datatype).toBe('Date');
    expect(result[0].value).toBe('2000-05-15T00:00:00.000Z');
  });

  it('should map a plain date string (no time component)', () => {
    const resource = baseResource('dob-uuid', { valueDateTime: '1985-12-01' });
    const result = getObservationsFromFhir([makeEntry(resource, 'id-10')]);

    expect(result[0].value).toBe('1985-12-01');
  });
});

// ---------------------------------------------------------------------------
// AC6 — Attachment: valueAttachment / extension → { url, fileName, contentType }
// ---------------------------------------------------------------------------

describe('AC6 — Attachment / complex observation', () => {
  it('should map a native valueAttachment to { url, fileName, contentType }', () => {
    const resource = {
      ...baseResource('image-uuid', {}),
      valueAttachment: {
        url: 'http://example.com/image.jpg',
        title: 'image.jpg',
        contentType: 'image/jpeg',
      },
    };
    const result = getObservationsFromFhir([makeEntry(resource, 'id-11')]);

    expect(result).toHaveLength(1);
    expect(result[0].concept.datatype).toBe('Complex');
    expect(result[0].value).toEqual({
      url: 'http://example.com/image.jpg',
      fileName: 'image.jpg',
      contentType: 'image/jpeg',
    });
  });

  it('should map an attachment stored in the value-attachment extension', () => {
    const resource = {
      ...baseResource('image-uuid', { valueString: 'http://example.com/scan.pdf' }),
      extension: [
        {
          url: FHIR_OBSERVATION_VALUE_ATTACHMENT_URL,
          valueAttachment: {
            url: 'http://example.com/scan.pdf',
            title: 'scan.pdf',
            contentType: 'application/pdf',
          },
        },
      ],
    };
    const result = getObservationsFromFhir([makeEntry(resource, 'id-12')]);

    expect(result).toHaveLength(1);
    expect(result[0].concept.datatype).toBe('Complex');
    expect(result[0].value).toEqual({
      url: 'http://example.com/scan.pdf',
      fileName: 'scan.pdf',
      contentType: 'application/pdf',
    });
  });

  it('should prefer extension attachment over valueString when both are present', () => {
    const resource = {
      ...baseResource('file-uuid', { valueString: 'http://example.com/file.jpg' }),
      extension: [
        {
          url: FHIR_OBSERVATION_VALUE_ATTACHMENT_URL,
          valueAttachment: {
            url: 'http://example.com/file.jpg',
            title: 'file.jpg',
            contentType: 'image/jpeg',
          },
        },
      ],
    };
    const result = getObservationsFromFhir([makeEntry(resource, 'id-13')]);

    expect(result[0].value.fileName).toBe('file.jpg');
    expect(result[0].value.url).toBe('http://example.com/file.jpg');
  });
});

// ---------------------------------------------------------------------------
// AC7 — Group with hasMember
// ---------------------------------------------------------------------------

describe('AC7 — Observation group (hasMember → groupMembers)', () => {
  it('should resolve hasMember references into groupMembers array', () => {
    const pulseEntry = makeEntry(
      baseResource('pulse-uuid', { valueQuantity: { value: 72 } }),
      'child-1'
    );
    const bpEntry = makeEntry(
      baseResource('bp-uuid', { valueQuantity: { value: 120 } }),
      'child-2'
    );
    const parentResource = {
      ...baseResource('vitals-uuid', {}),
      id: 'parent-1',
      hasMember: [
        { reference: pulseEntry.fullUrl, type: 'Observation' },
        { reference: bpEntry.fullUrl, type: 'Observation' },
      ],
    };
    const parentEntry = { resource: parentResource, fullUrl: 'urn:uuid:parent-1' };

    const result = getObservationsFromFhir([pulseEntry, bpEntry, parentEntry]);

    expect(result).toHaveLength(1); // only the top-level parent
    const parent = result[0];
    expect(parent.concept.uuid).toBe('vitals-uuid');
    expect(parent.groupMembers).toHaveLength(2);
    expect(parent.groupMembers[0].concept.uuid).toBe('pulse-uuid');
    expect(parent.groupMembers[0].value).toBe(72);
    expect(parent.groupMembers[1].concept.uuid).toBe('bp-uuid');
    expect(parent.groupMembers[1].value).toBe(120);
  });

  it('parent observation value should be null when it has groupMembers', () => {
    const childEntry = makeEntry(baseResource('leaf-uuid', { valueString: 'val' }), 'c1');
    const parentResource = {
      ...baseResource('group-uuid', {}),
      id: 'p1',
      hasMember: [{ reference: childEntry.fullUrl }],
    };
    const parentEntry = { resource: parentResource, fullUrl: 'urn:uuid:p1' };

    const result = getObservationsFromFhir([childEntry, parentEntry]);

    expect(result[0].value).toBeNull();
    expect(result[0].groupMembers).toHaveLength(1);
  });
});

// ---------------------------------------------------------------------------
// AC8 — Nested groups (recursive hasMember → recursive groupMembers)
// ---------------------------------------------------------------------------

describe('AC8 — Nested observation groups', () => {
  it('should recursively resolve nested hasMember into nested groupMembers', () => {
    const leafEntry = makeEntry(
      baseResource('leaf-uuid', { valueString: 'nested value' }),
      'leaf-1'
    );
    const innerResource = {
      ...baseResource('inner-uuid', {}),
      id: 'inner-1',
      hasMember: [{ reference: leafEntry.fullUrl }],
    };
    const innerEntry = { resource: innerResource, fullUrl: 'urn:uuid:inner-1' };
    const outerResource = {
      ...baseResource('outer-uuid', {}),
      id: 'outer-1',
      hasMember: [{ reference: innerEntry.fullUrl }],
    };
    const outerEntry = { resource: outerResource, fullUrl: 'urn:uuid:outer-1' };

    const result = getObservationsFromFhir([leafEntry, innerEntry, outerEntry]);

    expect(result).toHaveLength(1);
    const outer = result[0];
    expect(outer.concept.uuid).toBe('outer-uuid');
    expect(outer.groupMembers).toHaveLength(1);

    const inner = outer.groupMembers[0];
    expect(inner.concept.uuid).toBe('inner-uuid');
    expect(inner.groupMembers).toHaveLength(1);

    const leaf = inner.groupMembers[0];
    expect(leaf.concept.uuid).toBe('leaf-uuid');
    expect(leaf.value).toBe('nested value');
  });

  it('should support 3-level deep nesting', () => {
    const deepEntry = makeEntry(baseResource('deep-uuid', { valueQuantity: { value: 5 } }), 'd1');
    const l2Resource = { ...baseResource('l2-uuid', {}), id: 'l2', hasMember: [{ reference: deepEntry.fullUrl }] };
    const l2Entry = { resource: l2Resource, fullUrl: 'urn:uuid:l2' };
    const l1Resource = { ...baseResource('l1-uuid', {}), id: 'l1', hasMember: [{ reference: l2Entry.fullUrl }] };
    const l1Entry = { resource: l1Resource, fullUrl: 'urn:uuid:l1' };
    const topResource = { ...baseResource('top-uuid', {}), id: 'top', hasMember: [{ reference: l1Entry.fullUrl }] };
    const topEntry = { resource: topResource, fullUrl: 'urn:uuid:top' };

    const result = getObservationsFromFhir([deepEntry, l2Entry, l1Entry, topEntry]);

    expect(result).toHaveLength(1);
    expect(result[0].groupMembers[0].groupMembers[0].groupMembers[0].value).toBe(5);
  });
});

// ---------------------------------------------------------------------------
// AC9 — Comment: note[0].text → comment
// ---------------------------------------------------------------------------

describe('AC9 — Clinician comment', () => {
  it('should map note[0].text to comment', () => {
    const resource = {
      ...baseResource('concept-uuid', { valueString: 'test' }),
      note: [{ text: 'This is a clinical note' }],
    };
    const result = getObservationsFromFhir([makeEntry(resource, 'id-c1')]);

    expect(result[0].comment).toBe('This is a clinical note');
  });

  it('should not include comment when note is absent', () => {
    const resource = baseResource('concept-uuid', { valueString: 'test' });
    const result = getObservationsFromFhir([makeEntry(resource, 'id-c2')]);

    expect(result[0].comment).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// AC10 — Interpretation: code → human-readable word
// ---------------------------------------------------------------------------

describe('AC10 — Interpretation flag', () => {
  const makeWithInterpretation = (code, id) => ({
    ...baseResource('bp-uuid', { valueQuantity: { value: 140 } }),
    interpretation: [
      {
        coding: [
          {
            system: FHIR_OBSERVATION_INTERPRETATION_SYSTEM,
            code,
            display: CODE_TO_INTERPRETATION[code] || code,
          },
        ],
      },
    ],
    id,
  });

  it('should map code "A" to "Abnormal"', () => {
    const entry = makeEntry(makeWithInterpretation('A', 'i1'));
    const result = getObservationsFromFhir([entry]);

    expect(result[0].interpretation).toBe('Abnormal');
  });

  it('should map code "N" to "Normal"', () => {
    const entry = makeEntry(makeWithInterpretation('N', 'i2'));
    const result = getObservationsFromFhir([entry]);

    expect(result[0].interpretation).toBe('Normal');
  });

  it('should map code "H" to "High"', () => {
    const entry = makeEntry(makeWithInterpretation('H', 'i3'));
    const result = getObservationsFromFhir([entry]);

    expect(result[0].interpretation).toBe('High');
  });

  it('should map code "L" to "Low"', () => {
    const entry = makeEntry(makeWithInterpretation('L', 'i4'));
    const result = getObservationsFromFhir([entry]);

    expect(result[0].interpretation).toBe('Low');
  });

  it('should not include interpretation when absent', () => {
    const resource = baseResource('concept-uuid', { valueQuantity: { value: 80 } });
    const result = getObservationsFromFhir([makeEntry(resource, 'i5')]);

    expect(result[0].interpretation).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// AC11 — Form path extension → formNamespace + formFieldPath
// ---------------------------------------------------------------------------

describe('AC11 — Form namespace and field path', () => {
  it('should split the form-namespace-path extension on "^"', () => {
    const resource = {
      ...baseResource('concept-uuid', { valueString: 'test' }),
      extension: [
        {
          url: FHIR_OBSERVATION_FORM_NAMESPACE_PATH_URL,
          valueString: 'Bahmni^TestForm.1/1-0',
        },
      ],
    };
    const result = getObservationsFromFhir([makeEntry(resource, 'fp-1')]);

    expect(result[0].formNamespace).toBe('Bahmni');
    expect(result[0].formFieldPath).toBe('TestForm.1/1-0');
  });

  it('should not include formNamespace / formFieldPath when extension is absent', () => {
    const resource = baseResource('concept-uuid', { valueString: 'test' });
    const result = getObservationsFromFhir([makeEntry(resource, 'fp-2')]);

    expect(result[0].formNamespace).toBeUndefined();
    expect(result[0].formFieldPath).toBeUndefined();
  });

  it('should handle formFieldPath with multiple "/" characters', () => {
    const resource = {
      ...baseResource('concept-uuid', { valueString: 'test' }),
      extension: [
        {
          url: FHIR_OBSERVATION_FORM_NAMESPACE_PATH_URL,
          valueString: 'Bahmni^VitalsForm.3/2-0/pulse',
        },
      ],
    };
    const result = getObservationsFromFhir([makeEntry(resource, 'fp-3')]);

    expect(result[0].formNamespace).toBe('Bahmni');
    expect(result[0].formFieldPath).toBe('VitalsForm.3/2-0/pulse');
  });
});

// ---------------------------------------------------------------------------
// AC12 — Timestamp: effectiveDateTime → obsDatetime
// ---------------------------------------------------------------------------

describe('AC12 — Observation timestamp', () => {
  it('should map effectiveDateTime to obsDatetime', () => {
    const resource = {
      ...baseResource('concept-uuid', { valueString: 'test' }),
      effectiveDateTime: '2024-01-15T10:30:00.000Z',
    };
    const result = getObservationsFromFhir([makeEntry(resource, 'ts-1')]);

    expect(result[0].obsDatetime).toBe('2024-01-15T10:30:00.000Z');
  });

  it('should not include obsDatetime when effectiveDateTime is absent', () => {
    const resource = {
      resourceType: 'Observation',
      status: 'final',
      id: 'ts-2',
      code: makeConcept('c-uuid', 'Test'),
      valueString: 'val',
    };
    const result = getObservationsFromFhir([makeEntry(resource, 'ts-2')]);

    expect(result[0].obsDatetime).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// AC13 — Missing optional data: only present fields are mapped
// ---------------------------------------------------------------------------

describe('AC13 — Missing optional data', () => {
  it('should return only required fields when all optional fields are absent', () => {
    const resource = {
      resourceType: 'Observation',
      status: 'final',
      id: 'min-1',
      code: makeConcept('minimal-uuid', 'Minimal'),
      valueQuantity: { value: 42 },
    };
    const result = getObservationsFromFhir([makeEntry(resource, 'min-1')]);

    expect(result).toHaveLength(1);
    expect(result[0].concept.uuid).toBe('minimal-uuid');
    expect(result[0].value).toBe(42);
    expect(result[0].comment).toBeUndefined();
    expect(result[0].interpretation).toBeUndefined();
    expect(result[0].formNamespace).toBeUndefined();
    expect(result[0].formFieldPath).toBeUndefined();
    expect(result[0].groupMembers).toBeUndefined();
  });

  it('should include only the fields present in the FHIR resource', () => {
    // resource with comment but no interpretation or formPath
    const resource = {
      ...baseResource('concept-uuid', { valueString: 'val' }),
      note: [{ text: 'only comment' }],
    };
    const result = getObservationsFromFhir([makeEntry(resource, 'min-2')]);

    expect(result[0].comment).toBe('only comment');
    expect(result[0].interpretation).toBeUndefined();
    expect(result[0].formNamespace).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// AC14 — Malformed / invalid input → handle gracefully, log, don't crash
// ---------------------------------------------------------------------------

describe('AC14 — Malformed / invalid input handling', () => {
  it('should return [] for null input', () => {
    expect(getObservationsFromFhir(null)).toEqual([]);
  });

  it('should return [] for undefined input', () => {
    expect(getObservationsFromFhir(undefined)).toEqual([]);
  });

  it('should return [] for empty array', () => {
    expect(getObservationsFromFhir([])).toEqual([]);
  });

  it('should return [] for a non-array non-Bundle value', () => {
    expect(getObservationsFromFhir('not-an-array')).toEqual([]);
    expect(getObservationsFromFhir(42)).toEqual([]);
    expect(getObservationsFromFhir(true)).toEqual([]);
  });

  it('should not throw and should skip a malformed observation resource', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    // Entry with a null resource should be skipped
    const badEntry = { resource: null, fullUrl: 'urn:uuid:bad-1' };
    const goodEntry = makeEntry(baseResource('good-uuid', { valueQuantity: { value: 1 } }), 'good-1');

    let result;
    expect(() => {
      result = getObservationsFromFhir([badEntry, goodEntry]);
    }).not.toThrow();

    // Good entry still comes through
    expect(result.some((o) => o.concept.uuid === 'good-uuid')).toBe(true);

    warnSpy.mockRestore();
  });

  it('should warn (not throw) when hasMember reference cannot be resolved', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    const parentResource = {
      ...baseResource('group-uuid', {}),
      id: 'parent-bad',
      hasMember: [{ reference: 'urn:uuid:does-not-exist' }],
    };
    const parentEntry = { resource: parentResource, fullUrl: 'urn:uuid:parent-bad' };

    let result;
    expect(() => {
      result = getObservationsFromFhir([parentEntry]);
    }).not.toThrow();

    expect(warnSpy).toHaveBeenCalled();
    // Parent is still returned, just with no groupMembers
    expect(result).toHaveLength(1);
    expect(result[0].groupMembers).toBeUndefined();

    warnSpy.mockRestore();
  });

  it('should return [] for an empty FHIR Bundle', () => {
    const bundle = { resourceType: 'Bundle', entry: [] };
    expect(getObservationsFromFhir(bundle)).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// FHIR Bundle input support
// ---------------------------------------------------------------------------

describe('FHIR Bundle input', () => {
  it('should accept a full FHIR Bundle and return observations', () => {
    const bundle = {
      resourceType: 'Bundle',
      type: 'searchset',
      entry: [
        makeEntry(baseResource('bp-uuid', { valueQuantity: { value: 120 } }), 'b1'),
        makeEntry(baseResource('temp-uuid', { valueQuantity: { value: 37 } }), 'b2'),
      ],
    };

    const result = getObservationsFromFhir(bundle);

    expect(result).toHaveLength(2);
    expect(result.map((o) => o.concept.uuid).sort()).toEqual(['bp-uuid', 'temp-uuid'].sort());
  });

  it('should handle a Bundle with missing entry array', () => {
    const bundle = { resourceType: 'Bundle' };
    expect(getObservationsFromFhir(bundle)).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// Concept metadata on output
// ---------------------------------------------------------------------------

describe('Concept metadata extraction', () => {
  it('should include concept display from code.text when available', () => {
    const resource = {
      resourceType: 'Observation',
      status: 'final',
      id: 'cm-1',
      code: {
        coding: [{ code: 'c-uuid', display: 'Coding Display' }],
        text: 'Code Text',
      },
      valueQuantity: { value: 1 },
    };
    const result = getObservationsFromFhir([makeEntry(resource, 'cm-1')]);

    // code.text takes priority
    expect(result[0].concept.display).toBe('Code Text');
  });

  it('should fall back to coding[0].display when code.text is absent', () => {
    const resource = {
      resourceType: 'Observation',
      status: 'final',
      id: 'cm-2',
      code: {
        coding: [{ code: 'c-uuid', display: 'Coding Display' }],
      },
      valueQuantity: { value: 1 },
    };
    const result = getObservationsFromFhir([makeEntry(resource, 'cm-2')]);

    expect(result[0].concept.display).toBe('Coding Display');
  });
});

// ---------------------------------------------------------------------------
// Multiple observations at the top level
// ---------------------------------------------------------------------------

describe('Multiple top-level observations', () => {
  it('should return all top-level observations in input order', () => {
    const entries = [
      makeEntry(baseResource('c1-uuid', { valueString: 'v1' }), 'multi-1'),
      makeEntry(baseResource('c2-uuid', { valueQuantity: { value: 42 } }), 'multi-2'),
      makeEntry(baseResource('c3-uuid', { valueBoolean: true }), 'multi-3'),
    ];

    const result = getObservationsFromFhir(entries);

    expect(result).toHaveLength(3);
    expect(result[0].value).toBe('v1');
    expect(result[1].value).toBe(42);
    expect(result[2].value).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Round-trip sanity: getFhirObservations → getObservationsFromFhir
// ---------------------------------------------------------------------------

describe('Round-trip sanity (getFhirObservations → getObservationsFromFhir)', () => {
  const defaultOptions = {
    patientReference: { reference: 'Patient/patient-uuid' },
    encounterReference: { reference: 'Encounter/encounter-uuid' },
    performerReference: { reference: 'Practitioner/practitioner-uuid' },
  };

  it('should reconstruct scalar observations from FHIR entries produced by getFhirObservations', () => {
    const original = [
      {
        concept: { uuid: 'pulse-uuid', datatype: 'Numeric' },
        value: 72,
        obsDatetime: '2024-01-15T10:00:00.000Z',
        formNamespace: 'Bahmni',
        formFieldPath: 'Vitals.1/1-0',
        comment: 'Resting',
        interpretation: 'NORMAL',
      },
    ];

    const fhirEntries = getFhirObservations(original, defaultOptions);
    const roundTripped = getObservationsFromFhir(fhirEntries);

    expect(roundTripped).toHaveLength(1);
    const obs = roundTripped[0];
    expect(obs.concept.uuid).toBe('pulse-uuid');
    expect(obs.value).toBe(72);
    expect(obs.obsDatetime).toBe('2024-01-15T10:00:00.000Z');
    expect(obs.formNamespace).toBe('Bahmni');
    expect(obs.formFieldPath).toBe('Vitals.1/1-0');
    expect(obs.comment).toBe('Resting');
    expect(obs.interpretation).toBe('Normal');
  });

  it('should reconstruct boolean and text observations', () => {
    const original = [
      { concept: { uuid: 'smoker-uuid', datatype: 'Boolean' }, value: false },
      { concept: { uuid: 'notes-uuid', datatype: 'Text' }, value: 'feels better' },
    ];

    const fhirEntries = getFhirObservations(original, defaultOptions);
    const roundTripped = getObservationsFromFhir(fhirEntries);

    expect(roundTripped).toHaveLength(2);
    expect(roundTripped.find((o) => o.concept.uuid === 'smoker-uuid').value).toBe(false);
    expect(roundTripped.find((o) => o.concept.uuid === 'notes-uuid').value).toBe('feels better');
  });

  it('should reconstruct a group observation with its members', () => {
    const original = [
      {
        concept: { uuid: 'vitals-uuid' },
        groupMembers: [
          { concept: { uuid: 'pulse-uuid', datatype: 'Numeric' }, value: 72 },
          { concept: { uuid: 'bp-uuid', datatype: 'Numeric' }, value: 120 },
        ],
      },
    ];

    const fhirEntries = getFhirObservations(original, defaultOptions);
    const roundTripped = getObservationsFromFhir(fhirEntries);

    expect(roundTripped).toHaveLength(1);
    expect(roundTripped[0].concept.uuid).toBe('vitals-uuid');
    expect(roundTripped[0].groupMembers).toHaveLength(2);
    const memberUuids = roundTripped[0].groupMembers.map((m) => m.concept.uuid).sort();
    expect(memberUuids).toEqual(['bp-uuid', 'pulse-uuid']);
  });

  it('should reconstruct coded observations', () => {
    const original = [
      {
        concept: { uuid: 'gender-uuid', datatype: 'Coded' },
        value: { uuid: 'male-uuid', display: 'Male' },
      },
    ];

    const fhirEntries = getFhirObservations(original, defaultOptions);
    const roundTripped = getObservationsFromFhir(fhirEntries);

    expect(roundTripped[0].value).toEqual({ uuid: 'male-uuid', display: 'Male' });
  });
});
