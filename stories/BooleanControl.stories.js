import React from 'react';
import { action } from '@storybook/addon-actions';
import { injectIntl } from 'react-intl';
import 'src/components/Button.jsx';
import { BooleanControl } from 'src/components/BooleanControl.jsx';

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
          'Observation value is stored as a boolean (true/false).\n\n' +
          'Accessibility (WCAG 2.1 AA): Button group keyboard navigable via Tab and Enter/Space (SC 2.1.1); ' +
          'selected state conveyed via aria-pressed (SC 1.3.1, 4.1.2); ' +
          'visible focus ring on each button (SC 2.4.7); ' +
          'selected state not conveyed by colour alone (SC 1.4.1); text contrast ≥ 4.5:1 (SC 1.4.3).',
      },
    },
  },
};

export const Default = {
  render: () => (
    <BooleanControlWithIntl
      {...defaultProps}
    />
  ),
};

export const WithTrueSelected = {
  render: () => (
    <BooleanControlWithIntl
      {...defaultProps}
      value={true}
    />
  ),
};

export const WithFalseSelected = {
  render: () => (
    <BooleanControlWithIntl
      {...defaultProps}
      value={false}
    />
  ),
};

export const Disabled = {
  render: () => (
    <BooleanControlWithIntl
      {...defaultProps}
      enabled={false}
      value={false}
    />
  ),
};

export const WithValidationError = {
  render: () => (
    <BooleanControlWithIntl
      {...defaultProps}
      validate={true}
      validations={['mandatory']}
    />
  ),
};
