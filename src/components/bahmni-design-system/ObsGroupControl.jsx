import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { List } from 'immutable';
import { IntlProvider, injectIntl } from 'react-intl';
import addMoreDecorator from 'components/AddMoreDecorator';
import { getGroupedControls, displayRowControls } from 'src/helpers/controlsParser';
import { Accordion, AccordionItem } from '@bahmni/design-system';

export class ObsGroupControl extends addMoreDecorator(Component) {

  constructor(props) {
    super(props);
    const { collapse } = this.props;
    this.state = { errors: [], collapse };
    this.onChange = this.onChange.bind(this);
    this.onControlAdd = this.onControlAdd.bind(this);
    this.onControlRemove = this.onControlRemove.bind(this);
    this._onCollapse = this._onCollapse.bind(this);
    this.showDescription = this.showDescription.bind(this);
    this.onAddControl = this.onAddControl.bind(this);
    this.onRemoveControl = this.onRemoveControl.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.collapse !== undefined &&
        this.props.collapse !== prevProps.collapse) {
      this.setState({ collapse: this.props.collapse });
    }
  }

  onChange(formFieldPath, value, errors, onActionDone) {
    this.props.onValueChanged(formFieldPath, value, errors, onActionDone);
  }

  onControlAdd(formFieldPath, isNotificationShown = true) {
    this.props.onControlAdd(formFieldPath, isNotificationShown);
  }

  onControlRemove(formFieldPath) {
    this.props.onControlRemove(formFieldPath);
  }

  _onCollapse() {
    const collapse = !this.state.collapse;
    this.setState({ collapse });
  }

  showDescription() {
    const { description } = this.props.metadata.concept;

    if (description && description.value) {
      const showHelperTextHtml = this.props.intl.formatHTMLMessage({
        defaultMessage: description.value,
        id: description.translationKey || 'defaultId',
      });
      return (
        <div
          className={classNames('description')}
          dangerouslySetInnerHTML={{ __html: showHelperTextHtml }}
        />
      );
    }
    return null;
  }

  render() {
    const {
      collapse,
      formName,
      formVersion,
      metadata: { label },
      onEventTrigger,
      validate,
      validateForm,
      patientUuid,
      showNotification,
    } = this.props;

    const childProps = {
      collapse,
      enabled: this.props.enabled,
      formName,
      formVersion,
      validate,
      validateForm,
      onControlAdd: this.onControlAdd,
      onControlRemove: this.onControlRemove,
      onEventTrigger,
      onValueChanged: this.onChange,
      patientUuid,
      showNotification,
      componentStore: this.props.componentStore,
    };

    const groupedRowControls = getGroupedControls(this.props.metadata.controls, 'row');
    const disableClass = this.props.enabled ? '' : ' disabled';
    const hiddenClass = !this.props.hidden ? '' : 'hidden';

    const title = this.props.intl.formatMessage({
      defaultMessage: label.value,
      id: label.translationKey || 'defaultId',
    });

    return (
      <div className={classNames('form-builder-fieldset', hiddenClass)}>
        {this.showAddMore()}
        <Accordion align="start">
          <AccordionItem
            open={!this.state.collapse}
            onHeadingClick={this._onCollapse}
            title={title}
          >
            <IntlProvider {...this.props.intl}>
              <div className={`obsGroup-controls${disableClass}`}>
                {this.showDescription()}
                {displayRowControls(groupedRowControls, this.props.children.toArray(), childProps)}
              </div>
            </IntlProvider>
          </AccordionItem>
        </Accordion>
      </div>
    );
  }
}

ObsGroupControl.propTypes = {
  children: PropTypes.any,
  collapse: PropTypes.bool,
  formName: PropTypes.string.isRequired,
  formVersion: PropTypes.string.isRequired,
  metadata: PropTypes.shape({
    concept: PropTypes.object.isRequired,
    displayType: PropTypes.string,
    id: PropTypes.string.isRequired,
    label: PropTypes.shape({
      type: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }).isRequired,
    properties: PropTypes.object,
    type: PropTypes.string.isRequired,
    controls: PropTypes.array,
  }),
  onControlAdd: PropTypes.func,
  onControlRemove: PropTypes.func,
  onEventTrigger: PropTypes.func,
  onValueChanged: PropTypes.func.isRequired,
  patientUuid: PropTypes.string,
  showAddMore: PropTypes.bool.isRequired,
  showNotification: PropTypes.func.isRequired,
  showRemove: PropTypes.bool.isRequired,
  validate: PropTypes.bool.isRequired,
  validateForm: PropTypes.bool.isRequired,
  value: PropTypes.object.isRequired,
};

ObsGroupControl.defaultProps = {
  enabled: true,
  hidden: false,
  showAddMore: false,
  showRemove: false,
  children: List.of([]),
};
