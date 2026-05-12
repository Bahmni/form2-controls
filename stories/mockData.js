/* global componentStore */
import { NumericBox } from 'src/components/NumericBox.jsx';
import { BooleanControl } from 'src/components/BooleanControl.jsx';
import { Button } from 'src/components/Button.jsx';
import { CodedControl } from 'src/components/CodedControl.jsx';
import { AutoComplete } from 'src/components/AutoComplete.jsx';
import { TextBox } from 'src/components/TextBox.jsx';

export const systolicConcept = {
  name: 'Systolic',
  uuid: 'c36e9c8b-3f10-11e4-adec-0800271c1b75',
  datatype: 'Numeric',
};

export const diastolicConcept = {
  name: 'Diastolic',
  uuid: 'c379aa1d-3f10-11e4-adec-0800271c1b75',
  datatype: 'Numeric',
};

export const pulseConcept = {
  name: 'Pulse',
  uuid: 'c36bc411-3f10-11e4-adec-0800271c1b75',
  datatype: 'Numeric',
  conceptClass: 'Misc',
  lowNormal: 60,
  hiNormal: 120,
};

export const pulseAbnormalConcept = {
  name: 'Pulse Abnormal',
  uuid: 'c36c7c98-3f10-11e4-adec-0800271c1b75',
  datatype: 'Boolean',
  conceptClass: 'Abnormal',
};

export const pulseDataConcept = {
  name: 'Pulse Data',
  uuid: 'c36af094-3f10-11e4-adec-0800271c1b75',
  datatype: 'N/A',
};

// Pulse Data ObsGroup tree — used in ObsGroupControl and AbnormalObsControl stories
export const pulseDataMetadata = {
  type: 'ObsGroupControl',
  concept: pulseDataConcept,
  label: { type: 'label', value: 'Pulse Data' },
  properties: { mandatory: false, location: { column: 0, row: 0 } },
  id: '5',
  controls: [
    {
      type: 'obsControl',
      label: { type: 'label', value: 'Pulse' },
      properties: { mandatory: false, location: { column: 0, row: 0 } },
      id: '6',
      concept: pulseConcept,
    },
    {
      type: 'obsControl',
      displayType: 'Button',
      options: [{ name: 'Abnormal', value: true }],
      label: { type: 'label', value: 'Abnormal' },
      properties: { mandatory: false, location: { column: 0, row: 0 }, hideLabel: true },
      id: '7',
      concept: pulseAbnormalConcept,
    },
  ],
};

export function registerCommonComponents() {
  componentStore.registerComponent('numeric', NumericBox);
  componentStore.registerComponent('boolean', BooleanControl);
  componentStore.registerComponent('button', Button);
  componentStore.registerComponent('Coded', CodedControl);
  componentStore.registerComponent('autoComplete', AutoComplete);
  componentStore.registerComponent('text', TextBox);
}
