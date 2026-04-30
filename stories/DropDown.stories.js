import React from 'react';
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

export default {
  title: 'Atomic Controls/DropDown',
  component: DropDown,
  args: {
    options: bloodGroupOptions,
    enabled: true,
    searchable: false,
    validations: [],
    labelKey: 'display',
    valueKey: 'uuid',
  },
  argTypes: {
    onValueChange: { action: 'onValueChange' },
    enabled: { control: 'boolean' },
    searchable: { control: 'boolean' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Non-searchable dropdown select for coded single-select observations. ' +
          'Uses AutoComplete internally with asynchronous=false. ' +
          'Best suited for small, finite option sets.\n\n' +
          'DropDown is single-select only. For multi-select, use CodedControl with ' +
          'properties.multiSelect: true. Option groups are not supported; all options ' +
          'render in a flat list.\n\n' +
          'Accessibility (WCAG 2.1 AA): Combobox role with aria-expanded state (SC 1.3.1, 4.1.2); ' +
          'keyboard navigable with arrow keys (SC 2.1.1); visible focus ring (SC 2.4.7); ' +
          'mandatory validation announced via aria-invalid (SC 3.3.1); text contrast ≥ 4.5:1 (SC 1.4.3).',
      },
    },
  },
};

export const EmptyOptions = {
  parameters: {
    docs: {
      description: {
        story: 'Intentional empty state — options array is empty. Represents a dropdown before concept answers are loaded.',
      },
    },
  },
  args: {
    options: [],
  },
};

export const WithOptions = {};

export const Searchable = {
  args: {
    searchable: true,
  },
};

export const Disabled = {
  args: {
    enabled: false,
    value: { name: 'O+', uuid: 'bg-uuid-op', display: 'O+' },
  },
};

export const WithValidationError = {
  args: {
    validate: true,
    validations: ['mandatory'],
    options: bloodGroupOptions,
  },
};
