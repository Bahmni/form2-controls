import React from 'react';
import { action } from '@storybook/addon-actions';
import { injectIntl } from 'react-intl';
import { Label } from 'src/components/Label.jsx';
import { TextBox } from 'src/components/TextBox.jsx';
import '../styles/styles.scss';

const LabelWithIntl = injectIntl(Label);

const defaultMetadata = {
  value: 'Systolic Blood Pressure',
  uuid: 'systolic-bp-uuid',
  type: 'label',
  translationKey: '',
};

export default {
  title: 'Atomic Controls/Label',
  component: Label,
  parameters: {
    docs: {
      description: {
        component:
          'Static display label rendered alongside a form control. ' +
          'Not an observation control — it has no value binding. ' +
          'Supports i18n via translationKey and optional unit suffix.',
      },
    },
  },
};

export const Default = {
  render: () => (
    <LabelWithIntl
      metadata={defaultMetadata}
      enabled={true}
    />
  ),
};

export const WithUnits = {
  render: () => (
    <LabelWithIntl
      metadata={{
        value: 'Systolic Blood Pressure',
        uuid: 'systolic-bp-uuid',
        type: 'label',
        units: 'mmHg',
        translationKey: '',
      }}
      enabled={true}
    />
  ),
};

export const Disabled = {
  render: () => (
    <LabelWithIntl
      metadata={{
        value: 'Chief Complaint',
        uuid: 'chief-complaint-uuid',
        type: 'label',
        translationKey: '',
      }}
      enabled={false}
    />
  ),
};

export const LabelWithTextBoxInForm = {
  render: () => (
    <div style={{ fontFamily: 'sans-serif', maxWidth: 400, padding: 16 }}>
      <LabelWithIntl
        metadata={{
          value: 'Chief Complaint',
          uuid: 'chief-complaint-input-uuid',
          type: 'label',
          translationKey: '',
        }}
        enabled={true}
      />
      <TextBox
        onChange={action('onChange')}
        validate={false}
        validateForm={false}
        validations={[]}
        enabled={true}
        formFieldPath="visitForm/1-0"
        conceptUuid="chief-complaint-input-uuid"
      />
    </div>
  ),
};
