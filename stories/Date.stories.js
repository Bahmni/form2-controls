import React from 'react';
import { Date } from 'src/components/Date.jsx';

export default {
  title: 'Atomic Controls/Date',
  component: Date,
  args: {
    validate: false,
    validateForm: false,
    validations: [],
    enabled: true,
    formFieldPath: 'test/1-0',
    conceptUuid: 'date-concept-uuid',
  },
  argTypes: {
    onChange: { action: 'onChange' },
    enabled: { control: 'boolean' },
    validate: { control: 'boolean' },
    validateForm: { control: 'boolean' },
    value: { control: 'text' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Native date picker for date-type observations. ' +
          'Value is stored and transmitted as ISO 8601 string (YYYY-MM-DD). ' +
          'Supports mandatory validation and enabled/disabled states.\n\n' +
          'Accessibility (WCAG 2.1 AA): Native date input is keyboard navigable (SC 2.1.1) ' +
          'and announces its input type to screen readers (SC 1.3.1); visible focus ring (SC 2.4.7); ' +
          'validation errors surfaced via aria-invalid (SC 3.3.1); ' +
          'disabled state set via HTML disabled attribute (SC 4.1.2); text contrast ≥ 4.5:1 (SC 1.4.3).',
      },
    },
  },
};

export const Default = {};

export const WithValue = {
  args: {
    value: '2024-01-15',
  },
};

export const Disabled = {
  args: {
    enabled: false,
    value: '2024-01-15',
  },
};

export const WithValidationError = {
  args: {
    validate: true,
    validations: ['mandatory'],
  },
};
