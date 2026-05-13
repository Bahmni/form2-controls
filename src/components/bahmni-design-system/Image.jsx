import { FileUploaderButton, FileUploaderItem } from '@carbon/react';
import { Renew } from '@carbon/icons-react';
import { Button, Loading } from '@bahmni/design-system';
import classNames from 'classnames';
import { BaseFileUpload } from './BaseFileUpload';

export class Image extends BaseFileUpload {

  displayImage() {
    const loading = this.state.loading === true;
    const isVoided = this.props.value && this.props.value.indexOf('voided') > 0;
    const fileName = this.getFileName(this.props.value);

    return (
      <div className={classNames('carbon-image-upload', { 'carbon-error': this.state.hasErrors })}>
        <Loading active={loading} small withOverlay />
        <p className="upload-label">Upload files</p>
        <p className="upload-description">Max file size is 500kb. Supported file types are .jpg and .png.</p>
        <FileUploaderButton
          accept={['application/pdf', 'image/*']}
          labelText="Upload file"
          onChange={this.handleChange}
          disabled={!this.props.enabled}
          disableLabelChanges
        />
        {this.props.value && (
          <div className="file-row">
            <FileUploaderItem
              uuid={fileName}
              name={fileName}
              status="edit"
              onDelete={() => this.handleDelete()}
              iconDescription="Delete file"
            />
            {isVoided && (
              <Button
                kind="ghost"
                hasIconOnly
                size="sm"
                onClick={this.handleRestore}
                iconDescription="Restore image"
                className="restore-button-inline"
                renderIcon={Renew}
              />
            )}
          </div>
        )}
      </div>
    );
  }

  render() {
    return this.displayImage();
  }
}
