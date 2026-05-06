import React from 'react';
import { DateTime } from 'src/components/DateTime.jsx';

export default {
  title: 'Atomic Controls/DateTime',
  component: DateTime,
  args: {
    validate: false,
    validateForm: false,
    validations: [],
    enabled: true,
    formFieldPath: 'test/1-0',
    conceptUuid: 'datetime-concept-uuid',
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
          'Combined date and time picker for datetime observations. ' +
          'Value format is "YYYY-MM-DD HH:mm". Both fields must be filled for a valid observation. ' +
          'A partial fill (date only or time only) triggers an "Incorrect Date Time" validation error.\n\n' +
          'Timezone handling: the value is stored in local browser time with no timezone offset. ' +
          'Consumers are responsible for timezone interpretation; the stored string carries no TZ information.\n\n' +
          'Accessibility (WCAG 2.1 AA): Both date and time inputs are keyboard navigable (SC 2.1.1); ' +
          'visible focus ring on each field (SC 2.4.7); ' +
          'partial-fill and mandatory errors announced via aria-invalid (SC 3.3.1); ' +
          'disabled state propagated via HTML disabled attribute (SC 4.1.2); text contrast ≥ 4.5:1 (SC 1.4.3).',
      },
    },
  },
};

export const Default = {};

export const WithValue = {
  args: {
    value: '2024-01-15 14:30',
  },
};

export const Disabled = {
  args: {
    enabled: false,
    value: '2024-01-15 09:00',
  },
};

export const WithValidationError = {
  args: {
    validate: true,
    validations: ['mandatory'],
  },
};
