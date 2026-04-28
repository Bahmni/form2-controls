import React from 'react';
import { action } from '@storybook/addon-actions';
import { AutoComplete } from 'src/components/AutoComplete.jsx';

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
          'Observation value is stored as the selected option object.\n\n' +
          'Accessibility (WCAG 2.1 AA): Combobox pattern with listbox popup (SC 1.3.1, 4.1.2); ' +
          'keyboard navigable with arrow keys and Enter to select (SC 2.1.1); ' +
          'visible focus ring (SC 2.4.7); suggestions announced via aria-live region (SC 4.1.3); ' +
          'mandatory validation announced via aria-invalid (SC 3.3.1); text contrast ≥ 4.5:1 (SC 1.4.3).',
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

export const WithValidationError = {
  render: () => (
    <AutoComplete
      {...defaultProps}
      validate={true}
      validations={['mandatory']}
    />
  ),
};
