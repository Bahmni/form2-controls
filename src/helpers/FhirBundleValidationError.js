export class FhirBundleValidationError extends Error {
  constructor(errors) {
    super('Cannot build FHIR bundle: form has validation errors');
    this.name = 'FhirBundleValidationError';
    this.errors = errors;
  }
}

export default FhirBundleValidationError;
