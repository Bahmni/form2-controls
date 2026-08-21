import { codedConceptAnswers, booleanYesNoOptions } from './fixtures';
import { buildColumnHeader } from './complexFixtures';

const conceptUuidFor = (id) => `${id}-concept-uuid`;

export const buildTextBoxControl = ({ id = 'carbon-textbox-1', column = 0, row = 0 } = {}) => ({
  type: 'obsControl',
  label: { type: 'label', value: 'Chief Complaint' },
  properties: { mandatory: false, notes: false, location: { column, row } },
  id,
  concept: { name: 'Chief Complaint', uuid: conceptUuidFor(id), datatype: 'Text' },
});

export const buildNumericBoxControl = ({ id = 'carbon-numeric-1', column = 0, row = 0 } = {}) => ({
  type: 'obsControl',
  label: { type: 'label', value: 'Pulse (/min)' },
  properties: { mandatory: false, notes: false, location: { column, row } },
  id,
  concept: { name: 'Pulse', uuid: conceptUuidFor(id), datatype: 'Numeric' },
  hiNormal: 100,
  lowNormal: 60,
  hiAbsolute: 150,
  lowAbsolute: 40,
});

export const buildDateControl = ({ id = 'carbon-date-1', column = 0, row = 0 } = {}) => ({
  type: 'obsControl',
  label: { type: 'label', value: 'Visit Date' },
  properties: { mandatory: false, notes: false, location: { column, row } },
  id,
  concept: { name: 'Visit Date', uuid: conceptUuidFor(id), datatype: 'Date' },
});

export const buildDateTimeControl = ({ id = 'carbon-datetime-1', column = 0, row = 0 } = {}) => ({
  type: 'obsControl',
  label: { type: 'label', value: 'Observation DateTime' },
  properties: { mandatory: false, notes: false, location: { column, row } },
  id,
  concept: { name: 'Observation DateTime', uuid: conceptUuidFor(id), datatype: 'DateTime' },
});

const booleanChildControl = (id, column, row, label) => ({
  type: 'obsControl',
  label: { type: 'label', value: label },
  properties: { mandatory: false, notes: false, location: { column, row } },
  id,
  concept: { name: label, uuid: conceptUuidFor(id), datatype: 'Boolean', answers: booleanYesNoOptions },
});

export const buildFreeTextAutoCompleteControl = ({ id = 'carbon-freetext-1', column = 0, row = 0 } = {}) => ({
  type: 'obsControl',
  label: { type: 'label', value: 'Chief Complaint (Free Text)' },
  properties: { mandatory: false, notes: false, location: { column, row } },
  id,
  options: codedConceptAnswers,
  concept: {
    name: 'Chief Complaint Free Text', uuid: conceptUuidFor(id), datatype: 'freeTextAutoComplete', answers: [],
  },
});

export const buildAbnormalObsControl = ({ id = 'carbon-obscontrol-1', column = 0, row = 0 } = {}) => {
  const conceptUuid = conceptUuidFor(id);
  const control = {
    type: 'obsControl',
    label: { type: 'label', value: 'Pulse (Abnormal Demo)' },
    properties: { mandatory: false, notes: true, abnormal: true, location: { column, row } },
    id,
    concept: { name: 'Pulse', uuid: conceptUuid, datatype: 'Numeric' },
    hiNormal: 100,
    lowNormal: 60,
    hiAbsolute: 150,
    lowAbsolute: 40,
  };
  const observations = (formName) => ([{
    observationDateTime: '2026-08-10T09:00:00.000+0000',
    uuid: `obs-${id}`,
    value: 130,
    interpretation: 'ABNORMAL',
    comment: 'Elevated on repeat check',
    formNamespace: 'bahmni',
    formFieldPath: `${formName}.1/${id}-0`,
    concept: { uuid: conceptUuid },
    voided: false,
  }]);
  return { control, observations };
};

export const buildSectionControl = ({ id = 'carbon-section-1', column = 0, row = 0 } = {}) => ({
  type: 'section',
  label: { type: 'label', value: 'Vitals Notes' },
  properties: { mandatory: false, location: { column, row } },
  id,
  controls: [
    buildTextBoxControl({ id: `${id}-notes`, column: 0, row: 0 }),
    booleanChildControl(`${id}-fever`, 1, 0, 'Fever'),
  ],
});

export const buildVitalsObsGroupControl = ({ id = 'carbon-obsgroup-1', column = 0, row = 0 } = {}) => {
  const groupConceptUuid = conceptUuidFor(id);
  const pulseId = `${id}-pulse`;
  const feverId = `${id}-fever`;
  const pulseConceptUuid = conceptUuidFor(pulseId);
  const feverConceptUuid = conceptUuidFor(feverId);

  const control = {
    type: 'obsGroupControl',
    label: { type: 'label', value: 'Vitals Group' },
    properties: { mandatory: false, location: { column, row } },
    id,
    concept: { name: 'Vitals Group', uuid: groupConceptUuid, datatype: 'N/A' },
    controls: [
      buildNumericBoxControl({ id: pulseId, column: 0, row: 0 }),
      booleanChildControl(feverId, 1, 0, 'Fever'),
    ],
  };

  const observations = (formName) => ([{
    observationDateTime: '2026-08-10T09:00:00.000+0000',
    uuid: `obs-${id}`,
    formNamespace: 'bahmni',
    formFieldPath: `${formName}.1/${id}-0`,
    concept: { name: 'Vitals Group', uuid: groupConceptUuid, datatype: 'N/A' },
    groupMembers: [
      {
        observationDateTime: '2026-08-10T09:00:00.000+0000',
        uuid: `obs-${pulseId}`,
        value: 88,
        formNamespace: 'bahmni',
        formFieldPath: `${formName}.1/${pulseId}-0`,
        concept: { name: 'Pulse', uuid: pulseConceptUuid, datatype: 'Numeric' },
      },
      {
        observationDateTime: '2026-08-10T09:00:00.000+0000',
        uuid: `obs-${feverId}`,
        value: true,
        formNamespace: 'bahmni',
        formFieldPath: `${formName}.1/${feverId}-0`,
        concept: { name: 'Fever', uuid: feverConceptUuid, datatype: 'Boolean' },
      },
    ],
  }]);

  return { control, observations };
};

export const buildVitalsTableControl = ({ id = 'carbon-table-1', column = 0, row = 0 } = {}) => {
  const systolicId = `${id}-systolic`;
  const diastolicId = `${id}-diastolic`;
  const systolicConceptUuid = conceptUuidFor(systolicId);
  const diastolicConceptUuid = conceptUuidFor(diastolicId);

  const control = {
    type: 'table',
    label: { type: 'label', value: 'Vitals Measurements' },
    properties: { mandatory: false, location: { column, row } },
    id,
    columnHeaders: [
      buildColumnHeader(`${id}-col-systolic`, 'Systolic BP'),
      buildColumnHeader(`${id}-col-diastolic`, 'Diastolic BP'),
    ],
    controls: [
      {
        type: 'obsControl',
        label: { type: 'label', value: 'Systolic' },
        properties: { mandatory: false, location: { column: 0, row: 0 } },
        id: systolicId,
        concept: { name: 'Systolic', uuid: systolicConceptUuid, datatype: 'Text' },
      },
      {
        type: 'obsControl',
        label: { type: 'label', value: 'Diastolic' },
        properties: { mandatory: false, location: { column: 1, row: 0 } },
        id: diastolicId,
        concept: { name: 'Diastolic', uuid: diastolicConceptUuid, datatype: 'Text' },
      },
    ],
  };

  const observations = (formName) => ([
    {
      observationDateTime: '2026-08-10T09:00:00.000+0000',
      uuid: `obs-${systolicId}`,
      value: '120',
      formNamespace: 'bahmni',
      formFieldPath: `${formName}.1/${systolicId}-0`,
      concept: { name: 'Systolic', uuid: systolicConceptUuid, datatype: 'Text' },
    },
    {
      observationDateTime: '2026-08-10T09:00:00.000+0000',
      uuid: `obs-${diastolicId}`,
      value: '80',
      formNamespace: 'bahmni',
      formFieldPath: `${formName}.1/${diastolicId}-0`,
      concept: { name: 'Diastolic', uuid: diastolicConceptUuid, datatype: 'Text' },
    },
  ]);

  return { control, observations };
};

export const buildLocationControl = ({ id = 'carbon-location-1', column = 0, row = 0 } = {}) => ({
  type: 'obsControl',
  label: { type: 'label', value: 'Ward / Location' },
  properties: { mandatory: false, location: { column, row } },
  id,
  concept: {
    name: 'Ward / Location', uuid: conceptUuidFor(id), datatype: 'Complex', conceptHandler: 'LocationObsHandler',
  },
});

export const buildProviderControl = ({ id = 'carbon-provider-1', column = 0, row = 0 } = {}) => ({
  type: 'obsControl',
  label: { type: 'label', value: 'Responsible Provider' },
  properties: { mandatory: false, location: { column, row } },
  id,
  concept: {
    name: 'Responsible Provider', uuid: conceptUuidFor(id), datatype: 'Complex', conceptHandler: 'ProviderObsHandler',
  },
});

export const buildImageControl = ({ id = 'carbon-image-1', column = 0, row = 0 } = {}) => ({
  type: 'obsControl',
  label: { type: 'label', value: 'Patient Photo' },
  properties: { mandatory: false, location: { column, row } },
  id,
  concept: {
    name: 'Patient Photo', uuid: conceptUuidFor(id), datatype: 'Complex', conceptHandler: 'ImageUrlHandler',
  },
});

export const buildVideoControl = ({ id = 'carbon-video-1', column = 0, row = 0 } = {}) => ({
  type: 'obsControl',
  label: { type: 'label', value: 'Procedure Video' },
  properties: { mandatory: false, location: { column, row } },
  id,
  concept: {
    name: 'Procedure Video', uuid: conceptUuidFor(id), datatype: 'Complex', conceptHandler: 'VideoUrlHandler',
  },
});
