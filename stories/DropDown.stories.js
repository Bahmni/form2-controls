/**
 * DropDown Component Stories
 *
 * Purpose: Dropdown select control for coded single-select observations.
 * Wraps AutoComplete with asynchronous=false and minimumInput=0.
 * Intended as a simpler alternative to AutoComplete for finite option sets.
 *
 * Observation binding:
 *   - Value type: option object matching valueKey property
 *   - The selected option is passed to onValueChange
 *   - Example: { uuid: '...', value: { name: 'Option1', uuid: 'opt-uuid' } }
 *
 * Key props:
 *   - options (array): available options — format depends on labelKey/valueKey
 *   - value (any): currently selected option
 *   - onValueChange (func): called with (value, errors) on change
 *   - searchable (bool): enables text filtering within the dropdown (default: false)
 *   - enabled (bool): false disables the dropdown (default: true)
 *   - labelKey (string): option property to display (default: 'display')
 *   - valueKey (string): option property for value identity (default: 'uuid')
 *   - validations (array): validation rules
 *
 * Accessibility notes (WCAG 2.1 AA):
 *   - WCAG 1.3.1 Info and Relationships: pair with <label htmlFor={conceptUuid}>
 *   - WCAG 2.1.1 Keyboard: react-select provides full keyboard support — arrow keys
 *     navigate options, Enter selects, Escape closes, Tab moves focus away
 *   - WCAG 2.1.2 No Keyboard Trap: Escape/Tab both exit the dropdown cleanly
 *   - WCAG 4.1.2 Name, Role, Value: react-select sets role="combobox", aria-expanded,
 *     aria-haspopup="listbox", and aria-activedescendant automatically
 *   - isClearable=true (from AutoComplete) — clear button has aria-label="Clear value"
 */
import React from 'react';
import { action } from '@storybook/addon-actions';
import { DropDown } from 'src/components/DropDown.jsx';
import '../styles/styles.scss';

const bloodGroupOptions = [
  { name: 'A+', uuid: 'bg-uuid-ap', display: 'A+' },
  { name: 'A-', uuid: 'bg-uuid-am', display: 'A-' },
  { name: 'B+', uuid: 'bg-uuid-bp', display: 'B+' },
  { name: 'B-', uuid: 'bg-uuid-bm', display: 'B-' },
  { name: 'AB+', uuid: 'bg-uuid-abp', display: 'AB+' },
  { name: 'AB-', uuid: 'bg-uuid-abm', display: 'AB-' },
  { name: 'O+', uuid: 'bg-uuid-op', display: 'O+' },
  { name: 'O-', uuid: 'bg-uuid-om', display: 'O-' },
];

const defaultProps = {
  onValueChange: action('onValueChange'),
  options: [],
  enabled: true,
  searchable: false,
  validations: [],
  labelKey: 'display',
  valueKey: 'uuid',
};

export default {
  title: 'Atomic Controls/DropDown',
  component: DropDown,
  parameters: {
    docs: {
      description: {
        component:
          'Non-searchable dropdown select for coded single-select observations. ' +
          'Uses AutoComplete internally with asynchronous=false. ' +
          'Best suited for small, finite option sets.',
      },
    },
  },
};

/** Default empty dropdown with no options. */
export const Default = {
  render: () => (
    <DropDown
      {...defaultProps}
    />
  ),
};

/** Dropdown with a blood group options list loaded synchronously. */
export const WithOptions = {
  render: () => (
    <DropDown
      {...defaultProps}
      options={bloodGroupOptions}
    />
  ),
};

/** Searchable dropdown — user can type to filter the options list. */
export const Searchable = {
  render: () => (
    <DropDown
      {...defaultProps}
      options={bloodGroupOptions}
      searchable={true}
    />
  ),
};

/** Disabled dropdown showing a pre-selected value — cannot be changed. */
export const Disabled = {
  render: () => (
    <DropDown
      {...defaultProps}
      options={bloodGroupOptions}
      enabled={false}
      value={{ name: 'O+', uuid: 'bg-uuid-op', display: 'O+' }}
    />
  ),
};
