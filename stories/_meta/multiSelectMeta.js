/**
 * Metadata for MultiSelect stories.
 * Imported by stories/MultiSelect.stories.js.
 */

export const description =
  'MultiSelect is a coded observation control that allows clinicians to choose multiple ' +
  'answers for a single concept, storing each selected answer as a separate observation ' +
  'record in the encounter.\n\n' +
  '**When to use**: Use MultiSelect for coded concepts where more than one answer can be ' +
  'true simultaneously — for example, "Tuberculosis Comorbidities" (Diabetes, HIV, Asthma) ' +
  'or "Allergies" where multiple entries are clinically valid.\n\n' +
  '**How it works**: MultiSelect is enabled by setting `properties.multiSelect: true` on an ' +
  'obsControl with `concept.datatype: "Coded"`. Each selected answer is stored as an ' +
  'individual observation with the same concept UUID but a different coded value.\n\n' +
  '**AutoComplete integration**: When `properties.autoComplete: true` is also set, the ' +
  'control renders as a searchable tag-based input. Users can type to filter answers and ' +
  'select multiple tags. Selected tags appear inline and can be removed individually.\n\n' +
  '**Data structure**: Pre-populated selections are passed via the `observations` array on ' +
  'the parent `Container`. Each selected answer corresponds to one observation object with a ' +
  'coded `value` matching the answer UUID.\n\n' +
  'Accessibility (WCAG 2.1 AA): Each selectable tag includes an `aria-label` describing the ' +
  'answer and its selection state. The autocomplete input uses `role="combobox"` and ' +
  '`aria-expanded` to communicate dropdown state to screen readers.';

export const argTypes = {
  metadata: {
    description:
      'Form descriptor with a `controls` array containing one `type: "obsControl"` entry where ' +
      '`properties.multiSelect: true` and `concept.datatype: "Coded"`. The `concept.answers` ' +
      'array provides the selectable options.',
    table: {
      type: { summary: 'object' },
      defaultValue: { summary: 'undefined' },
    },
  },
  observations: {
    description:
      'Array of pre-selected coded observation objects. Each object must include ' +
      '`formFieldPath` and a `value` object matching one of the concept\'s answers.',
    table: {
      type: { summary: 'array' },
      defaultValue: { summary: '[]' },
    },
  },
  validate: {
    control: 'boolean',
    description: 'When `true`, triggers field-level validation.',
    table: {
      type: { summary: 'boolean' },
      defaultValue: { summary: 'false' },
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
