import React from 'react';
import { Video } from 'src/components/Video.jsx';

export default {
  title: 'Atomic Controls/Video',
  component: Video,
  args: {
    validate: false,
    validations: [],
    enabled: true,
    formFieldPath: 'test/1-0',
    patientUuid: 'patient-uuid-12345',
    addMore: false,
  },
  argTypes: {
    onChange: { action: 'onChange' },
    onControlAdd: { action: 'onControlAdd' },
    showNotification: { action: 'showNotification' },
    enabled: { control: 'boolean' },
    validate: { control: 'boolean' },
    addMore: { control: 'boolean' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'File upload control for video observations (MP4, MKV, OGG, etc.). ' +
          'Shows an "Upload Video" label before a file is selected, and a video player after upload. ' +
          'Full upload requires a Bahmni backend; these stories demonstrate the UI states only.\n\n' +
          'Camera capture (AC 13.1): camera capture is not natively invoked — the file input does not ' +
          'carry a capture attribute, so the OS file picker opens instead of the camera directly.\n\n' +
          'Observation storage format (AC 13.2): observation value is stored as ' +
          '"<patientUuid>/<filename>" after successful upload to the Bahmni visitDocument API.\n\n' +
          'Accessibility (WCAG 2.1 AA): File input activated via keyboard (SC 2.1.1); ' +
          'visible focus ring on the upload trigger (SC 2.4.7); ' +
          'upload status announced via aria-live region (SC 4.1.3); ' +
          'video player provides keyboard-accessible playback controls (SC 2.1.1); ' +
          'mandatory validation announced via aria-invalid (SC 3.3.1); text contrast ≥ 4.5:1 (SC 1.4.3).',
      },
    },
  },
};

export const Default = {};

export const Disabled = {
  args: {
    enabled: false,
  },
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
  args: {
    value: 'patient-uuid-12345/consultation-video-2024.mp4',
  },
};

export const WithValidationError = {
  args: {
    validate: true,
    validations: ['mandatory'],
  },
};
