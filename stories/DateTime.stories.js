import React from 'react';
import { action } from '@storybook/addon-actions';
import { DateTime } from 'src/components/DateTime.jsx';
import '../styles/styles.scss';

const defaultProps = {
  onChange: action('onChange'),
  validate: false,
  validateForm: false,
  validations: [],
  enabled: true,
  formFieldPath: 'test/1-0',
  conceptUuid: 'datetime-concept-uuid',
};

export default {
  title: 'Atomic Controls/DateTime',
  component: DateTime,
  parameters: {
    docs: {
      description: {
        component:
          'Combined date and time picker for datetime observations. ' +
          'Value format is "YYYY-MM-DD HH:mm". Both fields must be filled for a valid observation. ' +
          'A partial fill (date only or time only) triggers an "Incorrect Date Time" validation error.',
      },
    },
  },
};

export const Default = {
  render: () => (
    <DateTime
      {...defaultProps}
    />
  ),
};

export const WithValue = {
  render: () => (
    <DateTime
      {...defaultProps}
      value="2024-01-15 14:30"
    />
  ),
};

export const Disabled = {
  render: () => (
    <DateTime
      {...defaultProps}
      enabled={false}
      value="2024-01-15 09:00"
    />
  ),
};
