/**
 * AutoComplete Component Stories
 *
 * Purpose: Searchable select/autocomplete for coded observations.
 * Renders react-select (Select or AsyncSelect) based on the asynchronous prop.
 * Supports synchronous option lists, client-side filtering, and async HTTP loading.
 *
 * Observation binding:
 *   - Value type: option object { uuid, name/display, ... } or array for multi-select
 *   - The selected option object is passed to onValueChange as-is
 *   - Example for coded obs: { uuid: '...', value: { uuid: 'answer-uuid', name: 'Answer' } }
 *
 * Key props:
 *   - options (array): available options for synchronous mode
 *   - value (any): currently selected option(s)
 *   - onValueChange (func): called with (value, errors) on change
 *   - asynchronous (bool): true uses AsyncSelect with HTTP fetching (default: true)
 *   - minimumInput (number): minimum characters before search triggers (default: 3)
 *   - searchable (bool): enables text input for filtering
 *   - enabled (bool): false disables the select
 *   - multiSelect (bool): allows multiple selections
 *   - labelKey (string): option property to use as display label (default: 'display')
 *   - valueKey (string): option property to use as stored value (default: 'uuid')
 *   - formFieldPath (string): required for add-more logic
 *   - validations (array): validation rules
 *
 * Accessibility notes (WCAG 2.1 AA):
 *   - WCAG 1.3.1 Info and Relationships: pair with <label htmlFor={conceptUuid}>
 *   - WCAG 2.1.1 Keyboard: arrow keys navigate options, Enter selects, Escape closes,
 *     Tab moves focus out; Backspace removes last selected item in multi-select mode
 *   - WCAG 2.1.2 No Keyboard Trap: Tab/Escape both close the listbox cleanly
 *   - WCAG 4.1.2 Name, Role, Value: react-select sets role="combobox", aria-expanded,
 *     aria-haspopup="listbox", aria-autocomplete="list", and aria-activedescendant;
 *     multi-select values have aria-label with the selected option name
 *   - WCAG 4.1.3 Status Messages: "No Results Found" / "Type to search" messages are
 *     rendered inside the listbox and announced by screen readers
 */
import React from 'react';
import { action } from '@storybook/addon-actions';
import { AutoComplete } from 'src/components/AutoComplete.jsx';
import '../styles/styles.scss';

const medicationOptions = [
  { uuid: 'med-uuid-1', name: 'Paracetamol', display: 'Paracetamol' },
  { uuid: 'med-uuid-2', name: 'Ibuprofen', display: 'Ibuprofen' },
  { uuid: 'med-uuid-3', name: 'Amoxicillin', display: 'Amoxicillin' },
  { uuid: 'med-uuid-4', name: 'Metformin', display: 'Metformin' },
  { uuid: 'med-uuid-5', name: 'Atorvastatin', display: 'Atorvastatin' },
];

const defaultProps = {
  onValueChange: action('onValueChange'),
  options: medicationOptions,
  asynchronous: false,
  minimumInput: 0,
  searchable: false,
  enabled: true,
  multiSelect: false,
  formFieldPath: 'test/1-0',
  validations: [],
  labelKey: 'display',
  valueKey: 'uuid',
  conceptUuid: 'autocomplete-concept-uuid',
};

export default {
  title: 'Atomic Controls/AutoComplete',
  component: AutoComplete,
  parameters: {
    docs: {
      description: {
        component:
          'Searchable select control for coded observations. ' +
          'Supports synchronous option lists, client-side search filtering, ' +
          'and asynchronous HTTP loading for large concept sets. ' +
          'Observation value is stored as the selected option object.',
      },
    },
  },
};

/**
 * Synchronous select with a pre-loaded options list.
 * minimumInput=0 shows all options when the dropdown opens.
 */
export const SynchronousSelect = {
  render: () => (
    <AutoComplete
      {...defaultProps}
    />
  ),
};

/**
 * Searchable select with client-side filtering.
 * Type to filter the options list by label text.
 */
export const SearchableSelect = {
  render: () => (
    <AutoComplete
      {...defaultProps}
      searchable={true}
      minimumInput={0}
    />
  ),
};

/**
 * Multi-select mode — allows selecting more than one option.
 * Selected values appear as removable tags.
 */
export const MultiSelect = {
  render: () => (
    <AutoComplete
      {...defaultProps}
      multiSelect={true}
      searchable={true}
      minimumInput={0}
    />
  ),
};

/** Disabled select — dropdown cannot be opened. */
export const Disabled = {
  render: () => (
    <AutoComplete
      {...defaultProps}
      enabled={false}
      value={{ uuid: 'med-uuid-1', name: 'Paracetamol', display: 'Paracetamol' }}
    />
  ),
};
