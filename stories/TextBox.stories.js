import React from 'react';
import { action } from '@storybook/addon-actions';
import { TextBox } from 'src/components/TextBox.jsx';

const defaultProps = {
  onChange: action('onChange'),
  validate: false,
  validateForm: false,
  validations: [],
  enabled: true,
  formFieldPath: 'test/1-0',
  conceptUuid: 'textbox-concept-uuid',
};

export default {
  title: 'Atomic Controls/TextBox',
  component: TextBox,
  parameters: {
    docs: {
      description: {
        component:
          'Multi-line text area for free-form text observations. Auto-resizes with content. ' +
          'Observation value is stored as a plain string.\n\n' +
          'Accessibility (WCAG 2.1 AA): Keyboard navigable (SC 2.1.1); visible focus ring (SC 2.4.7); ' +
          'mandatory validation error announced via aria-invalid and adjacent error message (SC 3.3.1, 3.3.3); ' +
          'label programmatically associated via htmlFor/id (SC 1.3.1); text contrast ≥ 4.5:1 (SC 1.4.3).',
      },
    },
  },
};

export const Default = {
  render: () => (
    <TextBox
      {...defaultProps}
    />
  ),
};

export const WithValue = {
  render: () => (
    <TextBox
      {...defaultProps}
      value="Patient reports mild headache since yesterday morning."
    />
  ),
};

export const Disabled = {
  render: () => (
    <TextBox
      {...defaultProps}
      enabled={false}
    />
  ),
};

export const ReadOnly = {
  render: () => (
    <TextBox
      {...defaultProps}
      enabled={false}
      value="Chief complaint: fever for 3 days."
    />
  ),
};

export const WithValidationError = {
  render: () => (
    <TextBox
      {...defaultProps}
      validate={true}
      validations={['mandatory']}
      value={undefined}
    />
  ),
};
