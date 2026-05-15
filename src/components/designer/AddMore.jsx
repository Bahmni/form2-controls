import React, { PureComponent } from 'react';
import { IconButton, Close } from '@bahmni/design-system';
import { Add } from '@carbon/icons-react';

export class AddMoreDesigner extends PureComponent {

  render() {
    return (
      <div className="form-builder-clone">
        <IconButton label="Add" kind="tertiary" size="sm"><Add /></IconButton>
        <IconButton label="Remove" kind="tertiary" size="sm"><Close /></IconButton>
      </div>
    );
  }

}
