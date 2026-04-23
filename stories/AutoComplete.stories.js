import React from 'react';
import { action } from '@storybook/addon-actions';
import { AutoComplete } from 'src/components/AutoComplete.jsx';
import '../styles/styles.scss';

const medicationOptions = [
  { uuid: 'med-uuid-1', name: 'Paracetamol', display: 'Paracetamol' },
  { uuid: 'med-uuid-2', name: 'Ibuprofen', display: 'Ibuprofen' },
  { uuid: 'med-uuid-3', name: 'Amoxicillin', display: 'Amoxicillin' },
  { uuid: 'med-uuid-4', name: 'Metformin', display: 'Metformin' },
  { uuid: 'med-uuid-5', name: 'Atorvastatin', display: 'Atorvastatin' },
];

const defaultProps = {
  onValueChange: action('onValueChange'),
  options: medicationOptions,
  asynchronous: false,
  minimumInput: 0,
  searchable: false,
  enabled: true,
  multiSelect: false,
  formFieldPath: 'test/1-0',
  validations: [],
  labelKey: 'display',
  valueKey: 'uuid',
  conceptUuid: 'autocomplete-concept-uuid',
};

export default {
  title: 'Atomic Controls/AutoComplete',
  component: AutoComplete,
  parameters: {
    docs: {
      description: {
        component:
          'Searchable select control for coded observations. ' +
          'Supports synchronous option lists, client-side search filtering, ' +
          'and asynchronous HTTP loading for large concept sets. ' +
          'Observation value is stored as the selected option object.',
      },
    },
  },
};

export const SynchronousSelect = {
  render: () => (
    <AutoComplete
      {...defaultProps}
    />
  ),
};

export const SearchableSelect = {
  render: () => (
    <AutoComplete
      {...defaultProps}
      searchable={true}
      minimumInput={0}
    />
  ),
};

export const MultiSelect = {
  render: () => (
    <AutoComplete
      {...defaultProps}
      multiSelect={true}
      searchable={true}
      minimumInput={0}
    />
  ),
};

export const Disabled = {
  render: () => (
    <AutoComplete
      {...defaultProps}
      enabled={false}
      value={{ uuid: 'med-uuid-1', name: 'Paracetamol', display: 'Paracetamol' }}
    />
  ),
};
