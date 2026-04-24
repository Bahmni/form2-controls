import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AutoComplete } from 'components/bahmni-design-system/AutoComplete';
import { httpInterceptor } from 'src/helpers/httpInterceptor';
import Constants from 'src/constants';
import find from 'lodash/find';

export class Location extends Component {

  constructor(props) {
    super(props);
    this.state = { locationData: [], loaded: false };
    this._isMounted = false;
    this.onValueChange = this.onValueChange.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    const { properties } = this.props;
    const url = properties.URL || '/openmrs/ws/rest/v1/location?v=custom:(id,name,uuid)';
    httpInterceptor
      .get(url)
      .then((data) => {
        if (this._isMounted) {
          this.setState({ locationData: data.results, loaded: true });
        }
      })
      .catch(() => {
        if (this._isMounted) {
          this.props.showNotification('Failed to fetch location data', Constants.messageType.error);
          this.setState({ loaded: true });
        }
      });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  onValueChange(value, errors) {
    const updatedValue = value ? value.id : undefined;
    this.props.onChange({ value: updatedValue, errors });
  }

  _getValue(val) {
    return find(this.state.locationData, (location) => location.id === val);
  }

  render() {
    const value = this.props.value ? this._getValue(parseInt(this.props.value, 10)) : undefined;
    const { properties, enabled, formFieldPath, validate, validateForm, validations, conceptUuid } = this.props;
    const isSearchable = (properties.style === 'autocomplete');
    const minimumInput = isSearchable ? 2 : 0;
    return (
        <AutoComplete
          asynchronous={false}
          conceptUuid={conceptUuid}
          enabled={enabled}
          formFieldPath={formFieldPath}
          minimumInput={minimumInput}
          multiSelect={false}
          onValueChange={this.onValueChange}
          options={this.state.locationData}
          searchable={isSearchable}
          validate={validate}
          validateForm={validateForm}
          validations={validations}
          value={value}
        />
    );
  }
}

Location.propTypes = {
  addMore: PropTypes.bool,
  conceptUuid: PropTypes.string,
  enabled: PropTypes.bool,
  formFieldPath: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  properties: PropTypes.object.isRequired,
  showNotification: PropTypes.func.isRequired,
  validate: PropTypes.bool.isRequired,
  validateForm: PropTypes.bool,
  validations: PropTypes.array.isRequired,
  value: PropTypes.string,
};

Location.defaultProps = {
  autofocus: false,
  enabled: true,
  labelKey: 'name',
  valueKey: 'id',
  searchable: false,
};
