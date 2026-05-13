import { Component } from 'react';
import PropTypes from 'prop-types';
import Constants from 'src/constants';
import isEmpty from 'lodash/isEmpty';
import { Util } from 'src/helpers/Util';
import { Validator } from 'src/helpers/Validator';
import { UploadHandler } from 'src/helpers/UploadHandler';

export class BaseFileUpload extends Component {

  constructor(props) {
    super(props);
    this.state = { hasErrors: false, loading: false };
    this.handleChange = this.handleChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleRestore = this.handleRestore.bind(this);
  }

  componentDidMount() {
    if (this.props.value && !this.props.value.includes('voided')) {
      this.addControlWithNotification(false);
    }
  }

  // Abstract base class — extend in Image/Video; not registered in carbonComponents directly

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.enabled !== nextProps.enabled ||
      this.props.value !== nextProps.value ||
      this.state.hasErrors !== nextState.hasErrors || this.state.loading !== nextState.loading) {
      return true;
    }
    return false;
  }

  componentDidUpdate(prevProps) {
    if (this.props.validate !== prevProps.validate ||
        this.props.value !== prevProps.value) {
      if (this.props.validate) {
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
    }
  }

  _getErrors(value) {
    if (this._isCreateByAddMore()) {
      return [];
    }
    const validations = this.props.validations;
    let controlDetails;
    if (value && value.includes('voided')) {
      controlDetails = { validations, value: undefined };
    } else {
      controlDetails = { validations, value };
    }
    return Validator.getErrors(controlDetails);
  }

  _hasErrors(errors) {
    return !isEmpty(errors);
  }

  _isCreateByAddMore() {
    return !!this.props.formFieldPath && this.props.formFieldPath.split('-')[1] !== '0';
  }

  addControlWithNotification(isNotificationShown) {
    if (this.props.addMore && !this.hasBeenAddMore) {
      this.props.onControlAdd(this.props.formFieldPath, isNotificationShown);
      this.hasBeenAddMore = true;
    }
  }

  update(value) {
    const errors = this._getErrors(value);
    this.setState({ loading: false, hasErrors: this._hasErrors(errors) });
    this.props.onChange({ value, errors });
  }

  handleChange(e) {
    e.preventDefault();
    this.setState({ loading: true });
    if (e.target.files === undefined) {
      this.update(undefined);
      e.target.value = '';
      return;
    }
    const file = e.target.files[0];
    const reader = new FileReader();
    const fileType = Util.getFileType(file.type);
    if (fileType === 'not_supported') {
      this.update(undefined);
      this.props.showNotification(Constants.errorMessage.fileTypeNotSupported,
        Constants.messageType.error);
      e.target.value = '';
      return;
    }

    const inputElement = e.target;
    reader.onloadend = (event) => {
      Util.uploadFile(event.target.result, this.props.patientUuid, fileType)
        .then((response) => response.json())
        .then(data => {
          const handleSuccess = (url) => {
            this.update(url);
            inputElement.value = '';
            this.setState({}, () => {
              this.addControlWithNotification(true);
            });
          };
          const handleError = (errorMessage) => {
            this.setState({ loading: false });
            this.props.showNotification(errorMessage, Constants.messageType.error);
            inputElement.value = '';
          };
          UploadHandler.handleUploadResponse(data, handleSuccess, handleError);
        })
        .catch(() => {
          this.setState({ loading: false });
          this.props.showNotification(Constants.errorMessage.uploadFailed,
            Constants.messageType.error);
          inputElement.value = '';
        });
    };
    reader.readAsDataURL(file);
  }

  handleDelete() {
    if (this.props.value && !this.props.value.includes('voided')) {
      this.update(`${this.props.value}voided`);
    }
  }

  handleRestore() {
    this.update(this.props.value.replace(/voided/g, ''));
  }

  getFileName(value) {
    if (!value) return '';
    return value.replace(/voided/g, '').split('/').pop();
  }
}

BaseFileUpload.propTypes = {
  addMore: PropTypes.bool,
  enabled: PropTypes.bool,
  formFieldPath: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onControlAdd: PropTypes.func.isRequired,
  patientUuid: PropTypes.string,
  showNotification: PropTypes.func.isRequired,
  validate: PropTypes.bool.isRequired,
  validations: PropTypes.array.isRequired,
  value: PropTypes.string,
};

BaseFileUpload.defaultProps = {
  enabled: true,
};
