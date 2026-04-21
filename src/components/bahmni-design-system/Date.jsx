import { Component } from 'react';
import PropTypes from 'prop-types';
import { DatePicker, DatePickerInput } from '@bahmni/design-system';
import { Validator } from 'src/helpers/Validator';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import classNames from 'classnames';

export class Date extends Component {
  constructor(props) {
    super(props);
    const errors = this._getErrors(props.value) || [];
    const hasErrors = this._shouldValidateOnMount() ? this._hasErrors(errors) : false;
    this.state = { hasErrors };
    this.datePickerRef = null;
  }

  componentDidMount() {
    const { value, validateForm } = this.props;
    if (this.state.hasErrors || typeof value !== 'undefined' || validateForm) {
      this.props.onChange({ value, errors: this._getErrors(value), triggerControlEvent: false, calledOnMount: true });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    this.isValueChanged = this.props.value !== nextProps.value;
    if (this.props.enabled !== nextProps.enabled ||
        this.isValueChanged ||
        this.state.hasErrors !== nextState.hasErrors) {
      return true;
    }
    return false;
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
      this.props.onChange({ value: this.props.value, errors });
    }
    if (this.isValueChanged) {
      this.props.onChange({ value: this.props.value, errors });
    }
  }

  handleChange(dates) {
    try {
      // Carbon's DatePicker onChange receives an array of Date objects
      if (!dates || !Array.isArray(dates) || dates.length === 0) {
        const value = undefined;
        const errors = this._getErrors(value);
        this.setState({ hasErrors: this._hasErrors(errors) });
        this.props.onChange({ value, errors });
        return;
      }

      const selectedDate = dates[0];
      if (!selectedDate) {
        const value = undefined;
        const errors = this._getErrors(value);
        this.setState({ hasErrors: this._hasErrors(errors) });
        this.props.onChange({ value, errors });
        return;
      }

      const value = this._formatDate(selectedDate);
      const errors = this._getErrors(value);
      this.setState({ hasErrors: this._hasErrors(errors) });
      this.props.onChange({ value, errors });
    } catch (error) {
      console.error('Error in handleChange:', error);
      this.setState({ hasErrors: true });
      this.props.onChange({ value: undefined, errors: [{ message: 'Invalid date' }] });
    }
  }

  _formatDate(date) {
    if (!date) return undefined;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  _shouldValidateOnMount() {
    if (!this.props.formFieldPath) {
      return false;
    }
    return this._isCreateByAddMore();
  }

  _isCreateByAddMore() {
    if (!this.props.formFieldPath) {
      return false;
    }
    return (this.props.formFieldPath.split('-')[1] !== '0');
  }

  _hasErrors(errors) {
    return !isEmpty(errors);
  }

  _getErrors(value) {
    const validations = this.props.validations;
    const controlDetails = { validations, value };
    return Validator.getErrors(controlDetails);
  }

  render() {
    const { conceptUuid, label, enabled } = this.props;
    const displayHasErrors = this.state.hasErrors;

    return (
      <div className={classNames({
        'form-builder-error': displayHasErrors,
        'form-builder-warning': false
      })}>
        <DatePicker
          datePickerType="single"
          dateFormat="Y-m-d"
          value={this.props.value}
          onChange={(dates) => this.handleChange(dates)}
          ref={(ref) => { this.datePickerRef = ref; }}
        >
          <DatePickerInput
            id={conceptUuid}
            labelText={label}
            placeholder="yyyy-mm-dd"
            size="sm"
            disabled={!enabled}
            invalid={displayHasErrors}
          />
        </DatePicker>
      </div>
    );
  }
}

Date.propTypes = {
  conceptUuid: PropTypes.string,
  enabled: PropTypes.bool,
  formFieldPath: PropTypes.string.isRequired,
  label: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  validate: PropTypes.bool.isRequired,
  validateForm: PropTypes.bool.isRequired,
  validations: PropTypes.array.isRequired,
  value: PropTypes.string,
};
