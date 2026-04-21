import React from 'react';
import { action } from '@storybook/addon-actions';
import { FreeTextAutoComplete } from 'src/components/FreeTextAutoComplete.jsx';
import '../styles/styles.scss';

const suggestionOptions = [
  { label: 'Headache', value: 'headache' },
  { label: 'Fever', value: 'fever' },
  { label: 'Cough', value: 'cough' },
  { label: 'Nausea', value: 'nausea' },
  { label: 'Fatigue', value: 'fatigue' },
];

const defaultProps = {
  onChange: action('onChange'),
  options: [],
  multi: false,
  clearable: false,
  backspaceRemoves: false,
  deleteRemoves: false,
  conceptUuid: 'free-text-concept-uuid',
};

export default {
  title: 'Atomic Controls/FreeTextAutoComplete',
  component: FreeTextAutoComplete,
  parameters: {
    docs: {
      description: {
        component:
          'Creatable select input combining free-text entry with predefined suggestions. ' +
          'Users can type any value or pick from options. ' +
          'Supports single and multi-select modes.',
      },
    },
  },
};

export const Default = {
  render: () => (
    <FreeTextAutoComplete
      {...defaultProps}
    />
  ),
};

export const WithOptions = {
  render: () => (
    <FreeTextAutoComplete
      {...defaultProps}
      options={suggestionOptions}
    />
  ),
};

export const MultiSelect = {
  render: () => (
    <FreeTextAutoComplete
      {...defaultProps}
      options={suggestionOptions}
      multi={true}
      clearable={true}
    />
  ),
};

export const Clearable = {
  render: () => (
    <FreeTextAutoComplete
      {...defaultProps}
      options={suggestionOptions}
      clearable={true}
      value={{ label: 'Headache', value: 'headache' }}
    />
  ),
};
