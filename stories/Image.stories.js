import React from 'react';
import { action } from '@storybook/addon-actions';
import { Image } from 'src/components/Image.jsx';
import '../styles/styles.scss';

const defaultProps = {
  onChange: action('onChange'),
  onControlAdd: action('onControlAdd'),
  showNotification: action('showNotification'),
  validate: false,
  validations: [],
  enabled: true,
  formFieldPath: 'test/1-0',
  patientUuid: 'patient-uuid-12345',
  addMore: false,
};

export default {
  title: 'Atomic Controls/Image',
  component: Image,
  parameters: {
    docs: {
      description: {
        component:
          'File upload control for image (JPG, PNG, etc.) and PDF observations. ' +
          'Shows a cloud upload icon before a file is selected, and a preview after upload. ' +
          'Full upload requires a Bahmni backend; these stories demonstrate the UI states only.',
      },
    },
  },
};

export const Default = {
  render: () => (
    <Image
      {...defaultProps}
    />
  ),
};

export const Disabled = {
  render: () => (
    <Image
      {...defaultProps}
      enabled={false}
    />
  ),
};
