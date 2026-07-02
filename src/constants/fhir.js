/**
 * FHIR-related constants for observation transformation
 */

export const FHIR_OBSERVATION_INTERPRETATION_SYSTEM =
  'http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation';

export const FHIR_OBSERVATION_FORM_NAMESPACE_PATH_URL =
  'http://fhir.bahmni.org/ext/observation/form-namespace-path';

export const FHIR_OBSERVATION_VALUE_ATTACHMENT_URL =
  'http://fhir.bahmni.org/ext/observation/obs-value-attachment';

export const CONCEPT_DATATYPE_NUMERIC = 'Numeric';
export const CONCEPT_DATATYPE_COMPLEX = 'Complex';

export const FHIR_OBSERVATION_STATUS_FINAL = 'final';
export const FHIR_RESOURCE_TYPE_OBSERVATION = 'Observation';

export const DATE_REGEX_PATTERN = /^\d{4}-\d{2}-\d{2}/;
export const DATETIME_REGEX_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;

export const INTERPRETATION_TO_CODE = {
  ABNORMAL: { code: 'A', display: 'Abnormal' },
  NORMAL: { code: 'N', display: 'Normal' },
  HIGH: { code: 'H', display: 'High' },
  LOW: { code: 'L', display: 'Low' },
};

/**
 * Reverse map from FHIR interpretation code back to human-readable word.
 * Covers A=Abnormal, N=Normal, H=High, L=Low.
 */
export const CODE_TO_INTERPRETATION = {
  A: 'Abnormal',
  N: 'Normal',
  H: 'High',
  L: 'Low',
};
