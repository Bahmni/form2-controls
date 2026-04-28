import React from 'react';
import { action } from '@storybook/addon-actions';
import { FreeTextAutoComplete } from 'src/components/FreeTextAutoComplete.jsx';

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

export const Disabled = {
  parameters: {
    docs: {
      description: {
        story:
          'FreeTextAutoComplete does not expose an enabled/isDisabled prop. ' +
          'This story uses pointer-events: none and reduced opacity to simulate the disabled appearance. ' +
          'For a fully accessible disabled state, wire isDisabled through to the underlying CreatableSelect.',
      },
    },
  },
  render: () => (
    <div style={{ opacity: 0.5, pointerEvents: 'none' }}>
      <FreeTextAutoComplete
        {...defaultProps}
        options={suggestionOptions}
        value={{ label: 'Headache', value: 'headache' }}
      />
    </div>
  ),
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
  render: () => (
    <div className="form-builder-error">
      <FreeTextAutoComplete
        {...defaultProps}
        options={suggestionOptions}
      />
    </div>
  ),
};
