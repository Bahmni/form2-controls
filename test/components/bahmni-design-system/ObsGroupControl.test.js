import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { IntlProvider, injectIntl } from 'react-intl';
import { List } from 'immutable';
import { ObsGroupControl } from 'components/bahmni-design-system/ObsGroupControl';
import { ControlRecord } from 'src/helpers/ControlRecordTreeBuilder';
import ComponentStore from 'src/helpers/componentStore';
import { ObsControlWithIntl as ObsControl } from 'components/ObsControl.jsx';
import { NumericBox } from 'components/NumericBox.jsx';

const ObsGroupControlWithIntl = injectIntl(ObsGroupControl);

const renderWithIntl = (component) =>
  render(<IntlProvider locale="en" messages={{ TEST_KEY: 'Vitals' }}>{component}</IntlProvider>);

const obsConcept = {
  answers: [], datatype: 'Numeric', name: 'Pulse', uuid: 'pulse-uuid',
  properties: { allowDecimal: false },
};

const obsControl = {
  concept: obsConcept, id: '2',
  label: { type: 'label', value: 'Pulse' },
  properties: { location: { column: 0, row: 0 }, mandatory: false, notes: false },
  type: 'obsControl',
};

const children = List.of(new ControlRecord({
  control: obsControl,
  formFieldPath: 'TestForm.1/2-0',
  dataSource: { concept: obsConcept, formFieldPath: 'TestForm.1/2-0',
    formNamespace: 'Bahmni', voided: true },
}));

const metadata = {
  concept: { datatype: 'N/A', name: 'Vitals', set: true, setMembers: [] },
  controls: [],
  id: '1',
  label: { type: 'label', translationKey: 'TEST_KEY', value: 'Vitals' },
  properties: { location: { column: 0, row: 0 } },
  type: 'obsGroupControl',
};

const metadataWithControls = {
  ...metadata,
  controls: [obsControl],
};

const defaultProps = {
  children: List.of(),
  collapse: false,
  formName: 'TestForm',
  formVersion: '1',
  metadata,
  onValueChanged: jest.fn(),
  showNotification: jest.fn(),
  validate: false,
  validateForm: false,
  value: {},
};

describe('Carbon ObsGroupControl', () => {
  it('should render label as accordion title', () => {
    renderWithIntl(<ObsGroupControlWithIntl {...defaultProps} />);

    expect(screen.getByText('Vitals')).toBeInTheDocument();
  });

  it('should render accordion open when collapse is false', () => {
    renderWithIntl(<ObsGroupControlWithIntl {...defaultProps} collapse={false} />);

    expect(document.querySelector('.cds--accordion__item')).toHaveClass('cds--accordion__item--active');
  });

  it('should render accordion closed when collapse is true', () => {
    renderWithIntl(<ObsGroupControlWithIntl {...defaultProps} collapse />);

    expect(document.querySelector('.cds--accordion__item')).not.toHaveClass('cds--accordion__item--active');
  });

  it('should toggle open/close when heading is clicked', () => {
    renderWithIntl(<ObsGroupControlWithIntl {...defaultProps} collapse={false} />);

    const heading = document.querySelector('.cds--accordion__heading');
    const item = document.querySelector('.cds--accordion__item');

    expect(item).toHaveClass('cds--accordion__item--active');
    fireEvent.click(heading);
    expect(item).not.toHaveClass('cds--accordion__item--active');
    fireEvent.click(heading);
    expect(item).toHaveClass('cds--accordion__item--active');
  });

  it('should apply hidden class when hidden is true', () => {
    renderWithIntl(<ObsGroupControlWithIntl {...defaultProps} hidden />);

    expect(document.querySelector('.form-builder-fieldset')).toHaveClass('hidden');
  });

  it('should apply disabled class to content when enabled is false', () => {
    renderWithIntl(<ObsGroupControlWithIntl {...defaultProps} enabled={false} />);

    expect(document.querySelector('.obsGroup-controls')).toHaveClass('disabled');
  });

  it('should show description when concept has description', () => {
    const props = {
      ...defaultProps,
      metadata: {
        ...metadata,
        concept: { ...metadata.concept, description: { value: 'Group description' } },
      },
    };

    renderWithIntl(<ObsGroupControlWithIntl {...props} />);

    expect(screen.getByText('Group description')).toBeInTheDocument();
  });

  it('should render child controls inside accordion', () => {
    ComponentStore.registerComponent('obsControl', ObsControl);
    ComponentStore.registerComponent('numeric', NumericBox);

    const props = { ...defaultProps, children, metadata: metadataWithControls };
    renderWithIntl(<ObsGroupControlWithIntl {...props} />);

    expect(screen.getByRole('spinbutton')).toBeInTheDocument();

    ComponentStore.deRegisterComponent('obsControl');
    ComponentStore.deRegisterComponent('numeric');
  });
});
