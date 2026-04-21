import React from 'react';
import { action } from '@storybook/addon-actions';
import { RadioButton } from 'src/components/RadioButton.jsx';
import { TextBox } from 'src/components/TextBox.jsx';
import { injectIntl } from 'react-intl';
import { Label } from 'src/components/Label.jsx';
import '../styles/styles.scss';

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
          'Clicking an option sets the observation value to that option\'s value field.',
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
