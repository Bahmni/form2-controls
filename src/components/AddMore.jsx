import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { IconButton, Close } from '@bahmni/design-system';
import { Add } from '@carbon/icons-react';

export class AddMore extends Component {

  showAdd() {
    if (this.props.canAdd) {
      return (
        <IconButton
          label="Add"
          kind="tertiary"
          size="sm"
          disabled={!this.props.enabled}
          onClick={this.props.onAdd}
        >
          <Add />
        </IconButton>
      );
    }
    return null;
  }

  showDelete() {
    if (this.props.canRemove) {
      return (
        <IconButton
          label="Remove"
          kind="tertiary"
          size="sm"
          disabled={!this.props.enabled}
          onClick={this.props.onRemove}
        >
          <Close />
        </IconButton>
      );
    }
    return null;
  }

  render() {
    return (
      <div className="form-builder-clone">
        {this.showAdd()}
        {this.showDelete()}
      </div>
    );
  }
}

AddMore.propTypes = {
  canAdd: PropTypes.bool.isRequired,
  canRemove: PropTypes.bool.isRequired,
  enabled: PropTypes.bool,
  onAdd: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};


AddMore.defaultProps = {
  enabled: true,
};
