import React from 'react';

export default {
  title: 'Introduction',
  parameters: {
    options: { showPanel: false },
  },
};

export const Welcome = {
  name: 'Welcome',
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div style={{ fontFamily: 'sans-serif', padding: '40px', maxWidth: '800px' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Storybook for Bahmni Forms</h1>
      <p style={{ color: '#555', fontSize: '1.05rem', marginBottom: '32px' }}>
        Component library for <strong>Bahmni Forms</strong> — an open-source clinical data collection
        framework used across hospitals in low-resource settings.
      </p>

      <h2 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Navigation Guide</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '32px' }}>
        <thead>
          <tr style={{ background: '#f4f4f4' }}>
            <th style={{ textAlign: 'left', padding: '10px 14px', borderBottom: '1px solid #ddd' }}>Category</th>
            <th style={{ textAlign: 'left', padding: '10px 14px', borderBottom: '1px solid #ddd' }}>What you will find</th>
          </tr>
        </thead>
        <tbody>
          {[
            ['Atomic Controls', 'Individual form field components: NumericBox, TextBox, BooleanControl, Date, DateTime, AutoComplete, CodedControl, DropDown, FreeTextAutoComplete, Image, Label, Location, Provider, RadioButton, Video'],
            ['Complex Controls', 'Composite components: ObsControl, ObsGroupControl, ComplexControl, Section, Table, AbnormalObsControl, Add More Controls'],
            ['Orchestrator', 'Form-level containers that orchestrate control rendering: Container, CarbonContainer'],
            ['Example Forms', 'End-to-end form examples demonstrating real-world usage and lifecycle events'],
          ].map(([cat, desc]) => (
            <tr key={cat} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '10px 14px', fontWeight: 600, whiteSpace: 'nowrap' }}>{cat}</td>
              <td style={{ padding: '10px 14px', color: '#444' }}>{desc}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Key Concepts</h2>
      <ul style={{ lineHeight: '1.9', color: '#444', paddingLeft: '20px' }}>
        <li><strong>Observation (Obs)</strong>: A single clinical data point tied to a concept (e.g. "Pulse = 72 bpm").</li>
        <li><strong>ObsGroup</strong>: A parent observation whose value is a set of child observations (e.g. Blood Pressure = Systolic + Diastolic).</li>
        <li><strong>Container</strong>: The top-level form renderer — reads a form metadata JSON and renders the appropriate controls.</li>
        <li><strong>ComponentStore</strong>: A registry that maps concept datatypes to React control components.</li>
      </ul>
    </div>
  ),
};
