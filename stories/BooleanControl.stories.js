/**
 * BooleanControl Component Stories
 *
 * Purpose: True/false toggle control for boolean observations (e.g. Yes/No questions).
 * Uses ComponentStore.getRegisteredComponent('button') internally to render the Button component.
 * Importing Button.jsx registers it in ComponentStore so BooleanControl can find it.
 *
 * Observation binding:
 *   - Value type: boolean (true or false)
 *   - The selected option's .value (true/false) is stored as the observation value
 *   - Example: { uuid: '...', value: true, obsDatetime: '...' }
 *   - undefined means no selection has been made
 *
 * Key props:
 *   - options (array): [{ name: 'Yes', value: true }, { name: 'No', value: false }]
 *     Note: option names are translated via intl.formatMessage()
 *   - value (bool | undefined): currently selected boolean value
 *   - onChange (func): called with { value, errors } on change
 *   - enabled (bool): false disables all buttons
 *   - validate/validateForm (bool): triggers validation display
 *   - validations (array): validation rules (e.g. mandatory)
 *   - formFieldPath (string): required for Button's add-more logic
 *   - intl (object): injected via injectIntl() HOC (class component uses this.props.intl directly)
 *
 * Accessibility notes (WCAG 2.1 AA):
 *   - WCAG 1.3.1 Info and Relationships: pair with a <label> or <legend> so screen
 *     readers announce the question text when buttons receive focus
 *   - WCAG 1.4.3 Contrast: active/selected button colour must meet 4.5:1 contrast ratio
 *   - WCAG 2.1.1 Keyboard: each option is a <button> element, Tab-focusable,
 *     activated with Enter or Space
 *   - WCAG 4.1.2 Name, Role, Value: active selection uses 'active' CSS class only;
 *     adding aria-pressed="true/false" to each button would improve screen reader support
 *   - Disabled state uses native disabled attribute — screen readers announce as unavailable
 */
import React from 'react';
import { action } from '@storybook/addon-actions';
import { injectIntl } from 'react-intl';
// Import Button to register it in ComponentStore under 'button' key.
// BooleanControl calls ComponentStore.getRegisteredComponent('button') at render time.
import 'src/components/Button.jsx';
import { BooleanControl } from 'src/components/BooleanControl.jsx';
import '../styles/styles.scss';

// BooleanControl calls this.props.intl.formatMessage() in _getOptionsRepresentation.
// The global IntlProvider decorator provides context but does NOT inject intl as a prop
// into class components. injectIntl() reads from that context and injects the prop.
const BooleanControlWithIntl = injectIntl(BooleanControl);

const yesNoOptions = [
  { name: 'Yes', value: true, translationKey: '' },
  { name: 'No', value: false, translationKey: '' },
];

const defaultProps = {
  onChange: action('onChange'),
  validate: false,
  validateForm: false,
  validations: [],
  enabled: true,
  formFieldPath: 'test/1-0',
  options: yesNoOptions,
};

export default {
  title: 'Atomic Controls/BooleanControl',
  component: BooleanControl,
  parameters: {
    docs: {
      description: {
        component:
          'Yes/No toggle control for boolean observations. ' +
          'Renders as a button group via the registered Button component. ' +
          'Observation value is stored as a boolean (true/false).',
      },
    },
  },
};

/** Default BooleanControl with no selection — both Yes and No are unselected. */
export const Default = {
  render: () => (
    <BooleanControlWithIntl
      {...defaultProps}
    />
  ),
};

/** BooleanControl with 'Yes' (true) pre-selected. */
export const WithTrueSelected = {
  render: () => (
    <BooleanControlWithIntl
      {...defaultProps}
      value={true}
    />
  ),
};

/** BooleanControl in disabled state — buttons are visible but cannot be clicked. */
export const Disabled = {
  render: () => (
    <BooleanControlWithIntl
      {...defaultProps}
      enabled={false}
      value={false}
    />
  ),
};
