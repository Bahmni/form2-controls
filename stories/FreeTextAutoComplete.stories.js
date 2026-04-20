/**
 * FreeTextAutoComplete Component Stories
 *
 * Purpose: Creatable select input supporting both free-text entry and predefined suggestions.
 * Renders CreatableSelect from react-select/creatable.
 * Users can type any value or select from provided suggestions.
 *
 * Observation binding:
 *   - Value type: { label: string, value: string } or array for multi-select
 *   - Free-text values are created with label === value
 *   - Example: { uuid: '...', value: 'custom entry', obsDatetime: '...' }
 *
 * Key props:
 *   - options (array): predefined suggestions [{ label: 'Display', value: 'stored' }, ...]
 *   - value (string | object): current selected value
 *   - onChange (func): called with (value, type, translationKey, locale) on change
 *   - multi (bool): allows multiple selections (default: false)
 *   - clearable (bool): shows clear button (default: false)
 *   - backspaceRemoves (bool): backspace clears selection (default: false)
 *   - deleteRemoves (bool): delete key clears selection (default: false)
 *   - conceptUuid (string): sets the input id for accessibility
 *   - locale (string): locale for i18n
 *   - translationKey (string): i18n key
 *   - type (string): control type identifier
 *
 * Accessibility notes (WCAG 2.1 AA):
 *   - WCAG 1.3.1 Info and Relationships: pair with <label htmlFor={conceptUuid}> for
 *     screen reader announcement of the field name
 *   - WCAG 2.1.1 Keyboard: react-select handles full keyboard navigation — arrow keys
 *     navigate options, Enter selects, Escape closes, Backspace removes (if enabled)
 *   - WCAG 2.1.2 No Keyboard Trap: Escape closes the dropdown returning focus to input
 *   - WCAG 4.1.2 Name, Role, Value: react-select sets aria-expanded, aria-haspopup,
 *     aria-activedescendant, and aria-autocomplete on the combobox input automatically
 */
import React from 'react';
import { action } from '@storybook/addon-actions';
import { FreeTextAutoComplete } from 'src/components/FreeTextAutoComplete.jsx';
import '../styles/styles.scss';

const suggestionOptions = [
  { label: 'Headache', value: 'headache' },
  { label: 'Fever', value: 'fever' },
  { label: 'Cough', value: 'cough' },
  { label: 'Nausea', value: 'nausea' },
  { label: 'Fatigue', value: 'fatigue' },
];

const defaultProps = {
  onChange: action('onChange'),
  options: [],
  multi: false,
  clearable: false,
  backspaceRemoves: false,
  deleteRemoves: false,
  conceptUuid: 'free-text-concept-uuid',
};

export default {
  title: 'Atomic Controls/FreeTextAutoComplete',
  component: FreeTextAutoComplete,
  parameters: {
    docs: {
      description: {
        component:
          'Creatable select input combining free-text entry with predefined suggestions. ' +
          'Users can type any value or pick from options. ' +
          'Supports single and multi-select modes.',
      },
    },
  },
};

/** Default empty FreeTextAutoComplete with no predefined options — pure free text input. */
export const Default = {
  render: () => (
    <FreeTextAutoComplete
      {...defaultProps}
    />
  ),
};

/** FreeTextAutoComplete with predefined suggestion options (symptoms list). */
export const WithOptions = {
  render: () => (
    <FreeTextAutoComplete
      {...defaultProps}
      options={suggestionOptions}
    />
  ),
};

/** Multi-select mode — allows selecting or creating multiple values. */
export const MultiSelect = {
  render: () => (
    <FreeTextAutoComplete
      {...defaultProps}
      options={suggestionOptions}
      multi={true}
      clearable={true}
    />
  ),
};

/** Clearable single-select with a default value and visible clear button. */
export const Clearable = {
  render: () => (
    <FreeTextAutoComplete
      {...defaultProps}
      options={suggestionOptions}
      clearable={true}
      value={{ label: 'Headache', value: 'headache' }}
    />
  ),
};
