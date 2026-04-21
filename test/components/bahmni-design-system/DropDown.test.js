import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DropDown } from 'components/bahmni-design-system/DropDown';
import constants from 'src/constants';

describe('Carbon DropDown', () => {
  let mockOnValueChange;
  const options = [
    { name: 'Option A', uuid: 'uuid-a' },
    { name: 'Option B', uuid: 'uuid-b' },
  ];

  beforeEach(() => {
    mockOnValueChange = jest.fn();
  });

  it('should render a combobox', () => {
    render(
      <DropDown
        formFieldPath="test1.1/1-0"
        onValueChange={mockOnValueChange}
        options={options}
        validate={false}
        validateForm={false}
        validations={[]}
      />
    );

    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('should render option names via itemToString', () => {
    render(
      <DropDown
        formFieldPath="test1.1/1-0"
        onValueChange={mockOnValueChange}
        options={options}
        validate={false}
        validateForm={false}
        validations={[]}
        value={options[0]}
      />
    );

    expect(screen.getByText('Option A')).toBeInTheDocument();
  });

  it('should be disabled when enabled is false', () => {
    render(
      <DropDown
        enabled={false}
        formFieldPath="test1.1/1-0"
        onValueChange={mockOnValueChange}
        options={options}
        validate={false}
        validateForm={false}
        validations={[]}
      />
    );

    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('should call onValueChange on mount when value is defined', () => {
    render(
      <DropDown
        formFieldPath="test1.1/1-0"
        onValueChange={mockOnValueChange}
        options={options}
        validate={false}
        validateForm={false}
        validations={[]}
        value={options[0]}
      />
    );

    expect(mockOnValueChange).toHaveBeenCalledWith(options[0], []);
  });

  it('should not call onValueChange on mount when value is undefined and no errors', () => {
    render(
      <DropDown
        formFieldPath="test1.1/1-0"
        onValueChange={mockOnValueChange}
        options={options}
        validate={false}
        validateForm={false}
        validations={[]}
      />
    );

    expect(mockOnValueChange).not.toHaveBeenCalled();
  });

  it('should show invalid state for add-more instances with mandatory error on mount', () => {
    const validations = [constants.validations.mandatory];
    render(
      <DropDown
        formFieldPath="test1.1/1-1"
        onValueChange={mockOnValueChange}
        options={options}
        validate={false}
        validateForm={false}
        validations={validations}
      />
    );

    expect(screen.getByRole('combobox').closest('[data-invalid]') ||
      document.querySelector('[data-invalid]')).toBeTruthy();
  });

  it('should use conceptUuid as the dropdown id', () => {
    const { container } = render(
      <DropDown
        conceptUuid="my-concept-uuid"
        formFieldPath="test1.1/1-0"
        onValueChange={mockOnValueChange}
        options={options}
        validate={false}
        validateForm={false}
        validations={[]}
      />
    );

    expect(container.querySelector('#my-concept-uuid')).toBeInTheDocument();
  });

  it('should fall back to dropdown id when conceptUuid is not provided', () => {
    const { container } = render(
      <DropDown
        formFieldPath="test1.1/1-0"
        onValueChange={mockOnValueChange}
        options={options}
        validate={false}
        validateForm={false}
        validations={[]}
      />
    );

    expect(container.querySelector('#dropdown')).toBeInTheDocument();
  });

  it('should call onValueChange on mount when validateForm is true', () => {
    render(
      <DropDown
        formFieldPath="test1.1/1-0"
        onValueChange={mockOnValueChange}
        options={options}
        validate={false}
        validateForm
        validations={[]}
      />
    );

    expect(mockOnValueChange).toHaveBeenCalledWith(undefined, []);
  });

  it('should display selected item label in the trigger button', () => {
    render(
      <DropDown
        formFieldPath="test1.1/1-0"
        onValueChange={mockOnValueChange}
        options={options}
        validate={false}
        validateForm={false}
        validations={[]}
        value={options[0]}
      />
    );

    expect(screen.getByText('Option A')).toBeInTheDocument();
  });
});
