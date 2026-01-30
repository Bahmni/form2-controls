import ScriptRunner from './scriptRunner';

export function runEventScript(formData, eventScript, patient, parentRecord) {
  return new ScriptRunner(formData, patient, parentRecord).execute(eventScript);
}

export default runEventScript;
