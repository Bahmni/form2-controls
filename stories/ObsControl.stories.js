import React from 'react';
import { action } from '@storybook/addon-actions';
import { ObsControlWithIntl as ObsControl } from 'src/components/ObsControl.jsx';
import { CarbonContainer } from 'src/components/bahmni-design-system/CarbonContainer';
import StoryWrapper from './StoryWrapper';
import '../styles/styles.scss';

const form = {
  controls: [
    {
      type: 'obsControl',
      label: { id: 'systolic', type: 'label', value: 'Systolic' },
      properties: { mandatory: true, allowDecimal: false, addMore: true, location: { column: 0, row: 0 } },
      id: '1',
      concept: { name: 'Systolic', uuid: 'c36e9c8b-3f10-11e4-adec-0800271c1b75', datatype: 'Numeric' },
    },
    {
      type: 'obsControl',
      label: { id: 'diastolic', type: 'label', value: 'Diastolic' },
      properties: { mandatory: true, location: { column: 0, row: 0 } },
      id: '2',
      concept: { name: 'Diastolic', uuid: 'c379aa1d-3f10-11e4-adec-0800271c1b75', datatype: 'Text' },
    },
    {
      options: [{ name: 'Yes', value: true }, { name: 'No', value: false }],
      displayType: 'button',
      type: 'obsControl',
      label: { type: 'label', value: 'Smoking History' },
      properties: { mandatory: true, notes: false, location: { column: 0, row: 0 } },
      id: '3',
      concept: {
        name: 'Smoking History',
        uuid: 'c2a43174-c9db-4e54-8516-17372c83537f',
        datatype: 'Boolean',
        properties: { allowDecimal: null },
      },
    },
    {
      type: 'obsControl',
      label: { type: 'label', value: 'Coded concept' },
      properties: { mandatory: true, notes: false, autoComplete: false, location: { column: 0, row: 0 } },
      id: '5',
      concept: {
        name: 'Coded concept',
        uuid: 'c2a43174-c990-4e54-8516-17372c83537f',
        datatype: 'Coded',
        answers: [
          { display: 'Answer1', name: 'Answer1', uuid: 'answer1uuid' },
          { display: 'Answer2', name: 'Answer2', uuid: 'answer2uuid' },
        ],
      },
    },
    {
      type: 'obsControl',
      label: { id: 'systolic', type: 'label', value: 'Systolic' },
      properties: { mandatory: true, allowDecimal: false, location: { column: 0, row: 0 } },
      id: '6',
      concept: { name: 'Systolic', uuid: 'c36e9c8b-3f10-11e4-adec-0800271c1b75', datatype: 'Date' },
    },
    {
      type: 'obsControl',
      label: { id: 'systolic', type: 'label', value: 'Systolic' },
      properties: { mandatory: true, allowDecimal: false, location: { column: 0, row: 0 } },
      id: '7',
      concept: { name: 'Systolic', uuid: 'c36e9c8b-3f10-11e4-adec-0800271c1b75', datatype: 'DateTime' },
    },
    {
      type: 'obsControl',
      label: { type: 'label', value: 'Coded concept' },
      properties: { mandatory: true, notes: false, autoComplete: false, dropDown: true, location: { column: 0, row: 0 } },
      id: '8',
      concept: {
        name: 'Coded concept',
        uuid: 'c2a43174-c990-4e54-8516-17372c83537f',
        datatype: 'Coded',
        answers: [
          { display: 'Answer1', name: 'Answer1', uuid: 'answer1uuid' },
          { display: 'Answer2', name: 'Answer2', uuid: 'answer2uuid' },
        ],
      },
    },
  ],
};

const addMoreControl = {
  type: 'obsControl',
  label: { id: 'headache', type: 'label', value: 'Headache' },
  properties: { mandatory: true, addMore: true, location: { column: 0, row: 0 } },
  id: '20',
  concept: { name: 'Headache', uuid: 'c379aaff-3f10-11e4-adec-0800271c1b75', datatype: 'Text' },
};

const commonProps = {
  onValueChanged: () => {},
  showNotification: () => {},
  validate: false,
  validateForm: false,
  formFieldPath: 'test/1-0',
};

const emptyValue = { value: undefined, comment: undefined, interpretation: undefined };

export default {
  title: 'ObsControl',
};

export const NumericObsControl = {
  render: () => (
    <StoryWrapper json={form.controls[0]}>
      <ObsControl
        {...commonProps}
        formUuid={'fbc5d897-64e4-4cc1-90a3-47fde7a98026'}
        metadata={form.controls[0]}
        value={emptyValue}
      />
    </StoryWrapper>
  ),
};

export const TextBoxObsControl = {
  render: () => (
    <StoryWrapper json={form.controls[1]}>
      <ObsControl
        {...commonProps}
        formUuid={'fbc5d897-64e4-4cc1-90a3-47fde7a98026'}
        metadata={form.controls[1]}
        value={emptyValue}
      />
    </StoryWrapper>
  ),
};

export const TextBoxObsControlWithAddMoreEnabled = {
  render: () => (
    <StoryWrapper json={addMoreControl}>
      <ObsControl
        {...commonProps}
        formUuid={'fbc5d897-64e4-4cc1-90a3-47fde7a98026'}
        metadata={addMoreControl}
        value={emptyValue}
        onControlAdd={action('add clicked')}
        onControlRemove={action('remove clicked')}
      />
    </StoryWrapper>
  ),
};

export const BooleanObsControl = {
  render: () => (
    <StoryWrapper json={form.controls[2]}>
      <ObsControl
        {...commonProps}
        formUuid={'fbc5d897-64e4-4cc1-90a3-47fde7a98026'}
        metadata={form.controls[2]}
        value={emptyValue}
      />
    </StoryWrapper>
  ),
};

export const CodedObsControl = {
  render: () => (
    <StoryWrapper json={form.controls[3]}>
      <ObsControl
        {...commonProps}
        metadata={form.controls[3]}
        value={emptyValue}
      />
    </StoryWrapper>
  ),
};

export const DateObsControl = {
  render: () => (
    <StoryWrapper json={form.controls[4]}>
      <ObsControl
        {...commonProps}
        metadata={form.controls[4]}
        value={{ value: '1999-03-03', comment: undefined, interpretation: undefined }}
      />
    </StoryWrapper>
  ),
};

export const DateTimeObsControl = {
  render: () => (
    <StoryWrapper json={form.controls[5]}>
      <ObsControl
        {...commonProps}
        metadata={form.controls[5]}
        value={{ value: '2016-12-31 14:21', comment: undefined, interpretation: undefined }}
      />
    </StoryWrapper>
  ),
};

export const CodedObsControlDropDown = {
  render: () => (
    <StoryWrapper json={form.controls[6]}>
      <ObsControl
        {...commonProps}
        metadata={form.controls[6]}
        value={emptyValue}
      />
    </StoryWrapper>
  ),
};

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
