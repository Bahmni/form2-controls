import FhirObservationTransformer from 'src/helpers/FhirObservationTransformer';
import {
  FHIR_OBSERVATION_INTERPRETATION_SYSTEM,
  FHIR_OBSERVATION_FORM_NAMESPACE_PATH_URL,
  FHIR_OBSERVATION_COMPLEX_DATA_URL,
  FHIR_OBSERVATION_STATUS_FINAL,
  FHIR_RESOURCE_TYPE_OBSERVATION,
} from 'src/constants/fhir';

describe('FhirObservationTransformer', () => {
  let transformer;
  const defaultOptions = {
    patientReference: { reference: 'Patient/patient-uuid' },
    encounterReference: { reference: 'Encounter/encounter-uuid' },
    performerReference: { reference: 'Practitioner/practitioner-uuid' },
  };

  beforeEach(() => {
    transformer = new FhirObservationTransformer();
  });

  describe('toFhir', () => {
    it('should return empty array for null observations', () => {
      const result = transformer.toFhir(null, defaultOptions);
      expect(result).toEqual([]);
    });

    it('should return empty array for undefined observations', () => {
      const result = transformer.toFhir(undefined, defaultOptions);
      expect(result).toEqual([]);
    });

    it('should return empty array for non-array observations', () => {
      const result = transformer.toFhir('invalid', defaultOptions);
      expect(result).toEqual([]);
    });

    it('should transform a basic observation with string value', () => {
      const observations = [
        {
          concept: { uuid: 'concept-uuid', datatype: 'Text' },
          value: 'test value',
          formNamespace: 'Bahmni',
          formFieldPath: 'TestForm.1/1-0',
        },
      ];

      const result = transformer.toFhir(observations, defaultOptions);

      expect(result).toHaveLength(1);
      expect(result[0].resource.resourceType).toBe(FHIR_RESOURCE_TYPE_OBSERVATION);
      expect(result[0].resource.status).toBe(FHIR_OBSERVATION_STATUS_FINAL);
      expect(result[0].resource.valueString).toBe('test value');
      expect(result[0].resource.code.coding[0].code).toBe('concept-uuid');
      expect(result[0].resource.subject).toEqual(defaultOptions.patientReference);
      expect(result[0].resource.encounter).toEqual(defaultOptions.encounterReference);
      expect(result[0].resource.performer).toEqual([defaultOptions.performerReference]);
      expect(result[0].fullUrl).toMatch(/^urn:uuid:/);
      expect(result[0].resource.id).toBeDefined();
    });

    it('should transform observation with numeric value', () => {
      const observations = [
        {
          concept: { uuid: 'pulse-uuid', datatype: 'Numeric' },
          value: 72,
        },
      ];

      const result = transformer.toFhir(observations, defaultOptions);

      expect(result).toHaveLength(1);
      expect(result[0].resource.valueQuantity).toEqual({ value: 72 });
    });

    it('should transform observation with boolean value', () => {
      const observations = [
        {
          concept: { uuid: 'smoking-uuid', datatype: 'Boolean' },
          value: true,
        },
      ];

      const result = transformer.toFhir(observations, defaultOptions);

      expect(result).toHaveLength(1);
      expect(result[0].resource.valueBoolean).toBe(true);
    });

    it('should transform observation with date string value', () => {
      const observations = [
        {
          concept: { uuid: 'dob-uuid', datatype: 'Date' },
          value: '2024-01-15',
        },
      ];

      const result = transformer.toFhir(observations, defaultOptions);

      expect(result).toHaveLength(1);
      expect(result[0].resource.valueDateTime).toBeDefined();
      expect(result[0].resource.valueDateTime).toMatch(/^2024-01-15/);
    });

    it('should transform observation with Date object value', () => {
      const dateValue = new Date('2024-01-15T10:30:00Z');
      const observations = [
        {
          concept: { uuid: 'datetime-uuid', datatype: 'DateTime' },
          value: dateValue,
        },
      ];

      const result = transformer.toFhir(observations, defaultOptions);

      expect(result).toHaveLength(1);
      expect(result[0].resource.valueDateTime).toBe(dateValue.toISOString());
    });

    it('should transform observation with coded value (uuid object)', () => {
      const observations = [
        {
          concept: { uuid: 'gender-uuid', datatype: 'Coded' },
          value: { uuid: 'male-uuid', display: 'Male' },
        },
      ];

      const result = transformer.toFhir(observations, defaultOptions);

      expect(result).toHaveLength(1);
      expect(result[0].resource.valueCodeableConcept).toBeDefined();
      expect(result[0].resource.valueCodeableConcept.coding[0].code).toBe('male-uuid');
      expect(result[0].resource.valueCodeableConcept.coding[0].display).toBe('Male');
    });

    it('should transform observation with coded value using displayString', () => {
      const observations = [
        {
          concept: { uuid: 'gender-uuid', datatype: 'Coded' },
          value: { uuid: 'female-uuid', displayString: 'Female' },
        },
      ];

      const result = transformer.toFhir(observations, defaultOptions);

      expect(result).toHaveLength(1);
      expect(result[0].resource.valueCodeableConcept.coding[0].display).toBe('Female');
    });

    it('should handle numeric string for Numeric datatype', () => {
      const observations = [
        {
          concept: { uuid: 'weight-uuid', datatype: 'Numeric' },
          value: '75.5',
        },
      ];

      const result = transformer.toFhir(observations, defaultOptions);

      expect(result).toHaveLength(1);
      expect(result[0].resource.valueQuantity).toEqual({ value: 75.5 });
    });

    it('should skip voided observations', () => {
      const observations = [
        {
          concept: { uuid: 'concept-uuid' },
          value: 'test',
          voided: true,
        },
        {
          concept: { uuid: 'concept-uuid-2' },
          value: 'test2',
          voided: false,
        },
      ];

      const result = transformer.toFhir(observations, defaultOptions);

      expect(result).toHaveLength(1);
      expect(result[0].resource.code.coding[0].code).toBe('concept-uuid-2');
    });

    it('should include interpretation when provided', () => {
      const observations = [
        {
          concept: { uuid: 'bp-uuid' },
          value: 140,
          interpretation: 'ABNORMAL',
        },
      ];

      const result = transformer.toFhir(observations, defaultOptions);

      expect(result).toHaveLength(1);
      expect(result[0].resource.interpretation).toBeDefined();
      expect(result[0].resource.interpretation[0].coding[0].system).toBe(
        FHIR_OBSERVATION_INTERPRETATION_SYSTEM
      );
      expect(result[0].resource.interpretation[0].coding[0].code).toBe('A');
      expect(result[0].resource.interpretation[0].coding[0].display).toBe('Abnormal');
    });

    it('should handle lowercase interpretation', () => {
      const observations = [
        {
          concept: { uuid: 'bp-uuid' },
          value: 120,
          interpretation: 'normal',
        },
      ];

      const result = transformer.toFhir(observations, defaultOptions);

      expect(result[0].resource.interpretation[0].coding[0].code).toBe('N');
      expect(result[0].resource.interpretation[0].coding[0].display).toBe('Normal');
    });

    it('should include form namespace and field path extension', () => {
      const observations = [
        {
          concept: { uuid: 'concept-uuid' },
          value: 'test',
          formNamespace: 'Bahmni',
          formFieldPath: 'TestForm.1/1-0',
        },
      ];

      const result = transformer.toFhir(observations, defaultOptions);

      expect(result[0].resource.extension).toBeDefined();
      const formPathExtension = result[0].resource.extension.find(
        (ext) => ext.url === FHIR_OBSERVATION_FORM_NAMESPACE_PATH_URL
      );
      expect(formPathExtension).toBeDefined();
      expect(formPathExtension.valueString).toBe('Bahmni^TestForm.1/1-0');
    });

    it('should not include form path extension when namespace or path is missing', () => {
      const observations = [
        {
          concept: { uuid: 'concept-uuid' },
          value: 'test',
          formNamespace: 'Bahmni',
        },
      ];

      const result = transformer.toFhir(observations, defaultOptions);

      const formPathExtension = result[0].resource.extension?.find(
        (ext) => ext.url === FHIR_OBSERVATION_FORM_NAMESPACE_PATH_URL
      );
      expect(formPathExtension).toBeUndefined();
    });

    it('should include comment as note', () => {
      const observations = [
        {
          concept: { uuid: 'concept-uuid' },
          value: 'test',
          comment: 'This is a clinical note',
        },
      ];

      const result = transformer.toFhir(observations, defaultOptions);

      expect(result[0].resource.note).toBeDefined();
      expect(result[0].resource.note[0].text).toBe('This is a clinical note');
    });

    it('should handle complex datatype with attachment extension', () => {
      const observations = [
        {
          concept: { uuid: 'image-uuid', datatype: 'Complex' },
          value: 'http://example.com/image.jpg',
        },
      ];

      const result = transformer.toFhir(observations, defaultOptions);

      expect(result[0].resource.extension).toBeDefined();
      const complexExtension = result[0].resource.extension.find(
        (ext) => ext.url === FHIR_OBSERVATION_COMPLEX_DATA_URL
      );
      expect(complexExtension).toBeDefined();
      expect(complexExtension.valueAttachment.url).toBe('http://example.com/image.jpg');
      expect(result[0].resource.valueString).toBe('http://example.com/image.jpg');
    });

    it('should use provided obsDatetime', () => {
      const obsDatetime = '2024-01-15T10:30:00.000Z';
      const observations = [
        {
          concept: { uuid: 'concept-uuid' },
          value: 'test',
          obsDatetime,
        },
      ];

      const result = transformer.toFhir(observations, defaultOptions);

      expect(result[0].resource.effectiveDateTime).toBe(obsDatetime);
    });

    it('should use provided observationDateTime (alternate field name)', () => {
      const observationDateTime = '2024-01-15T10:30:00.000Z';
      const observations = [
        {
          concept: { uuid: 'concept-uuid' },
          value: 'test',
          observationDateTime,
        },
      ];

      const result = transformer.toFhir(observations, defaultOptions);

      expect(result[0].resource.effectiveDateTime).toBe(observationDateTime);
    });

    it('should handle concept as string uuid', () => {
      const observations = [
        {
          concept: 'direct-concept-uuid',
          value: 'test',
        },
      ];

      const result = transformer.toFhir(observations, defaultOptions);

      expect(result[0].resource.code.coding[0].code).toBe('direct-concept-uuid');
    });

    it('should skip empty string values', () => {
      const observations = [
        {
          concept: { uuid: 'concept-uuid' },
          value: '   ',
        },
      ];

      const result = transformer.toFhir(observations, defaultOptions);

      expect(result[0].resource.valueString).toBeUndefined();
    });
  });

  describe('group members handling', () => {
    it('should transform observation with group members', () => {
      const observations = [
        {
          concept: { uuid: 'vitals-group-uuid' },
          groupMembers: [
            {
              concept: { uuid: 'pulse-uuid', datatype: 'Numeric' },
              value: 72,
            },
            {
              concept: { uuid: 'bp-uuid', datatype: 'Numeric' },
              value: 120,
            },
          ],
        },
      ];

      const result = transformer.toFhir(observations, defaultOptions);

      // Should have 3 observations: 2 members + 1 parent
      expect(result).toHaveLength(3);

      // Find the parent observation (the one with hasMember)
      const parentObs = result.find((r) => r.resource.hasMember);
      expect(parentObs).toBeDefined();
      expect(parentObs.resource.hasMember).toHaveLength(2);

      // Verify hasMember references point to member observations
      const memberUrls = result
        .filter((r) => !r.resource.hasMember)
        .map((r) => r.fullUrl);
      parentObs.resource.hasMember.forEach((ref) => {
        expect(memberUrls).toContain(ref.reference);
      });
    });

    it('should handle nested group members', () => {
      const observations = [
        {
          concept: { uuid: 'outer-group-uuid' },
          groupMembers: [
            {
              concept: { uuid: 'inner-group-uuid' },
              groupMembers: [
                {
                  concept: { uuid: 'leaf-uuid' },
                  value: 'nested value',
                },
              ],
            },
          ],
        },
      ];

      const result = transformer.toFhir(observations, defaultOptions);

      // Should have 3 observations: 1 leaf + 1 inner parent + 1 outer parent
      expect(result).toHaveLength(3);

      // Find outer parent (should have hasMember pointing to both inner parent and leaf)
      // because the recursive call processes all nested members first
      const outerParent = result.find(
        (r) => r.resource.code.coding[0].code === 'outer-group-uuid'
      );
      expect(outerParent.resource.hasMember).toHaveLength(2);

      // Find inner parent (should have hasMember pointing to leaf)
      const innerParent = result.find(
        (r) => r.resource.code.coding[0].code === 'inner-group-uuid'
      );
      expect(innerParent.resource.hasMember).toHaveLength(1);
    });

    it('should skip voided group members', () => {
      const observations = [
        {
          concept: { uuid: 'group-uuid' },
          groupMembers: [
            {
              concept: { uuid: 'member1-uuid' },
              value: 'active',
              voided: false,
            },
            {
              concept: { uuid: 'member2-uuid' },
              value: 'voided',
              voided: true,
            },
          ],
        },
      ];

      const result = transformer.toFhir(observations, defaultOptions);

      // Should have 2 observations: 1 active member + 1 parent
      expect(result).toHaveLength(2);

      const parentObs = result.find((r) => r.resource.hasMember);
      expect(parentObs.resource.hasMember).toHaveLength(1);
    });
  });

  describe('multiple observations', () => {
    it('should transform multiple observations', () => {
      const observations = [
        {
          concept: { uuid: 'concept-1' },
          value: 'value1',
        },
        {
          concept: { uuid: 'concept-2' },
          value: 42,
        },
        {
          concept: { uuid: 'concept-3' },
          value: true,
        },
      ];

      const result = transformer.toFhir(observations, defaultOptions);

      expect(result).toHaveLength(3);
      expect(result[0].resource.valueString).toBe('value1');
      expect(result[1].resource.valueQuantity).toEqual({ value: 42 });
      expect(result[2].resource.valueBoolean).toBe(true);
    });

    it('should generate unique UUIDs for each observation', () => {
      const observations = [
        { concept: { uuid: 'c1' }, value: 'v1' },
        { concept: { uuid: 'c2' }, value: 'v2' },
        { concept: { uuid: 'c3' }, value: 'v3' },
      ];

      const result = transformer.toFhir(observations, defaultOptions);

      const ids = result.map((r) => r.resource.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(3);

      const fullUrls = result.map((r) => r.fullUrl);
      const uniqueUrls = new Set(fullUrls);
      expect(uniqueUrls.size).toBe(3);
    });
  });

  describe('edge cases', () => {
    it('should handle observation with null value', () => {
      const observations = [
        {
          concept: { uuid: 'concept-uuid' },
          value: null,
        },
      ];

      const result = transformer.toFhir(observations, defaultOptions);

      expect(result).toHaveLength(1);
      expect(result[0].resource.valueString).toBeUndefined();
      expect(result[0].resource.valueQuantity).toBeUndefined();
      expect(result[0].resource.valueBoolean).toBeUndefined();
    });

    it('should handle observation with undefined value', () => {
      const observations = [
        {
          concept: { uuid: 'concept-uuid' },
          value: undefined,
        },
      ];

      const result = transformer.toFhir(observations, defaultOptions);

      expect(result).toHaveLength(1);
      expect(result[0].resource.valueString).toBeUndefined();
    });

    it('should handle empty observations array', () => {
      const result = transformer.toFhir([], defaultOptions);
      expect(result).toEqual([]);
    });

    it('should handle observation with empty groupMembers array', () => {
      const observations = [
        {
          concept: { uuid: 'group-uuid' },
          groupMembers: [],
        },
      ];

      const result = transformer.toFhir(observations, defaultOptions);

      // Empty group members should still produce an observation without hasMember
      expect(result).toHaveLength(1);
      expect(result[0].resource.hasMember).toBeUndefined();
    });
  });
});
