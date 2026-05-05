import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextArea, SelectableTag } from '@bahmni/design-system';
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
    const { showCommentSection } = this.state;
    return (
      <SelectableTag
        size="lg"
        text="Note"
        selected={showCommentSection}
        onChange={() => this.setState({ showCommentSection: !showCommentSection })}
      />
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
