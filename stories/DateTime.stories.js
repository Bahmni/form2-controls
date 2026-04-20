/**
 * DateTime Component Stories
 *
 * Purpose: Combined date and time picker for datetime-type observations.
 * Renders two native inputs: <input type="date"> + <input type="time">.
 *
 * Observation binding:
 *   - Value type: string in format "YYYY-MM-DD HH:mm"
 *   - Example: { uuid: '...', value: '2024-01-15 14:30', obsDatetime: '...' }
 *   - Both date and time must be filled for a valid value; partial fill shows an error
 *   - Empty string or undefined means no datetime selected
 *
 * Timezone handling:
 *   - The component captures the browser's LOCAL date and time as entered by the user
 *   - No timezone conversion is performed within the component itself
 *   - The value string "YYYY-MM-DD HH:mm" is stored as-is (no UTC offset appended)
 *   - Timezone interpretation is the responsibility of the consuming application layer
 *   - The parent observation's obsDatetime field (set by OpenMRS) carries the server
 *     timezone; the obs.value datetime is treated as local clinic time
 *
 * Key props:
 *   - value (string): datetime string e.g. '2024-01-15 14:30'
 *   - onChange (func): called with { value, errors } on change
 *   - enabled (bool): false disables both inputs
 *   - validate/validateForm (bool): triggers validation display
 *   - validations (array): custom validation rules
 *   - formFieldPath (string): required for add-more logic
 *   - conceptUuid (string): sets input ids for accessibility
 *
 * Accessibility notes (WCAG 2.1 AA):
 *   - WCAG 1.3.1 Info and Relationships: both inputs share conceptUuid as their id;
 *     use distinct aria-label or <label> elements for date and time fields separately
 *   - WCAG 1.4.3 Contrast: error border colour must meet 4.5:1 contrast ratio
 *   - WCAG 2.1.1 Keyboard: both inputs are natively focusable; date/time pickers
 *     are operated via keyboard using browser-native date/time input controls
 *   - WCAG 4.1.2 Name, Role, Value: type="date" and type="time" announce their roles
 *     to screen readers; disabled state uses native `disabled` attribute
 *   - Partial fill (date without time or vice versa) triggers "Incorrect Date Time" error
 */
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

/** Default empty DateTime picker with both date and time inputs. */
export const Default = {
  render: () => (
    <DateTime
      {...defaultProps}
    />
  ),
};

/** DateTime picker pre-populated with a full datetime value. */
export const WithValue = {
  render: () => (
    <DateTime
      {...defaultProps}
      value="2024-01-15 14:30"
    />
  ),
};

/** DateTime picker in disabled state — values are visible but cannot be changed. */
export const Disabled = {
  render: () => (
    <DateTime
      {...defaultProps}
      enabled={false}
      value="2024-01-15 09:00"
    />
  ),
};
