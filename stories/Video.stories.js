import React from 'react';
import { action } from '@storybook/addon-actions';
import { Video } from 'src/components/Video.jsx';

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
  title: 'Atomic Controls/Video',
  component: Video,
  parameters: {
    docs: {
      description: {
        component:
          'File upload control for video observations (MP4, MKV, OGG, etc.). ' +
          'Shows an "Upload Video" label before a file is selected, and a video player after upload. ' +
          'Full upload requires a Bahmni backend; these stories demonstrate the UI states only.\n\n' +
          'Accessibility (WCAG 2.1 AA): File input activated via keyboard (SC 2.1.1); ' +
          'visible focus ring on the upload trigger (SC 2.4.7); ' +
          'upload status announced via aria-live region (SC 4.1.3); ' +
          'video player provides keyboard-accessible playback controls (SC 2.1.1); ' +
          'mandatory validation announced via aria-invalid (SC 3.3.1); text contrast ≥ 4.5:1 (SC 1.4.3).',
      },
    },
  },
};

export const Default = {
  render: () => (
    <Video
      {...defaultProps}
    />
  ),
};

export const Disabled = {
  render: () => (
    <Video
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
          'in its "file already uploaded" state with a video player and a delete/void option. ' +
          'The video src will 404 in Storybook without a Bahmni backend.',
      },
    },
  },
  render: () => (
    <Video
      {...defaultProps}
      value="patient-uuid-12345/consultation-video-2024.mp4"
    />
  ),
};

export const WithValidationError = {
  render: () => (
    <Video
      {...defaultProps}
      validate={true}
      validations={['mandatory']}
    />
  ),
};
