// Per-type control-metadata builders for the CarbonContainer showcase
// (Orchestrator/Bahmni Design System/CarbonContainer). These build the small
// `control` objects that go inside a form's `controls` array — one builder
// per registered CarbonContainer type (see CarbonContainer.jsx's
// `carbonComponents` map for the full list of 18).
//
// Shared building blocks (`carbonContainerCommonProps` / `buildFormMetadata` /
// `buildColumnHeader` from complexFixtures.js, `codedConceptAnswers` /
// `booleanYesNoOptions` / `mockLocations` / `mockProviders` from fixtures.js)
// are reused rather than re-declared. Consumers import those directly from
// their own modules, as the sibling stories do — this file only adds the
// per-type control builders.
import { codedConceptAnswers, booleanYesNoOptions } from './fixtures';

// The 3 pre-existing coded variants (AutoComplete/DropDown/Button) were built
// against this exact answer shape — `name: { display } }` — because
// CodedControl's `_getOptionsRepresentation` reads `option.name.display ||
// option.name`. Kept unchanged here (moved verbatim from the old file) so
// their rendered behaviour is unchanged. New variants below use the shared
// flat `codedConceptAnswers` from fixtures.js instead, which satisfies the
// same `option.name.display || option.name` read (a string has no
// `.display`, so it falls back to `option.name`).
export const carbonCodedAnswers = [
  { display: 'Malaria', name: { display: 'Malaria' }, uuid: 'malaria-uuid', translationKey: 'MALARIA' },
  { display: 'Typhoid', name: { display: 'Typhoid' }, uuid: 'typhoid-uuid', translationKey: 'TYPHOID' },
  { display: 'Dengue', name: { display: 'Dengue' }, uuid: 'dengue-uuid', translationKey: 'DENGUE' },
];

const location = (column, row) => ({ column, row });

export const textControl = (id, name, uuid, column = 0, row = 0) => ({
  type: 'obsControl',
  label: { type: 'label', value: name },
  id,
  properties: { mandatory: false, notes: false, location: location(column, row) },
  concept: { name, uuid, datatype: 'Text' },
});

// `hiNormal`/`lowNormal`/`hiAbsolute`/`lowAbsolute` are read straight off the
// control object by ObsControl's `_numericContext`, not off `concept` — see
// ObsControl.jsx `displayObsControl`.
export const numericControl = (id, name, uuid, column = 0, row = 0, range = {}) => ({
  type: 'obsControl',
  label: { type: 'label', value: name },
  id,
  properties: { mandatory: false, notes: false, location: location(column, row) },
  concept: { name, uuid, datatype: 'Numeric' },
  hiNormal: range.hiNormal ?? null,
  lowNormal: range.lowNormal ?? null,
  hiAbsolute: range.hiAbsolute ?? null,
  lowAbsolute: range.lowAbsolute ?? null,
});

export const dateControl = (id, name, uuid, column = 0, row = 0) => ({
  type: 'obsControl',
  label: { type: 'label', value: name },
  id,
  properties: { mandatory: false, location: location(column, row) },
  concept: { name, uuid, datatype: 'Date' },
});

export const dateTimeControl = (id, name, uuid, column = 0, row = 0) => ({
  type: 'obsControl',
  label: { type: 'label', value: name },
  id,
  properties: { mandatory: false, location: location(column, row) },
  concept: { name, uuid, datatype: 'DateTime' },
});

// BooleanControl reads its option list off `metadata.options` (falling back
// to `concept.answers`) — see ObsControl.jsx `displayObsControl`
// (`options = metadata.options || concept.answers`).
export const booleanControl = (id, name, uuid, column = 0, row = 0, options = booleanYesNoOptions) => ({
  type: 'obsControl',
  label: { type: 'label', value: name },
  id,
  options,
  properties: { mandatory: false, location: location(column, row) },
  concept: { name, uuid, datatype: 'Boolean' },
});

// Coded display type is chosen by `properties` (CodedControl._getDisplayType):
// `autoComplete` -> autocomplete, `dropDown` -> dropdown, `radio` -> radio,
// none of those -> button.
export const codedControl = (id, name, uuid, column = 0, row = 0, displayProperty, answers = codedConceptAnswers) => ({
  type: 'obsControl',
  label: { type: 'label', value: name },
  id,
  properties: {
    mandatory: false,
    notes: false,
    location: location(column, row),
    ...(displayProperty ? { [displayProperty]: true } : {}),
  },
  concept: { name, uuid, datatype: 'Coded', answers },
});

// Reached via `concept.datatype: 'freeTextAutoComplete'`, not a properties
// flag — see test/components/bahmni-design-system/CarbonContainer.test.js's
// `freeTextMetadata`.
export const freeTextControl = (id, name, uuid, column = 0, row = 0, answers = codedConceptAnswers) => ({
  type: 'obsControl',
  label: { type: 'label', value: name },
  id,
  properties: { mandatory: false, notes: false, location: location(column, row) },
  concept: { name, uuid, datatype: 'freeTextAutoComplete', answers },
});

export const sectionControl = (id, name, controls, column = 0, row = 0) => ({
  type: 'section',
  label: { type: 'label', value: name },
  id,
  properties: { mandatory: false, location: location(column, row) },
  controls,
});

export const obsGroupControl = (id, name, uuid, controls, column = 0, row = 0) => ({
  type: 'obsGroupControl',
  label: { type: 'label', value: name },
  id,
  properties: { mandatory: false, location: location(column, row) },
  concept: { name, uuid, datatype: 'N/A' },
  controls,
});

export const tableControl = (id, name, columnHeaders, controls, column = 0, row = 0) => ({
  type: 'table',
  label: { type: 'label', value: name },
  id,
  properties: { mandatory: false, location: location(column, row) },
  columnHeaders,
  controls,
});

// Complex types (Location/Provider/Image/Video) all route the same way:
// `type: 'obsControl'` + `concept.datatype: 'Complex'` + a `conceptHandler`.
// ObsControl resolves `concept.datatype` ('Complex') via `componentStore`,
// which isn't in `carbonComponents`, so it falls back to the global
// ComponentStore's `ComplexControl` (registered on import — see the
// side-effect imports at the top of CarbonContainer.stories.js). ComplexControl
// then resolves `conceptHandler` back through the *same* `carbonStore`, which
// does have `imageurlhandler`/`videourlhandler`/`locationobshandler`/
// `providerobshandler` registered — landing on the Carbon Image/Video/
// Location/Provider component. The runtime field is `conceptHandler`
// (case-sensitive value, e.g. `'ImageUrlHandler'`) — not `handler`, which is
// only used by the form designer's own metadata, never read at runtime.
export const complexControl = (id, name, uuid, column, row, conceptHandler, extraProperties = {}) => ({
  type: 'obsControl',
  label: { type: 'label', value: name },
  id,
  properties: { mandatory: false, location: location(column, row), ...extraProperties },
  concept: { name, uuid, datatype: 'Complex', conceptHandler },
});

export const buildObservation = (formName, formVersion, controlId, uuid, name, datatype, value, extra = {}) => ({
  observationDateTime: '2026-08-10T09:00:00.000+0000',
  uuid: `obs-${controlId}-${uuid}`,
  value,
  formNamespace: 'bahmni',
  formFieldPath: `${formName}.${formVersion}/${controlId}-0`,
  concept: { name, uuid, datatype },
  ...extra,
});

export const buildGroupObservation = (formName, formVersion, controlId, uuid, name, groupMembers) => ({
  observationDateTime: '2026-08-10T09:00:00.000+0000',
  uuid: `obs-${controlId}-${uuid}`,
  formNamespace: 'bahmni',
  formFieldPath: `${formName}.${formVersion}/${controlId}-0`,
  concept: { name, uuid, datatype: 'N/A' },
  groupMembers,
});
