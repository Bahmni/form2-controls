/**
 * Metadata for Forms / Lifecycle & Events stories.
 * Imported by stories/Forms.stories.js.
 */

export const description = `
The **Container** component is the entry point for every Bahmni clinical form.
It renders form controls from a JSON metadata tree, manages observation state, and exposes
a set of events and methods that let your application react to user interactions — from the
first render all the way through saving an encounter.

**When to use**: Use the Container (with form metadata JSON) whenever you need to render a
complete clinical form in a Bahmni application. It handles control resolution, observation
tracking, validation, and lifecycle scripts.

**Lifecycle events**:

| Phase | Event / Method | Who provides it | What it does |
|---|---|---|---|
| Init | \`onFormInit\` | \`metadata.events.onFormInit\` | Runs once after render. Use for defaults, hiding sections, or pre-fetching data. |
| Change | \`onValueChange\` | Individual obsControl | Fires every time a single control's value changes. |
| Change | \`onValueUpdated\` | Container prop (callback) | Fires after any change. Use for dirty tracking or dependent fields. |
| Submit | \`getValue()\` | Container ref (method) | Returns current observations and validation errors. Triggers validation. |
| Post-save | \`onFormSave\` | \`metadata.events.onFormSave\` | Runs after encounter save. Use to navigate or show notifications. |

**Script encoding**: All event scripts in \`metadata.events\` and \`control.events\` must be
base64-encoded. \`ScriptRunner\` decodes them via \`base64ToUtf8\` before executing.
`;

export const argTypes = {
  metadata: {
    description:
      'Form descriptor JSON object. Must include `id`, `name`, `version`, `uuid`, and a ' +
      '`controls` array. May include an `events` object with base64-encoded lifecycle scripts.',
    table: {
      type: { summary: 'object' },
      defaultValue: { summary: 'undefined' },
    },
  },
  observations: {
    description:
      'Array of pre-populated observation objects from a previous encounter. Each must include ' +
      '`formFieldPath` and `value`. Pass `[]` for a new encounter.',
    table: {
      type: { summary: 'array' },
      defaultValue: { summary: '[]' },
    },
  },
  validate: {
    control: 'boolean',
    description: 'When `true`, triggers field-level validation and renders error messages inline.',
    table: {
      type: { summary: 'boolean' },
      defaultValue: { summary: 'false' },
    },
  },
  validateForm: {
    control: 'boolean',
    description:
      'When `true`, enables form-level validation (typically set before calling `getValue()` ' +
      'on submit).',
    table: {
      type: { summary: 'boolean' },
      defaultValue: { summary: 'false' },
    },
  },
  collapse: {
    control: 'boolean',
    description: 'When `true`, renders all top-level sections in their collapsed state.',
    table: {
      type: { summary: 'boolean' },
      defaultValue: { summary: 'false' },
    },
  },
  patient: {
    description:
      'Patient object passed to controls and event scripts. Used for age-based defaults and ' +
      'patient-specific logic in `onFormInit`. Pass `{}` when not needed.',
    table: {
      type: { summary: 'object' },
      defaultValue: { summary: '{}' },
    },
  },
  onValueUpdated: {
    action: 'onValueUpdated',
    description:
      'Callback fired after any value change in the form. Receives the full ControlRecordTree. ' +
      'Signature: `(controlRecordTree: object) => void`.',
    table: {
      type: { summary: 'function' },
    },
  },
  translations: {
    description:
      'Translation map with `labels` and `concepts` dictionaries for i18n. ' +
      'Pass `{ labels: {}, concepts: {} }` for English stories.',
    table: {
      type: { summary: '{ labels: object, concepts: object }' },
      defaultValue: { summary: '{ labels: {}, concepts: {} }' },
    },
  },
};
