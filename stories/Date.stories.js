/**
 * Date Component Stories
 *
 * Purpose: Date picker input for date-type observations.
 * Renders a native <input type="date"> with validation support.
 *
 * Observation binding:
 *   - Value type: string in ISO 8601 format (YYYY-MM-DD)
 *   - Example: { uuid: '...', value: '2024-01-15', obsDatetime: '...' }
 *   - Empty string means no date selected; undefined clears the field
 *
 * Key props:
 *   - value (string): ISO 8601 date string e.g. '2024-01-15'
 *   - onChange (func): called with { value, errors } on change
 *   - enabled (bool): false disables the input
 *   - validate/validateForm (bool): triggers validation display
 *   - validations (array): custom validation rules (e.g. mandatory)
 *   - formFieldPath (string): required for add-more logic
 *   - conceptUuid (string): sets input id for accessibility
 *
 * Accessibility notes (WCAG 2.1 AA):
 *   - WCAG 1.3.1 Info and Relationships: pair with <label htmlFor={conceptUuid}>
 *   - WCAG 2.1.1 Keyboard: native date input is keyboard-operable; date parts
 *     (year/month/day) are navigable with arrow keys in browser-native UI
 *   - WCAG 4.1.2 Name, Role, Value: type="date" is announced as a date input by
 *     screen readers; disabled state uses native disabled attribute
 *   - WCAG 1.4.3 Contrast: error border (form-builder-error class) must meet 4.5:1
 */
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

/** Default empty date picker, ready for user selection. */
export const Default = {
  render: () => (
    <Date
      {...defaultProps}
    />
  ),
};

/** Date picker pre-populated with a specific date (2024-01-15). */
export const WithValue = {
  render: () => (
    <Date
      {...defaultProps}
      value="2024-01-15"
    />
  ),
};

/** Date picker in disabled state — date is visible but cannot be changed. */
export const Disabled = {
  render: () => (
    <Date
      {...defaultProps}
      enabled={false}
      value="2024-01-15"
    />
  ),
};
