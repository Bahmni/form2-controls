import React, { useRef, useState } from 'react';
import { fn } from '@storybook/test';
import { Container } from 'src/components/Container.jsx';
import StoryWrapper from './StoryWrapper';
import '../styles/styles.scss';

// Import components to trigger self-registration in ComponentStore.
// Each component registers itself via ComponentStore.registerComponent() on import.
import 'src/components/ObsControl.jsx';
import 'src/components/ObsGroupControl.jsx';
import 'src/components/Section.jsx';
import 'src/components/NumericBox.jsx';
import 'src/components/TextBox.jsx';
import 'src/components/BooleanControl.jsx';
import 'src/components/CodedControl.jsx';
import 'src/components/Date.jsx';
import 'src/components/DateTime.jsx';
import 'src/components/Button.jsx';
import 'src/components/Label.jsx';
import 'src/components/AutoComplete.jsx';
import 'src/components/DropDown.jsx';

export default {
  title: 'Orchestrator/Container',
  component: Container,
  parameters: {
    docs: {
      description: {
        component:
          'Container is the top-level form orchestrator. It reads a form metadata JSON, renders the ' +
          'appropriate controls via ComponentStore, and exposes a `getValue()` ref method that returns ' +
          'the current observations and validation errors. Use Container to embed a full Bahmni form ' +
          'in any React host application.',
      },
    },
  },
  argTypes: {
    validate: { control: 'boolean' },
    validateForm: { control: 'boolean' },
    collapse: { control: 'boolean' },
    locale: { control: 'text' },
    readonly: { control: 'boolean' },
  },
};

const simpleFormMetadata = {
  id: 1,
  uuid: 'simple-form-uuid-001',
  name: 'Patient Vitals',
  version: '1',
  controls: [
    {
      type: 'obsControl',
      label: { type: 'label', value: 'Temperature (C)' },
      properties: {
        mandatory: true,
        location: { column: 0, row: 0 },
      },
      id: '1',
      concept: {
        name: 'Temperature',
        uuid: 'c36e9c8b-0001-11e4-adec-0800271c1b75',
        datatype: 'Numeric',
        lowNormal: 36.1,
        hiNormal: 37.2,
        lowAbsolute: 35.0,
        hiAbsolute: 43.0,
      },
    },
    {
      type: 'obsControl',
      label: { type: 'label', value: 'Chief Complaint' },
      properties: {
        mandatory: false,
        location: { column: 1, row: 0 },
      },
      id: '2',
      concept: {
        name: 'Chief Complaint',
        uuid: 'c36e9c8b-0002-11e4-adec-0800271c1b75',
        datatype: 'Text',
      },
    },
    {
      type: 'obsControl',
      label: { type: 'label', value: 'Smoking History' },
      displayType: 'button',
      options: [
        { name: 'Yes', value: true },
        { name: 'No', value: false },
      ],
      properties: {
        mandatory: false,
        location: { column: 0, row: 1 },
      },
      id: '3',
      concept: {
        name: 'Smoking History',
        uuid: 'c36e9c8b-0003-11e4-adec-0800271c1b75',
        datatype: 'Boolean',
      },
    },
    {
      type: 'obsControl',
      label: { type: 'label', value: 'Diagnosis Certainty' },
      properties: {
        mandatory: false,
        autoComplete: false,
        location: { column: 1, row: 1 },
      },
      id: '4',
      concept: {
        name: 'Diagnosis Certainty',
        uuid: 'c36e9c8b-0004-11e4-adec-0800271c1b75',
        datatype: 'Coded',
        answers: [
          { display: 'Confirmed', name: 'Confirmed', uuid: 'ans-confirmed-uuid' },
          { display: 'Presumed', name: 'Presumed', uuid: 'ans-presumed-uuid' },
        ],
      },
    },
    {
      type: 'obsControl',
      label: { type: 'label', value: 'Visit Date' },
      properties: {
        mandatory: true,
        location: { column: 0, row: 2 },
      },
      id: '5',
      concept: {
        name: 'Visit Date',
        uuid: 'c36e9c8b-0005-11e4-adec-0800271c1b75',
        datatype: 'Date',
      },
    },
    {
      type: 'obsControl',
      label: { type: 'label', value: 'Observation DateTime' },
      properties: {
        mandatory: false,
        location: { column: 1, row: 2 },
      },
      id: '6',
      concept: {
        name: 'Observation DateTime',
        uuid: 'c36e9c8b-0006-11e4-adec-0800271c1b75',
        datatype: 'DateTime',
      },
    },
  ],
};

const complexFormMetadata = {
  id: 2,
  uuid: 'complex-form-uuid-002',
  name: 'Comprehensive Assessment',
  version: '1',
  controls: [
    {
      type: 'section',
      label: { type: 'label', value: 'Vitals' },
      properties: {
        mandatory: false,
        location: { column: 0, row: 0 },
      },
      id: '10',
      controls: [
        {
          type: 'obsControl',
          label: { type: 'label', value: 'Pulse (/min)' },
          properties: {
            mandatory: true,
            location: { column: 0, row: 0 },
          },
          id: '11',
          concept: {
            name: 'Pulse',
            uuid: 'c36bc411-0011-11e4-adec-0800271c1b75',
            datatype: 'Numeric',
            lowNormal: 60,
            hiNormal: 100,
          },
        },
        {
          type: 'obsControl',
          label: { type: 'label', value: 'Weight (kg)' },
          properties: {
            mandatory: false,
            location: { column: 1, row: 0 },
          },
          id: '12',
          concept: {
            name: 'Weight',
            uuid: 'c36bc411-0012-11e4-adec-0800271c1b75',
            datatype: 'Numeric',
          },
        },
      ],
    },
    {
      type: 'obsGroupControl',
      label: { type: 'label', value: 'Blood Pressure' },
      properties: {
        mandatory: false,
        location: { column: 0, row: 1 },
      },
      id: '20',
      concept: {
        name: 'Blood Pressure',
        uuid: 'c36af094-0020-11e4-adec-0800271c1b75',
        datatype: 'N/A',
      },
      controls: [
        {
          type: 'obsControl',
          label: { type: 'label', value: 'Systolic (mmHg)' },
          properties: {
            mandatory: true,
            location: { column: 0, row: 0 },
          },
          id: '21',
          concept: {
            name: 'Systolic Blood Pressure',
            uuid: 'c36bc411-0021-11e4-adec-0800271c1b75',
            datatype: 'Numeric',
            lowNormal: 90,
            hiNormal: 120,
          },
        },
        {
          type: 'obsControl',
          label: { type: 'label', value: 'Diastolic (mmHg)' },
          properties: {
            mandatory: true,
            location: { column: 1, row: 0 },
          },
          id: '22',
          concept: {
            name: 'Diastolic Blood Pressure',
            uuid: 'c36bc411-0022-11e4-adec-0800271c1b75',
            datatype: 'Numeric',
            lowNormal: 60,
            hiNormal: 80,
          },
        },
      ],
    },
    {
      type: 'section',
      label: { type: 'label', value: 'Clinical Notes' },
      properties: {
        mandatory: false,
        location: { column: 0, row: 2 },
      },
      id: '30',
      controls: [
        {
          type: 'obsControl',
          label: { type: 'label', value: 'History of Present Illness' },
          properties: {
            mandatory: false,
            location: { column: 0, row: 0 },
          },
          id: '31',
          concept: {
            name: 'History of Present Illness',
            uuid: 'c36bc411-0031-11e4-adec-0800271c1b75',
            datatype: 'Text',
          },
        },
        {
          type: 'obsControl',
          label: { type: 'label', value: 'Follow-up Date' },
          properties: {
            mandatory: false,
            location: { column: 1, row: 0 },
          },
          id: '32',
          concept: {
            name: 'Follow-up Date',
            uuid: 'c36bc411-0032-11e4-adec-0800271c1b75',
            datatype: 'Date',
          },
        },
      ],
    },
  ],
};

const groupedObsMetadata = {
  id: 3,
  uuid: 'grouped-form-uuid-003',
  name: 'Vital Signs Monitoring',
  version: '1',
  controls: [
    {
      type: 'obsGroupControl',
      label: { type: 'label', value: 'Blood Pressure Reading' },
      properties: {
        mandatory: false,
        addMore: true,
        location: { column: 0, row: 0 },
      },
      id: '40',
      concept: {
        name: 'Blood Pressure Data',
        uuid: 'c36af094-0040-11e4-adec-0800271c1b75',
        datatype: 'N/A',
      },
      controls: [
        {
          type: 'obsControl',
          label: { type: 'label', value: 'Systolic' },
          properties: {
            mandatory: true,
            location: { column: 0, row: 0 },
          },
          id: '41',
          concept: {
            name: 'Systolic',
            uuid: 'c36bc411-0041-11e4-adec-0800271c1b75',
            datatype: 'Numeric',
            lowNormal: 90,
            hiNormal: 140,
          },
        },
        {
          type: 'obsControl',
          label: { type: 'label', value: 'Diastolic' },
          properties: {
            mandatory: true,
            location: { column: 1, row: 0 },
          },
          id: '42',
          concept: {
            name: 'Diastolic',
            uuid: 'c36bc411-0042-11e4-adec-0800271c1b75',
            datatype: 'Numeric',
            lowNormal: 60,
            hiNormal: 90,
          },
        },
        {
          type: 'obsControl',
          label: { type: 'label', value: 'Position' },
          properties: {
            mandatory: false,
            autoComplete: false,
            location: { column: 0, row: 1 },
          },
          id: '43',
          concept: {
            name: 'Position',
            uuid: 'c36bc411-0043-11e4-adec-0800271c1b75',
            datatype: 'Coded',
            answers: [
              { display: 'Sitting', name: 'Sitting', uuid: 'ans-sitting-uuid' },
              { display: 'Standing', name: 'Standing', uuid: 'ans-standing-uuid' },
              { display: 'Supine', name: 'Supine', uuid: 'ans-supine-uuid' },
            ],
          },
        },
      ],
    },
    {
      type: 'obsControl',
      label: { type: 'label', value: 'Heart Rate' },
      properties: {
        mandatory: false,
        addMore: true,
        location: { column: 0, row: 1 },
      },
      id: '44',
      concept: {
        name: 'Heart Rate',
        uuid: 'c36bc411-0044-11e4-adec-0800271c1b75',
        datatype: 'Numeric',
        lowNormal: 60,
        hiNormal: 100,
      },
    },
  ],
};

const defaultPatient = {
  uuid: 'patient-uuid-12345',
  name: 'Jane Doe',
  age: 35,
  gender: 'F',
  identifier: 'BAH-0012345',
};

const defaultTranslations = { labels: {}, concepts: {} };

export const SimpleForm = {
  parameters: {
    a11y: { element: '#storybook-root' },
  },
  render: () => (
    <StoryWrapper json={simpleFormMetadata}>
      <Container
        metadata={simpleFormMetadata}
        observations={[]}
        patient={defaultPatient}
        translations={defaultTranslations}
        validate={false}
        validateForm={false}
        collapse={false}
      />
    </StoryWrapper>
  ),
};

export const ComplexNestedForm = {
  render: () => (
    <StoryWrapper json={complexFormMetadata}>
      <Container
        metadata={complexFormMetadata}
        observations={[]}
        patient={defaultPatient}
        translations={defaultTranslations}
        validate={false}
        validateForm={false}
        collapse={false}
      />
    </StoryWrapper>
  ),
};

export const GroupedObservations = {
  render: () => (
    <StoryWrapper json={groupedObsMetadata}>
      <Container
        metadata={groupedObsMetadata}
        observations={[]}
        patient={defaultPatient}
        translations={defaultTranslations}
        validate={false}
        validateForm={false}
        collapse={false}
      />
    </StoryWrapper>
  ),
};

export const WithPatientData = {
  render: () => {
    const existingObservations = [
      {
        uuid: 'obs-temp-uuid',
        value: 37.0,
        formNamespace: 'Bahmni',
        formFieldPath: 'simple-form-uuid-001/1',
        observationDateTime: '2026-04-28T10:00:00.000+0530',
      },
      {
        uuid: 'obs-complaint-uuid',
        value: 'Persistent headache for 3 days',
        formNamespace: 'Bahmni',
        formFieldPath: 'simple-form-uuid-001/2',
        observationDateTime: '2026-04-28T10:00:00.000+0530',
      },
    ];

    return (
      <StoryWrapper json={simpleFormMetadata}>
        <Container
          metadata={simpleFormMetadata}
          observations={existingObservations}
          patient={defaultPatient}
          translations={defaultTranslations}
          validate={false}
          validateForm={false}
          collapse={false}
        />
      </StoryWrapper>
    );
  },
};

const FormSubmissionExample = () => {
  const containerRef = useRef(null);
  const [formOutput, setFormOutput] = useState(null);

  const handleGetValue = () => {
    if (containerRef.current) {
      const result = containerRef.current.getValue();
      setFormOutput(result);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <button
          onClick={handleGetValue}
          style={{
            padding: '8px 16px',
            backgroundColor: '#0f62fe',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '8px',
          }}
        >
          Get Form Value (Submit)
        </button>
        <span style={{ fontSize: '12px', color: '#525252' }}>
          Click to call Container.getValue() — returns observations and errors.
          Try submitting with empty mandatory fields to see validation errors.
        </span>
      </div>

      <Container
        ref={containerRef}
        metadata={simpleFormMetadata}
        observations={[]}
        patient={defaultPatient}
        translations={defaultTranslations}
        validate={false}
        validateForm={true}
        collapse={false}
      />

      {formOutput && (
        <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f4f4f4', borderRadius: '4px' }}>
          <strong>getValue() result:</strong>
          <pre style={{ fontSize: '12px', maxHeight: '300px', overflow: 'auto' }}>
            {JSON.stringify(formOutput, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export const FormSubmission = {
  render: () => <FormSubmissionExample />,
};

export const WithTranslations = {
  render: () => {
    const spanishTranslations = {
      labels: {
        'TEMPERATURE_(C)_1': 'Temperatura (C)',
        'CHIEF_COMPLAINT_2': 'Queja Principal',
        'SMOKING_HISTORY_3': 'Historial de Tabaquismo',
        'DIAGNOSIS_CERTAINTY_4': 'Certeza de Diagnostico',
        'VISIT_DATE_5': 'Fecha de Visita',
        'OBSERVATION_DATETIME_6': 'Fecha y Hora de Observacion',
      },
      concepts: {
        'Temperature': 'Temperatura',
        'Chief Complaint': 'Queja Principal',
        'Smoking History': 'Historial de Tabaquismo',
        'Diagnosis Certainty': 'Certeza de Diagnostico',
        'Visit Date': 'Fecha de Visita',
        'Observation DateTime': 'Fecha y Hora de Observacion',
        'Confirmed': 'Confirmado',
        'Presumed': 'Presumido',
      },
    };

    return (
      <StoryWrapper json={{ translations: spanishTranslations }}>
        <Container
          metadata={simpleFormMetadata}
          observations={[]}
          patient={defaultPatient}
          translations={spanishTranslations}
          validate={false}
          validateForm={false}
          collapse={false}
          locale="es"
        />
      </StoryWrapper>
    );
  },
};

const ConsumerAppExample = ({ onValueUpdated }) => {
  const containerRef = useRef(null);
  const [changeCount, setChangeCount] = useState(0);
  const [lastChange, setLastChange] = useState(null);

  const handleValueUpdated = (controlRecordTree) => {
    setChangeCount(prev => prev + 1);
    setLastChange(new Date().toLocaleTimeString());
    onValueUpdated(controlRecordTree);
  };

  const handleSave = () => {
    if (containerRef.current) {
      containerRef.current.getValue();
    }
  };

  return (
    <div>
      <div style={{
        padding: '12px',
        marginBottom: '16px',
        backgroundColor: '#e0f0ff',
        borderRadius: '4px',
        border: '1px solid #0f62fe',
      }}>
        <strong>Consumer App Wrapper</strong>
        <span style={{ marginLeft: '16px', fontSize: '12px' }}>
          Changes: {changeCount} | Last change: {lastChange || 'none'}
        </span>
        <button
          onClick={handleSave}
          style={{
            float: 'right',
            padding: '4px 12px',
            backgroundColor: '#0f62fe',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Save Form
        </button>
      </div>

      <Container
        ref={containerRef}
        metadata={simpleFormMetadata}
        observations={[]}
        patient={defaultPatient}
        translations={defaultTranslations}
        validate={false}
        validateForm={true}
        collapse={false}
        onValueUpdated={handleValueUpdated}
      />
    </div>
  );
};

export const ConsumerAppPattern = {
  args: {
    onValueUpdated: fn(),
  },
  render: (args) => <ConsumerAppExample onValueUpdated={args.onValueUpdated} />,
};
