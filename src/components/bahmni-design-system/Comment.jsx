import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextArea } from '@bahmni/design-system';
import { Util } from 'src/helpers/Util';

export class Comment extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showCommentSection: false,
      comment: props.comment || '',
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    const raw = e.target.value;
    this.setState({ comment: raw });
    const trimmed = raw.trim();
    this.props.onCommentChange(trimmed !== '' ? trimmed : undefined);
  }

  showCommentSection(isComplexMediaConcept) {
    if (this.state.showCommentSection || (isComplexMediaConcept && this.props.value)) {
      return (
        <div className="obs-comment-section-wrap">
          <TextArea
            id={this.props.conceptUuid}
            labelText=""
            maxLength={255}
            onChange={this.handleChange}
            placeholder="Notes"
            rows={3}
            value={this.state.comment}
          />
        </div>
      );
    }
    return null;
  }

  showCommentButton(isComplexMediaConcept) {
    if (isComplexMediaConcept) {
      return '';
    }
    const { showCommentSection, comment } = this.state;
    const hasNote = comment.trim().length > 0;
    return (
      <button
        className={[
          'form-builder-comment-toggle',
          'form-builder-comment-button-toggle',
          showCommentSection ? 'active' : '',
          hasNote ? 'has-notes' : '',
        ].filter(Boolean).join(' ')}
        onClick={() => this.setState({ showCommentSection: !showCommentSection })}
      >
        <i className="fa fa-file-o">
          <i className="fa fa-plus-circle" />
          <i className="fa fa-minus-circle" />
        </i>
        <i className="fa fa-file-text-o" />
      </button>
    );
  }

  render() {
    const { conceptHandler, datatype } = this.props;
    const isComplexMediaConcept = Util.isComplexMediaConcept({ conceptHandler, datatype });
    return (
      <div className="form-builder-comment-wrap">
        {this.showCommentButton(isComplexMediaConcept)}
        {this.showCommentSection(isComplexMediaConcept)}
      </div>
    );
  }
}

Comment.propTypes = {
  comment: PropTypes.string,
  conceptHandler: PropTypes.string,
  conceptUuid: PropTypes.string,
  datatype: PropTypes.string,
  onCommentChange: PropTypes.func.isRequired,
  value: PropTypes.string,
};
