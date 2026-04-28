import React from 'react';
import { action } from '@storybook/addon-actions';
import { RadioButton } from 'src/components/RadioButton.jsx';
import { TextBox } from 'src/components/TextBox.jsx';
import { injectIntl } from 'react-intl';
import { Label } from 'src/components/Label.jsx';

const LabelWithIntl = injectIntl(Label);

const yesNoOptions = [
  { name: 'Yes', value: 'yes' },
  { name: 'No', value: 'no' },
];

const frequencyOptions = [
  { name: 'Never', value: 'never' },
  { name: 'Occasionally', value: 'occasionally' },
  { name: 'Daily', value: 'daily' },
  { name: 'Multiple times per day', value: 'multiple' },
];

const defaultProps = {
  onValueChange: action('onValueChange'),
  validate: false,
  validations: [],
  conceptUuid: 'radio-concept-uuid',
};

export default {
  title: 'Atomic Controls/RadioButton',
  component: RadioButton,
  parameters: {
    docs: {
      description: {
        component:
          'Radio button group for single-select coded observations. ' +
          'Each option maps to a stored value in the observation record. ' +
          'Clicking an option sets the observation value to that option\'s value field.\n\n' +
          'Accessibility (WCAG 2.1 AA): Radio inputs are keyboard navigable with arrow keys (SC 2.1.1); ' +
          'checked state announced by screen readers via native input type (SC 4.1.2); ' +
          'visible focus ring on each radio option (SC 2.4.7); ' +
          'selected state not conveyed by colour alone (SC 1.4.1); ' +
          'group should be wrapped in <fieldset>/<legend> for accessible group labelling (SC 1.3.1). ' +
          'Note: the component does not expose an enabled prop — use a <fieldset disabled> wrapper.',
      },
    },
  },
};

export const Default = {
  render: () => (
    <RadioButton
      {...defaultProps}
      options={yesNoOptions}
    />
  ),
};

export const WithSelection = {
  render: () => (
    <RadioButton
      {...defaultProps}
      options={yesNoOptions}
      value="yes"
    />
  ),
};

export const MultipleOptions = {
  render: () => (
    <RadioButton
      {...defaultProps}
      options={frequencyOptions}
      value="occasionally"
      conceptUuid="smoking-frequency-uuid"
    />
  ),
};

export const Disabled = {
  parameters: {
    docs: {
      description: {
        story:
          'RadioButton does not expose an enabled prop. This story uses a <fieldset disabled> ' +
          'wrapper, which disables native <input> elements and is announced as disabled by screen readers (SC 4.1.2).',
      },
    },
  },
  render: () => (
    <fieldset disabled style={{ border: 'none', padding: 0, margin: 0 }}>
      <RadioButton
        {...defaultProps}
        options={yesNoOptions}
        value="yes"
      />
    </fieldset>
  ),
};

export const WithValidationError = {
  render: () => (
    <RadioButton
      {...defaultProps}
      options={yesNoOptions}
      validate={true}
      validations={['mandatory']}
    />
  ),
};

export const InObservationForm = {
  render: () => (
    <div style={{ fontFamily: 'sans-serif', maxWidth: 400, padding: 16 }}>
      <div style={{ marginBottom: 8 }}>
        <LabelWithIntl
          metadata={{
            value: 'Smoking History',
            uuid: 'smoking-history-uuid',
            type: 'label',
            translationKey: '',
          }}
          enabled={true}
        />
      </div>
      <RadioButton
        onValueChange={action('onValueChange')}
        validate={false}
        validations={[]}
        conceptUuid="smoking-history-uuid"
        options={yesNoOptions}
      />
      <div style={{ marginTop: 12 }}>
        <LabelWithIntl
          metadata={{
            value: 'Additional Notes',
            uuid: 'smoking-notes-uuid',
            type: 'label',
            translationKey: '',
          }}
          enabled={true}
        />
      </div>
      <TextBox
        onChange={action('notesOnChange')}
        validate={false}
        validateForm={false}
        validations={[]}
        enabled={true}
        formFieldPath="smokingForm/1-0"
        conceptUuid="smoking-notes-uuid"
      />
    </div>
  ),
};
