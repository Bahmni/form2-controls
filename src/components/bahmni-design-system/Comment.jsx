import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { TextArea, Link } from '@bahmni/design-system';
import { Util } from 'src/helpers/Util';

export class Comment extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showCommentSection: false,
      hasNote: props.comment && props.comment.length > 0,
      comment: props.comment || '',
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.comment !== this.props.comment) {
      const hasNote = this.props.comment && this.props.comment.length > 0;
      this.setState({ hasNote, comment: this.props.comment || '' });
    }
  }

  handleChange(e) {
    const raw = e.target.value;
    this.setState({ comment: raw, hasNote: raw.trim().length > 0 });
    const trimmed = raw.trim();
    this.props.onCommentChange(trimmed !== '' ? trimmed : undefined);
  }

  showCommentSection(isComplexMediaConcept) {
    if (this.state.showCommentSection || (isComplexMediaConcept && this.props.value)) {
      return (
        <div className="carbon-obs-comment-section-wrap">
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
    return (
      <Link
        href="#"
        aria-expanded={this.state.showCommentSection}
        className={classNames('ds-obs-add-note-link',
          { active: this.state.showCommentSection === true,
            'has-notes': this.state.hasNote === true })}
        onClick={(e) => {
          e.preventDefault();
          this.setState({ showCommentSection: !this.state.showCommentSection });
        }}
      >
        Add note
      </Link>
    );
  }

  render() {
    const { conceptHandler, datatype } = this.props;
    const isComplexMediaConcept = Util.isComplexMediaConcept({ conceptHandler, datatype });
    return (
      <>
        <div className="form-builder-comment-wrap">
          {this.showCommentButton(isComplexMediaConcept)}
        </div>
        {this.showCommentSection(isComplexMediaConcept)}
      </>
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
