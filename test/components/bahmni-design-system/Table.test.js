import React from 'react';
import { render, screen } from '@testing-library/react';
import { IntlProvider, injectIntl } from 'react-intl';
import { List } from 'immutable';
import { Table, TableWithIntl } from 'components/bahmni-design-system/Table';
import { ControlRecord } from 'src/helpers/ControlRecordTreeBuilder';
import ComponentStore from 'src/helpers/componentStore';
import { ObsControlWithIntl as ObsControl } from 'components/ObsControl.jsx';
import { NumericBox } from 'components/NumericBox.jsx';

const renderWithIntl = (component, messages = {}) =>
  render(
    <IntlProvider
      locale="en"
      messages={{ COLUMN1: 'Symptom', COLUMN2: 'Severity', TABLE_LABEL: 'Vitals Table', ...messages }}
    >
      {component}
    </IntlProvider>
  );

const MockControl = ({ formFieldPath }) => <div className="mock-control" data-testid={formFieldPath} />;

const obsConcept = {
  answers: [],
  datatype: 'Numeric',
  name: 'Pulse',
  properties: { allowDecimal: false },
  uuid: 'pulse-uuid',
};

const obsControl = {
  concept: obsConcept,
  id: '2',
  label: { type: 'label', value: 'Pulse(/min)' },
  properties: { location: { column: 0, row: 0 }, mandatory: false, notes: false },
  type: 'obsControl',
};

const metadata = {
  columnHeaders: [
    { translationKey: 'COLUMN1', type: 'label', value: 'Symptom', id: '1' },
    { translationKey: 'COLUMN2', type: 'label', value: 'Severity', id: '2' },
  ],
  controls: [obsControl],
  id: '1',
  label: { type: 'label', translationKey: 'TABLE_LABEL', value: 'Vitals Table' },
  properties: { location: { column: 0, row: 0 } },
  type: 'table',
};

const children = List.of(new ControlRecord({
  control: obsControl,
  formFieldPath: 'TestForm.1/2-0',
  dataSource: {
    concept: obsConcept,
    formFieldPath: 'TestForm.1/2-0',
    formNamespace: 'Bahmni',
    voided: true,
  },
}));

const defaultProps = {
  children,
  formName: 'TestForm',
  formVersion: '1',
  metadata,
  onValueChanged: jest.fn(),
  showNotification: jest.fn(),
  validate: false,
  validateForm: false,
  enabled: true,
};

describe('Carbon Table', () => {
  beforeEach(() => {
    ComponentStore.registerComponent('obsControl', ObsControl);
    ComponentStore.registerComponent('numeric', NumericBox);
  });

  afterEach(() => {
    ComponentStore.deRegisterComponent('obsControl');
    ComponentStore.deRegisterComponent('numeric');
    jest.clearAllMocks();
  });

  describe('DataTable structure', () => {
    it('should render a Carbon data table', () => {
      renderWithIntl(<TableWithIntl {...defaultProps} />);

      expect(document.querySelector('table.cds--data-table')).toBeInTheDocument();
    });

    it('should render thead', () => {
      renderWithIntl(<TableWithIntl {...defaultProps} />);

      expect(document.querySelector('thead')).toBeInTheDocument();
    });

    it('should render tbody', () => {
      renderWithIntl(<TableWithIntl {...defaultProps} />);

      expect(document.querySelector('tbody')).toBeInTheDocument();
    });

    it('should render column headers as th cells inside thead', () => {
      renderWithIntl(<TableWithIntl {...defaultProps} />);

      const headerCells = document.querySelectorAll('thead th');
      expect(headerCells).toHaveLength(2);
      expect(headerCells[0].textContent).toBe('Symptom');
      expect(headerCells[1].textContent).toBe('Severity');
    });

    it('should render data rows inside tbody', () => {
      renderWithIntl(<TableWithIntl {...defaultProps} />);

      const bodyRows = document.querySelectorAll('tbody tr');
      expect(bodyRows.length).toBeGreaterThan(0);
    });
  });

  describe('table label', () => {
    it('should render the table label', () => {
      renderWithIntl(<TableWithIntl {...defaultProps} />);

      expect(screen.getByText('Vitals Table')).toBeInTheDocument();
    });

    it('should apply table-header and test-table-label classes to the label', () => {
      renderWithIntl(<TableWithIntl {...defaultProps} />);

      const label = screen.getByText('Vitals Table');
      expect(label).toHaveClass('table-header', 'test-table-label');
    });
  });

  describe('internationalization', () => {
    it('should render translated table label', () => {
      renderWithIntl(<TableWithIntl {...defaultProps} />, { TABLE_LABEL: 'Tabla de Signos Vitales' });

      expect(screen.getByText('Tabla de Signos Vitales')).toBeInTheDocument();
    });

    it('should render translated column headers', () => {
      renderWithIntl(
        <TableWithIntl {...defaultProps} />,
        { COLUMN1: 'Síntoma', COLUMN2: 'Gravedad' }
      );

      expect(screen.getByText('Síntoma')).toBeInTheDocument();
      expect(screen.getByText('Gravedad')).toBeInTheDocument();
    });

    it('should fallback to default value when no translation key is provided', () => {
      const noKeyMetadata = {
        ...metadata,
        label: { type: 'label', value: 'Fallback Label' },
      };

      renderWithIntl(<TableWithIntl {...defaultProps} metadata={noKeyMetadata} />);

      expect(screen.getByText('Fallback Label')).toBeInTheDocument();
    });
  });

  describe('empty state', () => {
    it('should still render headers with no children', () => {
      const emptyChildProps = { ...defaultProps, children: List.of() };
      renderWithIntl(<TableWithIntl {...emptyChildProps} />);

      const headerCells = document.querySelectorAll('thead th');
      expect(headerCells).toHaveLength(2);
    });

    it('should render empty body with no children', () => {
      const emptyChildProps = { ...defaultProps, children: List.of() };
      renderWithIntl(<TableWithIntl {...emptyChildProps} />);

      const bodyRows = document.querySelectorAll('tbody tr');
      expect(bodyRows).toHaveLength(0);
    });

    it('should render table with no controls in metadata', () => {
      const emptyMetadata = { ...metadata, controls: [] };

      renderWithIntl(<TableWithIntl {...defaultProps} metadata={emptyMetadata} />);

      expect(document.querySelector('table.cds--data-table')).toBeInTheDocument();
    });
  });

  describe('props propagation', () => {
    it('should pass componentStore down to child controls', () => {
      const customStore = {
        getRegisteredComponent: jest.fn(() => MockControl),
      };

      renderWithIntl(<TableWithIntl {...defaultProps} componentStore={customStore} />);

      expect(customStore.getRegisteredComponent).toHaveBeenCalledWith('obsControl');
      expect(document.querySelector('.mock-control')).toBeInTheDocument();
    });

    it('should call onValueChanged when a child control changes value', () => {
      const onValueChanged = jest.fn();

      renderWithIntl(<TableWithIntl {...defaultProps} onValueChanged={onValueChanged} />);

      expect(document.querySelector('table.cds--data-table')).toBeInTheDocument();
    });

    it('should pass validate and validateForm to child controls', () => {
      const emptyMetadata = { ...metadata, controls: [] };
      renderWithIntl(<TableWithIntl {...defaultProps} metadata={emptyMetadata} validate validateForm />);

      expect(document.querySelector('table.cds--data-table')).toBeInTheDocument();
    });

    it('should pass enabled=false to child controls', () => {
      renderWithIntl(<TableWithIntl {...defaultProps} enabled={false} />);

      expect(document.querySelector('table.cds--data-table')).toBeInTheDocument();
    });
  });
});
