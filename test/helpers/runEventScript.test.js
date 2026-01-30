import { runEventScript } from 'src/helpers/runEventScript';
import ScriptRunner from 'src/helpers/scriptRunner';
import { utf8ToBase64 } from 'src/helpers/encodingUtils';

jest.mock('src/helpers/scriptRunner');

describe('runEventScript (Exported Function)', () => {
  let mockFormData;
  let mockPatient;
  let mockParentRecord;
  let mockScriptRunner;

  beforeEach(() => {
    mockFormData = {
      children: [
        { id: 'field1', value: 'test' },
        { id: 'field2', value: 123 }
      ]
    };

    mockPatient = {
      uuid: 'patient-uuid-123',
      name: 'John Doe',
      age: 45,
      gender: 'M'
    };

    mockParentRecord = {
      id: 'parent-record',
      children: []
    };

    mockScriptRunner = {
      execute: jest.fn()
    };

    ScriptRunner.mockImplementation(() => mockScriptRunner);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Functionality', () => {
    it('should create ScriptRunner with formData, patient, and parentRecord', () => {
      const eventScript = 'function(form) { return form.getRecords(); }';

      runEventScript(mockFormData, eventScript, mockPatient, mockParentRecord);

      expect(ScriptRunner).toHaveBeenCalledWith(
        mockFormData,
        mockPatient,
        mockParentRecord
      );
    });

    it('should create ScriptRunner with undefined parentRecord when not provided', () => {
      const eventScript = 'function(form) { return form.getRecords(); }';

      runEventScript(mockFormData, eventScript, mockPatient);

      expect(ScriptRunner).toHaveBeenCalledWith(
        mockFormData,
        mockPatient,
        undefined
      );
    });

    it('should call execute method on ScriptRunner with eventScript', () => {
      const eventScript = 'function(form) { return true; }';

      runEventScript(mockFormData, eventScript, mockPatient);

      expect(mockScriptRunner.execute).toHaveBeenCalledWith(eventScript);
    });

    it('should return the result from ScriptRunner.execute', () => {
      const eventScript = 'function(form) { return form.getRecords(); }';
      const expectedResult = { children: [{ id: 'updated' }] };
      mockScriptRunner.execute.mockReturnValue(expectedResult);

      const result = runEventScript(mockFormData, eventScript, mockPatient);

      expect(result).toBe(expectedResult);
    });
  });

  describe('Script Types', () => {
    it('should handle plain text JavaScript function', () => {
      const plainScript = 'function(form, interceptor) { return form.getRecords(); }';

      runEventScript(mockFormData, plainScript, mockPatient);

      expect(mockScriptRunner.execute).toHaveBeenCalledWith(plainScript);
    });

    it('should handle base64 encoded script', () => {
      const plainScript = 'function(form) { return true; }';
      const base64Script = utf8ToBase64(plainScript);

      runEventScript(mockFormData, base64Script, mockPatient);

      expect(mockScriptRunner.execute).toHaveBeenCalledWith(base64Script);
    });

    it('should handle arrow function script', () => {
      const arrowScript = '(form, interceptor) => form.getRecords()';

      runEventScript(mockFormData, arrowScript, mockPatient);

      expect(mockScriptRunner.execute).toHaveBeenCalledWith(arrowScript);
    });

    it('should handle multi-line complex script', () => {
      const complexScript = `function(form, interceptor) {
        const temperature = form.get('Temperature').getValue();
        const pulse = form.get('Pulse').getValue();

        if (temperature > 100 || pulse > 120) {
          throw { message: 'Abnormal vitals detected' };
        }

        return form.getRecords();
      }`;

      runEventScript(mockFormData, complexScript, mockPatient);

      expect(mockScriptRunner.execute).toHaveBeenCalledWith(complexScript);
    });
  });

  describe('Validation Scenarios', () => {
    it('should handle successful validation (no error thrown)', () => {
      const eventScript = 'function(form) { return form.getRecords(); }';
      mockScriptRunner.execute.mockReturnValue(mockFormData);

      expect(() => {
        runEventScript(mockFormData, eventScript, mockPatient);
      }).not.toThrow();
    });

    it('should propagate validation errors thrown by script', () => {
      const eventScript = 'function(form) { throw { message: "Validation failed" }; }';
      const validationError = { message: 'Temperature is mandatory' };
      mockScriptRunner.execute.mockImplementation(() => {
        throw validationError;
      });

      expect(() => {
        runEventScript(mockFormData, eventScript, mockPatient);
      }).toThrow(validationError);
    });

    it('should handle Error object thrown by script', () => {
      const eventScript = 'function(form) { throw new Error("Invalid data"); }';
      const error = new Error('Invalid data');
      mockScriptRunner.execute.mockImplementation(() => {
        throw error;
      });

      expect(() => {
        runEventScript(mockFormData, eventScript, mockPatient);
      }).toThrow('Invalid data');
    });

    it('should handle string error thrown by script', () => {
      const eventScript = 'function(form) { throw "Something went wrong"; }';
      mockScriptRunner.execute.mockImplementation(() => {
        throw 'Validation error string';
      });

      expect(() => {
        runEventScript(mockFormData, eventScript, mockPatient);
      }).toThrow('Validation error string');
    });
  });

  describe('Event Types (onFormSave, onFormInit, onValueChange)', () => {
    it('should execute onFormSave validation script', () => {
      const onFormSaveScript = `function(form) {
        const weight = form.get('Weight').getValue();
        if (!weight) {
          throw { message: 'Weight is mandatory before saving' };
        }
      }`;

      runEventScript(mockFormData, onFormSaveScript, mockPatient);

      expect(mockScriptRunner.execute).toHaveBeenCalledWith(onFormSaveScript);
    });

    it('should execute onFormInit script', () => {
      const onFormInitScript = `function(form) {
        form.get('Date').setValue(new Date());
      }`;

      runEventScript(mockFormData, onFormInitScript, mockPatient);

      expect(mockScriptRunner.execute).toHaveBeenCalledWith(onFormInitScript);
    });

    it('should execute onValueChange script', () => {
      const onValueChangeScript = `function(form) {
        const temperature = form.get('Temperature').getValue();
        if (temperature > 100) {
          form.get('FeverAlert').setValue('High Fever');
        }
      }`;

      runEventScript(mockFormData, onValueChangeScript, mockPatient);

      expect(mockScriptRunner.execute).toHaveBeenCalledWith(onValueChangeScript);
    });
  });

  describe('Nested Forms (with parentRecord)', () => {
    it('should pass parentRecord for obsGroup event scripts', () => {
      const obsGroupScript = `function(form) {
        // Access field in parent scope
        const patientName = form.getFromParent('Patient Name').getValue();

        // Access field in current obsGroup
        const temperature = form.get('Temperature').getValue();

        if (temperature > 100) {
          alert('High fever for patient: ' + patientName);
        }
      }`;

      runEventScript(mockFormData, obsGroupScript, mockPatient, mockParentRecord);

      expect(ScriptRunner).toHaveBeenCalledWith(
        mockFormData,
        mockPatient,
        mockParentRecord
      );
      expect(mockScriptRunner.execute).toHaveBeenCalledWith(obsGroupScript);
    });

    it('should work without parentRecord for top-level forms', () => {
      const topLevelScript = 'function(form) { return form.getRecords(); }';

      runEventScript(mockFormData, topLevelScript, mockPatient);

      expect(ScriptRunner).toHaveBeenCalledWith(
        mockFormData,
        mockPatient,
        undefined
      );
    });

    it('should handle null parentRecord', () => {
      const eventScript = 'function(form) { return form.getRecords(); }';

      runEventScript(mockFormData, eventScript, mockPatient, null);

      expect(ScriptRunner).toHaveBeenCalledWith(
        mockFormData,
        mockPatient,
        null
      );
    });
  });

  describe('Real-world Use Cases', () => {
    it('should handle onFormSave validation with Container.state.data', () => {
      // Simulating formRef.current.state.data
      const formStateData = {
        children: [
          { id: 'height', value: 170, errors: [] },
          { id: 'weight', value: 70, errors: [] }
        ]
      };
      const metadata = {
        events: {
          onFormSave: utf8ToBase64(`function(form) {
            const height = form.get('Height').getValue();
            const weight = form.get('Weight').getValue();

            if (!height || !weight) {
              throw { message: 'Height and Weight are required' };
            }
          }`)
        }
      };

      const patient = { uuid: 'patient-123', name: 'Jane Doe' };

      runEventScript(formStateData, metadata.events.onFormSave, patient);

      expect(ScriptRunner).toHaveBeenCalledWith(formStateData, patient, undefined);
      expect(mockScriptRunner.execute).toHaveBeenCalledWith(metadata.events.onFormSave);
    });

    it('should handle dynamic field visibility based on other field values', () => {
      const eventScript = `function(form) {
        const hasFever = form.get('Has Fever').getValue();

        if (hasFever) {
          form.get('Temperature').setHidden(false);
        } else {
          form.get('Temperature').setHidden(true);
        }
      }`;
      const updatedFormData = { children: [{ id: 'temperature', hidden: false }] };
      mockScriptRunner.execute.mockReturnValue(updatedFormData);

      const result = runEventScript(mockFormData, eventScript, mockPatient);

      expect(result).toEqual(updatedFormData);
      expect(mockScriptRunner.execute).toHaveBeenCalledWith(eventScript);
    });

    it('should handle calculated fields', () => {
      const eventScript = `function(form) {
        const height = form.get('Height').getValue();
        const weight = form.get('Weight').getValue();

        if (height && weight) {
          const heightInMeters = height / 100;
          const bmi = weight / (heightInMeters * heightInMeters);
          form.get('BMI').setValue(bmi.toFixed(2));
        }
      }`;

      runEventScript(mockFormData, eventScript, mockPatient);

      expect(mockScriptRunner.execute).toHaveBeenCalledWith(eventScript);
    });

    it('should handle conditional mandatory fields', () => {
      const eventScript = `function(form) {
        const pregnant = form.get('Is Pregnant').getValue();

        if (pregnant === true) {
          const lmp = form.get('Last Menstrual Period').getValue();
          if (!lmp) {
            throw { message: 'Last Menstrual Period is mandatory for pregnant patients' };
          }
        }
      }`;

      runEventScript(mockFormData, eventScript, mockPatient);

      expect(mockScriptRunner.execute).toHaveBeenCalledWith(eventScript);
    });

    it('should handle HTTP interceptor usage', () => {
      const eventScript = `function(form, interceptor) {
        const conceptUuid = form.get('Diagnosis').getValue();

        if (conceptUuid) {
          interceptor.get('/openmrs/ws/rest/v1/concept/' + conceptUuid)
            .then(function(response) {
              form.get('DiagnosisName').setValue(response.data.name);
            });
        }
      }`;

      runEventScript(mockFormData, eventScript, mockPatient);

      expect(mockScriptRunner.execute).toHaveBeenCalledWith(eventScript);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty eventScript', () => {
      mockScriptRunner.execute.mockReturnValue(mockFormData);

      const result = runEventScript(mockFormData, '', mockPatient);

      expect(mockScriptRunner.execute).toHaveBeenCalledWith('');
      expect(result).toEqual(mockFormData);
    });

    it('should handle null eventScript', () => {
      mockScriptRunner.execute.mockReturnValue(mockFormData);

      const result = runEventScript(mockFormData, null, mockPatient);

      expect(mockScriptRunner.execute).toHaveBeenCalledWith(null);
      expect(result).toEqual(mockFormData);
    });

    it('should handle undefined eventScript', () => {
      mockScriptRunner.execute.mockReturnValue(mockFormData);

      const result = runEventScript(mockFormData, undefined, mockPatient);

      expect(mockScriptRunner.execute).toHaveBeenCalledWith(undefined);
      expect(result).toEqual(mockFormData);
    });

    it('should handle empty formData', () => {
      const emptyFormData = { children: [] };
      const eventScript = 'function(form) { return form.getRecords(); }';

      runEventScript(emptyFormData, eventScript, mockPatient);

      expect(ScriptRunner).toHaveBeenCalledWith(emptyFormData, mockPatient, undefined);
    });

    it('should handle minimal patient object', () => {
      const minimalPatient = { uuid: 'uuid-only' };
      const eventScript = 'function(form) { return form.getRecords(); }';

      runEventScript(mockFormData, eventScript, minimalPatient);

      expect(ScriptRunner).toHaveBeenCalledWith(
        mockFormData,
        minimalPatient,
        undefined
      );
    });

    it('should handle patient with extra properties', () => {
      const detailedPatient = {
        uuid: 'patient-123',
        name: 'John Doe',
        age: 45,
        gender: 'M',
        identifier: 'PAT001',
        birthdate: '1978-01-15',
        customProperty: 'custom value'
      };
      const eventScript = 'function(form) { return form.getRecords(); }';

      runEventScript(mockFormData, eventScript, detailedPatient);

      expect(ScriptRunner).toHaveBeenCalledWith(
        mockFormData,
        detailedPatient,
        undefined
      );
    });
  });

  describe('Integration with Consumer Apps', () => {
    it('should work with direct import in ES6 modules', () => {
      // This test verifies the export can be used as documented
      const eventScript = 'function(form) { return form.getRecords(); }';

      // Simulating: import { runEventScript } from '@bahmni/form2-controls';
      expect(typeof runEventScript).toBe('function');
      expect(runEventScript.name).toBe('runEventScript');

      runEventScript(mockFormData, eventScript, mockPatient);

      expect(mockScriptRunner.execute).toHaveBeenCalled();
    });

    it('should support typical React component usage pattern', () => {
      // Simulating usage in a React component's handleSave
      const formRef = {
        current: {
          state: {
            data: mockFormData
          }
        }
      };
      const metadata = {
        events: {
          onFormSave: 'function(form) { return form.getRecords(); }'
        }
      };

      const handleSave = () => {
        if (metadata.events.onFormSave) {
          runEventScript(
            formRef.current.state.data,
            metadata.events.onFormSave,
            mockPatient
          );
        }
      };

      expect(() => handleSave()).not.toThrow();
      expect(mockScriptRunner.execute).toHaveBeenCalled();
    });

    it('should support try-catch error handling pattern', () => {
      const eventScript = 'function(form) { throw { message: "Validation failed" }; }';
      const validationError = { message: 'Validation failed' };
      mockScriptRunner.execute.mockImplementation(() => {
        throw validationError;
      });

      let caughtError = null;
      try {
        runEventScript(mockFormData, eventScript, mockPatient);
      } catch (error) {
        caughtError = error;
      }

      expect(caughtError).toBe(validationError);
      expect(caughtError.message).toBe('Validation failed');
    });
  });

  describe('Performance and Reusability', () => {
    it('should create a new ScriptRunner instance for each call', () => {
      const eventScript = 'function(form) { return form.getRecords(); }';

      runEventScript(mockFormData, eventScript, mockPatient);
      runEventScript(mockFormData, eventScript, mockPatient);

      expect(ScriptRunner).toHaveBeenCalledTimes(2);
    });

    it('should handle multiple sequential calls with different scripts', () => {
      const script1 = 'function(form) { return 1; }';
      const script2 = 'function(form) { return 2; }';
      const script3 = 'function(form) { return 3; }';

      mockScriptRunner.execute.mockReturnValueOnce(1);
      mockScriptRunner.execute.mockReturnValueOnce(2);
      mockScriptRunner.execute.mockReturnValueOnce(3);

      const result1 = runEventScript(mockFormData, script1, mockPatient);
      const result2 = runEventScript(mockFormData, script2, mockPatient);
      const result3 = runEventScript(mockFormData, script3, mockPatient);

      expect(result1).toBe(1);
      expect(result2).toBe(2);
      expect(result3).toBe(3);
      expect(ScriptRunner).toHaveBeenCalledTimes(3);
    });

    it('should handle multiple sequential calls with different formData', () => {
      const eventScript = 'function(form) { return form.getRecords(); }';
      const formData1 = { children: [{ id: 'field1' }] };
      const formData2 = { children: [{ id: 'field2' }] };
      const formData3 = { children: [{ id: 'field3' }] };

      runEventScript(formData1, eventScript, mockPatient);
      runEventScript(formData2, eventScript, mockPatient);
      runEventScript(formData3, eventScript, mockPatient);

      expect(ScriptRunner).toHaveBeenNthCalledWith(1, formData1, mockPatient, undefined);
      expect(ScriptRunner).toHaveBeenNthCalledWith(2, formData2, mockPatient, undefined);
      expect(ScriptRunner).toHaveBeenNthCalledWith(3, formData3, mockPatient, undefined);
    });
  });

  describe('TypeScript Type Safety', () => {
    it('should accept formData as any type (ControlRecord)', () => {
      const eventScript = 'function(form) { return form.getRecords(); }';

      // Simulating different formData structures
      const immutableFormData = { _isImmutable: true, children: [] };
      const plainFormData = { children: [] };

      expect(() => {
        runEventScript(immutableFormData, eventScript, mockPatient);
        runEventScript(plainFormData, eventScript, mockPatient);
      }).not.toThrow();
    });

    it('should accept eventScript as string', () => {
      const plainString = 'function(form) { return true; }';
      const base64String = utf8ToBase64(plainString);

      expect(() => {
        runEventScript(mockFormData, plainString, mockPatient);
        runEventScript(mockFormData, base64String, mockPatient);
      }).not.toThrow();
    });

    it('should accept patient with required uuid property', () => {
      const minimalPatient = { uuid: 'patient-uuid' };
      const detailedPatient = {
        uuid: 'patient-uuid',
        name: 'John Doe',
        additionalProp: 'value'
      };
      const eventScript = 'function(form) { return form.getRecords(); }';

      expect(() => {
        runEventScript(mockFormData, eventScript, minimalPatient);
        runEventScript(mockFormData, eventScript, detailedPatient);
      }).not.toThrow();
    });

    it('should accept optional parentRecord parameter', () => {
      const eventScript = 'function(form) { return form.getRecords(); }';

      expect(() => {
        // With parentRecord
        runEventScript(mockFormData, eventScript, mockPatient, mockParentRecord);

        // Without parentRecord
        runEventScript(mockFormData, eventScript, mockPatient);
      }).not.toThrow();
    });
  });
});
