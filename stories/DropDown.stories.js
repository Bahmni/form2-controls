import React from 'react';
import { action } from '@storybook/addon-actions';
import { DropDown } from 'src/components/DropDown.jsx';

const bloodGroupOptions = [
  { name: 'A+', uuid: 'bg-uuid-ap', display: 'A+' },
  { name: 'A-', uuid: 'bg-uuid-am', display: 'A-' },
  { name: 'B+', uuid: 'bg-uuid-bp', display: 'B+' },
  { name: 'B-', uuid: 'bg-uuid-bm', display: 'B-' },
  { name: 'AB+', uuid: 'bg-uuid-abp', display: 'AB+' },
  { name: 'AB-', uuid: 'bg-uuid-abm', display: 'AB-' },
  { name: 'O+', uuid: 'bg-uuid-op', display: 'O+' },
  { name: 'O-', uuid: 'bg-uuid-om', display: 'O-' },
];

const defaultProps = {
  onValueChange: action('onValueChange'),
  options: [],
  enabled: true,
  searchable: false,
  validations: [],
  labelKey: 'display',
  valueKey: 'uuid',
};

export default {
  title: 'Atomic Controls/DropDown',
  component: DropDown,
  parameters: {
    docs: {
      description: {
        component:
          'Non-searchable dropdown select for coded single-select observations. ' +
          'Uses AutoComplete internally with asynchronous=false. ' +
          'Best suited for small, finite option sets.\n\n' +
          'Accessibility (WCAG 2.1 AA): Combobox role with aria-expanded state (SC 1.3.1, 4.1.2); ' +
          'keyboard navigable with arrow keys (SC 2.1.1); visible focus ring (SC 2.4.7); ' +
          'mandatory validation announced via aria-invalid (SC 3.3.1); text contrast ≥ 4.5:1 (SC 1.4.3).',
      },
    },
  },
};

export const Default = {
  render: () => (
    <DropDown
      {...defaultProps}
    />
  ),
};

export const WithOptions = {
  render: () => (
    <DropDown
      {...defaultProps}
      options={bloodGroupOptions}
    />
  ),
};

export const Searchable = {
  render: () => (
    <DropDown
      {...defaultProps}
      options={bloodGroupOptions}
      searchable={true}
    />
  ),
};

export const Disabled = {
  render: () => (
    <DropDown
      {...defaultProps}
      options={bloodGroupOptions}
      enabled={false}
      value={{ name: 'O+', uuid: 'bg-uuid-op', display: 'O+' }}
    />
  ),
};

export const WithValidationError = {
  render: () => (
    <DropDown
      {...defaultProps}
      options={bloodGroupOptions}
      validate={true}
      validations={['mandatory']}
    />
  ),
};
