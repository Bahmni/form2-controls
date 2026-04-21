import { Component } from 'react';
import PropTypes from 'prop-types';
import { DatePicker, DatePickerInput, TimePicker } from '@bahmni/design-system';
import { Validator } from 'src/helpers/Validator';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import classNames from 'classnames';

export class DateTime extends Component {
  constructor(props) {
    super(props);
    const { dateValue, timeValue } = this._parseValue(props.value);
    this.state = {
      hasErrors: false,
      dateValue,
      timeValue
    };
    this.datePickerRef = null;
    this.timePickerRef = null;
  }

  componentDidMount() {
    const { value, validateForm } = this.props;
    if (this.state.hasErrors || typeof value !== 'undefined' || validateForm) {
      this.props.onChange({
        value,
        errors: this._getAllErrors(this.state.dateValue, this.state.timeValue),
        triggerControlEvent: false,
        calledOnMount: true,
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const valueChanged = this.props.value !== nextProps.value;
    if (this.props.enabled !== nextProps.enabled ||
        valueChanged ||
        !isEqual(this.state, nextState)) {
      return true;
    }
    return false;
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(this.props.value, prevProps.value)) {
      const { dateValue, timeValue } = this._parseValue(this.props.value);
      this.setState({ dateValue, timeValue });
    }

    if (this.props.validate !== prevProps.validate) {
      const errors = this._getAllErrors(this.state.dateValue, this.state.timeValue);
      const hasErrors = this._hasErrors(errors);
      if (this.state.hasErrors !== hasErrors) {
        this.setState({ hasErrors });
      }
    }

    const errors = this._getAllErrors(this.state.dateValue, this.state.timeValue);
    if (this._hasErrors(errors)) {
      this.props.onChange({ value: this.props.value, errors });
    }
  }

  _parseValue(value) {
    if (!value) {
      return { dateValue: undefined, timeValue: '' };
    }
    const parts = value.split(' ');
    return {
      dateValue: parts[0] ? new Date(parts[0]) : undefined,
      timeValue: parts[1] || ''
    };
  }

  _formatDateTime(dateValue, timeValue) {
    if (!dateValue || !timeValue) {
      return undefined;
    }
    const year = dateValue.getFullYear();
    const month = String(dateValue.getMonth() + 1).padStart(2, '0');
    const day = String(dateValue.getDate()).padStart(2, '0');
    return `${year}-${month}-${day} ${timeValue}`;
  }

  handleDateChange(dates) {
    try {
      // Carbon's DatePicker onChange receives an array of Date objects
      if (!dates || !Array.isArray(dates) || dates.length === 0) {
        this.setState({ dateValue: undefined }, this.updateParent);
        return;
      }

      const selectedDate = dates[0];
      if (!selectedDate) {
        this.setState({ dateValue: undefined }, this.updateParent);
        return;
      }

      this.setState({ dateValue: selectedDate }, this.updateParent);
    } catch (error) {
      console.error('Error in handleDateChange:', error);
      this.setState({ dateValue: undefined }, this.updateParent);
    }
  }

  handleTimeChange(e) {
    const timeValue = e.target.value;
    this.setState({ timeValue }, this.updateParent);
  }

  updateParent = () => {
    const { dateValue, timeValue } = this.state;
    const errors = this._getAllErrors(dateValue, timeValue);
    const dateTimeValue = this._formatDateTime(dateValue, timeValue);
    this.setState({ hasErrors: this._hasErrors(errors) });
    this.props.onChange({ value: dateTimeValue, errors });
  }

  _hasErrors(errors) {
    return !isEmpty(errors);
  }

  _getAllErrors(dateValue, timeValue) {
    if (!dateValue && !timeValue) {
      return [];
    }
    if ((dateValue && !timeValue) || (!dateValue && timeValue)) {
      return [{ message: 'Both date and time are required' }];
    }
    const validations = this.props.validations;
    const value = this._formatDateTime(dateValue, timeValue);
    const controlDetails = { validations, value };
    return Validator.getErrors(controlDetails);
  }

  render() {
    const { conceptUuid, label } = this.props;
    const { dateValue, timeValue, hasErrors } = this.state;
    const displayHasErrors = hasErrors;

    return (
      <div className={classNames('datetime-control', {
        'form-builder-error': displayHasErrors
      })}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <DatePicker
              datePickerType="single"
              dateFormat="Y-m-d"
              value={dateValue}
              onChange={(dates) => this.handleDateChange(dates)}
              ref={(ref) => { this.datePickerRef = ref; }}
            >
              <DatePickerInput
                id={`${conceptUuid}-date`}
                labelText={label ? `${label} (Date)` : 'Date'}
                placeholder="yyyy-mm-dd"
                size="sm"
                disabled={!this.props.enabled}
                invalid={displayHasErrors}
              />
            </DatePicker>
          </div>
          <div style={{ flex: 1 }}>
            <TimePicker
              id={`${conceptUuid}-time`}
              labelText={label ? `${label} (Time)` : 'Time'}
              value={timeValue}
              onChange={(e) => this.handleTimeChange(e)}
              size="sm"
              disabled={!this.props.enabled}
              invalid={displayHasErrors}
              ref={(ref) => { this.timePickerRef = ref; }}
            />
          </div>
        </div>
      </div>
    );
  }
}

DateTime.propTypes = {
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
