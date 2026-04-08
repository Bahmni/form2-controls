import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CarbonContainer } from 'src/carbon-components/CarbonContainer';
import { NumericBox } from 'components/NumericBox.jsx';
import { Label } from 'components/Label.jsx';
import { ObsControlWithIntl as ObsControl } from 'components/ObsControl.jsx';
import { ObsGroupControlWithIntl as ObsGroupControl } from 'components/ObsGroupControl.jsx';
import ComponentStore from 'src/helpers/componentStore';

const defaultProps = {
  collapse: false,
  locale: 'en',
  observations: [],
  patient: { age: 10, gender: 'M', uuid: 'patient-uuid' },
  translations: { labels: {}, concepts: {} },
  validate: false,
  validateForm: false,
};

const textMetadata = {
  controls: [{
    concept: { answers: [], datatype: 'Text', description: [], name: 'Notes',
      properties: { allowDecimal: null }, uuid: 'text-uuid' },
    id: '1', label: { type: 'label', value: 'Notes' },
    properties: { addMore: false, hideLabel: false, location: { column: 0, row: 0 },
      mandatory: false, notes: false },
    type: 'obsControl', hiAbsolute: null, hiNormal: null, lowAbsolute: null, lowNormal: null,
  }],
  id: 1, name: 'TextForm', uuid: 'form-uuid-1', version: '1', defaultLocale: 'en',
};

const numericMetadata = {
  controls: [{
    concept: { answers: [], datatype: 'Numeric', description: [], name: 'Pulse',
      properties: { allowDecimal: true }, uuid: 'pulse-uuid' },
    id: '1', label: { type: 'label', value: 'Pulse' },
    properties: { addMore: false, hideLabel: false, location: { column: 0, row: 0 },
      mandatory: false, notes: false },
    type: 'obsControl', hiAbsolute: null, hiNormal: null, lowAbsolute: null, lowNormal: null,
  }],
  id: 2, name: 'NumericForm', uuid: 'form-uuid-2', version: '1', defaultLocale: 'en',
};

describe('CarbonContainer', () => {
  beforeEach(() => {
    ComponentStore.registerComponent('label', Label);
    ComponentStore.registerComponent('numeric', NumericBox);
    ComponentStore.registerComponent('obsControl', ObsControl);
    ComponentStore.registerComponent('obsGroupControl', ObsGroupControl);
  });

  afterEach(() => {
    ComponentStore.deRegisterComponent('label');
    ComponentStore.deRegisterComponent('numeric');
    ComponentStore.deRegisterComponent('obsControl');
    ComponentStore.deRegisterComponent('obsGroupControl');
  });

  it('should render Carbon TextArea for text-type controls', () => {
    render(<CarbonContainer {...defaultProps} metadata={textMetadata} />);
    expect(screen.getByRole('textbox')).toHaveClass('cds--text-area');
  });

  it('should fall back to global ComponentStore for non-Carbon types', () => {
    render(<CarbonContainer {...defaultProps} metadata={numericMetadata} />);
    expect(screen.getByRole('spinbutton')).toBeInTheDocument();
  });

  it('should forward ref to the underlying Container', () => {
    const ref = React.createRef();
    render(<CarbonContainer ref={ref} {...defaultProps} metadata={textMetadata} />);
    expect(ref.current).toBeTruthy();
    expect(typeof ref.current.getValue).toBe('function');
  });
});
