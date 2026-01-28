import ScriptRunner from './scriptRunner';

/**
 * Execute an event script with FormContext API
 *
 * @param {ControlRecord} formData - Current form state tree (Immutable)
 * @param {string} eventScript - JavaScript function as string (plain or base64)
 * @param {Object} patient - Patient object
 * @param {ControlRecord} [parentRecord] - Optional parent record for context
 * @returns {ControlRecord} Updated form state tree
 * @throws {Error} When script throws (e.g., validation failure)
 *
 * @example
 * import { runEventScript } from '@bahmni/form2-controls';
 *
 * try {
 *   const updatedTree = runEventScript(
 *     formRef.current.state.data,
 *     metadata.events.onFormSave,
 *     patient
 *   );
 *   console.log('Validation passed');
 * } catch (error) {
 *   console.error('Validation failed:', error.message);
 * }
 */
export function runEventScript(formData, eventScript, patient, parentRecord) {
  return new ScriptRunner(formData, patient, parentRecord).execute(eventScript);
}

export default runEventScript;
