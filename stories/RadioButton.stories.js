/**
 * RadioButton Component Stories
 *
 * Purpose: Radio button group for single-select coded observations.
 * Renders a list of clickable radio inputs for choosing one option.
 *
 * Observation binding:
 *   - Value type: option value (string, boolean, or any)
 *   - The selected option's .value is stored as the observation value
 *   - Example: { uuid: '...', value: 'opt1', obsDatetime: '...' }
 *
 * Key props:
 *   - options (array): [{ name: 'Display Text', value: 'storedValue' }, ...]
 *   - value (any): the currently selected option's value
 *   - onValueChange (func): called with (value, errors) when selection changes
 *   - validate (bool): triggers validation display
 *   - validations (array): validation rules
 *   - conceptUuid (string): sets the input id for accessibility
 *
 * Accessibility notes (WCAG 2.1 AA):
 *   - WCAG 1.3.1 Info and Relationships: radio inputs share a random `name` attribute
 *     grouping them; wrap the group in a <fieldset>/<legend> for screen reader context
 *   - WCAG 2.1.1 Keyboard: radio inputs are natively focusable; arrow keys move between
 *     options within the group; Space selects the focused option
 *   - WCAG 2.4.7 Focus Visible: browser default focus ring is visible on radio inputs
 *   - WCAG 4.1.2 Name, Role, Value: each input has type="radio" announced by screen readers;
 *     option text is rendered as an adjacent text node — wrapping in <label> would improve
 *     click target size and screen reader announcement
 *   - Error state applies `form-builder-error` class to the container div
 */
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

/** Default radio group with Yes/No options and no selection. */
export const Default = {
  render: () => (
    <RadioButton
      {...defaultProps}
      options={yesNoOptions}
    />
  ),
};

/** Radio group with a pre-selected value ('yes'). */
export const WithSelection = {
  render: () => (
    <RadioButton
      {...defaultProps}
      options={yesNoOptions}
      value="yes"
    />
  ),
};

/** Radio group with multiple options (frequency scale). */
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

/**
 * RadioButton used in an observation form context — paired with a Label and a
 * complementary TextBox for additional notes.
 *
 * In a real form, the Label's uuid matches the RadioButton's conceptUuid, linking
 * them semantically. The onValueChange callback receives (value, errors) and the
 * parent form stores the selection as the observation value.
 *
 * Form integration pattern:
 *   - Label: displays the question text (e.g. "Smoking History")
 *   - RadioButton: captures the coded answer (Yes / No)
 *   - Observation stored: { uuid: 'concept-uuid', value: 'yes', obsDatetime: '...' }
 */
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
