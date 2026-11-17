import { runEventScript } from 'src/helpers/runEventScript';
import { utf8ToBase64 } from 'src/helpers/encodingUtils';

// No mocks: these tests run the real ScriptRunner, the same path the clinical
// app uses for onFormSave (executeOnFormSaveEvent -> runEventScript).
describe('runEventScript with plain-text event scripts', () => {
  const patient = { uuid: 'patient-uuid-123', age: 30, gender: 'F' };

  const captureThrown = (fn) => {
    let thrown;
    try {
      fn();
    } catch (error) {
      thrown = error;
    }
    return thrown;
  };

  it('runs a plain-text script without error', () => {
    const script = 'function(form) {\n  var x = 1;\n}';

    expect(() => runEventScript(undefined, script, patient)).not.toThrow();
  });

  it('runs the same script when it is base64 encoded', () => {
    const script = utf8ToBase64('function(form) {\n  var x = 1;\n}');

    expect(() => runEventScript(undefined, script, patient)).not.toThrow();
  });

  it('propagates the object thrown by a plain-text script with its message intact', () => {
    const script = "function(form) {\n  throw { message: 'Please select a future date' };\n}";

    const thrown = captureThrown(() => runEventScript(undefined, script, patient));

    expect(thrown).toEqual({ message: 'Please select a future date' });
  });
});
