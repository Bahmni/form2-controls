import React from 'react';
import { action } from '@storybook/addon-actions';
import { Date } from 'src/components/Date.jsx';
import '../styles/styles.scss';

const defaultProps = {
  onChange: action('onChange'),
  validate: false,
  validateForm: false,
  validations: [],
  enabled: true,
  formFieldPath: 'test/1-0',
  conceptUuid: 'date-concept-uuid',
};

export default {
  title: 'Atomic Controls/Date',
  component: Date,
  parameters: {
    docs: {
      description: {
        component:
          'Native date picker for date-type observations. ' +
          'Value is stored and transmitted as ISO 8601 string (YYYY-MM-DD). ' +
          'Supports mandatory validation and enabled/disabled states.',
      },
    },
  },
};

export const Default = {
  render: () => (
    <Date
      {...defaultProps}
    />
  ),
};

export const WithValue = {
  render: () => (
    <Date
      {...defaultProps}
      value="2024-01-15"
    />
  ),
};

export const Disabled = {
  render: () => (
    <Date
      {...defaultProps}
      enabled={false}
      value="2024-01-15"
    />
  ),
};
