/**
 * CodedControl Component Stories
 *
 * Purpose: Multi-mode coded concept selector — renders as buttons, dropdown, or autocomplete
 * depending on the properties configuration. Uses ComponentStore internally to look up
 * the child component by display type.
 *
 * IMPORTANT: Importing Button, AutoComplete and DropDown registers them in ComponentStore.
 * CodedControl calls ComponentStore.getRegisteredComponent(displayType) at render time.
 * Without these imports the component renders null.
 *
 * Display type selection (from properties):
 *   - properties.autoComplete=true  → renders AutoComplete ('autoComplete')
 *   - properties.dropDown=true      → renders DropDown ('dropDown')
 *   - neither                       → renders Button ('button')
 *
 * Observation binding:
 *   - Value type: option object { uuid, name } or array for multiSelect
 *   - Example single: { uuid: '...', value: { uuid: 'answer-uuid', name: 'Answer1' } }
 *   - Example multi:  { uuid: '...', value: [{ uuid: 'ans1' }, { uuid: 'ans2' }] }
 *
 * Key props:
 *   - options (array): [{ name: 'Answer1', uuid: 'uuid1', translationKey: '' }, ...]
 *   - properties (object): { multiSelect, autoComplete, dropDown, url }
 *   - onChange (func): called with { value, errors } on change
 *   - enabled (bool): false disables the child control
 *   - validate/validateForm (bool): triggers validation display
 *   - validations (array): validation rules
 *   - formFieldPath (string): required for child control add-more logic
 *   - conceptUuid (string): passed to child control for accessibility
 *   - intl (object): injected via injectIntl() HOC (class component uses this.props.intl directly)
 *   - showNotification (func): called on HTTP errors when url is set
 *   - value (any): currently selected value(s)
 *
 * Accessibility notes (WCAG 2.1 AA):
 *   - WCAG 1.3.1 Info and Relationships: pair with a <label htmlFor={conceptUuid}>
 *     for all display modes so screen readers announce the field name
 *   - WCAG 2.1.1 Keyboard (Button mode): each option is a <button> element, focusable
 *     with Tab; activated with Enter or Space
 *   - WCAG 2.1.1 Keyboard (DropDown/AutoComplete): react-select provides full keyboard
 *     navigation (arrow keys, Enter to select, Escape to close)
 *   - WCAG 4.1.2 Name, Role, Value: active selection indicated via 'active' CSS class
 *     in Button mode — also add aria-pressed for screen reader state announcement
 *   - WCAG 4.1.3 Status Messages: showNotification callback surfaces API errors to the UI
 */
import React from 'react';
import { action } from '@storybook/addon-actions';
import { injectIntl } from 'react-intl';
// These imports register components in ComponentStore.
// CodedControl looks up child components by name at render time.
import 'src/components/Button.jsx';
import 'src/components/AutoComplete.jsx';
import 'src/components/DropDown.jsx';
import { CodedControl } from 'src/components/CodedControl.jsx';
import '../styles/styles.scss';

// CodedControl calls this.props.intl.formatMessage() in _getOptionsRepresentation.
// injectIntl() reads the IntlProvider context (from global decorator) and injects intl as a prop.
const CodedControlWithIntl = injectIntl(CodedControl);

const codedOptions = [
  { name: 'Never', uuid: 'never-uuid', translationKey: '' },
  { name: 'Rarely', uuid: 'rarely-uuid', translationKey: '' },
  { name: 'Sometimes', uuid: 'sometimes-uuid', translationKey: '' },
  { name: 'Often', uuid: 'often-uuid', translationKey: '' },
  { name: 'Always', uuid: 'always-uuid', translationKey: '' },
];

const defaultProps = {
  onChange: action('onChange'),
  showNotification: action('showNotification'),
  validate: false,
  validateForm: false,
  validations: [],
  enabled: true,
  formFieldPath: 'test/1-0',
  conceptUuid: 'coded-concept-uuid',
  options: codedOptions,
};

export default {
  title: 'Atomic Controls/CodedControl',
  component: CodedControl,
  parameters: {
    docs: {
      description: {
        component:
          'Coded concept selector that renders as buttons (default), dropdown, or autocomplete. ' +
          'Display mode is controlled by the properties prop. ' +
          'Observation value is stored as a concept option object (or array for multiSelect).',
      },
    },
  },
};

/**
 * Button display mode (default) — options rendered as clickable buttons.
 * Use for small sets of well-known options (e.g. Never/Sometimes/Always).
 */
export const ButtonDisplay = {
  render: () => (
    <CodedControlWithIntl
      {...defaultProps}
      properties={{ multiSelect: false, autoComplete: false, dropDown: false }}
    />
  ),
};

/**
 * DropDown display mode — options rendered as a select dropdown.
 * Use properties.dropDown=true.
 */
export const DropDownDisplay = {
  render: () => (
    <CodedControlWithIntl
      {...defaultProps}
      properties={{ multiSelect: false, autoComplete: false, dropDown: true }}
    />
  ),
};

/**
 * AutoComplete display mode — options rendered as searchable select.
 * Use properties.autoComplete=true. Type to filter the options list.
 */
export const AutoCompleteDisplay = {
  render: () => (
    <CodedControlWithIntl
      {...defaultProps}
      properties={{ multiSelect: false, autoComplete: true, dropDown: false }}
    />
  ),
};

/**
 * Multi-select button mode — allows selecting multiple answers.
 * properties.multiSelect=true enables multiple selections.
 */
export const MultiSelectButtonDisplay = {
  render: () => (
    <CodedControlWithIntl
      {...defaultProps}
      properties={{ multiSelect: true, autoComplete: false, dropDown: false }}
    />
  ),
};
