import React from 'react';
import { NumericBox } from 'src/components/NumericBox.jsx';

export default {
  title: 'Atomic Controls/NumericBox',
  component: NumericBox,
  args: {
    validate: false,
    validateForm: false,
    validations: [],
    enabled: true,
    formFieldPath: 'test/1-0',
    conceptUuid: 'numeric-concept-uuid',
  },
  argTypes: {
    onChange: { action: 'onChange' },
    enabled: { control: 'boolean' },
    validate: { control: 'boolean' },
    validateForm: { control: 'boolean' },
    value: { control: 'text' },
    lowNormal: { control: 'number' },
    hiNormal: { control: 'number' },
    lowAbsolute: { control: 'number' },
    hiAbsolute: { control: 'number' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Numeric input for quantitative observations (e.g. blood pressure, temperature). ' +
          'Supports normal range display and absolute range validation. ' +
          'Observation value is stored as a number.\n\n' +
          'Accessibility (WCAG 2.1 AA): Keyboard navigable (SC 2.1.1); visible focus ring (SC 2.4.7); ' +
          'out-of-range errors announced via aria-invalid (SC 3.3.1); ' +
          'numeric inputmode declared for mobile keyboards (SC 1.3.5); text contrast ≥ 4.5:1 (SC 1.4.3).',
      },
    },
  },
};

export const Default = {};

export const WithRange = {
  args: {
    lowNormal: 60,
    hiNormal: 100,
    conceptUuid: 'pulse-rate-uuid',
  },
};

export const WithValue = {
  args: {
    value: '120',
    lowNormal: 90,
    hiNormal: 140,
    conceptUuid: 'systolic-bp-uuid',
  },
};

export const Disabled = {
  args: {
    enabled: false,
    value: '98.6',
    conceptUuid: 'temperature-uuid',
  },
};

export const OutOfRangeError = {
  args: {
    value: '200',
    lowAbsolute: 60,
    hiAbsolute: 180,
    lowNormal: 90,
    hiNormal: 140,
    validate: true,
    conceptUuid: 'systolic-bp-uuid',
  },
};

export const ComputedValue = {
  args: {
    value: '22.5',
    conceptClass: 'Computed',
    conceptUuid: 'bmi-uuid',
  },
};

export const IntegerOnlyValue = {
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates the allowDecimal validator (AC 2.1): a decimal value triggers an ' +
          '"Invalid Value" error because the concept only accepts integers.',
      },
    },
  },
  args: {
    value: '98.6',
    validate: true,
    validations: ['allowDecimal'],
    conceptUuid: 'integer-concept-uuid',
  },
};
