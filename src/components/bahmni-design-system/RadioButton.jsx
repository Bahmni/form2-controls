import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { RadioButton as CarbonRadioButton } from '@carbon/react';
import { Validator } from 'src/helpers/Validator';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';

export class RadioButton extends Component {
  constructor(props) {
    super(props);
    const errors = this._getErrors(props.value) || [];
    const hasErrors = this._isCreateByAddMore() ? this._hasErrors(errors) : false;
    this.state = { hasErrors };
    this.changeValue = this.changeValue.bind(this);
  }

  componentDidMount() {
    const { value, validateForm } = this.props;
    if (this.state.hasErrors || value !== undefined || validateForm) {
      this.props.onValueChange(value, this._getErrors(value), true);
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

  changeValue(option) {
    const errors = this._getErrors(option);
    this.setState({ hasErrors: this._hasErrors(errors) });
    this.props.onValueChange(option, errors);
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

  render() {
    const { options, enabled, conceptUuid } = this.props;
    const name = `radio-${conceptUuid}`;
    return (
      <div
        id={conceptUuid}
        className={this.state.hasErrors ? 'form-builder-error' : ''}
        style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}
      >
        {options.map((option) => {
          const labelText = option[this.props.nameKey];
          const isChecked = this.props.value &&
            this.props.value[this.props.valueKey] === option[this.props.valueKey];
          return (
            <CarbonRadioButton
              key={labelText}
              id={`${conceptUuid}-${labelText}`}
              labelText={labelText}
              name={name}
              value={option[this.props.valueKey]}
              checked={isChecked}
              disabled={!enabled}
              onChange={() => this.changeValue(option)}
            />
          );
        })}
      </div>
    );
  }
}

RadioButton.propTypes = {
  conceptUuid: PropTypes.string,
  enabled: PropTypes.bool,
  formFieldPath: PropTypes.string,
  nameKey: PropTypes.string,
  onValueChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  validate: PropTypes.bool.isRequired,
  validateForm: PropTypes.bool.isRequired,
  validations: PropTypes.array.isRequired,
  value: PropTypes.any,
  valueKey: PropTypes.string,
};

RadioButton.defaultProps = {
  enabled: true,
  nameKey: 'name',
  valueKey: 'value',
  validate: false,
  validateForm: false,
  validations: [],
};
