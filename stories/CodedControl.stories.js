import React from 'react';
import { action } from '@storybook/addon-actions';
import { injectIntl } from 'react-intl';
import 'src/components/Button.jsx';
import 'src/components/AutoComplete.jsx';
import 'src/components/DropDown.jsx';
import { CodedControl } from 'src/components/CodedControl.jsx';
import '../styles/styles.scss';

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

export const ButtonDisplay = {
  render: () => (
    <CodedControlWithIntl
      {...defaultProps}
      properties={{ multiSelect: false, autoComplete: false, dropDown: false }}
    />
  ),
};

export const DropDownDisplay = {
  render: () => (
    <CodedControlWithIntl
      {...defaultProps}
      properties={{ multiSelect: false, autoComplete: false, dropDown: true }}
    />
  ),
};

export const AutoCompleteDisplay = {
  render: () => (
    <CodedControlWithIntl
      {...defaultProps}
      properties={{ multiSelect: false, autoComplete: true, dropDown: false }}
    />
  ),
};

export const MultiSelectButtonDisplay = {
  render: () => (
    <CodedControlWithIntl
      {...defaultProps}
      properties={{ multiSelect: true, autoComplete: false, dropDown: false }}
    />
  ),
};
