/**
 * Metadata for ObsControl stories.
 * Imported by stories/ObsControl.stories.js.
 */

export const description =
  'ObsControl is the primary observation control that binds a single OpenMRS concept to a ' +
  'form field. It resolves the correct input widget (NumericBox, TextBox, BooleanControl, ' +
  'CodedControl, etc.) from `componentStore` at render time based on `metadata.concept.datatype`.\n\n' +
  '**When to use**: Use ObsControl whenever you need to capture a single clinical observation ' +
  'for a specific concept in a Bahmni form. It is the building block of all clinical forms.\n\n' +
  '**Concept binding**: The `metadata.concept` object identifies which OpenMRS concept is being ' +
  'captured. The `concept.datatype` drives which widget renders:\n\n' +
  '| Datatype | Widget |\n' +
  '|---|---|\n' +
  '| Numeric | NumericBox |\n' +
  '| Text | TextBox |\n' +
  '| Boolean | BooleanControl or Button |\n' +
  '| Coded | AutoComplete or DropDown |\n' +
  '| Date | DatePicker |\n' +
  '| DateTime | DateTimePicker |\n\n' +
  '**Value wrapping**: Values are passed and emitted as `{ value, comment, interpretation }`. ' +
  'The `onValueChanged(formFieldPath, value, errors)` callback notifies the parent Container ' +
  'which updates its ControlRecordTree.\n\n' +
  '**Add More**: When `properties.addMore` is `true`, the control renders Add / Remove buttons ' +
  'via AddMoreDecorator, allowing clinicians to capture repeated observations for the same ' +
  'concept within a single encounter.\n\n' +
  'Accessibility (WCAG 2.1 AA): Each input is associated with a `<label>` via `htmlFor`/`id` ' +
  'pairing. Mandatory fields include `aria-required="true"`. Validation error messages are ' +
  'rendered adjacent to the field and referenced with `aria-describedby`.';

export const argTypes = {
  metadata: {
    description:
      'Control descriptor from the form JSON. Must include `concept` (with `name`, `uuid`, ' +
      '`datatype`), `label`, `properties`, and `id`. The `concept.datatype` determines which ' +
      'widget is rendered.',
    table: {
      type: { summary: 'object' },
      defaultValue: { summary: 'undefined' },
    },
  },
  value: {
    description:
      'Current observation value wrapped as `{ value, comment, interpretation }`. ' +
      'Pass `{ value: undefined, comment: undefined, interpretation: undefined }` for an ' +
      'empty / unsaved field.',
    table: {
      type: { summary: '{ value: any, comment: string, interpretation: string }' },
      defaultValue: { summary: 'undefined' },
    },
  },
  formUuid: {
    description:
      'UUID of the parent form. Used to construct the `formFieldPath` ' +
      '(`"<formUuid>/<controlId>"`) which uniquely identifies this control\'s value in the ' +
      'ControlRecordTree.',
    table: {
      type: { summary: 'string' },
      defaultValue: { summary: 'undefined' },
    },
  },
  formFieldPath: {
    description:
      'Fully-qualified path identifying this control instance within the form tree ' +
      '(e.g. `"test/1-0"`). Generated automatically by the Container; pass explicitly in stories.',
    table: {
      type: { summary: 'string' },
      defaultValue: { summary: "'test/1-0'" },
    },
  },
  validate: {
    control: 'boolean',
    description: 'When `true`, triggers field-level validation and shows error messages.',
    table: {
      type: { summary: 'boolean' },
      defaultValue: { summary: 'false' },
    },
  },
  validateForm: {
    control: 'boolean',
    description: 'When `true`, triggers form-level validation (used on submit).',
    table: {
      type: { summary: 'boolean' },
      defaultValue: { summary: 'false' },
    },
  },
  onValueChanged: {
    action: 'onValueChanged',
    description:
      'Callback fired when the user changes the input. ' +
      'Signature: `(formFieldPath: string, value: object, errors: array) => void`.',
    table: {
      type: { summary: 'function' },
    },
  },
  showNotification: {
    action: 'showNotification',
    description: 'Callback to display a toast/notification. Signature: `(notification: object) => void`.',
    table: {
      type: { summary: 'function' },
    },
  },
  onControlAdd: {
    action: 'onControlAdd',
    description:
      'Callback fired when the clinician clicks "Add" in an addMore-enabled control. ' +
      'Signature: `(formFieldPath: string) => void`.',
    table: {
      type: { summary: 'function' },
    },
  },
  onControlRemove: {
    action: 'onControlRemove',
    description:
      'Callback fired when the clinician clicks "Remove" in an addMore-enabled control. ' +
      'Signature: `(formFieldPath: string) => void`.',
    table: {
      type: { summary: 'function' },
    },
  },
};
