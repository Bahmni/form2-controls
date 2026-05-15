import React from 'react';
import StoryWrapper from './StoryWrapper';
import { Container } from 'src/components/Container.jsx';
import { runEventScript } from 'src/helpers/runEventScript';
import { SYSTOLIC_UUID, DIASTOLIC_UUID } from './mockData';

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
        uuid: SYSTOLIC_UUID,
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
        uuid: DIASTOLIC_UUID,
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
      concept: { name: 'Systolic', uuid: SYSTOLIC_UUID, datatype: 'Date' },
    },
    {
      type: 'obsControl',
      label: { id: 'systolic', type: 'label', value: 'Systolic' },
      properties: { mandatory: true, allowDecimal: false, location: { column: 0, row: 0 } },
      id: '7',
      concept: { name: 'Systolic', uuid: SYSTOLIC_UUID, datatype: 'DateTime' },
    },
    {
      type: 'obsControl',
      label: { type: 'label', value: 'Coded concept' },
      properties: {
        mandatory: true, notes: false, autoComplete: false, dropDown: true,
        location: { column: 0, row: 0 },
      },
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
  title: 'Example Forms/Lifecycle & Events',
  parameters: {
    docs: {
      description: {
        component: `
A guided tour of the form lifecycle. Each story documents one event or method exposed
by the form engine and shows it working on a real form.

**Stories on this page:**

- **Basic Data Binding** — foundation: how the Container renders pre-populated observations.
- **Form Lifecycle Demo** — all six lifecycle events on one interactive form with a live
  Event Log: onFormInit, onValueChange, onValueUpdated, getValue(), onFormSave, Submit/Reset.
- **Event Flow Diagram** — the complete init → change → submit → post-save timeline.
- **Handler Templates** — copy-pasteable handler snippets for the most common patterns.
- **Accessibility for Events** — keyboard and assistive-technology considerations when
  events update the form dynamically.
        `,
      },
    },
  },
};

// ---------------------------------------------------------------------------
// Overview — landing page (mirrors Carbon Design System's "Overview" tab)
// ---------------------------------------------------------------------------

const lifecycleRows = [
  ['1. Init', 'onFormInit', 'Form metadata (script)',
    'Runs once after the form renders. Use it to set defaults, hide sections, or pre-fetch data.'],
  ['2. Change', 'onValueChange', 'Individual obsControl',
    "Fires every time a single control's value changes. Carries the new value and its concept."],
  ['2. Change', 'onValueUpdated', 'Container prop (callback)',
    'Fires after any change in the form. Use for dirty tracking, dependent fields, or state sync.'],
  ['3. Submit', 'getValue()', 'Container ref (method)',
    'Read current observations and validation errors. Triggers validation before returning.'],
  ['4. Post-save', 'onFormSave', 'Form metadata (script)',
    'Runs after your app saves the encounter. Use to navigate, refresh, or show notifications.'],
  ['Any', 'onClick handlers', 'Consumer app',
    'Wire Submit / Reset / Cancel buttons yourself — the form engine does not own the button bar.'],
];

const storyRows = [
  ['Basic Data Binding',
    'How Container renders pre-populated observations — the foundation before any events.'],
  ['Form Lifecycle Demo',
    'All six lifecycle events on one form: onFormInit, onValueChange, onValueUpdated, ' +
    'getValue(), onFormSave, and Submit/Reset buttons — with a live Event Log.'],
  ['Event Flow Diagram',
    'The complete timeline: init → change → submit → post-save in one view.'],
  ['Handler Templates',
    'Copy-pasteable handler snippets for the most common integration patterns.'],
  ['Accessibility for Events',
    'Keyboard and screen-reader requirements when events update the form dynamically.'],
];

const conceptRows = [
  ['Container',
    'Top-level React component. Accepts metadata (JSON), observations (array), and event ' +
    'callbacks. Exposes getValue() via a ref.'],
  ['Form metadata',
    'JSON object describing every control — its type, concept, validation rules, and optional ' +
    'lifecycle scripts (onFormInit, onFormSave).'],
  ['Observation',
    'A single data point recorded for a patient. Container collects observations from all child ' +
    'controls and returns them via getValue().'],
  ['onValueChange vs onValueUpdated',
    'onValueChange is per-control (on the obsControl metadata). onValueUpdated is a Container ' +
    'prop that fires for any change and receives all current observations.'],
];

const th = { padding: '0.5rem 0.75rem', fontWeight: 600 };
const tdGray = { padding: '0.5rem 0.75rem', color: '#525252' };
const codeStyle = {
  background: '#e8e8e8', padding: '0.1rem 0.4rem', borderRadius: '3px', fontSize: '0.8rem',
};

export const Overview = {
  name: 'Overview',
  parameters: {
    docs: {
      description: {
        story: 'Landing page — full context for any new developer.',
      },
    },
  },
  render: () => (
    <div style={{ fontFamily: 'IBM Plex Sans, sans-serif', maxWidth: '820px', lineHeight: 1.6 }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '0.25rem' }}>
        Form Lifecycle &amp; Events
      </h1>
      <p style={{ color: '#525252', marginTop: 0, marginBottom: '2rem', fontSize: '1rem' }}>
        The <strong>Container</strong> component is the entry point for every Bahmni clinical form.
        It renders form controls from a JSON metadata tree, manages observation state, and exposes
        a set of events and methods that let your application react to user interactions — from the
        first render all the way through saving an encounter.
      </p>

      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, borderBottom: '1px solid #e0e0e0',
        paddingBottom: '0.5rem', marginBottom: '1rem' }}>
        Lifecycle at a glance
      </h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem',
        marginBottom: '2rem' }}>
        <thead>
          <tr style={{ background: '#f4f4f4', textAlign: 'left' }}>
            <th style={{ padding: '0.5rem 0.75rem', fontWeight: 600 }}>Phase</th>
            <th style={{ padding: '0.5rem 0.75rem', fontWeight: 600 }}>Event / Method</th>
            <th style={{ padding: '0.5rem 0.75rem', fontWeight: 600 }}>Who provides it</th>
            <th style={{ padding: '0.5rem 0.75rem', fontWeight: 600 }}>What it does</th>
          </tr>
        </thead>
        <tbody>
          {lifecycleRows.map(([phase, event, who, what], i) => (
            <tr key={event} style={{ borderBottom: '1px solid #e0e0e0',
              background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
              <td style={{ padding: '0.5rem 0.75rem', whiteSpace: 'nowrap', color: '#525252' }}>
                {phase}
              </td>
              <td style={{ padding: '0.5rem 0.75rem' }}>
                <code style={codeStyle}>{event}</code>
              </td>
              <td style={tdGray}>{who}</td>
              <td style={{ padding: '0.5rem 0.75rem' }}>{what}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, borderBottom: '1px solid #e0e0e0',
        paddingBottom: '0.5rem', marginBottom: '1rem' }}>
        Navigate these stories
      </h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem',
        marginBottom: '2rem' }}>
        <thead>
          <tr style={{ background: '#f4f4f4', textAlign: 'left' }}>
            <th style={th}>Story</th>
            <th style={th}>What you will learn</th>
          </tr>
        </thead>
        <tbody>
          {storyRows.map(([story, desc], i) => (
            <tr key={story} style={{ borderBottom: '1px solid #e0e0e0',
              background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
              <td style={{ padding: '0.5rem 0.75rem', whiteSpace: 'nowrap' }}>
                <strong>{story}</strong>
              </td>
              <td style={tdGray}>{desc}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, borderBottom: '1px solid #e0e0e0',
        paddingBottom: '0.5rem', marginBottom: '1rem' }}>
        Key concepts
      </h2>
      <dl style={{ fontSize: '0.875rem' }}>
        {conceptRows.map(([term, def]) => (
          <div key={term} style={{ marginBottom: '1rem' }}>
            <dt style={{ fontWeight: 600 }}>
              <code style={{ background: '#e8e8e8', padding: '0.1rem 0.4rem',
                borderRadius: '3px', fontSize: '0.8rem' }}>
                {term}
              </code>
            </dt>
            <dd style={{ marginLeft: '1.5rem', color: '#525252' }}>{def}</dd>
          </div>
        ))}
      </dl>
    </div>
  ),
};

export const BasicDataBinding = {
  name: 'Basic Data Binding',
  parameters: {
    docs: {
      description: {
        story: `
**Foundation example — no events.**

Renders a Container with pre-populated observations to show how form metadata + an
\`observations\` array become a rendered form. Use this story as the baseline before
exploring the event-driven stories below.
        `,
      },
    },
  },
  render: () => (
    <StoryWrapper json={form} title="Basic Data Binding">
      {/* validate={false} — suppresses initial validation UI; set true in production */}
      <Container metadata={form} observations={obsList} validate={false} translations={{ labels: {}, concepts: {} }} />
    </StoryWrapper>
  ),
};

// ---------------------------------------------------------------------------
// Form Lifecycle Demo — all six lifecycle events on one form
// ---------------------------------------------------------------------------

const lifecycleDemoForm = {
  id: 11,
  name: 'LifecycleDemo',
  version: '1',
  uuid: 'lifecycle-demo-0000-000000000011',
  controls: [
    {
      type: 'obsControl',
      label: { id: 'systolic', type: 'label', value: 'Systolic' },
      properties: { mandatory: true, allowDecimal: false, location: { column: 0, row: 0 } },
      id: '1',
      concept: {
        name: 'Systolic', uuid: SYSTOLIC_UUID, datatype: 'Numeric',
      },
      events: {
        onValueChange: 'ZnVuY3Rpb24oZm9ybSkgeyB2YXIgdmFsID0gZm9ybS5nZXQoJ1N5c3RvbGljJykuZ2' +
          'V0VmFsdWUoKTsgY29uc29sZS5sb2coJ1tvblZhbHVlQ2hhbmdlXSBTeXN0b2xpYyA9JywgdmFsKTsgfQ==',
      },
    },
    {
      type: 'obsControl',
      label: { id: 'diastolic', type: 'label', value: 'Diastolic' },
      properties: { mandatory: false, allowDecimal: false, location: { column: 0, row: 1 } },
      id: '2',
      concept: {
        name: 'Diastolic', uuid: DIASTOLIC_UUID, datatype: 'Numeric',
      },
    },
    {
      type: 'obsControl',
      label: { id: 'notes', type: 'label', value: 'Notes' },
      properties: { mandatory: false, location: { column: 0, row: 2 } },
      id: '3',
      concept: {
        name: 'Notes', uuid: 'c2a43174-c9db-4e54-8516-17372c83abcd', datatype: 'Text',
      },
    },
  ],
  events: {
    onFormInit: 'ZnVuY3Rpb24oZm9ybSkgeyBmb3JtLmdldCgnU3lzdG9saWMnKS5zZXRWYWx1ZSgxMjApOyB9',
    onFormSave: 'ZnVuY3Rpb24oZm9ybSkgeyBjb25zb2xlLmxvZygnW29uRm9ybVNhdmVdIGZvcm0gc2F2ZWQu' +
      'IFN5c3RvbGljID0nLCBmb3JtLmdldCgnU3lzdG9saWMnKS5nZXRWYWx1ZSgpKTsgfQ==',
  },
};

export const FormLifecycleDemo = {
  name: 'Form Lifecycle Demo',
  parameters: {
    docs: {
      description: {
        story: `
## All lifecycle events on one form

This story wires all six lifecycle hooks to a single **Vitals** form
(Systolic · Diastolic · Notes). Interact with the form and watch the
**Event Log** panel update in real time.

| Event | Where it lives | What it does |
|---|---|---|
| \`onFormInit\` | \`metadata.events.onFormInit\` | Runs once on init — pre-fills Systolic to 120. Visible in the UI. |
| \`onValueChange\` | \`control.events.onValueChange\` | Fires per-control — open DevTools, edit Systolic. |
| \`onValueUpdated\` | Container prop | Fires on any change — shown in Event Log below the form. |
| \`getValue()\` | Container ref method | Called by Submit — shown in Event Log + raw JSON. |
| \`onFormSave\` | \`metadata.events.onFormSave\` | Triggered after save — open DevTools, submit, see the log. |
| onClick (Submit / Reset) | Consumer app | Submit calls \`getValue()\`, Reset remounts via React key. |

> **Note:** Scripts in \`metadata.events\` and \`control.events\` must be base64-encoded.
> \`ScriptRunner\` always tries to decode the script via \`base64ToUtf8\` before executing it.

**Systolic is mandatory** — click Submit with it empty to see validation errors,
then fill it in and submit again to see the observations array.
        `,
      },
    },
  },
  render: () => {
    const WrapperComponent = () => {
      const [eventLog, setEventLog] = React.useState([
        { event: 'onFormInit', detail: 'Systolic pre-filled to 120 by metadata script' },
      ]);
      const [result, setResult] = React.useState(null);
      const [formKey, setFormKey] = React.useState(0);
      const containerRef = React.useRef(null);

      const appendLog = (event, detail) =>
        setEventLog(prev => [...prev, { event, detail }]);

      const btnBase = {
        padding: '4px 14px', cursor: 'pointer', border: 'none',
        borderRadius: '3px', fontSize: '13px',
      };

      return (
        <div>
          <StoryWrapper json={lifecycleDemoForm} title="Form Lifecycle Demo">
            <Container
              key={formKey}
              ref={containerRef}
              metadata={lifecycleDemoForm}
              observations={[]}
              validate={false} // suppresses initial validation UI; validateForm handles on-submit validation
              validateForm={true}
              collapse={false}
              patient={{}}
              translations={{ labels: {}, concepts: {} }}
              onValueUpdated={(tree) => {
                const count = tree.getActive().children.size;
                appendLog('onValueUpdated', `${count} active record(s) in the tree`);
              }}
            />
          </StoryWrapper>

          <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
            <button
              style={{ ...btnBase, background: '#0f62fe', color: '#fff' }}
              onClick={() => {
                const r = containerRef.current.getValue();
                appendLog(
                  'getValue()',
                  `${r.observations.length} observation(s), ${(r.errors || []).length} error(s)`
                );
                setResult(r);
                if (!(r.errors || []).length) {
                  runEventScript(lifecycleDemoForm, lifecycleDemoForm.events.onFormSave, {});
                  appendLog('onFormSave', 'Script executed — check DevTools console');
                }
              }}
            >
              Submit
            </button>
            <button
              style={{ ...btnBase, background: '#fff', border: '1px solid #ccc',
                color: '#161616' }}
              onClick={() => {
                setFormKey(k => k + 1);
                setEventLog([
                  { event: 'onFormInit',
                    detail: 'Systolic pre-filled to 120 by metadata script' },
                ]);
                setResult(null);
              }}
            >
              Reset
            </button>
          </div>

          <div style={{
            marginTop: '16px', fontSize: '12px', fontFamily: 'monospace',
            border: '1px solid #e0e0e0', borderRadius: '4px', overflow: 'hidden',
          }}>
            <div style={{
              background: '#f4f4f4', padding: '6px 12px', fontWeight: 600,
              borderBottom: '1px solid #e0e0e0', fontFamily: 'inherit',
            }}>
              Event Log
            </div>
            {eventLog.map((entry, i) => (
              <div
                key={i}
                style={{
                  padding: '5px 12px', display: 'flex', gap: '12px',
                  borderBottom: i < eventLog.length - 1 ? '1px solid #f0f0f0' : 'none',
                  background: i === 0 ? '#f9f9f9' : '#fff',
                }}
              >
                <span style={{ color: '#0f62fe', minWidth: '160px' }}>{entry.event}</span>
                <span style={{ color: '#525252' }}>{entry.detail}</span>
              </div>
            ))}
          </div>

          {result && (
            <pre style={{
              fontSize: '11px', marginTop: '12px', background: '#f5f5f5',
              padding: '8px', borderRadius: '4px', overflow: 'auto',
            }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          )}
        </div>
      );
    };
    return <WrapperComponent />;
  },
};

// ---------------------------------------------------------------------------
// EventFlowDiagram, HandlerTemplates, AccessibilityForEvents
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
      concept: { name: 'Systolic', uuid: SYSTOLIC_UUID, datatype: 'Numeric' },
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

export const EventFlowDiagram = {
  name: 'Event Flow Diagram',
  parameters: {
    docs: {
      description: {
        story: `
## Event flow timeline

Use this diagram as a reference alongside the individual event stories above.

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
        `,
      },
    },
  },
  render: () => (
    <StoryWrapper json={formForEventFlow} title="Event Flow Diagram">
      <Container
        metadata={formForEventFlow}
        observations={[]}
        validate={false} // reference story — validation suppressed so form renders cleanly
        validateForm={false}
        collapse={false}
        patient={{}}
        translations={{ labels: {}, concepts: {} }}
      />
    </StoryWrapper>
  ),
};

export const HandlerTemplates = {
  name: 'Handler Templates',
  parameters: {
    docs: {
      description: {
        story: `
## Copy-pasteable handler templates

---

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
        `,
      },
    },
  },
  render: () => (
    <StoryWrapper json={formForEventFlow} title="Handler Templates">
      <Container
        metadata={formForEventFlow}
        observations={[]}
        validate={false} // reference story — validation suppressed so form renders cleanly
        validateForm={false}
        collapse={false}
        patient={{}}
        translations={{ labels: {}, concepts: {} }}
      />
    </StoryWrapper>
  ),
};

export const AccessibilityForEvents = {
  name: 'Accessibility for Events',
  parameters: {
    docs: {
      description: {
        story: `
## Accessibility considerations for dynamic event-driven forms

When events such as \`onValueChange\` or \`onValueUpdated\` show or hide fields, or update
values programmatically, assistive technologies may not announce the change automatically.
The following considerations apply whenever the form responds dynamically to user input or
initialization logic.

**aria-live regions for async updates**

Wrap status or feedback messages in an \`aria-live="polite"\` region so screen readers
announce them without interrupting the user:

\`\`\`jsx
<div aria-live="polite" aria-atomic="true" style={{ position: 'absolute', left: '-9999px' }}>
  {statusMessage}
</div>
\`\`\`

Use \`aria-live="assertive"\` only for critical errors that require immediate attention.

**Focus management when fields are revealed via setHidden(false)**

When \`onValueChange\` or \`onFormInit\` reveals a previously hidden field, keyboard users
may be unaware a new field is available. Move focus to the revealed field (or its container
label) so the user can interact with it without re-navigating the entire form:

\`\`\`js
// After setHidden(false), move focus to the revealed field's input element
revealedFieldRef.current && revealedFieldRef.current.focus();
\`\`\`

**Pairing programmatic setValue with visible labels**

When \`setValue\` is called in \`onFormInit\` or an event handler, ensure the field's visible
label accurately reflects the new value. Screen-reader users rely on the association between
the label and the input — a programmatic value update that bypasses the visible label leaves
them without context.

**Keyboard navigation expectations**

- All form controls must be reachable and operable using the keyboard alone
  (Tab / Shift+Tab to navigate, Enter / Space to activate).
- Fields revealed dynamically via \`setHidden(false)\` must be included in the natural tab order once visible.
- Disabled fields (set via \`setEnabled(false)\`) should remain in the DOM but must not receive keyboard focus.
        `,
      },
    },
  },
  render: () => (
    <StoryWrapper json={formForEventFlow} title="Accessibility for Events">
      <Container
        metadata={formForEventFlow}
        observations={[]}
        validate={false} // reference story — validation suppressed so form renders cleanly
        validateForm={false}
        collapse={false}
        patient={{}}
        translations={{ labels: {}, concepts: {} }}
      />
    </StoryWrapper>
  ),
};
