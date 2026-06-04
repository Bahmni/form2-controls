/**
 * Metadata for AbnormalObsControl stories.
 * Imported by stories/AbnormalObsControl.stories.js.
 */

export const description =
  'AbnormalObsControl is an ObsGroup that pairs a numeric observation with a Boolean ' +
  '"Abnormal" toggle button. It allows clinicians to record a measurement and immediately ' +
  'flag it as out-of-range without leaving the field.\n\n' +
  '**When to use**: Use AbnormalObsControl for clinical measurements that may need to be ' +
  'marked abnormal — for example, Pulse Rate, Blood Pressure, or Temperature readings where ' +
  'a quick abnormality flag is clinically relevant.\n\n' +
  '**Concept structure**: The control requires an ObsGroup concept whose `controls` array ' +
  'contains exactly two children:\n\n' +
  '1. A numeric observation (the measured value)\n' +
  '2. A Boolean observation with `displayType: "button"` for the Abnormal toggle\n\n' +
  '**Rendering**: The ObsGroup is rendered via `ObsGroupControl`. The Boolean child renders ' +
  'as an inline button (Yes/No) positioned next to the numeric input. Both are housed inside ' +
  'a single fieldset so they are semantically grouped.\n\n' +
  '**Value handling**: Values are stored as an `Obs` immutable record with `groupMembers` ' +
  'containing the child observations. The `ObsGroupMapper` flattens group members for the ' +
  'REST API submission.\n\n' +
  'Accessibility (WCAG 2.1 AA): The `<fieldset>` + `<legend>` structure groups the numeric ' +
  'input and the toggle for screen readers. The abnormal toggle button exposes its state via ' +
  '`aria-pressed` so assistive technologies announce checked/unchecked transitions.';

export const argTypes = {
  metadata: {
    description:
      'ObsGroup control descriptor. Must include a `concept` (the group concept) and a ' +
      '`controls` array with the numeric child and the Boolean abnormal child. The Boolean ' +
      'child must have `displayType: "button"` and `options: [{name: "Yes", value: true}, ' +
      '{name: "No", value: false}]`.',
    table: {
      type: { summary: 'object' },
      defaultValue: { summary: 'undefined' },
    },
  },
  obs: {
    description:
      'The current ObsGroup value as an immutable `Obs` record. Must include a `groupMembers` ' +
      'List containing child `Obs` instances for the numeric and abnormal concepts.',
    table: {
      type: { summary: 'Obs (immutable record)' },
      defaultValue: { summary: 'undefined' },
    },
  },
  mapper: {
    description:
      'Instance of `ObsGroupMapper` used to read and write group member values. ' +
      'Provided by the parent Container in production; pass `new ObsGroupMapper()` in stories.',
    table: {
      type: { summary: 'ObsGroupMapper' },
      defaultValue: { summary: 'new ObsGroupMapper()' },
    },
  },
  validate: {
    control: 'boolean',
    description: 'When `true`, triggers field-level validation on child controls.',
    table: {
      type: { summary: 'boolean' },
      defaultValue: { summary: 'false' },
    },
  },
  onValueChanged: {
    action: 'onValueChanged',
    description:
      'Callback fired when the user changes either the numeric value or the abnormal toggle. ' +
      'Signature: `(formFieldPath: string, value: object, errors: array) => void`.',
    table: {
      type: { summary: 'function' },
    },
  },
  errors: {
    description: 'Array of validation error objects for this group. Pass `[]` when valid.',
    table: {
      type: { summary: 'array' },
      defaultValue: { summary: '[]' },
    },
  },
};
