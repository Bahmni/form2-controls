import { FileUploaderButton, FileUploaderItem } from '@carbon/react';
import { Renew } from '@carbon/icons-react';
import { Button, Loading } from '@bahmni/design-system';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { BaseFileUpload } from './BaseFileUpload';

export class Video extends BaseFileUpload {

  displayVideo() {
    const loading = this.state.loading === true;
    const isVoided = this.props.value && this.props.value.includes('voided');
    const fileName = this.getFileName(this.props.value);

    return (
      <div className={classNames('carbon-video-upload', { 'carbon-error': this.state.hasErrors })}>
        <Loading active={loading} small />
        <p className="upload-label">Upload video</p>
        <p className="upload-description">Supported video formats: .mp4, .avi and more.</p>
        <FileUploaderButton
          accept={['.mkv', '.flv', '.ogg', 'video/*', 'audio/3gpp']}
          labelText="Upload video"
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
              onDelete={this.handleDelete}
              iconDescription="Delete video"
            />
            {isVoided && (
              <Button
                kind="ghost"
                hasIconOnly
                size="sm"
                onClick={this.handleRestore}
                iconDescription="Restore video"
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
    return this.displayVideo();
  }
}

Video.propTypes = BaseFileUpload.propTypes;
Video.defaultProps = BaseFileUpload.defaultProps;
