import React from 'react';
import StoryWrapper from './StoryWrapper';
import { Container } from 'src/components/Container.jsx';
import '../styles/styles.scss';

const form = {
  id: 1,
  name: 'abcd',
  version: '1',
  uuid: 'fbc5d897-64e4-4cc1-90a3-47fde7a98026',
  controls: [
    {
      type: 'obsControl',
      label: {
        id: 'systolic',
        type: 'label',
        value: 'Systolic',
      },
      properties: {
        mandatory: true,
        allowDecimal: false,
        addMore: true,
        location: {
          column: 0,
          row: 0,
        },
      },
      id: '1',
      concept: {
        name: 'Systolic',
        uuid: 'c36e9c8b-3f10-11e4-adec-0800271c1b75',
        datatype: 'Numeric',
      },
    },
    {
      type: 'obsControl',
      label: {
        id: 'diastolic',
        type: 'label',
        value: 'Diastolic',
      },
      properties: {
        mandatory: true,
        location: {
          column: 0,
          row: 0,
        },
      },
      id: '2',
      concept: {
        name: 'Diastolic',
        uuid: 'c379aa1d-3f10-11e4-adec-0800271c1b75',
        datatype: 'Text',
      },
    },
    {
      options: [
        { name: 'Yes', value: true },
        { name: 'No', value: false },
      ],
      displayType: 'button',
      type: 'obsControl',
      label: {
        type: 'label',
        value: 'Smoking History',
      },
      properties: {
        mandatory: true,
        notes: false,
        location: {
          column: 0,
          row: 0,
        },
      },
      id: '3',
      concept: {
        name: 'Smoking History',
        uuid: 'c2a43174-c9db-4e54-8516-17372c83537f',
        datatype: 'Boolean',
        properties: {
          allowDecimal: null,
        },
      },
    },
    {
      type: 'obsControl',
      label: {
        type: 'label',
        value: 'Coded concept',
      },
      properties: {
        mandatory: true,
        notes: false,
        autoComplete: false,
        location: {
          column: 0,
          row: 0,
        },
      },
      id: '5',
      concept: {
        name: 'Coded concept',
        uuid: 'c2a43174-c990-4e54-8516-17372c83537f',
        datatype: 'Coded',
        answers: [
          { display: 'Answer1', name: 'Answer1', uuid: 'answer1uuid' },
          { display: 'Answer2', name: 'Answer2', uuid: 'answer2uuid' },
        ],
      },
    },
    {
      type: 'obsControl',
      label: { id: 'systolic', type: 'label', value: 'Systolic' },
      properties: { mandatory: true, allowDecimal: false, location: { column: 0, row: 0 } },
      id: '6',
      concept: { name: 'Systolic', uuid: 'c36e9c8b-3f10-11e4-adec-0800271c1b75', datatype: 'Date' },
    },
    {
      type: 'obsControl',
      label: { id: 'systolic', type: 'label', value: 'Systolic' },
      properties: { mandatory: true, allowDecimal: false, location: { column: 0, row: 0 } },
      id: '7',
      concept: { name: 'Systolic', uuid: 'c36e9c8b-3f10-11e4-adec-0800271c1b75', datatype: 'DateTime' },
    },
    {
      type: 'obsControl',
      label: { type: 'label', value: 'Coded concept' },
      properties: { mandatory: true, notes: false, autoComplete: false, dropDown: true, location: { column: 0, row: 0 } },
      id: '8',
      concept: {
        name: 'Coded concept',
        uuid: 'c2a43174-c990-4e54-8516-17372c83537f',
        datatype: 'Coded',
        answers: [
          { display: 'Answer1', name: 'Answer1', uuid: 'answer1uuid' },
          { display: 'Answer2', name: 'Answer2', uuid: 'answer2uuid' },
        ],
      },
    },
  ],
};

const obsList = [
  {
    observationDateTime: '2016-09-08T10:10:38.000+0530',
    uuid: 'systolicUuid',
    value: '120',
    formNamespace: 'Bahmni',
    formFieldPath: 'formUuid/1',
  },
  {
    observationDateTime: '2016-09-08T10:10:38.000+0530',
    uuid: 'diastolicUuid',
    value: '80',
    formNamespace: 'Bahmni',
    formFieldPath: 'formUuid/2',
  },
];

export default {
  title: 'Forms',
};

export const Form1 = {
  render: () => (
    <StoryWrapper json={form}>
      <Container metadata={form} observations={obsList} validate={false} translations={{ labels: {}, concepts: {} }} />
    </StoryWrapper>
  ),
};

const formWithOnFormInit = {
  id: 4,
  name: 'Vitals',
  version: '1',
  uuid: 'form4-uuid-0000-0000-000000000004',
  controls: [
    {
      type: 'obsControl',
      label: { id: 'systolic', type: 'label', value: 'Systolic' },
      properties: { mandatory: false, allowDecimal: false, location: { column: 0, row: 0 } },
      id: '1',
      concept: { name: 'Systolic', uuid: 'c36e9c8b-3f10-11e4-adec-0800271c1b75', datatype: 'Numeric' },
    },
    {
      type: 'obsControl',
      label: { id: 'notes', type: 'label', value: 'Notes' },
      properties: { mandatory: false, location: { column: 0, row: 1 } },
      id: '2',
      concept: { name: 'Notes', uuid: 'c2a43174-c9db-4e54-8516-17372c83abcd', datatype: 'Text' },
    },
  ],
  events: {
    onFormInit: `function(form) {
  form.get('Systolic').setValue(120);
  form.get('Notes').setHidden(true);
}`,
  },
};

/**
 * ## onFormInit
 *
 * **When triggered:** Fired once during form initialization, in the Container constructor,
 * before the first render. Use it to set up the form's initial state.
 *
 * **Use cases:**
 * - Load default values for fields (e.g. pre-fill a numeric baseline, today's date)
 * - Conditionally show/hide fields based on patient data or other context
 * - Disable fields that should be read-only on load
 *
 * **Signature:**
 * ```js
 * function(form, interceptor) { ... }
 * ```
 *
 * **Parameters:**
 *
 * | Param | Type | Description |
 * |---|---|---|
 * | `form` | FormContext | Access and mutate form controls |
 * | `interceptor` | HttpInterceptor | Make HTTP calls (e.g. fetch reference data) |
 *
 * **FormContext API (`form`):**
 *
 * | Method | Description |
 * |---|---|
 * | `form.get(name)` | Find a control by concept/label name |
 * | `form.getById(id)` | Find a control by its numeric control ID |
 * | `form.getPatient()` | Access the current patient object |
 * | `form.getFromParent(name)` | Find a control relative to its parent (use inside obs groups) |
 *
 * **Control methods** (returned by `form.get()` / `form.getById()`):
 *
 * | Method | Description |
 * |---|---|
 * | `setValue(value)` | Set the field value |
 * | `getValue()` | Read the current value |
 * | `setHidden(bool)` | Show or hide the field |
 * | `setEnabled(bool)` | Enable or disable the field |
 *
 * **Setting in form metadata:**
 * ```json
 * {
 *   "events": {
 *     "onFormInit": "function(form) { form.get('Systolic').setValue(120); }"
 *   }
 * }
 * ```
 *
 * The story below renders a form where `onFormInit` pre-fills Systolic to 120
 * and hides the Notes field. Inspect the JSON panel on the right to see the
 * full event script embedded in the metadata.
 */
export const Form4 = {
  parameters: {
    docs: {
      description: {
        story: `
## onFormInit

**When triggered:** Fired once during form initialization, in the \`Container\` constructor,
before the first render.

**Use cases:** Load default values, conditionally show/hide fields, disable read-only fields on load.

**Signature:**
\`\`\`js
function(form, interceptor) {
  // form  → FormContext: get(), getById(), getPatient(), getFromParent()
  // interceptor → HttpInterceptor: make API calls
}
\`\`\`

**Data passed — \`form\` (FormContext):**

| Method | Description |
|---|---|
| \`form.get(name)\` | Find control by concept/label name → returns control handle |
| \`form.getById(id)\` | Find control by numeric control ID → returns control handle |
| \`form.getPatient()\` | Returns the current patient object |
| \`form.getFromParent(name)\` | Find control relative to its parent (for obs groups) |

**Control handle methods:**

| Method | Description |
|---|---|
| \`setValue(value)\` | Set the field's value |
| \`getValue()\` | Read the current value |
| \`setHidden(bool)\` | Show (\`false\`) or hide (\`true\`) the field |
| \`setEnabled(bool)\` | Enable (\`true\`) or disable (\`false\`) the field |

**In this story:** \`onFormInit\` sets Systolic to \`120\` and hides the Notes field before render.
        `,
      },
    },
  },
  render: () => (
    <StoryWrapper json={formWithOnFormInit}>
      <Container
        metadata={formWithOnFormInit}
        observations={[]}
        validate={false}
        validateForm={false}
        collapse={false}
        patient={{}}
        translations={{ labels: {}, concepts: {} }}
      />
    </StoryWrapper>
  ),
};

// ---------------------------------------------------------------------------
// Form5 — onValueChange (per-control event)
// ---------------------------------------------------------------------------

const formWithOnValueChange = {
  id: 5,
  name: 'PerControlEvents',
  version: '1',
  uuid: 'form5-uuid-0000-0000-000000000005',
  controls: [
    {
      type: 'obsControl',
      label: { id: 'systolic', type: 'label', value: 'Systolic' },
      properties: { mandatory: false, allowDecimal: false, location: { column: 0, row: 0 } },
      id: '1',
      concept: { name: 'Systolic', uuid: 'c36e9c8b-3f10-11e4-adec-0800271c1b75', datatype: 'Numeric' },
      events: {
        onValueChange: `function(form) {
  var val = form.get('Systolic').getValue();
  console.log('Systolic changed:', val);
}`,
      },
    },
    {
      type: 'obsControl',
      label: { id: 'notes', type: 'label', value: 'Notes' },
      properties: { mandatory: false, location: { column: 0, row: 1 } },
      id: '2',
      concept: { name: 'Notes', uuid: 'c2a43174-c9db-4e54-8516-17372c83abcd', datatype: 'Text' },
    },
  ],
};

export const Form5 = {
  parameters: {
    docs: {
      description: {
        story: `
## onValueChange (per-control event)

**When triggered:** Fired each time the value of the specific control changes. The event is
dispatched via \`onEventTrigger\` inside the Container after the control's \`onChange\` handler
runs.

**Placement:** Set on an individual control inside \`control.events.onValueChange\`:
\`\`\`json
{
  "events": {
    "onValueChange": "function(form) { ... }"
  }
}
\`\`\`

**Signature:**
\`\`\`js
function(form, interceptor) {
  // form        → FormContext (same API as onFormInit)
  // interceptor → HttpInterceptor for async lookups
}
\`\`\`

**Use cases:**
- Log or track when a specific field changes
- Drive dependent field visibility (e.g. show Notes only when Systolic is elevated)
- Trigger a calculation based on the updated value

**Dependent-field example** — show Notes only when Systolic > 140:
\`\`\`js
function(form) {
  var systolic = form.get('Systolic').getValue();
  var isHigh = systolic !== undefined && systolic > 140;
  form.get('Notes').setHidden(!isHigh);
}
\`\`\`

**In this story:** The Systolic control has \`onValueChange\` set to log the new value to the
browser console whenever it changes. Open the browser DevTools console, type a value in the
Systolic field, and observe the log output.
        `,
      },
    },
  },
  render: () => (
    <StoryWrapper json={formWithOnValueChange}>
      <Container
        metadata={formWithOnValueChange}
        observations={[]}
        validate={false}
        validateForm={false}
        collapse={false}
        patient={{}}
        translations={{ labels: {}, concepts: {} }}
      />
    </StoryWrapper>
  ),
};

// ---------------------------------------------------------------------------
// Form6 — onValueUpdated (Container prop)
// ---------------------------------------------------------------------------

const formForValueUpdated = {
  id: 6,
  name: 'ValueUpdatedDemo',
  version: '1',
  uuid: 'form6-uuid-0000-0000-000000000006',
  controls: [
    {
      type: 'obsControl',
      label: { id: 'systolic', type: 'label', value: 'Systolic' },
      properties: { mandatory: false, allowDecimal: false, location: { column: 0, row: 0 } },
      id: '1',
      concept: { name: 'Systolic', uuid: 'c36e9c8b-3f10-11e4-adec-0800271c1b75', datatype: 'Numeric' },
    },
    {
      type: 'obsControl',
      label: { id: 'notes', type: 'label', value: 'Notes' },
      properties: { mandatory: false, location: { column: 0, row: 1 } },
      id: '2',
      concept: { name: 'Notes', uuid: 'c2a43174-c9db-4e54-8516-17372c83abcd', datatype: 'Text' },
    },
  ],
};

export const Form6 = {
  parameters: {
    docs: {
      description: {
        story: `
## onValueUpdated (Container prop)

**When triggered:** Called after every value change on any control in the form. This is a
**Container-level prop**, not embedded in the metadata — the consumer provides it when
rendering the form.

**Signature:**
\`\`\`jsx
<Container
  metadata={formMetadata}
  onValueUpdated={(controlRecordTree) => {
    // controlRecordTree → the full, up-to-date record tree after the change
  }}
  ...
/>
\`\`\`

**What \`controlRecordTree\` contains:**
- The complete internal record tree representing all controls and their current values
- Use \`controlRecordTree.getActive().children\` to iterate over active records
- Each record carries \`value\`, \`errors\`, \`formFieldPath\`, and \`control\` metadata

**Use cases:**
- **Dirty tracking** — mark the form as "modified" after the first change
- **Cross-field updates based on full form state** — inspect multiple fields and update others
- **Sync to external store** — push the updated tree to Redux / Zustand on every keystroke

**In this story:** A stateful wrapper captures \`onValueUpdated\` and displays the total number
of active control records below the form as a dirty-state indicator. Fill in either field to
see the count update.
        `,
      },
    },
  },
  render: () => {
    const WrapperComponent = () => {
      const [recordTree, setRecordTree] = React.useState(null);
      const activeCount = recordTree
        ? recordTree.getActive().children.size
        : null;
      return (
        <StoryWrapper json={formForValueUpdated}>
          <Container
            metadata={formForValueUpdated}
            observations={[]}
            validate={false}
            validateForm={false}
            collapse={false}
            patient={{}}
            translations={{ labels: {}, concepts: {} }}
            onValueUpdated={(tree) => setRecordTree(tree)}
          />
          {activeCount !== null && (
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#555' }}>
              onValueUpdated fired — active records: {activeCount}
            </div>
          )}
        </StoryWrapper>
      );
    };
    return <WrapperComponent />;
  },
};

// ---------------------------------------------------------------------------
// Form7 — getValue method
// ---------------------------------------------------------------------------

const formForGetValue = {
  id: 7,
  name: 'GetValueDemo',
  version: '1',
  uuid: 'form7-uuid-0000-0000-000000000007',
  controls: [
    {
      type: 'obsControl',
      label: { id: 'systolic', type: 'label', value: 'Systolic' },
      properties: { mandatory: true, allowDecimal: false, location: { column: 0, row: 0 } },
      id: '1',
      concept: { name: 'Systolic', uuid: 'c36e9c8b-3f10-11e4-adec-0800271c1b75', datatype: 'Numeric' },
    },
    {
      type: 'obsControl',
      label: { id: 'diastolic', type: 'label', value: 'Diastolic' },
      properties: { mandatory: true, allowDecimal: false, location: { column: 0, row: 1 } },
      id: '2',
      concept: { name: 'Diastolic', uuid: 'c379aa1d-3f10-11e4-adec-0800271c1b75', datatype: 'Numeric' },
    },
  ],
};

export const Form7 = {
  parameters: {
    docs: {
      description: {
        story: `
## getValue() method

**What it does:** Collects current observations and validation errors from the form's internal
record tree. Call it on the Container ref to retrieve the form's current state before saving.

**Signature:**
\`\`\`js
const { observations, errors } = containerRef.current.getValue();
\`\`\`

**Return value:**

| Field | Type | Description |
|---|---|---|
| \`observations\` | \`Array\` | FHIR-compatible observation objects ready for the API |
| \`errors\` | \`Array\` | Validation error objects; empty when the form is valid |

**When errors appear:**
- A mandatory field is left empty
- A field value fails its datatype constraints (e.g. non-numeric text in a Numeric field)

**Validation flow:**
1. Consumer calls \`containerRef.current.getValue()\`
2. If \`errors\` is non-empty → display validation UI, **do not** submit
3. If \`errors\` is empty → proceed to API call / \`onFormSave\` script

**Error handling pattern:**
\`\`\`js
const { observations, errors } = containerRef.current.getValue();
if (errors && errors.length > 0) {
  setValidationErrors(errors);
  return; // stop here — do not save
}
saveObservations(observations);
\`\`\`

**In this story:** Both Systolic and Diastolic are mandatory. Click **Get Values** with fields
empty to see errors returned; fill both fields and click again to see observations.
        `,
      },
    },
  },
  render: () => {
    const WrapperComponent = () => {
      const [result, setResult] = React.useState(null);
      const containerRef = React.useRef(null);
      return (
        <StoryWrapper json={formForGetValue}>
          <Container
            ref={containerRef}
            metadata={formForGetValue}
            observations={[]}
            validate={false}
            validateForm={true}
            collapse={false}
            patient={{}}
            translations={{ labels: {}, concepts: {} }}
          />
          <div style={{ marginTop: '8px' }}>
            <button
              onClick={() => setResult(containerRef.current.getValue())}
              style={{ padding: '4px 12px', cursor: 'pointer' }}
            >
              Get Values
            </button>
          </div>
          {result && (
            <pre style={{ fontSize: '11px', marginTop: '8px', background: '#f5f5f5', padding: '8px' }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          )}
        </StoryWrapper>
      );
    };
    return <WrapperComponent />;
  },
};

// ---------------------------------------------------------------------------
// Form8 — onFormSave
// ---------------------------------------------------------------------------

const formWithOnFormSave = {
  id: 8,
  name: 'OnFormSaveDemo',
  version: '1',
  uuid: 'form8-uuid-0000-0000-000000000008',
  controls: [
    {
      type: 'obsControl',
      label: { id: 'systolic', type: 'label', value: 'Systolic' },
      properties: { mandatory: false, allowDecimal: false, location: { column: 0, row: 0 } },
      id: '1',
      concept: { name: 'Systolic', uuid: 'c36e9c8b-3f10-11e4-adec-0800271c1b75', datatype: 'Numeric' },
    },
    {
      type: 'obsControl',
      label: { id: 'notes', type: 'label', value: 'Notes' },
      properties: { mandatory: false, location: { column: 0, row: 1 } },
      id: '2',
      concept: { name: 'Notes', uuid: 'c2a43174-c9db-4e54-8516-17372c83abcd', datatype: 'Text' },
    },
  ],
  events: {
    onFormSave: `function(form, interceptor) {
  console.log('Form saved. Systolic:', form.get('Systolic').getValue());
}`,
  },
};

export const Form8 = {
  parameters: {
    docs: {
      description: {
        story: `
## onFormSave

**When triggered:** Unlike \`onFormInit\`, this event is **not called automatically**. The
consumer must explicitly execute it after a successful \`getValue()\` call by invoking
\`runEventScript(formData, script, patient)\` from the application layer.

**Placement:** Set in \`metadata.events.onFormSave\`:
\`\`\`json
{
  "events": {
    "onFormSave": "function(form, interceptor) { ... }"
  }
}
\`\`\`

**Signature:**
\`\`\`js
function(form, interceptor) {
  // form        → FormContext (same API as onFormInit / onValueChange)
  // interceptor → HttpInterceptor for post-save API calls
}
\`\`\`

**Use cases:**
- Navigate to another page after a successful save
- Refresh reference data or related lists
- Show a success notification / toast

**Full consumer pattern:**
\`\`\`js
import { runEventScript } from 'src/helpers/scriptRunner'; // or equivalent import

async function handleSave(containerRef, formMetadata, patient) {
  const { observations, errors } = containerRef.current.getValue();

  if (errors && errors.length > 0) {
    // surface validation errors — do not proceed
    return;
  }

  // 1. Persist observations via your API
  await saveObservationsToApi(observations);

  // 2. Run the onFormSave script if present
  const script = formMetadata.events && formMetadata.events.onFormSave;
  if (script) {
    runEventScript(formData, script, patient);
  }
}
\`\`\`

**In this story:** \`onFormSave\` is embedded in the metadata. Open the browser console to
observe the log message that would fire when the consumer triggers \`runEventScript\` after save.
        `,
      },
    },
  },
  render: () => (
    <StoryWrapper json={formWithOnFormSave}>
      <Container
        metadata={formWithOnFormSave}
        observations={[]}
        validate={false}
        validateForm={false}
        collapse={false}
        patient={{}}
        translations={{ labels: {}, concepts: {} }}
      />
    </StoryWrapper>
  ),
};

// ---------------------------------------------------------------------------
// Form9 — onClick / Submit-Reset-Cancel patterns
// ---------------------------------------------------------------------------

const formForSubmitPatterns = {
  id: 9,
  name: 'SubmitPatternsDemo',
  version: '1',
  uuid: 'form9-uuid-0000-0000-000000000009',
  controls: [
    {
      type: 'obsControl',
      label: { id: 'systolic', type: 'label', value: 'Systolic' },
      properties: { mandatory: true, allowDecimal: false, location: { column: 0, row: 0 } },
      id: '1',
      concept: { name: 'Systolic', uuid: 'c36e9c8b-3f10-11e4-adec-0800271c1b75', datatype: 'Numeric' },
    },
    {
      type: 'obsControl',
      label: { id: 'notes', type: 'label', value: 'Notes' },
      properties: { mandatory: false, location: { column: 0, row: 1 } },
      id: '2',
      concept: { name: 'Notes', uuid: 'c2a43174-c9db-4e54-8516-17372c83abcd', datatype: 'Text' },
    },
  ],
};

export const Form9 = {
  parameters: {
    docs: {
      description: {
        story: `
## onClick / Submit-Reset-Cancel patterns

The form itself does not provide Submit, Reset, or Cancel buttons. The consumer application
wraps the \`Container\` and adds its own action buttons.

### Submit flow

\`\`\`
Button click
    │
    ▼
containerRef.current.getValue()
    │
    ├── errors present? → display validation UI, stop
    │
    └── no errors → save observations → runEventScript(onFormSave)
\`\`\`

\`\`\`js
function handleSubmit() {
  const { observations, errors } = containerRef.current.getValue();
  if (errors && errors.length > 0) {
    setErrors(errors);
    return;
  }
  saveToApi(observations).then(() => {
    runOnFormSaveScript(formMetadata, patient);
    navigate('/success');
  });
}
\`\`\`

### Reset pattern

There is no built-in \`reset()\` method on the Container. To reset the form:
- Unmount and remount the \`Container\` component (React key trick)
- Or re-initialize \`observations\` state to \`[]\` and update the key prop

\`\`\`jsx
// key-based reset
const [formKey, setFormKey] = React.useState(0);
<Container key={formKey} metadata={formMetadata} observations={[]} ... />
<button onClick={() => setFormKey(k => k + 1)}>Reset</button>
\`\`\`

### Cancel pattern

Navigate away from the page without calling \`getValue()\`. Optionally prompt the user if the
form is dirty (tracked via \`onValueUpdated\`).

**In this story:** Systolic is mandatory. Click **Submit** with it empty to see validation
errors; fill it in and click again to see successful observations. The **Reset** button is
intentionally disabled to illustrate that reset is not built in.
        `,
      },
    },
  },
  render: () => {
    const WrapperComponent = () => {
      const [result, setResult] = React.useState(null);
      const containerRef = React.useRef(null);
      return (
        <StoryWrapper json={formForSubmitPatterns}>
          <Container
            ref={containerRef}
            metadata={formForSubmitPatterns}
            observations={[]}
            validate={false}
            validateForm={true}
            collapse={false}
            patient={{}}
            translations={{ labels: {}, concepts: {} }}
          />
          <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setResult(containerRef.current.getValue())}
              style={{
                padding: '4px 12px', cursor: 'pointer',
                background: '#0077cc', color: '#fff', border: 'none', borderRadius: '3px',
              }}
            >
              Submit
            </button>
            <button
              disabled
              title="Reset is not built in — see docs above for the key-based pattern"
              style={{ padding: '4px 12px', cursor: 'not-allowed', opacity: 0.5 }}
            >
              Reset (not built-in)
            </button>
          </div>
          {result && (
            <pre style={{ fontSize: '11px', marginTop: '8px', background: '#f5f5f5', padding: '8px' }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          )}
        </StoryWrapper>
      );
    };
    return <WrapperComponent />;
  },
};

// ---------------------------------------------------------------------------
// Form10 — Event flow diagram + handler templates
// ---------------------------------------------------------------------------

const formForEventFlow = {
  id: 10,
  name: 'EventFlowReference',
  version: '1',
  uuid: 'form10-uuid-0000-0000-000000000010',
  controls: [
    {
      type: 'obsControl',
      label: { id: 'systolic', type: 'label', value: 'Systolic' },
      properties: { mandatory: false, allowDecimal: false, location: { column: 0, row: 0 } },
      id: '1',
      concept: { name: 'Systolic', uuid: 'c36e9c8b-3f10-11e4-adec-0800271c1b75', datatype: 'Numeric' },
    },
    {
      type: 'obsControl',
      label: { id: 'notes', type: 'label', value: 'Notes' },
      properties: { mandatory: false, location: { column: 0, row: 1 } },
      id: '2',
      concept: { name: 'Notes', uuid: 'c2a43174-c9db-4e54-8516-17372c83abcd', datatype: 'Text' },
    },
  ],
};

export const Form10 = {
  parameters: {
    docs: {
      description: {
        story: `
## Event flow diagram and handler templates

This story is a **reference guide** — use it alongside the individual event stories (Form4–Form9).

---

### Event flow timeline

\`\`\`
User opens form
     │
     ▼
onFormInit ──▶ form renders with initial data
     │
     ▼
User types / selects a value
     │
     ├──▶ onValueChange  (control-level, fires if set on that control)
     │
     └──▶ onValueUpdated (Container prop, always fires after any change)
     │
     ▼
User clicks Submit
     │
     ▼
getValue() ──▶ { observations, errors }
     │
     ├── errors present? ──▶ show validation UI, stop
     │
     └── success ──▶ onFormSave (via runEventScript)
                           │
                           ▼
                      navigate / notify
\`\`\`

---

### Handler templates

**1. Initialize form (onFormInit)**
\`\`\`js
// In metadata.events.onFormInit
function(form, interceptor) {
  // Pre-fill a default value
  form.get('Systolic').setValue(120);

  // Hide a field until needed
  form.get('Notes').setHidden(true);

  // Disable a read-only field
  form.get('Systolic').setEnabled(false);

  // Access patient data
  var patient = form.getPatient();
  if (patient && patient.age > 60) {
    form.get('Notes').setValue('Senior patient — verify values carefully.');
  }
}
\`\`\`

**2. Track dirty state (onValueUpdated)**
\`\`\`jsx
// As a Container prop in the consumer application
const [isDirty, setIsDirty] = React.useState(false);

<Container
  metadata={formMetadata}
  onValueUpdated={(controlRecordTree) => {
    setIsDirty(true);
    // Optionally inspect the full tree:
    // controlRecordTree.getActive().children.forEach(record => {
    //   console.log(record.formFieldPath, record.value);
    // });
  }}
  ...
/>
\`\`\`

**3. Handle submission (getValue + onFormSave)**
\`\`\`js
async function handleSubmit(containerRef, formMetadata, patient) {
  const { observations, errors } = containerRef.current.getValue();

  // Stop if there are validation errors
  if (errors && errors.length > 0) {
    displayErrors(errors);
    return;
  }

  try {
    // Persist observations
    await saveObservationsToApi(observations);

    // Run onFormSave script if provided in metadata
    const script = formMetadata.events && formMetadata.events.onFormSave;
    if (script) {
      runEventScript(formMetadata, script, patient);
    }

    navigate('/success');
  } catch (apiError) {
    showErrorNotification('Save failed: ' + apiError.message);
  }
}
\`\`\`

---

### Error handling

| Scenario | Source | How to handle |
|---|---|---|
| Mandatory field empty | \`getValue().errors\` | Check before submit; surface field-level messages |
| Invalid datatype | \`getValue().errors\` | Same as above |
| API failure on save | \`try/catch\` around API call | Show toast/notification; do not navigate |
| Script runtime error | \`onFormInit\` / event scripts | Wrap in \`try/catch\`; log to console; degrade gracefully |

---

### Dependent fields pattern (onValueChange)

Show a secondary field only when a primary field exceeds a threshold:

\`\`\`js
// On the Systolic control: control.events.onValueChange
function(form) {
  var systolic = form.get('Systolic').getValue();
  // Show Notes field only when Systolic is elevated (> 140 mmHg)
  form.get('Notes').setHidden(!(systolic > 140));
}
\`\`\`

For more complex dependencies (multiple fields influencing each other), prefer
\`onValueUpdated\` on the Container so you always work with the full form state.

---

### Accessibility note

When async updates (driven by \`onValueChange\` or \`onValueUpdated\`) show or hide fields, or
update values programmatically, assistive technologies may not announce the change
automatically. Consider:

- Adding an \`aria-live="polite"\` region near the form to announce dynamic status messages
- Using focus management to move keyboard focus to newly revealed fields
- Pairing programmatic \`setValue\` calls with a visible label change so screen-reader users
  receive the same context as sighted users
        `,
      },
    },
  },
  render: () => (
    <StoryWrapper json={formForEventFlow}>
      <Container
        metadata={formForEventFlow}
        observations={[]}
        validate={false}
        validateForm={false}
        collapse={false}
        patient={{}}
        translations={{ labels: {}, concepts: {} }}
      />
    </StoryWrapper>
  ),
};
