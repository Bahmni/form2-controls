import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FreeTextAutoComplete } from 'components/bahmni-design-system/FreeTextAutoComplete';
import constants from 'src/constants';

describe('Carbon FreeTextAutoComplete', () => {
  let mockOnChange;
  const options = ['Option 1', 'Option 2', 'Option 3'];

  beforeEach(() => {
    mockOnChange = jest.fn();
  });

  it('should render a combobox input', () => {
    render(
      <FreeTextAutoComplete
        formFieldPath="test1.1/1-0"
        onChange={mockOnChange}
        options={options}
        validate={false}
        validateForm={false}
        validations={[]}
      />
    );

    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('should render with initial value', () => {
    render(
      <FreeTextAutoComplete
        formFieldPath="test1.1/1-0"
        onChange={mockOnChange}
        options={options}
        validate={false}
        validateForm={false}
        validations={[]}
        value="Option 1"
      />
    );

    expect(screen.getByRole('combobox')).toHaveValue('Option 1');
  });

  it('should be disabled when enabled is false', () => {
    render(
      <FreeTextAutoComplete
        enabled={false}
        formFieldPath="test1.1/1-0"
        onChange={mockOnChange}
        options={options}
        validate={false}
        validateForm={false}
        validations={[]}
      />
    );

    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('should call onChange on mount when validateForm is true', () => {
    render(
      <FreeTextAutoComplete
        formFieldPath="test1.1/1-0"
        onChange={mockOnChange}
        options={options}
        validate={false}
        validateForm
        validations={[]}
      />
    );

    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: undefined, errors: [] })
    );
  });

  it('should call onChange on mount when value is provided', () => {
    render(
      <FreeTextAutoComplete
        formFieldPath="test1.1/1-0"
        onChange={mockOnChange}
        options={options}
        validate={false}
        validateForm={false}
        validations={[]}
        value="Option 1"
      />
    );

    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: 'Option 1', errors: [] })
    );
  });

  it('should not call onChange on mount when value is undefined and no errors', () => {
    render(
      <FreeTextAutoComplete
        formFieldPath="test1.1/1-0"
        onChange={mockOnChange}
        options={options}
        validate={false}
        validateForm={false}
        validations={[]}
      />
    );

    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('should show invalid state for add-more instances with mandatory error on mount', () => {
    const validations = [constants.validations.mandatory];
    render(
      <FreeTextAutoComplete
        formFieldPath="test1.1/1-1"
        onChange={mockOnChange}
        options={options}
        validate={false}
        validateForm={false}
        validations={validations}
      />
    );

    expect(document.querySelector('[data-invalid]')).toBeTruthy();
  });

  it('should use conceptUuid as the combobox id', () => {
    const { container } = render(
      <FreeTextAutoComplete
        conceptUuid="my-freetext-uuid"
        formFieldPath="test1.1/1-0"
        onChange={mockOnChange}
        options={options}
        validate={false}
        validateForm={false}
        validations={[]}
      />
    );

    expect(container.querySelector('#my-freetext-uuid')).toBeInTheDocument();
  });

  it('should fall back to free-text-autocomplete id when conceptUuid is not provided', () => {
    const { container } = render(
      <FreeTextAutoComplete
        formFieldPath="test1.1/1-0"
        onChange={mockOnChange}
        options={options}
        validate={false}
        validateForm={false}
        validations={[]}
      />
    );

    expect(container.querySelector('#free-text-autocomplete')).toBeInTheDocument();
  });
});
