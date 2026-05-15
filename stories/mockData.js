export const SYSTOLIC_UUID = 'c36e9c8b-3f10-11e4-adec-0800271c1b75';
export const DIASTOLIC_UUID = 'c379aa1d-3f10-11e4-adec-0800271c1b75';

const PULSE_DATA_UUID = 'c36af094-3f10-11e4-adec-0800271c1b75';
const PULSE_UUID = 'c36bc411-3f10-11e4-adec-0800271c1b75';
const PULSE_ABNORMAL_UUID = 'c36c7c98-3f10-11e4-adec-0800271c1b75';

export const pulseDataMetadata = {
  type: 'ObsGroupControl',
  concept: {
    name: 'Pulse Data',
    uuid: PULSE_DATA_UUID,
    datatype: 'N/A',
  },
  label: { type: 'label', value: 'Pulse Data' },
  properties: { mandatory: false, location: { column: 0, row: 0 } },
  id: '5',
  controls: [
    {
      type: 'obsControl',
      label: { type: 'label', value: 'Pulse' },
      properties: { mandatory: false, location: { column: 0, row: 0 } },
      id: '6',
      concept: {
        name: 'Pulse',
        uuid: PULSE_UUID,
        datatype: 'Numeric',
        conceptClass: 'Misc',
        lowNormal: 60,
        hiNormal: 120,
      },
    },
    {
      type: 'obsControl',
      displayType: 'Button',
      options: [{ name: 'Abnormal', value: true }],
      label: { type: 'label', value: 'Abnormal' },
      properties: { mandatory: false, location: { column: 0, row: 0 }, hideLabel: true },
      id: '7',
      concept: {
        name: 'Pulse Abnormal',
        uuid: PULSE_ABNORMAL_UUID,
        datatype: 'Boolean',
        conceptClass: 'Abnormal',
      },
    },
  ],
};
