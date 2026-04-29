import React from 'react';
import { CarbonContainer } from 'src/components/bahmni-design-system/CarbonContainer';
import StoryWrapper from './StoryWrapper';
import '../styles/styles.scss';

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
  patient: {},
  translations: {},
  validate: false,
  validateForm: false,
  collapse: false,
  locale: 'en',
  onValueUpdated: () => {},
};

export default {
  title: 'CarbonContainer',
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
