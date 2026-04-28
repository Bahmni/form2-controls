/* global componentStore */
import React from 'react';
import PropTypes from 'prop-types';
import { ComplexControl } from 'src/components/ComplexControl.jsx';
import StoryWrapper from './StoryWrapper';

// Register a simple mock component as a conceptHandler for story demonstration.
// ComplexControl looks up the conceptHandler key in componentStore and renders
// whatever component is stored there, passing all its own props down.
const MockWeightWidget = ({ conceptHandler }) => (
  <div style={{ border: '1px solid #ccc', padding: '8px', borderRadius: '4px' }}>
    <label htmlFor="mock-weight">
      Weight (kg) — rendered by conceptHandler &quot;{conceptHandler}&quot;
    </label>
    <input
      id="mock-weight"
      placeholder="Enter weight"
      style={{ display: 'block', marginTop: '4px', width: '200px' }}
      type="number"
    />
  </div>
);

MockWeightWidget.propTypes = {
  conceptHandler: PropTypes.string.isRequired,
};

const MockVitalsWidget = ({ addMore, conceptHandler }) => (
  <div style={{ border: '2px solid #4a90d9', padding: '12px', borderRadius: '4px' }}>
    <strong>Vitals Complex Widget — conceptHandler: &quot;{conceptHandler}&quot;</strong>
    <div style={{ marginTop: '8px' }}>
      <label htmlFor="mock-bp">Blood Pressure</label>
      <input
        id="mock-bp"
        placeholder="e.g. 120/80"
        style={{ display: 'block', marginTop: '4px' }}
        type="text"
      />
    </div>
    <div style={{ marginTop: '8px' }}>
      <label htmlFor="mock-hr">Heart Rate</label>
      <input
        id="mock-hr"
        placeholder="bpm"
        style={{ display: 'block', marginTop: '4px' }}
        type="number"
      />
    </div>
    {addMore && (
      <p style={{ color: '#777', fontSize: '0.85em' }}>Add More is enabled for this complex control.</p>
    )}
  </div>
);

MockVitalsWidget.propTypes = {
  addMore: PropTypes.bool,
  conceptHandler: PropTypes.string.isRequired,
};

componentStore.registerComponent('weightHandler', MockWeightWidget);
componentStore.registerComponent('vitalsHandler', MockVitalsWidget);

// Metadata shapes used for the JSON visualisation panel
const weightMetadata = {
  type: 'complex',
  conceptHandler: 'weightHandler',
  id: '10',
  label: { type: 'label', value: 'Weight' },
  properties: { mandatory: false, location: { column: 0, row: 0 } },
  concept: {
    name: 'Weight',
    uuid: 'weight-concept-uuid-0001',
    datatype: 'Complex',
  },
};

const vitalsMetadata = {
  type: 'complex',
  conceptHandler: 'vitalsHandler',
  id: '11',
  label: { type: 'label', value: 'Vitals' },
  properties: { mandatory: false, addMore: true, location: { column: 0, row: 0 } },
  concept: {
    name: 'Vitals Panel',
    uuid: 'vitals-concept-uuid-0002',
    datatype: 'Complex',
  },
};

// Real-world example matching standard_config: an ECG complex control
const ecgMetadata = {
  type: 'complex',
  conceptHandler: 'vitalsHandler',
  id: '20',
  label: { type: 'label', value: 'ECG Recording' },
  properties: {
    mandatory: false,
    location: { column: 0, row: 0 },
    notes: true,
  },
  concept: {
    name: 'ECG Recording',
    uuid: 'ecg-concept-uuid-0003',
    datatype: 'Complex',
    description: 'Captures a multi-lead ECG waveform observation.',
  },
};

const commonProps = {
  onChange: () => {},
  onControlAdd: () => {},
  showNotification: () => {},
  validate: false,
  validations: [],
  properties: { mandatory: false },
};

export default {
  title: 'Complex Controls/ComplexControl',
  component: ComplexControl,
  parameters: {
    docs: {
      description: {
        component:
          'ComplexControl is a dynamic dispatcher that resolves the actual rendering component at ' +
          'runtime by looking up `conceptHandler` in the global `componentStore` singleton. ' +
          'This allows third-party modules (e.g. image capture, ECG, audio recording) to register ' +
          'themselves and be embedded inside any form without any changes to the form-engine core.\n\n' +
          '**How it works**:\n' +
          '1. The form metadata specifies `type: "complex"` and a `conceptHandler` string.\n' +
          '2. At render time, `ComplexControl` calls `componentStore.getRegisteredComponent(conceptHandler)`.\n' +
          '3. If a matching component is found, it is instantiated with all of `ComplexControl`\'s props.\n' +
          '4. If no component is registered for that key, `ComplexControl` renders `null`.\n\n' +
          '**Real-world example**: An ECG module registers itself as ' +
          '`componentStore.registerComponent("ecg", EcgWidget)` and the form metadata uses ' +
          '`conceptHandler: "ecg"` to embed it.\n\n' +
          'Accessibility (WCAG 2.1 AA): The responsibility for accessible markup lies with each ' +
          'registered conceptHandler component. At minimum, each complex widget must associate its ' +
          'inputs with visible labels, support keyboard navigation, and expose error states via ' +
          '`aria-describedby`. The ComplexControl wrapper itself does not add extra DOM structure.',
      },
    },
  },
};

export const DefaultConceptHandlerLookup = {
  render: () => (
    <StoryWrapper json={weightMetadata}>
      <ComplexControl
        {...commonProps}
        conceptHandler="weightHandler"
        formFieldPath="form/10-0"
        properties={{ mandatory: false }}
      />
    </StoryWrapper>
  ),
};

export const WithNestedChildControls = {
  render: () => (
    <StoryWrapper json={vitalsMetadata}>
      <ComplexControl
        {...commonProps}
        addMore={true}
        conceptHandler="vitalsHandler"
        formFieldPath="form/11-0"
        properties={{ mandatory: false, addMore: true }}
      />
    </StoryWrapper>
  ),
};

export const RealWorldEcgExample = {
  render: () => (
    <StoryWrapper json={ecgMetadata}>
      <ComplexControl
        {...commonProps}
        conceptHandler="vitalsHandler"
        formFieldPath="form/20-0"
        properties={{ mandatory: false, notes: true }}
      />
    </StoryWrapper>
  ),
};
