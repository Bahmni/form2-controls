import React from 'react';
import { action } from '@storybook/addon-actions';
import { TextBox } from 'src/components/TextBox.jsx';
import '../styles/styles.scss';

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
          'Observation value is stored as a plain string.',
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
