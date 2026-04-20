/**
 * Label Component Stories
 *
 * Purpose: Static display label rendered alongside a form control.
 * Renders a <label> element using the metadata value as display text.
 *
 * IMPORTANT: Label is a class component that uses this.props.intl.formatMessage()
 * directly (not the useIntl hook). The global IntlProvider decorator from preview.js
 * does NOT inject intl as a prop to class components. We use injectIntl() to wrap
 * the component and pass the intl object as a prop automatically.
 *
 * Observation binding:
 *   - Label is not an observation control — it has no value binding
 *   - It displays static text from the form definition metadata
 *   - Used as a companion label for other controls in the same row
 *
 * Key props:
 *   - metadata (object): { value, uuid, type, units, translationKey }
 *     - value (string): display text for the label
 *     - uuid (string): used as htmlFor for the associated input
 *     - type (string): should be 'label'
 *     - units (string, optional): appended to label text (e.g. ' mmHg')
 *     - translationKey (string, optional): i18n key for the label text
 *   - enabled (bool): false applies 'disabled-label' CSS class
 *   - intl (object): injected via injectIntl HOC
 *
 * Accessibility notes (WCAG 2.1 AA):
 *   - WCAG 1.3.1 Info and Relationships: renders a native <label htmlFor={uuid}>;
 *     the uuid must match the id of the associated input for programmatic association
 *   - WCAG 1.4.3 Contrast: label text colour must have ≥ 4.5:1 contrast ratio against
 *     background; disabled-label class must still meet 3:1 for low-vision users
 *   - WCAG 2.4.6 Headings and Labels: label text should be descriptive and concise
 *   - WCAG 4.1.2 Name, Role, Value: the native <label> element is automatically
 *     announced by screen readers when the associated input receives focus
 */
import React from 'react';
import { action } from '@storybook/addon-actions';
import { injectIntl } from 'react-intl';
import { Label } from 'src/components/Label.jsx';
import { TextBox } from 'src/components/TextBox.jsx';
import '../styles/styles.scss';

// Wrap Label with injectIntl so that this.props.intl is populated.
// The global IntlProvider decorator provides the IntlProvider context,
// and injectIntl reads from that context to inject the intl prop.
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

/** Default label showing control name text. */
export const Default = {
  render: () => (
    <LabelWithIntl
      metadata={defaultMetadata}
      enabled={true}
    />
  ),
};

/** Label with a unit annotation appended to the display text (e.g. " mmHg"). */
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

/**
 * Disabled label — applies 'disabled-label' CSS class to dim the text,
 * indicating the associated control is disabled.
 */
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

/**
 * Best practice: Label paired with a TextBox in a form row.
 *
 * The Label's metadata.uuid MUST match the TextBox's conceptUuid so that:
 *   1. The <label htmlFor> points to the input's id attribute
 *   2. Screen readers announce the label text when the input receives focus
 *   3. Clicking the label moves focus to the input (WCAG 2.5.3 Label in Name)
 *
 * This pattern should be applied to every form control in a Bahmni form.
 */
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
