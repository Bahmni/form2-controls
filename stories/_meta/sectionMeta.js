/**
 * Metadata for Section stories.
 * Imported by stories/Section.stories.js.
 */

export const description =
  'Section renders a collapsible `<fieldset>` that visually and semantically groups related ' +
  'form controls under a single heading (legend). It organises observations into logical ' +
  'panels on complex clinical forms.\n\n' +
  '**When to use**: Use Section whenever a form needs to group related fields — for example, ' +
  '"Vital Signs", "Patient History", or "Lab Results" — into a collapsible panel that reduces ' +
  'visual clutter on long forms.\n\n' +
  '**Collapse / expand**: Clicking the legend header toggles `state.collapse`. When collapsed, ' +
  'child controls are hidden via the `closing-group-controls` CSS class without unmounting, ' +
  'preserving any partially entered data.\n\n' +
  '**Nested sections**: A Section\'s `controls` array can contain other sections, enabling ' +
  'multi-level hierarchical form layouts. Each level renders its own `<fieldset>` / `<legend>` pair.\n\n' +
  '**Rendering via Container**: In production, Section is not instantiated directly. The ' +
  '`Container` component reads the form metadata tree, resolves `type: "section"` via ' +
  '`componentStore`, and passes the appropriate child record props down. These stories use ' +
  '`Container` to replicate that full rendering pipeline.\n\n' +
  'Accessibility (WCAG 2.1 AA): The `<fieldset>` + `<legend>` combination provides a native ' +
  'grouping landmark recognised by all screen readers. The collapse toggle is on the `<legend>` ' +
  'element so it is naturally focusable and operable via keyboard.';

export const argTypes = {
  metadata: {
    description:
      'Form descriptor object containing a `controls` array with one or more `type: "section"` ' +
      'entries. Each section entry must include `label`, `properties`, `id`, and a `controls` ' +
      'array of child control descriptors.',
    table: {
      type: { summary: 'object' },
      defaultValue: { summary: 'undefined' },
    },
  },
  observations: {
    description:
      'Array of pre-populated observation objects from a previous encounter. Each observation ' +
      'must include `formFieldPath` to be matched to the correct control.',
    table: {
      type: { summary: 'array' },
      defaultValue: { summary: '[]' },
    },
  },
  collapse: {
    control: 'boolean',
    description:
      'When `true`, renders the section in its initially collapsed state. ' +
      'The user can still expand it by clicking the section header.',
    table: {
      type: { summary: 'boolean' },
      defaultValue: { summary: 'false' },
    },
  },
  validate: {
    control: 'boolean',
    description: 'When `true`, triggers field-level validation on all child controls.',
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
  patient: {
    description:
      'Patient object passed down to child controls. Used by controls that need patient ' +
      'context (e.g. age-based defaults). Pass `{}` in stories.',
    table: {
      type: { summary: 'object' },
      defaultValue: { summary: '{}' },
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
