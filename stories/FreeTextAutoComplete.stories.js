import React from 'react';
import { FreeTextAutoComplete } from 'src/components/FreeTextAutoComplete.jsx';

const suggestionOptions = [
  { label: 'Headache', value: 'headache' },
  { label: 'Fever', value: 'fever' },
  { label: 'Cough', value: 'cough' },
  { label: 'Nausea', value: 'nausea' },
  { label: 'Fatigue', value: 'fatigue' },
];

export default {
  title: 'Atomic Controls/FreeTextAutoComplete',
  component: FreeTextAutoComplete,
  args: {
    options: [],
    multi: false,
    clearable: false,
    backspaceRemoves: false,
    deleteRemoves: false,
    conceptUuid: 'free-text-concept-uuid',
  },
  argTypes: {
    onChange: { action: 'onChange' },
    multi: { control: 'boolean' },
    clearable: { control: 'boolean' },
    backspaceRemoves: { control: 'boolean' },
    deleteRemoves: { control: 'boolean' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Creatable select input combining free-text entry with predefined suggestions. ' +
          'Users can type any value or pick from options. ' +
          'Supports single and multi-select modes.\n\n' +
          'Accessibility (WCAG 2.1 AA): Combobox pattern with creatable listbox (SC 1.3.1, 4.1.2); ' +
          'keyboard navigable with arrow keys and Enter to create new options (SC 2.1.1); ' +
          'visible focus ring (SC 2.4.7); new option creation announced via aria-live (SC 4.1.3); ' +
          'text contrast ≥ 4.5:1 (SC 1.4.3). Note: disabled state is not natively supported by ' +
          'this component — use a <fieldset disabled> wrapper for accessible disabling.',
      },
    },
  },
};

export const Default = {};

export const WithOptions = {
  args: {
    options: suggestionOptions,
  },
};

export const MultiSelect = {
  args: {
    options: suggestionOptions,
    multi: true,
    clearable: true,
  },
};

export const Clearable = {
  args: {
    options: suggestionOptions,
    clearable: true,
    value: { label: 'Headache', value: 'headache' },
  },
};

export const Disabled = {
  parameters: {
    docs: {
      description: {
        story:
          'FreeTextAutoComplete does not expose an enabled/isDisabled prop. ' +
          'A <fieldset disabled> wrapper is used so screen readers announce the group as disabled (SC 4.1.2), ' +
          'consistent with the RadioButton disabled pattern.',
      },
    },
  },
  render: (args) => (
    <fieldset disabled style={{ border: 'none', padding: 0, margin: 0 }}>
      <FreeTextAutoComplete {...args} />
    </fieldset>
  ),
  args: {
    options: suggestionOptions,
    value: { label: 'Headache', value: 'headache' },
  },
};

export const WithValidationError = {
  parameters: {
    docs: {
      description: {
        story:
          'FreeTextAutoComplete does not implement its own validation logic. ' +
          'Validation errors are managed by the parent ObsControl and surface via CSS class injection. ' +
          'This story simulates the error wrapper applied by the parent.',
      },
    },
  },
  render: (args) => (
    <div className="form-builder-error">
      <FreeTextAutoComplete {...args} />
    </div>
  ),
  args: {
    options: suggestionOptions,
  },
};
