import React from 'react';
import { action } from '@storybook/addon-actions';
import { Image } from 'src/components/Image.jsx';

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
          'Full upload requires a Bahmni backend; these stories demonstrate the UI states only.\n\n' +
          'Accessibility (WCAG 2.1 AA): File input activated via keyboard (SC 2.1.1); ' +
          'visible focus ring on the upload trigger (SC 2.4.7); ' +
          'upload status announced via aria-live region (SC 4.1.3); ' +
          'uploaded image includes a descriptive alt attribute (SC 1.1.1); ' +
          'mandatory validation announced via aria-invalid (SC 3.3.1); text contrast ≥ 4.5:1 (SC 1.4.3).',
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

export const WithUploadedFile = {
  parameters: {
    docs: {
      description: {
        story:
          'Pre-uploaded state: the component receives an existing value (filename) and renders ' +
          'in its "file already uploaded" state with a delete/void option. ' +
          'The image src will 404 in Storybook without a Bahmni backend.',
      },
    },
  },
  render: () => (
    <Image
      {...defaultProps}
      value="patient-uuid-12345/chest-xray-2024.jpg"
    />
  ),
};

export const WithValidationError = {
  render: () => (
    <Image
      {...defaultProps}
      validate={true}
      validations={['mandatory']}
    />
  ),
};
