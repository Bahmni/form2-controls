/**
 * TextBox Component Stories
 *
 * Purpose: Multi-line text input for free-form text observations.
 * Renders a <Textarea> (react-textarea-autosize) that auto-resizes.
 *
 * Observation binding:
 *   - Value type: string
 *   - Maps directly to obs.value as a plain string
 *   - Example: { uuid: '...', value: 'Patient has fever', obsDatetime: '...' }
 *
 * Key props:
 *   - value (string): current text value
 *   - onChange (func): called with { value, errors } on every change
 *   - enabled (bool): false disables the textarea (read-only)
 *   - validate (bool): triggers validation display
 *   - validateForm (bool): triggers form-wide validation
 *   - validations (array): validation rules (e.g. mandatory)
 *   - formFieldPath (string): path like 'formName/1-0' (required for add-more logic)
 *   - conceptUuid (string): sets the input id for accessibility
 *
 * Accessibility notes (WCAG 2.1 AA):
 *   - WCAG 1.3.1 Info and Relationships: pair with <label htmlFor={conceptUuid}> so
 *     assistive technologies can announce the field name
 *   - WCAG 1.4.3 Contrast: ensure text and border colours meet 4.5:1 contrast ratio
 *   - WCAG 2.1.1 Keyboard: textarea is natively focusable and operable via keyboard
 *   - WCAG 4.1.2 Name, Role, Value: disabled state uses native `disabled` attribute
 *     so screen readers announce the control as unavailable
 *   - Error state applies `form-builder-error` CSS class; also set aria-invalid="true"
 *     and aria-describedby pointing to an error message element for screen readers
 */
import React from 'react';
import { action } from '@storybook/addon-actions';
import { TextBox } from 'src/components/TextBox.jsx';
import '../styles/styles.scss';

const defaultProps = {
  onChange: action('onChange'),
  validate: false,
  validateForm: false,
  validations: [],
  enabled: true,
  formFieldPath: 'test/1-0',
  conceptUuid: 'textbox-concept-uuid',
};

export default {
  title: 'Atomic Controls/TextBox',
  component: TextBox,
  parameters: {
    docs: {
      description: {
        component:
          'Multi-line text area for free-form text observations. Auto-resizes with content. ' +
          'Observation value is stored as a plain string.',
      },
    },
  },
};

/** Default empty TextBox, ready for user input. */
export const Default = {
  render: () => (
    <TextBox
      {...defaultProps}
    />
  ),
};

/** TextBox pre-populated with an existing observation value. */
export const WithValue = {
  render: () => (
    <TextBox
      {...defaultProps}
      value="Patient reports mild headache since yesterday morning."
    />
  ),
};

/** TextBox in disabled (read-only) state — cannot be edited. */
export const Disabled = {
  render: () => (
    <TextBox
      {...defaultProps}
      enabled={false}
    />
  ),
};

/** TextBox that is both disabled and shows an existing value (view mode). */
export const ReadOnly = {
  render: () => (
    <TextBox
      {...defaultProps}
      enabled={false}
      value="Chief complaint: fever for 3 days."
    />
  ),
};

/**
 * TextBox with mandatory validation triggered — shows error state (red border).
 * validate=true and validations=['mandatory'] cause the component to highlight the
 * field when no value is entered. The onChange action panel shows the emitted errors.
 *
 * Observation binding: when invalid, onChange is called with
 *   { value: undefined, errors: [{ message: 'mandatory' }] }
 */
export const WithValidationError = {
  render: () => (
    <TextBox
      {...defaultProps}
      validate={true}
      validations={['mandatory']}
      value={undefined}
    />
  ),
};
