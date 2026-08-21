import React from 'react';
import { CarbonContainer } from 'src/components/bahmni-design-system/CarbonContainer';
import StoryWrapper from '../StoryWrapper';
import { carbonContainerCommonProps, buildFormMetadata, buildColumnHeader } from './complexFixtures';
import { withLocationHttp, withProviderHttp } from './httpStub';
import {
  carbonCodedAnswers,
  textControl,
  numericControl,
  dateControl,
  dateTimeControl,
  booleanControl,
  codedControl,
  freeTextControl,
  sectionControl,
  obsGroupControl,
  tableControl,
  complexControl,
  buildObservation,
  buildGroupObservation,
} from './carbonContainerFixtures';
import '../../styles/styles.scss';

// CodedControl and ComplexControl only register themselves in the global
// ComponentStore as a side effect of being imported (see the last line of
// each file). Nothing in CarbonContainer's own import chain
// (CarbonContainer.jsx -> ObsControl.jsx -> ...) imports them, so without
// these explicit imports the Coded (AutoComplete/DropDown/Button/Radio) and
// Complex (Location/Provider/Image/Video) variants below would silently
// render nothing. Mirrors the documented pattern at the top of
// stories/Container.stories.js.
import 'src/components/CodedControl.jsx';
import 'src/components/ComplexControl.jsx';

// ---------------------------------------------------------------------------
// The 3 original coded variants (AutoComplete/DropDown/Button), preserved
// unchanged in behaviour per AC #12 — same control objects, same shared
// (accidentally-identical) form id/uuid/name as before the move.
// ---------------------------------------------------------------------------
const carbonAutoCompleteControl = {
  type: 'obsControl',
  label: { type: 'label', value: 'Diagnosis (Carbon AutoComplete)' },
  properties: { mandatory: false, notes: false, autoComplete: true, location: { column: 0, row: 0 } },
  id: 'carbon-autocomplete-1',
  concept: {
    name: 'Diagnosis',
    uuid: 'diagnosis-concept-uuid',
    datatype: 'Coded',
    answers: carbonCodedAnswers,
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
    answers: carbonCodedAnswers,
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
    answers: carbonCodedAnswers,
  },
};

const carbonFormMetadata = (control) =>
  buildFormMetadata('carbon-coded-form', 'carbon-coded-form-uuid', 'Carbon Coded Form', [control]);

// ---------------------------------------------------------------------------
// CarbonTextBox
// ---------------------------------------------------------------------------
const TEXT_FORM = 'Carbon Text Form';
const textFormControl = textControl('text-1', 'Chief Complaint', 'carbon-text-uuid', 0, 0);
const textForm = buildFormMetadata(500, 'carbon-text-form-uuid', TEXT_FORM, [textFormControl]);

// ---------------------------------------------------------------------------
// CarbonNumericBox — lowNormal/hiNormal/lowAbsolute/hiAbsolute set so the
// range label renders (AC #3).
// ---------------------------------------------------------------------------
const NUMERIC_FORM = 'Carbon Numeric Form';
const numericFormControl = numericControl('numeric-1', 'Pulse', 'carbon-numeric-uuid', 0, 0,
  { lowNormal: 60, hiNormal: 100, lowAbsolute: 40, hiAbsolute: 180 });
const numericForm = buildFormMetadata(501, 'carbon-numeric-form-uuid', NUMERIC_FORM, [numericFormControl]);

// ---------------------------------------------------------------------------
// CarbonDate
// ---------------------------------------------------------------------------
const DATE_FORM = 'Carbon Date Form';
const dateFormControl = dateControl('date-1', 'Visit Date', 'carbon-date-uuid', 0, 0);
const dateForm = buildFormMetadata(502, 'carbon-date-form-uuid', DATE_FORM, [dateFormControl]);

// ---------------------------------------------------------------------------
// CarbonDateTime
// ---------------------------------------------------------------------------
const DATETIME_FORM = 'Carbon DateTime Form';
const dateTimeFormControl = dateTimeControl('datetime-1', 'Observation DateTime', 'carbon-datetime-uuid', 0, 0);
const dateTimeForm = buildFormMetadata(503, 'carbon-datetime-form-uuid', DATETIME_FORM, [dateTimeFormControl]);

// ---------------------------------------------------------------------------
// CarbonBoolean
// ---------------------------------------------------------------------------
const BOOLEAN_FORM = 'Carbon Boolean Form';
const booleanFormControl = booleanControl('boolean-1', 'Smoking History', 'carbon-boolean-uuid', 0, 0);
const booleanForm = buildFormMetadata(504, 'carbon-boolean-form-uuid', BOOLEAN_FORM, [booleanFormControl]);

// ---------------------------------------------------------------------------
// CarbonRadioButton
// ---------------------------------------------------------------------------
const RADIO_FORM = 'Carbon Radio Form';
const radioFormControl = codedControl('radio-1', 'Pain Location', 'carbon-radio-uuid', 0, 0, 'radio');
const radioForm = buildFormMetadata(505, 'carbon-radio-form-uuid', RADIO_FORM, [radioFormControl]);

// ---------------------------------------------------------------------------
// CarbonFreeTextAutoComplete
// ---------------------------------------------------------------------------
const FREETEXT_FORM = 'Carbon FreeText Form';
const freeTextFormControl = freeTextControl(
  'freetext-1', 'Chief Complaint (Free Text)', 'carbon-freetext-uuid', 0, 0);
const freeTextForm = buildFormMetadata(506, 'carbon-freetext-form-uuid', FREETEXT_FORM, [freeTextFormControl]);

// ---------------------------------------------------------------------------
// CarbonObsControl — showcases the wrapper itself: label + abnormal +
// notes. The observation value (120) trips the Numeric `allowRange`
// validation against hiNormal (100), which is what makes the Carbon
// SelectableTag "Abnormal" button render (see ObsControl.jsx `onChange`).
// ---------------------------------------------------------------------------
const OBSCONTROL_FORM = 'Carbon ObsControl Showcase Form';
const obsControlFormControl = {
  type: 'obsControl',
  label: { type: 'label', value: 'Pulse (Abnormal Demo)' },
  id: 'obscontrol-1',
  properties: { mandatory: false, notes: true, abnormal: true, location: { column: 0, row: 0 } },
  concept: { name: 'Pulse (Abnormal Demo)', uuid: 'carbon-obscontrol-pulse-uuid', datatype: 'Numeric' },
  hiNormal: 100,
  lowNormal: 60,
  hiAbsolute: null,
  lowAbsolute: null,
};
const obsControlForm = buildFormMetadata(507, 'carbon-obscontrol-form-uuid', OBSCONTROL_FORM,
  [obsControlFormControl]);
const obsControlObservations = [
  buildObservation(OBSCONTROL_FORM, '1', 'obscontrol-1', 'carbon-obscontrol-pulse-uuid',
    'Pulse (Abnormal Demo)', 'Numeric', 120),
];

// ---------------------------------------------------------------------------
// CarbonSection — Accordion with nested controls (AC #8).
// ---------------------------------------------------------------------------
const SECTION_FORM = 'Carbon Section Form';
const sectionChildren = [
  textControl('section-child-1', 'Chief Complaint', 'carbon-section-cc-uuid', 0, 0),
  booleanControl('section-child-2', 'Fever', 'carbon-section-fever-uuid', 1, 0),
];
const carbonSectionFormControl = sectionControl('section-1', 'Patient History', sectionChildren, 0, 0);
const sectionForm = buildFormMetadata(508, 'carbon-section-form-uuid', SECTION_FORM, [carbonSectionFormControl]);

// ---------------------------------------------------------------------------
// CarbonObsGroup — Accordion with pre-populated child observations (AC #9).
// ---------------------------------------------------------------------------
const OBSGROUP_FORM = 'Carbon ObsGroup Form';
const obsGroupChildren = [
  booleanControl('obsgroup-child-1', 'Cough', 'carbon-obsgroup-cough-uuid', 0, 0),
  booleanControl('obsgroup-child-2', 'Fatigue', 'carbon-obsgroup-fatigue-uuid', 1, 0),
];
const carbonObsGroupFormControl = obsGroupControl(
  'obsgroup-1', 'Review of Systems', 'carbon-obsgroup-ros-uuid', obsGroupChildren, 0, 0);
const obsGroupForm = buildFormMetadata(509, 'carbon-obsgroup-form-uuid', OBSGROUP_FORM, [carbonObsGroupFormControl]);
const obsGroupObservations = [
  buildGroupObservation(OBSGROUP_FORM, '1', 'obsgroup-1', 'carbon-obsgroup-ros-uuid', 'Review of Systems', [
    buildObservation(OBSGROUP_FORM, '1', 'obsgroup-child-1', 'carbon-obsgroup-cough-uuid', 'Cough', 'Boolean', true),
    buildObservation(
      OBSGROUP_FORM, '1', 'obsgroup-child-2', 'carbon-obsgroup-fatigue-uuid', 'Fatigue', 'Boolean', false),
  ]),
];

// ---------------------------------------------------------------------------
// CarbonTable — DataTable with observation columns (AC #10).
// ---------------------------------------------------------------------------
const TABLE_FORM = 'Carbon Table Form';
const tableChildren = [
  textControl('table-child-1', 'Haemoglobin', 'carbon-table-hgb-uuid', 0, 0),
  textControl('table-child-2', 'Platelets', 'carbon-table-plt-uuid', 0, 1),
];
const carbonTableFormControl = tableControl(
  'table-1', 'Lab Results', [buildColumnHeader('col-carbon-lab-test', 'Lab Test')], tableChildren, 0, 0);
const tableForm = buildFormMetadata(510, 'carbon-table-form-uuid', TABLE_FORM, [carbonTableFormControl]);

// ---------------------------------------------------------------------------
// CarbonLocation / CarbonProvider — Complex datatype routed through
// ComplexControl to the Carbon Location/Provider components, which fetch
// their option list over HTTP on mount (stubbed via the decorators above).
// ---------------------------------------------------------------------------
const LOCATION_FORM = 'Carbon Location Form';
const locationFormControl = complexControl('location-1', 'Ward', 'carbon-location-uuid', 0, 0, 'LocationObsHandler');
const locationForm = buildFormMetadata(511, 'carbon-location-form-uuid', LOCATION_FORM, [locationFormControl]);

const PROVIDER_FORM = 'Carbon Provider Form';
const providerFormControl = complexControl(
  'provider-1', 'Provider', 'carbon-provider-uuid', 0, 0, 'ProviderObsHandler');
const providerForm = buildFormMetadata(512, 'carbon-provider-form-uuid', PROVIDER_FORM, [providerFormControl]);

// ---------------------------------------------------------------------------
// CarbonImage / CarbonVideo — Complex datatype routed through ComplexControl
// to the Carbon Image/Video upload components.
// ---------------------------------------------------------------------------
const IMAGE_FORM = 'Carbon Image Form';
const imageFormControl = complexControl('image-1', 'Patient Image', 'carbon-image-uuid', 0, 0, 'ImageUrlHandler');
const imageForm = buildFormMetadata(513, 'carbon-image-form-uuid', IMAGE_FORM, [imageFormControl]);
const imageObservations = [
  buildObservation(IMAGE_FORM, '1', 'image-1', 'carbon-image-uuid', 'Patient Image', 'Complex', undefined,
    { voided: false }),
];

const VIDEO_FORM = 'Carbon Video Form';
const videoFormControl = complexControl('video-1', 'Patient Video', 'carbon-video-uuid', 0, 0, 'VideoUrlHandler');
const videoForm = buildFormMetadata(514, 'carbon-video-form-uuid', VIDEO_FORM, [videoFormControl]);
const videoObservations = [
  buildObservation(VIDEO_FORM, '1', 'video-1', 'carbon-video-uuid', 'Patient Video', 'Complex', undefined,
    { voided: false }),
];

// ---------------------------------------------------------------------------
// AllControls — every one of the 18 registered types plus the 3 coded
// variants, in a single form, as an at-a-glance overview.
// ---------------------------------------------------------------------------
const ALL_FORM = 'All Carbon Controls Overview Form';
const allControls = [
  textControl('all-text', 'Chief Complaint', 'all-text-uuid', 0, 0),
  numericControl('all-numeric', 'Pulse', 'all-numeric-uuid', 1, 0, { lowNormal: 60, hiNormal: 100 }),
  dateControl('all-date', 'Visit Date', 'all-date-uuid', 0, 1),
  dateTimeControl('all-datetime', 'Observation DateTime', 'all-datetime-uuid', 1, 1),
  booleanControl('all-boolean', 'Smoking History', 'all-boolean-uuid', 0, 2),
  codedControl('all-autocomplete', 'Diagnosis (AutoComplete)', 'all-autocomplete-uuid', 1, 2, 'autoComplete'),
  codedControl('all-dropdown', 'Diagnosis (DropDown)', 'all-dropdown-uuid', 0, 3, 'dropDown'),
  codedControl('all-button', 'Diagnosis (Button)', 'all-button-uuid', 1, 3, undefined),
  codedControl('all-radio', 'Pain Location', 'all-radio-uuid', 0, 4, 'radio'),
  freeTextControl('all-freetext', 'Chief Complaint (Free Text)', 'all-freetext-uuid', 1, 4),
  sectionControl('all-section', 'Patient History', [
    textControl('all-section-child', 'Duration', 'all-section-child-uuid', 0, 0),
  ], 0, 5),
  obsGroupControl('all-obsgroup', 'Review of Systems', 'all-obsgroup-uuid', [
    booleanControl('all-obsgroup-child', 'Cough', 'all-obsgroup-child-uuid', 0, 0),
  ], 1, 5),
  tableControl('all-table', 'Lab Results',
    [buildColumnHeader('all-col-lab-test', 'Lab Test')], [
      textControl('all-table-child', 'Haemoglobin', 'all-table-child-uuid', 0, 0),
    ], 0, 6),
  complexControl('all-location', 'Ward', 'all-location-uuid', 1, 6, 'LocationObsHandler'),
  complexControl('all-provider', 'Provider', 'all-provider-uuid', 0, 7, 'ProviderObsHandler'),
  complexControl('all-image', 'Patient Image', 'all-image-uuid', 1, 7, 'ImageUrlHandler'),
  complexControl('all-video', 'Patient Video', 'all-video-uuid', 0, 8, 'VideoUrlHandler'),
];
const allControlsForm = buildFormMetadata(599, 'all-controls-form-uuid', ALL_FORM, allControls);

export default {
  title: 'Orchestrator/Bahmni Design System/CarbonContainer',
  component: CarbonContainer,
  parameters: {
    docs: {
      description: {
        component:
          'CarbonContainer is a Carbon Design System–backed variant of Container. It renders every ' +
          'one of the 18 component types registered in its scoped `carbonStore` — Text, Numeric, ' +
          'Date, DateTime, Boolean, the four Coded display types (AutoComplete, DropDown, Radio, ' +
          'Button), FreeTextAutoComplete, the ObsControl wrapper, Section, ObsGroupControl, Table, ' +
          'and the four Complex-datatype handlers (Location, Provider, Image, Video) — using Carbon ' +
          'components instead of the legacy Bahmni UI, providing an accessible, consistent look for ' +
          'newer deployments.',
      },
    },
  },
};

export const CarbonCodedAutoComplete = {
  render: () => (
    <StoryWrapper json={carbonAutoCompleteControl}>
      <CarbonContainer
        {...carbonContainerCommonProps}
        metadata={carbonFormMetadata(carbonAutoCompleteControl)}
        observations={[]}
      />
    </StoryWrapper>
  ),
};

export const CarbonCodedDropDown = {
  render: () => (
    <StoryWrapper json={carbonDropDownControl}>
      <CarbonContainer
        {...carbonContainerCommonProps}
        metadata={carbonFormMetadata(carbonDropDownControl)}
        observations={[]}
      />
    </StoryWrapper>
  ),
};

export const CarbonCodedButton = {
  render: () => (
    <StoryWrapper json={carbonButtonControl}>
      <CarbonContainer
        {...carbonContainerCommonProps}
        metadata={carbonFormMetadata(carbonButtonControl)}
        observations={[]}
      />
    </StoryWrapper>
  ),
};

export const CarbonTextBox = {
  render: () => (
    <StoryWrapper json={textForm}>
      <CarbonContainer {...carbonContainerCommonProps} metadata={textForm} observations={[]} />
    </StoryWrapper>
  ),
};

export const CarbonNumericBox = {
  render: () => (
    <StoryWrapper json={numericForm}>
      <CarbonContainer {...carbonContainerCommonProps} metadata={numericForm} observations={[]} />
    </StoryWrapper>
  ),
};

export const CarbonDate = {
  render: () => (
    <StoryWrapper json={dateForm}>
      <CarbonContainer {...carbonContainerCommonProps} metadata={dateForm} observations={[]} />
    </StoryWrapper>
  ),
};

export const CarbonDateTime = {
  render: () => (
    <StoryWrapper json={dateTimeForm}>
      <CarbonContainer {...carbonContainerCommonProps} metadata={dateTimeForm} observations={[]} />
    </StoryWrapper>
  ),
};

export const CarbonBoolean = {
  render: () => (
    <StoryWrapper json={booleanForm}>
      <CarbonContainer {...carbonContainerCommonProps} metadata={booleanForm} observations={[]} />
    </StoryWrapper>
  ),
};

export const CarbonRadioButton = {
  render: () => (
    <StoryWrapper json={radioForm}>
      <CarbonContainer {...carbonContainerCommonProps} metadata={radioForm} observations={[]} />
    </StoryWrapper>
  ),
};

export const CarbonFreeTextAutoComplete = {
  render: () => (
    <StoryWrapper json={freeTextForm}>
      <CarbonContainer {...carbonContainerCommonProps} metadata={freeTextForm} observations={[]} />
    </StoryWrapper>
  ),
};

export const CarbonObsControl = {
  render: () => (
    <StoryWrapper json={obsControlForm}>
      <CarbonContainer
        {...carbonContainerCommonProps}
        metadata={obsControlForm}
        observations={obsControlObservations}
      />
    </StoryWrapper>
  ),
};

export const CarbonSection = {
  render: () => (
    <StoryWrapper json={sectionForm}>
      <CarbonContainer {...carbonContainerCommonProps} metadata={sectionForm} observations={[]} collapse={false} />
    </StoryWrapper>
  ),
};

export const CarbonObsGroup = {
  render: () => (
    <StoryWrapper json={obsGroupForm}>
      <CarbonContainer
        {...carbonContainerCommonProps}
        metadata={obsGroupForm}
        observations={obsGroupObservations}
        collapse={false}
      />
    </StoryWrapper>
  ),
};

export const CarbonTable = {
  render: () => (
    <StoryWrapper json={tableForm}>
      <CarbonContainer {...carbonContainerCommonProps} metadata={tableForm} observations={[]} />
    </StoryWrapper>
  ),
};

export const CarbonLocation = {
  decorators: [withLocationHttp],
  render: () => (
    <StoryWrapper json={locationForm}>
      <CarbonContainer {...carbonContainerCommonProps} metadata={locationForm} observations={[]} />
    </StoryWrapper>
  ),
};

export const CarbonProvider = {
  decorators: [withProviderHttp],
  render: () => (
    <StoryWrapper json={providerForm}>
      <CarbonContainer {...carbonContainerCommonProps} metadata={providerForm} observations={[]} />
    </StoryWrapper>
  ),
};

export const CarbonImage = {
  render: () => (
    <StoryWrapper json={imageForm}>
      <CarbonContainer {...carbonContainerCommonProps} metadata={imageForm} observations={imageObservations} />
    </StoryWrapper>
  ),
};

export const CarbonVideo = {
  render: () => (
    <StoryWrapper json={videoForm}>
      <CarbonContainer {...carbonContainerCommonProps} metadata={videoForm} observations={videoObservations} />
    </StoryWrapper>
  ),
};

export const AllControls = {
  decorators: [withLocationHttp, withProviderHttp],
  render: () => (
    <StoryWrapper json={allControlsForm}>
      <CarbonContainer
        {...carbonContainerCommonProps}
        metadata={allControlsForm}
        observations={[]}
        collapse={false}
      />
    </StoryWrapper>
  ),
};
