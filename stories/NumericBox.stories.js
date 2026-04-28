import React from 'react';
import { action } from '@storybook/addon-actions';
import { NumericBox } from 'src/components/NumericBox.jsx';

const defaultProps = {
  onChange: action('onChange'),
  validate: false,
  validateForm: false,
  validations: [],
  enabled: true,
  formFieldPath: 'test/1-0',
  conceptUuid: 'numeric-concept-uuid',
};

export default {
  title: 'Atomic Controls/NumericBox',
  component: NumericBox,
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

export const Default = {
  render: () => (
    <NumericBox
      {...defaultProps}
    />
  ),
};

export const WithRange = {
  render: () => (
    <NumericBox
      {...defaultProps}
      lowNormal={60}
      hiNormal={100}
      conceptUuid="pulse-rate-uuid"
    />
  ),
};

export const WithValue = {
  render: () => (
    <NumericBox
      {...defaultProps}
      value="120"
      lowNormal={90}
      hiNormal={140}
      conceptUuid="systolic-bp-uuid"
    />
  ),
};

export const Disabled = {
  render: () => (
    <NumericBox
      {...defaultProps}
      enabled={false}
      value="98.6"
      conceptUuid="temperature-uuid"
    />
  ),
};

export const OutOfRangeError = {
  render: () => (
    <NumericBox
      {...defaultProps}
      value="200"
      lowAbsolute={60}
      hiAbsolute={180}
      lowNormal={90}
      hiNormal={140}
      validate={true}
      conceptUuid="systolic-bp-uuid"
    />
  ),
};

export const ComputedValue = {
  render: () => (
    <NumericBox
      {...defaultProps}
      value="22.5"
      conceptClass="Computed"
      conceptUuid="bmi-uuid"
    />
  ),
};
