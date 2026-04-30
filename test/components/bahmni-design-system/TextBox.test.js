import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TextBox } from 'components/bahmni-design-system/TextBox';
import constants from 'src/constants';
import { Error } from 'src/Error';

describe('Carbon TextBox', () => {
  let mockOnChange;

  beforeEach(() => {
    mockOnChange = jest.fn();
  });

  it('should render a textarea', () => {
    render(
      <TextBox
        formFieldPath="test1.1/1-0"
        onChange={mockOnChange}
        validate={false}
        validateForm={false}
        validations={[]}
      />
    );

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should render with default value', () => {
    render(
      <TextBox
        formFieldPath="test1.1/1-0"
        onChange={mockOnChange}
        validate={false}
        validateForm={false}
        validations={[]}
        value="hello"
      />
    );

    expect(screen.getByRole('textbox')).toHaveValue('hello');
  });

  it('should call onChange with new value on user input', async () => {
    render(
      <TextBox
        formFieldPath="test1.1/1-0"
        onChange={mockOnChange}
        validate={false}
        validateForm={false}
        validations={[]}
        value="initial"
      />
    );

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'updated' } });
    expect(mockOnChange).toHaveBeenCalledWith({ value: 'updated', errors: [] });
  });

  it('should apply Carbon invalid state on validation error', async () => {
    const validations = [constants.validations.mandatory];
    render(
      <TextBox
        formFieldPath="test1.1/1-0"
        onChange={mockOnChange}
        validate={false}
        validateForm={false}
        validations={validations}
        value="text"
      />
    );

    await userEvent.clear(screen.getByRole('textbox'));

    const mandatoryError = new Error({ message: validations[0] });
    expect(mockOnChange).toHaveBeenCalledWith({ value: '', errors: [mandatoryError] });
    expect(screen.getByRole('textbox')).toHaveClass('cds--text-area--invalid');
  });

  it('should not have invalid class when there are no errors', () => {
    render(
      <TextBox
        formFieldPath="test1.1/1-0"
        onChange={mockOnChange}
        validate={false}
        validateForm={false}
        validations={[]}
      />
    );

    expect(screen.getByRole('textbox')).not.toHaveClass('cds--text-area--invalid');
  });

  it('should be disabled when enabled prop is false', () => {
    render(
      <TextBox
        enabled={false}
        formFieldPath="test1.1/1-0"
        onChange={mockOnChange}
        validate={false}
        validateForm={false}
        validations={[]}
      />
    );

    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('should show invalid state for add-more instances with validation errors on mount', () => {
    const validations = [constants.validations.mandatory];
    render(
      <TextBox
        formFieldPath="test1.1/1-1"
        onChange={mockOnChange}
        validate={false}
        validateForm={false}
        validations={validations}
      />
    );

    expect(screen.getByRole('textbox')).toHaveClass('cds--text-area--invalid');
  });

  it('should show invalid state when validate changes to true with mandatory field and no value', () => {
    const validations = [constants.validations.mandatory];
    const { rerender } = render(
      <TextBox
        formFieldPath="test1.1/1-0"
        onChange={mockOnChange}
        validate={false}
        validateForm={false}
        validations={validations}
      />
    );

    mockOnChange.mockClear();

    rerender(
      <TextBox
        formFieldPath="test1.1/1-0"
        onChange={mockOnChange}
        validate={true}
        validateForm={false}
        validations={validations}
      />
    );

    expect(screen.getByRole('textbox')).toHaveClass('cds--text-area--invalid');
  });

  it('should not call onChange when validate changes to true', () => {
    const validations = [constants.validations.mandatory];
    const { rerender } = render(
      <TextBox
        formFieldPath="test1.1/1-0"
        onChange={mockOnChange}
        validate={false}
        validateForm={false}
        validations={validations}
      />
    );

    mockOnChange.mockClear();

    rerender(
      <TextBox
        formFieldPath="test1.1/1-0"
        onChange={mockOnChange}
        validate={true}
        validateForm={false}
        validations={validations}
      />
    );

    expect(mockOnChange).not.toHaveBeenCalled();
  });
});
