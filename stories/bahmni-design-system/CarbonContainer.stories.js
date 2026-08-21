import React from 'react';
import { CarbonContainer } from 'src/components/bahmni-design-system/CarbonContainer';
import StoryWrapper from '../StoryWrapper';
import { carbonContainerCommonProps, buildFormMetadata } from './complexFixtures';
import { codedConceptAnswers, booleanYesNoOptions } from './fixtures';
import { withLocationHttp, withProviderHttp } from './httpStub';
import {
  buildTextBoxControl,
  buildNumericBoxControl,
  buildDateControl,
  buildDateTimeControl,
  buildFreeTextAutoCompleteControl,
  buildAbnormalObsControl,
  buildSectionControl,
  buildVitalsObsGroupControl,
  buildVitalsTableControl,
  buildLocationControl,
  buildProviderControl,
  buildImageControl,
  buildVideoControl,
} from './carbonContainerFixtures';
import '../../styles/styles.scss';
import 'src/components/CodedControl.jsx';
import 'src/components/ComplexControl.jsx';

const carbonCodedConceptAnswers = [
  { display: 'Malaria', name: { display: 'Malaria' }, uuid: 'malaria-uuid', translationKey: 'MALARIA' },
  { display: 'Typhoid', name: { display: 'Typhoid' }, uuid: 'typhoid-uuid', translationKey: 'TYPHOID' },
  { display: 'Dengue', name: { display: 'Dengue' }, uuid: 'dengue-uuid', translationKey: 'DENGUE' },
];

const carbonAutoCompleteControl = {
  type: 'obsControl',
  label: { type: 'label', value: 'Diagnosis (Carbon AutoComplete)' },
  properties: { mandatory: false, notes: false, autoComplete: true, location: { column: 0, row: 0 } },
  id: 'carbon-autocomplete-1',
  concept: {
    name: 'Diagnosis',
    uuid: 'diagnosis-concept-uuid',
    datatype: 'Coded',
    answers: carbonCodedConceptAnswers,
  },
};

const carbonDropDownControl = {
  type: 'obsControl',
  label: { type: 'label', value: 'Diagnosis (Carbon DropDown)' },
  properties: { mandatory: false, notes: false, dropDown: true, location: { column: 0, row: 0 } },
  id: 'carbon-dropdown-1',
  concept: {
    name: 'Diagnosis',
    uuid: 'diagnosis-concept-uuid-2',
    datatype: 'Coded',
    answers: carbonCodedConceptAnswers,
  },
};

const carbonButtonControl = {
  type: 'obsControl',
  label: { type: 'label', value: 'Diagnosis (Carbon Button)' },
  properties: { mandatory: false, notes: false, location: { column: 0, row: 0 } },
  id: 'carbon-button-1',
  concept: {
    name: 'Diagnosis',
    uuid: 'diagnosis-concept-uuid-3',
    datatype: 'Coded',
    answers: carbonCodedConceptAnswers,
  },
};

const carbonFormMetadata = (control) => ({
  id: 'carbon-coded-form',
  uuid: 'carbon-coded-form-uuid',
  name: 'Carbon Coded Form',
  version: '1',
  controls: [control],
});

const carbonCommonProps = {
  observations: [],
  patient: { uuid: 'demo-patient-uuid' },
  translations: {},
  validate: false,
  validateForm: false,
  collapse: false,
  locale: 'en',
  onValueUpdated: () => {},
};

export default {
  title: 'Orchestrator/Bahmni Design System/CarbonContainer',
  component: CarbonContainer,
  parameters: {
    docs: {
      description: {
        component:
          'CarbonContainer is a Carbon Design System–backed variant of Container. It resolves each ' +
          'of the 18 types registered in `carbonComponents` (see CarbonContainer.jsx) to a Bahmni ' +
          'Design System widget — text, numeric, date, datetime, boolean and coded controls, layout ' +
          'controls (Section, ObsGroupControl, Table), and the Complex-datatype handlers (Location, ' +
          'Provider, Image, Video) — providing an accessible, consistent look for newer deployments. ' +
          'Types not yet migrated to Carbon fall back to their original Bahmni UI implementation.',
      },
    },
  },
};

export const CarbonCodedAutoComplete = {
  render: () => (
    <StoryWrapper json={carbonAutoCompleteControl}>
      <CarbonContainer
        {...carbonCommonProps}
        metadata={carbonFormMetadata(carbonAutoCompleteControl)}
      />
    </StoryWrapper>
  ),
};

export const CarbonCodedDropDown = {
  render: () => (
    <StoryWrapper json={carbonDropDownControl}>
      <CarbonContainer
        {...carbonCommonProps}
        metadata={carbonFormMetadata(carbonDropDownControl)}
      />
    </StoryWrapper>
  ),
};

export const CarbonCodedButton = {
  render: () => (
    <StoryWrapper json={carbonButtonControl}>
      <CarbonContainer
        {...carbonCommonProps}
        metadata={carbonFormMetadata(carbonButtonControl)}
      />
    </StoryWrapper>
  ),
};

const buildRadioButtonControl = ({ id = 'carbon-radiobutton-1', column = 0, row = 0 } = {}) => ({
  type: 'obsControl',
  label: { type: 'label', value: 'Diagnosis (Carbon RadioButton)' },
  properties: { mandatory: false, notes: false, radio: true, location: { column, row } },
  id,
  concept: {
    name: 'Diagnosis', uuid: `${id}-concept-uuid`, datatype: 'Coded', answers: codedConceptAnswers,
  },
});

const buildBooleanControl = ({ id = 'carbon-boolean-1', column = 0, row = 0 } = {}) => ({
  type: 'obsControl',
  label: { type: 'label', value: 'Smoking History' },
  properties: { mandatory: false, notes: false, location: { column, row } },
  id,
  concept: {
    name: 'Smoking History', uuid: `${id}-concept-uuid`, datatype: 'Boolean', answers: booleanYesNoOptions,
  },
});

const atLocation = (control, column, row) => ({
  ...control,
  properties: { ...control.properties, location: { column, row } },
});

const textBoxControl = buildTextBoxControl();
const textBoxForm = buildFormMetadata(500, 'carbon-textbox-form-uuid', 'Carbon TextBox Form', [textBoxControl]);

export const CarbonTextBox = {
  render: () => (
    <StoryWrapper json={textBoxForm}>
      <CarbonContainer {...carbonContainerCommonProps} metadata={textBoxForm} observations={[]} />
    </StoryWrapper>
  ),
};

const numericBoxControl = buildNumericBoxControl();
const numericBoxForm = buildFormMetadata(
  501, 'carbon-numericbox-form-uuid', 'Carbon NumericBox Form', [numericBoxControl]
);

export const CarbonNumericBox = {
  render: () => (
    <StoryWrapper json={numericBoxForm}>
      <CarbonContainer {...carbonContainerCommonProps} metadata={numericBoxForm} observations={[]} />
    </StoryWrapper>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All four bounds (lowNormal/hiNormal/lowAbsolute/hiAbsolute) are set on the control ' +
          'so the "(60 - 100)" range label renders next to the input (AC #3).',
      },
    },
  },
};

const dateControl = buildDateControl();
const dateForm = buildFormMetadata(502, 'carbon-date-form-uuid', 'Carbon Date Form', [dateControl]);

export const CarbonDate = {
  render: () => (
    <StoryWrapper json={dateForm}>
      <CarbonContainer {...carbonContainerCommonProps} metadata={dateForm} observations={[]} />
    </StoryWrapper>
  ),
};

const dateTimeControl = buildDateTimeControl();
const dateTimeForm = buildFormMetadata(503, 'carbon-datetime-form-uuid', 'Carbon DateTime Form', [dateTimeControl]);

export const CarbonDateTime = {
  render: () => (
    <StoryWrapper json={dateTimeForm}>
      <CarbonContainer {...carbonContainerCommonProps} metadata={dateTimeForm} observations={[]} />
    </StoryWrapper>
  ),
};

const booleanControl = buildBooleanControl();
const booleanForm = buildFormMetadata(504, 'carbon-boolean-form-uuid', 'Carbon Boolean Form', [booleanControl]);

export const CarbonBoolean = {
  render: () => (
    <StoryWrapper json={booleanForm}>
      <CarbonContainer {...carbonContainerCommonProps} metadata={booleanForm} observations={[]} />
    </StoryWrapper>
  ),
};

const radioButtonControl = buildRadioButtonControl();
const radioButtonForm = buildFormMetadata(
  505, 'carbon-radiobutton-form-uuid', 'Carbon RadioButton Form', [radioButtonControl]
);

export const CarbonRadioButton = {
  render: () => (
    <StoryWrapper json={radioButtonForm}>
      <CarbonContainer {...carbonContainerCommonProps} metadata={radioButtonForm} observations={[]} />
    </StoryWrapper>
  ),
};

const freeTextAutoCompleteControl = buildFreeTextAutoCompleteControl();
const freeTextAutoCompleteForm = buildFormMetadata(
  506, 'carbon-freetext-form-uuid', 'Carbon FreeTextAutoComplete Form', [freeTextAutoCompleteControl]
);

export const CarbonFreeTextAutoComplete = {
  render: () => (
    <StoryWrapper json={freeTextAutoCompleteForm}>
      <CarbonContainer {...carbonContainerCommonProps} metadata={freeTextAutoCompleteForm} observations={[]} />
    </StoryWrapper>
  ),
};

const OBS_CONTROL_FORM_NAME = 'Carbon ObsControl Abnormal Form';
const { control: abnormalObsControl, observations: buildAbnormalObsObservations } = buildAbnormalObsControl();
const obsControlForm = buildFormMetadata(
  507, 'carbon-obscontrol-form-uuid', OBS_CONTROL_FORM_NAME, [abnormalObsControl]
);

export const CarbonObsControl = {
  render: () => (
    <StoryWrapper json={obsControlForm}>
      <CarbonContainer
        {...carbonContainerCommonProps}
        metadata={obsControlForm}
        observations={buildAbnormalObsObservations(OBS_CONTROL_FORM_NAME)}
      />
    </StoryWrapper>
  ),
  parameters: {
    docs: {
      description: {
        story: '`properties.abnormal` + `properties.notes` are both set, and the observation is ' +
          'pre-populated with a value outside the normal range and `interpretation: \'ABNORMAL\'`, so ' +
          'the Carbon SelectableTag renders selected on first paint.',
      },
    },
  },
};

const sectionControl = buildSectionControl();
const sectionForm = buildFormMetadata(508, 'carbon-section-form-uuid', 'Carbon Section Form', [sectionControl]);

export const CarbonSection = {
  render: () => (
    <StoryWrapper json={sectionForm}>
      <CarbonContainer {...carbonContainerCommonProps} metadata={sectionForm} observations={[]} collapse={false} />
    </StoryWrapper>
  ),
};

const OBS_GROUP_FORM_NAME = 'Carbon ObsGroup Form';
const { control: vitalsObsGroupControl, observations: buildVitalsObsGroupObservations } = buildVitalsObsGroupControl();
const obsGroupForm = buildFormMetadata(509, 'carbon-obsgroup-form-uuid', OBS_GROUP_FORM_NAME, [vitalsObsGroupControl]);

export const CarbonObsGroup = {
  render: () => (
    <StoryWrapper json={obsGroupForm}>
      <CarbonContainer
        {...carbonContainerCommonProps}
        metadata={obsGroupForm}
        observations={buildVitalsObsGroupObservations(OBS_GROUP_FORM_NAME)}
        collapse={false}
      />
    </StoryWrapper>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Pulse (88) and Fever (Yes) are pre-populated via the parent group\'s `groupMembers` ' +
          '(AC #9), so both children show values as soon as the Accordion opens.',
      },
    },
  },
};

const TABLE_FORM_NAME = 'Carbon Table Form';
const { control: vitalsTableControl, observations: buildVitalsTableObservations } = buildVitalsTableControl();
const tableForm = buildFormMetadata(510, 'carbon-table-form-uuid', TABLE_FORM_NAME, [vitalsTableControl]);

export const CarbonTable = {
  render: () => (
    <StoryWrapper json={tableForm}>
      <CarbonContainer
        {...carbonContainerCommonProps}
        metadata={tableForm}
        observations={buildVitalsTableObservations(TABLE_FORM_NAME)}
      />
    </StoryWrapper>
  ),
};

const locationControl = buildLocationControl();
const locationForm = buildFormMetadata(511, 'carbon-location-form-uuid', 'Carbon Location Form', [locationControl]);

export const CarbonLocation = {
  decorators: [withLocationHttp],
  render: () => (
    <StoryWrapper json={locationForm}>
      <CarbonContainer {...carbonContainerCommonProps} metadata={locationForm} observations={[]} />
    </StoryWrapper>
  ),
};

const providerControl = buildProviderControl();
const providerForm = buildFormMetadata(512, 'carbon-provider-form-uuid', 'Carbon Provider Form', [providerControl]);

export const CarbonProvider = {
  decorators: [withProviderHttp],
  render: () => (
    <StoryWrapper json={providerForm}>
      <CarbonContainer {...carbonContainerCommonProps} metadata={providerForm} observations={[]} />
    </StoryWrapper>
  ),
};

const imageControl = buildImageControl();
const imageForm = buildFormMetadata(513, 'carbon-image-form-uuid', 'Carbon Image Form', [imageControl]);

export const CarbonImage = {
  render: () => (
    <StoryWrapper json={imageForm}>
      <CarbonContainer {...carbonContainerCommonProps} metadata={imageForm} observations={[]} />
    </StoryWrapper>
  ),
};

const videoControl = buildVideoControl();
const videoForm = buildFormMetadata(514, 'carbon-video-form-uuid', 'Carbon Video Form', [videoControl]);

export const CarbonVideo = {
  render: () => (
    <StoryWrapper json={videoForm}>
      <CarbonContainer {...carbonContainerCommonProps} metadata={videoForm} observations={[]} />
    </StoryWrapper>
  ),
};

const ALL_CONTROLS_FORM_NAME = 'Carbon All Controls Form';

const allAbnormalObsControl = buildAbnormalObsControl({ id: 'all-obscontrol-1', column: 0, row: 10 });
const allVitalsObsGroup = buildVitalsObsGroupControl({ id: 'all-obsgroup-1', column: 0, row: 12 });
const allVitalsTable = buildVitalsTableControl({ id: 'all-table-1', column: 0, row: 13 });

const allControlsList = [
  atLocation(carbonAutoCompleteControl, 0, 0),
  atLocation(carbonDropDownControl, 0, 1),
  atLocation(carbonButtonControl, 0, 2),
  buildTextBoxControl({ id: 'all-textbox-1', column: 0, row: 3 }),
  buildNumericBoxControl({ id: 'all-numeric-1', column: 0, row: 4 }),
  buildDateControl({ id: 'all-date-1', column: 0, row: 5 }),
  buildDateTimeControl({ id: 'all-datetime-1', column: 0, row: 6 }),
  buildBooleanControl({ id: 'all-boolean-1', column: 0, row: 7 }),
  buildRadioButtonControl({ id: 'all-radiobutton-1', column: 0, row: 8 }),
  buildFreeTextAutoCompleteControl({ id: 'all-freetext-1', column: 0, row: 9 }),
  allAbnormalObsControl.control,
  buildSectionControl({ id: 'all-section-1', column: 0, row: 11 }),
  allVitalsObsGroup.control,
  allVitalsTable.control,
  buildLocationControl({ id: 'all-location-1', column: 0, row: 14 }),
  buildProviderControl({ id: 'all-provider-1', column: 0, row: 15 }),
  buildImageControl({ id: 'all-image-1', column: 0, row: 16 }),
  buildVideoControl({ id: 'all-video-1', column: 0, row: 17 }),
];

const allControlsForm = buildFormMetadata(
  515, 'carbon-all-controls-form-uuid', ALL_CONTROLS_FORM_NAME, allControlsList
);

const allControlsObservations = [
  ...allAbnormalObsControl.observations(ALL_CONTROLS_FORM_NAME),
  ...allVitalsObsGroup.observations(ALL_CONTROLS_FORM_NAME),
  ...allVitalsTable.observations(ALL_CONTROLS_FORM_NAME),
];

export const AllControls = {
  decorators: [withLocationHttp, withProviderHttp],
  render: () => (
    <StoryWrapper json={allControlsForm}>
      <CarbonContainer
        {...carbonContainerCommonProps}
        metadata={allControlsForm}
        observations={allControlsObservations}
        collapse={false}
      />
    </StoryWrapper>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Every one of the 18 types registered in `carbonComponents` rendered through a ' +
          'single CarbonContainer instance, including both Location and Provider (each needing ' +
          'their own OpenMRS REST fetch, stubbed here simultaneously via ./httpStub).',
      },
    },
  },
};
