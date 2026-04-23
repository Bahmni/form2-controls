import React from 'react';
import { action } from '@storybook/addon-actions';
import { injectIntl } from 'react-intl';
import 'src/components/Button.jsx';
import { BooleanControl } from 'src/components/BooleanControl.jsx';
import '../styles/styles.scss';

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

export const Disabled = {
  render: () => (
    <BooleanControlWithIntl
      {...defaultProps}
      enabled={false}
      value={false}
    />
  ),
};
