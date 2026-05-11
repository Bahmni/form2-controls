import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BooleanControl } from 'components/bahmni-design-system/BooleanControl';
import constants from 'src/constants';

describe('Carbon BooleanControl', () => {
  const options = [
    { translationKey: 'BOOLEAN_YES', name: 'Yes', value: true },
    { translationKey: 'BOOLEAN_NO', name: 'No', value: false },
  ];

  const mockIntl = {
    formatMessage: jest.fn(({ defaultMessage }) => defaultMessage),
  };

  let mockOnChange;
  let defaultProps;

  beforeEach(() => {
    mockOnChange = jest.fn();
    defaultProps = {
      conceptUuid: 'boolean-uuid',
      formFieldPath: 'test/1-0',
      intl: mockIntl,
      onChange: mockOnChange,
      options,
      validate: false,
      validateForm: false,
      validations: [],
    };
    jest.clearAllMocks();
  });

  it('should render SelectableTags for each option', () => {
    render(<BooleanControl {...defaultProps} />);

    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
  });

  it('should call onChange with true when Yes is clicked', () => {
    render(<BooleanControl {...defaultProps} />);

    fireEvent.click(screen.getByText('Yes').closest('button'));

    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: true, errors: [] })
    );
  });

  it('should call onChange with false when No is clicked', () => {
    render(<BooleanControl {...defaultProps} />);

    fireEvent.click(screen.getByText('No').closest('button'));

    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: false, errors: [] })
    );
  });

  it('should toggle off (undefined) when the selected option is clicked again', () => {
    render(<BooleanControl {...defaultProps} value={true} />);

    mockOnChange.mockClear();
    fireEvent.click(screen.getByText('Yes').closest('button'));

    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: undefined })
    );
  });

  it('should show Yes tag as selected when value is true', () => {
    render(<BooleanControl {...defaultProps} value={true} />);

    expect(screen.getByText('Yes').closest('button')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('No').closest('button')).toHaveAttribute('aria-pressed', 'false');
  });

  it('should show No tag as selected when value is false', () => {
    render(<BooleanControl {...defaultProps} value={false} />);

    expect(screen.getByText('No').closest('button')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('Yes').closest('button')).toHaveAttribute('aria-pressed', 'false');
  });

  it('should show no tag as selected when value is undefined', () => {
    render(<BooleanControl {...defaultProps} />);

    expect(screen.getByText('Yes').closest('button')).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByText('No').closest('button')).toHaveAttribute('aria-pressed', 'false');
  });

  it('should disable tags when enabled is false', () => {
    render(<BooleanControl {...defaultProps} enabled={false} />);

    expect(screen.getByText('Yes').closest('button')).toBeDisabled();
    expect(screen.getByText('No').closest('button')).toBeDisabled();
  });

  it('should not disable tags when enabled is true', () => {
    render(<BooleanControl {...defaultProps} enabled />);

    expect(screen.getByText('Yes').closest('button')).not.toBeDisabled();
    expect(screen.getByText('No').closest('button')).not.toBeDisabled();
  });

  it('should show form-builder-error class when validation fails on add-more control', () => {
    const { container } = render(
      <BooleanControl
        {...defaultProps}
        formFieldPath="test/1-1"
        validate
        validations={[constants.validations.mandatory]}
      />
    );

    expect(container.firstChild).toHaveClass('form-builder-error');
  });

  it('should not show form-builder-error when formFieldPath suffix is 0', () => {
    const { container } = render(
      <BooleanControl
        {...defaultProps}
        formFieldPath="test/1-0"
        validate
        validations={[constants.validations.mandatory]}
      />
    );

    expect(container.firstChild).not.toHaveClass('form-builder-error');
  });

  it('should use conceptUuid as container id', () => {
    const { container } = render(<BooleanControl {...defaultProps} />);

    expect(container.querySelector('#boolean-uuid')).toBeInTheDocument();
  });

  it('should call onChange on mount when value is defined', () => {
    render(<BooleanControl {...defaultProps} value={true} />);

    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: true, errors: [] })
    );
  });

  it('should call onChange on mount when validateForm is true', () => {
    render(<BooleanControl {...defaultProps} validateForm />);

    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: undefined })
    );
  });

  it('should handle options without translationKey', () => {
    const optionsWithoutKey = [
      { name: 'Yes', value: true },
      { name: 'No', value: false },
    ];
    render(<BooleanControl {...defaultProps} options={optionsWithoutKey} />);

    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
    expect(mockIntl.formatMessage).toHaveBeenCalledWith(
      expect.objectContaining({ defaultMessage: 'Yes' })
    );
  });
});
