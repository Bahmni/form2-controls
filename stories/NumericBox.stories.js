import React from 'react';
import { action } from '@storybook/addon-actions';
import { NumericBox } from 'src/components/NumericBox.jsx';
import '../styles/styles.scss';

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
          'Observation value is stored as a number.',
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
