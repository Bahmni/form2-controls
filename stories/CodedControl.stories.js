import React from 'react';
import { action } from '@storybook/addon-actions';
import { injectIntl } from 'react-intl';
import 'src/components/Button.jsx';
import 'src/components/AutoComplete.jsx';
import 'src/components/DropDown.jsx';
import { CodedControl } from 'src/components/CodedControl.jsx';

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
          'Display mode is controlled by the properties prop ' +
          '(properties.dropDown: boolean — use dropdown; properties.autoComplete: boolean — use autocomplete; ' +
          'properties.multiSelect: boolean — allow multiple selections; dropDown takes precedence over autoComplete). ' +
          'Observation value is stored as a concept option object (or array for multiSelect).\n\n' +
          'Accessibility (WCAG 2.1 AA): Each display mode inherits its sub-component\'s accessibility; ' +
          'button mode uses role=button with keyboard activation via Enter/Space (SC 2.1.1); ' +
          'visible focus ring on each option (SC 2.4.7); selected state conveyed via aria-pressed (SC 4.1.2); ' +
          'mandatory validation announced via aria-invalid (SC 3.3.1); text contrast ≥ 4.5:1 (SC 1.4.3).',
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

export const Disabled = {
  render: () => (
    <CodedControlWithIntl
      {...defaultProps}
      enabled={false}
      value={{ name: 'Sometimes', uuid: 'sometimes-uuid', translationKey: '' }}
      properties={{ multiSelect: false, autoComplete: false, dropDown: false }}
    />
  ),
};

export const WithValidationError = {
  render: () => (
    <CodedControlWithIntl
      {...defaultProps}
      validate={true}
      validations={['mandatory']}
      properties={{ multiSelect: false, autoComplete: false, dropDown: false }}
    />
  ),
};
