import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List } from 'immutable';
import { injectIntl, IntlProvider } from 'react-intl';
import { getGroupedControls, getControls } from 'src/helpers/controlsParser';
import {
  Table as CarbonTable,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
} from '@carbon/react';

export class Table extends Component {
  render() {
    const {
      enabled, formName, formVersion,
      metadata: { label, controls, columnHeaders },
      onEventTrigger, patientUuid, validate, validateForm, showNotification,
    } = this.props;

    const childProps = {
      enabled, formName, formVersion, validate, validateForm,
      onValueChanged: this.props.onValueChanged,
      onEventTrigger, patientUuid, showNotification,
      componentStore: this.props.componentStore,
    };

    const groupedRowControls = getGroupedControls(controls, 'row');
    const records = this.props.children.toArray();

    return (
      <div>
        <strong className="table-header test-table-label">
          {this.props.intl.formatMessage({
            defaultMessage: label.value,
            id: label.translationKey || `table-label-${this.props.metadata.id}`,
          })}
        </strong>
        <CarbonTable className="carbon-form-table">
          <TableHead>
            <TableRow>
              {columnHeaders.map(h => (
                <TableHeader key={h.id}>
                  {this.props.intl.formatMessage({
                    defaultMessage: h.value,
                    id: h.translationKey || `table-header-${h.id}`,
                  })}
                </TableHeader>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <IntlProvider {...this.props.intl}>
              {groupedRowControls.map((rowControls, rowIndex) => {
                const colMap = {};
                getGroupedControls(rowControls, 'column').forEach(colControls => {
                  if (!colControls || colControls.length === 0) return;
                  const colIdx = colControls[0].properties.location.column;
                  colMap[colIdx] = getControls(colControls, records, childProps);
                });
                const hasVisible = Object.values(colMap).some(controls =>
                  controls.some(group => group.some(ctrl => !ctrl.props.hidden))
                );
                if (!hasVisible) return null;
                return (
                  <TableRow key={rowControls[0]?.properties?.location?.row ?? rowIndex}>
                    {columnHeaders.map((_, colIndex) => (
                      <TableCell key={colIndex}>
                        <div className="form-builder-row">
                          <div className="form-builder-column-wrapper">
                            <div className="form-builder-column">
                              {colMap[colIndex] || null}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
            </IntlProvider>
          </TableBody>
        </CarbonTable>
      </div>
    );
  }
}

Table.propTypes = {
  children: PropTypes.any,
  componentStore: PropTypes.object,
  enabled: PropTypes.bool,
  formName: PropTypes.string.isRequired,
  formVersion: PropTypes.string.isRequired,
  intl: PropTypes.object,
  metadata: PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.shape({
      type: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      translationKey: PropTypes.string,
    }).isRequired,
    properties: PropTypes.object,
    type: PropTypes.string.isRequired,
    controls: PropTypes.array,
    columnHeaders: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      translationKey: PropTypes.string,
      type: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })).isRequired,
  }),
  onEventTrigger: PropTypes.func,
  onValueChanged: PropTypes.func.isRequired,
  patientUuid: PropTypes.string,
  showNotification: PropTypes.func.isRequired,
  validate: PropTypes.bool.isRequired,
  validateForm: PropTypes.bool.isRequired,
};

Table.defaultProps = {
  children: List(),
  enabled: true,
};

export const TableWithIntl = injectIntl(Table, { forwardRef: true });
