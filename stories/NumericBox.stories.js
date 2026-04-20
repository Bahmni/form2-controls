/**
 * NumericBox Component Stories
 *
 * Purpose: Numeric input for quantitative observations such as vital signs.
 * Renders an <input type="number"> with optional normal-range annotation.
 *
 * Observation binding:
 *   - Value type: string (stored as number in obs)
 *   - Example: { uuid: '...', value: 120, obsDatetime: '...' }
 *   - The component receives value as a string and emits numeric string via onChange
 *
 * Key props:
 *   - value (string): current numeric value as string
 *   - onChange (func): called with { value, errors } on change
 *   - enabled (bool): false disables the input
 *   - validate/validateForm (bool): triggers validation display
 *   - validations (array): custom validation rules
 *   - formFieldPath (string): required for add-more logic
 *   - conceptUuid (string): sets input id for accessibility
 *   - hiNormal/lowNormal (number): normal range boundaries (displayed as hint)
 *   - hiAbsolute/lowAbsolute (number): absolute range for hard validation
 *   - conceptClass (string): 'Computed' shows read-only styling
 *
 * Accessibility notes (WCAG 2.1 AA):
 *   - WCAG 1.3.1 Info and Relationships: pair with <label htmlFor={conceptUuid}>
 *   - WCAG 1.4.3 Contrast: error and warning border colours must meet 4.5:1 ratio
 *   - WCAG 2.1.1 Keyboard: natively focusable; up/down arrow keys increment value
 *   - WCAG 4.1.2 Name, Role, Value: type="number" role is announced by screen readers
 *   - Range hint text (e.g. "60 - 100") is visible to sighted users; also expose it
 *     via aria-describedby for screen reader users
 *   - Error state applies `form-builder-error` class; warning applies `form-builder-warning`
 */
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

/** Default empty NumericBox with no range constraints. */
export const Default = {
  render: () => (
    <NumericBox
      {...defaultProps}
    />
  ),
};

/** NumericBox showing a normal range hint beside the input (60–100 bpm). */
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

/** NumericBox pre-populated with a value (systolic blood pressure 120 mmHg). */
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

/** NumericBox in disabled state — cannot be edited. */
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

/**
 * NumericBox with a value outside the absolute range — triggers a hard validation error.
 * lowAbsolute=60 and hiAbsolute=180 are the permitted bounds. Value 200 exceeds hiAbsolute,
 * so the component renders with form-builder-error styling.
 * validate=true causes the error to be visible on mount.
 *
 * Observation binding: onChange emits { value: '200', errors: [{ type: 'error', ... }] }
 * The form layer should prevent saving when errors array contains type='error' entries.
 *
 * Min/max validation: set via lowAbsolute (min) and hiAbsolute (max) props.
 * Decimal validation: pass 'allowDecimal' in validations array to restrict to integers.
 */
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

/**
 * Computed (read-only) NumericBox styled to indicate the value was calculated,
 * not entered manually. conceptClass='Computed' applies the computed-value CSS class.
 */
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
