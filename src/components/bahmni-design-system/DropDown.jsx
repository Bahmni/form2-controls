import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from '@bahmni/design-system';
import { Validator } from 'src/helpers/Validator';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';

export class DropDown extends Component {
  constructor(props) {
    super(props);
    const errors = this._getErrors(props.value) || [];
    const hasErrors = this._isCreateByAddMore() ? this._hasErrors(errors) : false;
    this.state = { hasErrors };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    const { value, validateForm } = this.props;
    if (this.state.hasErrors || value !== undefined || validateForm) {
      this.props.onValueChange(value, this._getErrors(value));
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    this.isValueChanged = !isEqual(this.props.value, nextProps.value);
    return (
      this.isValueChanged ||
      this.state.hasErrors !== nextState.hasErrors ||
      this.props.enabled !== nextProps.enabled
    );
  }

  componentDidUpdate(prevProps) {
    if (this.props.validate !== prevProps.validate ||
        !isEqual(this.props.value, prevProps.value)) {
      const errors = this._getErrors(this.props.value);
      const hasErrors = this._hasErrors(errors);
      if (this.state.hasErrors !== hasErrors) {
        this.setState({ hasErrors });
      }
    }

    const errors = this._getErrors(this.props.value);
    if (this._hasErrors(errors)) {
      this.props.onValueChange(this.props.value, errors);
    }
    if (this.isValueChanged) {
      this.props.onValueChange(this.props.value, errors);
    }
  }

  _hasErrors(errors) {
    return !isEmpty(errors);
  }

  _getErrors(value) {
    return Validator.getErrors({ validations: this.props.validations, value });
  }

  _isCreateByAddMore() {
    return !!this.props.formFieldPath && this.props.formFieldPath.split('-')[1] !== '0';
  }

  _getInvalidText(errors) {
    return errors && errors.length > 0 ? errors[0].message : '';
  }

  handleChange({ selectedItem }) {
    const errors = this._getErrors(selectedItem);
    this.setState({ hasErrors: this._hasErrors(errors) });
    this.props.onValueChange(selectedItem, errors);
  }

  render() {
    const { conceptUuid, enabled, options, value } = this.props;
    const errors = this._getErrors(value);
    return (
      <Dropdown
        id={conceptUuid || 'dropdown'}
        disabled={!enabled}
        invalid={this.state.hasErrors}
        invalidText={this._getInvalidText(errors)}
        items={options}
        itemToString={(item) => item?.name || ''}
        label=""
        onChange={this.handleChange}
        selectedItem={value || null}
        titleText=""
      />
    );
  }
}

DropDown.propTypes = {
  conceptUuid: PropTypes.string,
  enabled: PropTypes.bool,
  formFieldPath: PropTypes.string,
  onValueChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  validate: PropTypes.bool.isRequired,
  validateForm: PropTypes.bool.isRequired,
  validations: PropTypes.array.isRequired,
  value: PropTypes.any,
};

DropDown.defaultProps = {
  enabled: true,
  validate: false,
  validateForm: false,
  validations: [],
};
