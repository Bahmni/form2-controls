import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Comment } from 'components/bahmni-design-system/Comment.jsx';
import { Util } from 'helpers/Util';

jest.mock('src/helpers/Util', () => ({
  Util: {
    isComplexMediaConcept: jest.fn(),
  },
}));

describe('Carbon Comment', () => {
  let mockOnCommentChange;

  beforeEach(() => {
    mockOnCommentChange = jest.fn();
    Util.isComplexMediaConcept.mockReturnValue(false);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render add note link', () => {
    render(<Comment onCommentChange={mockOnCommentChange} />);

    expect(screen.getByRole('link', { name: /add note/i })).toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('should render the comment section on click of add note link', () => {
    render(<Comment onCommentChange={mockOnCommentChange} />);

    fireEvent.click(screen.getByRole('link', { name: /add note/i }));

    expect(screen.getByRole('link', { name: /add note/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should hide the comment section on second click of add note link', () => {
    render(<Comment onCommentChange={mockOnCommentChange} />);

    const link = screen.getByRole('link', { name: /add note/i });
    fireEvent.click(link);
    expect(screen.getByRole('textbox')).toBeInTheDocument();

    fireEvent.click(link);
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('should set comment', () => {
    render(<Comment onCommentChange={mockOnCommentChange} />);

    fireEvent.click(screen.getByRole('link', { name: /add note/i }));
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'New Comment' } });

    expect(mockOnCommentChange).toHaveBeenCalledWith('New Comment');
  });

  it('should call onCommentChange with undefined if filled with empty spaces', () => {
    render(<Comment onCommentChange={mockOnCommentChange} />);

    fireEvent.click(screen.getByRole('link', { name: /add note/i }));
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '   ' } });

    expect(mockOnCommentChange).toHaveBeenCalledWith(undefined);
  });

  it('should render comment section with default value', () => {
    render(<Comment comment="Some Comment" onCommentChange={mockOnCommentChange} />);

    fireEvent.click(screen.getByRole('link', { name: /add note/i }));

    expect(screen.getByRole('textbox')).toHaveValue('Some Comment');
  });

  it('should not render add note link when the control is of complex media type', () => {
    Util.isComplexMediaConcept.mockReturnValue(true);

    render(
      <Comment
        conceptHandler="ImageUrlHandler"
        datatype="Complex"
        onCommentChange={mockOnCommentChange}
      />
    );

    expect(screen.queryByRole('link', { name: /add note/i })).not.toBeInTheDocument();
  });

  it('should render add note link when the control is of complex but not media type', () => {
    Util.isComplexMediaConcept.mockReturnValue(false);

    render(
      <Comment
        conceptHandler="LocationHandler"
        datatype="Complex"
        onCommentChange={mockOnCommentChange}
      />
    );

    expect(screen.getByRole('link', { name: /add note/i })).toBeInTheDocument();
  });

  it('should render comment section when the complex media type control has value', () => {
    Util.isComplexMediaConcept.mockReturnValue(true);

    render(
      <Comment
        conceptHandler="ImageUrlHandler"
        datatype="Complex"
        onCommentChange={mockOnCommentChange}
        value="someValue"
      />
    );

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should not render comment section when the complex media control does not have value', () => {
    Util.isComplexMediaConcept.mockReturnValue(true);

    render(
      <Comment
        conceptHandler="ImageUrlHandler"
        datatype="Complex"
        onCommentChange={mockOnCommentChange}
        value={undefined}
      />
    );

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });
});
