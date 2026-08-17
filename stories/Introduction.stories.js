import React from 'react';

const renderTable = (headers, rows) => (
  <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '32px' }}>
    <thead>
      <tr style={{ background: '#f4f4f4' }}>
        {headers.map((header) => (
          <th key={header} style={{ textAlign: 'left', padding: '10px 14px', borderBottom: '1px solid #ddd' }}>{header}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {rows.map(([label, description]) => (
        <tr key={label} style={{ borderBottom: '1px solid #eee' }}>
          <td style={{ padding: '10px 14px', fontWeight: 600, whiteSpace: 'nowrap' }}>{label}</td>
          <td style={{ padding: '10px 14px', color: '#444' }}>{description}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

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
      {renderTable(['Category', 'What you will find'], [
        ['Atomic Controls', 'Individual form field components: NumericBox, TextBox, BooleanControl, Button, Comment, Date, DateTime, AutoComplete, CodedControl, DropDown, FreeTextAutoComplete, Image, Label, Location, Provider, RadioButton, Video. Most are available under both the "Legacy Components" and "Bahmni Design System" sub-categories in the sidebar — exceptions: CodedControl and Label have no Bahmni Design System version yet, while Button and Comment currently exist only under Bahmni Design System (no Legacy Components story yet).'],
        ['Complex Controls', 'Composite components: ObsControl, ObsGroupControl, ComplexControl, Section, Table, AbnormalObsControl, Add More Controls. Most are available under both the "Legacy Components" and "Bahmni Design System" sub-categories in the sidebar — exceptions: ComplexControl, AbnormalObsControl, and Add More Controls have no Bahmni Design System version yet.'],
        ['Orchestrator', 'Form-level containers that orchestrate control rendering: Container, CarbonContainer'],
        ['Example Forms', 'End-to-end form examples demonstrating real-world usage and lifecycle events'],
      ])}

      <h2 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Key Concepts</h2>
      <ul style={{ lineHeight: '1.9', color: '#444', paddingLeft: '20px', marginBottom: '32px' }}>
        <li><strong>Observation (Obs)</strong>: A single clinical data point tied to a concept (e.g. "Pulse = 72 bpm").</li>
        <li><strong>ObsGroup</strong>: A parent observation whose value is a set of child observations (e.g. Blood Pressure = Systolic + Diastolic).</li>
        <li><strong>Container</strong>: The top-level form renderer — reads a form metadata JSON and renders the appropriate controls.</li>
        <li><strong>ComponentStore</strong>: A registry that maps concept datatypes to React control components.</li>
      </ul>

      <h2 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Component Versions</h2>
      <p style={{ color: '#444', marginBottom: '16px' }}>
        form2-controls ships two parallel families of components: <strong>Legacy Components</strong>, built
        directly on <strong>Container</strong> using custom per-component markup, and the <strong>Bahmni Design
        System</strong> family, built on Carbon Design System primitives. <strong>CarbonContainer</strong> is a
        drop-in replacement for <strong>Container</strong> — it accepts the same form metadata and renders the
        Carbon-based version of every control, so switching between the two requires no changes to how a form is
        defined.
      </p>
      {renderTable(['Component', 'Carbon Primitive Used'], [
        ['AutoComplete', 'Carbon ComboBox / FilterableMultiSelect'],
        ['DropDown', 'Carbon ComboBox / FilterableMultiSelect'],
        ['FreeTextAutoComplete', 'Carbon ComboBox (custom value allowed)'],
        ['Location', 'Carbon ComboBox (via AutoComplete)'],
        ['Provider', 'Carbon ComboBox (via AutoComplete)'],
        ['Date', 'Carbon DatePicker + DatePickerInput'],
        ['DateTime', 'Carbon DatePicker + DatePickerInput + TimePicker'],
        ['NumericBox', 'Carbon NumberInput'],
        ['TextBox', 'Carbon TextArea'],
        ['Button', 'Carbon SelectableTag'],
        ['BooleanControl', 'Carbon SelectableTag'],
        ['RadioButton', 'Carbon RadioButtonGroup + RadioButton'],
        ['Image', 'Carbon FileUploaderButton + FileUploaderItem'],
        ['Video', 'Carbon FileUploaderButton + FileUploaderItem'],
        ['Comment', 'Carbon Link + TextArea'],
        ['Section', 'Carbon Accordion'],
        ['ObsGroupControl', 'Carbon Accordion'],
        ['Table', 'Carbon Table (composable: TableHead, TableRow, TableHeader, TableBody, TableCell)'],
        ['ObsControl', 'Carbon SelectableTag (when marked abnormal)'],
      ])}

      <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Getting Started</h3>
      <p style={{ color: '#444' }}>
        For <strong>new deployments</strong>, use <strong>CarbonContainer</strong> so that forms render with
        Carbon Design System components. For <strong>legacy compatibility</strong> with existing deployments,
        continue using <strong>Container</strong>. The deprecation timeline for the legacy components is
        currently <strong>TBD</strong>.
      </p>
    </div>
  ),
};
