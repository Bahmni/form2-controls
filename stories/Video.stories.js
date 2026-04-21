import React from 'react';
import { action } from '@storybook/addon-actions';
import { Video } from 'src/components/Video.jsx';
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
  title: 'Atomic Controls/Video',
  component: Video,
  parameters: {
    docs: {
      description: {
        component:
          'File upload control for video observations (MP4, MKV, OGG, etc.). ' +
          'Shows an "Upload Video" label before a file is selected, and a video player after upload. ' +
          'Full upload requires a Bahmni backend; these stories demonstrate the UI states only.',
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
