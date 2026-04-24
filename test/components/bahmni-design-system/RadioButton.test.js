import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { RadioButton } from 'components/bahmni-design-system/RadioButton';
import constants from 'src/constants';

describe('Carbon RadioButton', () => {
  const options = [
    { name: 'Yes', value: true },
    { name: 'No', value: false },
  ];

  let mockOnValueChange;

  beforeEach(() => {
    mockOnValueChange = jest.fn();
  });

  it('should render radio buttons for each option', () => {
    render(
      <RadioButton
        conceptUuid="test-uuid"
        formFieldPath="test1.1/1-0"
        onValueChange={mockOnValueChange}
        options={options}
        validate={false}
        validateForm={false}
        validations={[]}
      />
    );

    const radioInputs = screen.getAllByRole('radio');
    expect(radioInputs).toHaveLength(2);
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
  });

  it('should render radio button with selected value', () => {
    render(
      <RadioButton
        conceptUuid="test-uuid"
        formFieldPath="test1.1/1-0"
        onValueChange={mockOnValueChange}
        options={options}
        validate={false}
        validateForm={false}
        validations={[]}
        value={true}
      />
    );

    const radioInputs = screen.getAllByRole('radio');
    expect(radioInputs[0]).toBeChecked();
    expect(radioInputs[1]).not.toBeChecked();
  });

  it('should call onValueChange with value when radio button is clicked', () => {
    render(
      <RadioButton
        conceptUuid="test-uuid"
        formFieldPath="test1.1/1-0"
        onValueChange={mockOnValueChange}
        options={options}
        validate={false}
        validateForm={false}
        validations={[]}
      />
    );

    const noOption = screen.getByText('No');
    fireEvent.click(noOption);

    expect(mockOnValueChange).toHaveBeenCalledWith(false, []);
  });

  it('should show error class when validation fails', () => {
    const { container } = render(
      <RadioButton
        conceptUuid="test-uuid"
        formFieldPath="test1.1/1-1"
        onValueChange={mockOnValueChange}
        options={options}
        validate
        validateForm={false}
        validations={[constants.validations.mandatory]}
      />
    );

    expect(container.firstChild).toHaveClass('form-builder-error');
  });

  it('should not show error class when formFieldPath suffix is 0', () => {
    const { container } = render(
      <RadioButton
        conceptUuid="test-uuid"
        formFieldPath="test1.1/1-0"
        onValueChange={mockOnValueChange}
        options={options}
        validate={false}
        validateForm={false}
        validations={[constants.validations.mandatory]}
      />
    );

    expect(container.firstChild).not.toHaveClass('form-builder-error');
  });

  it('should work with custom nameKey and valueKey', () => {
    const customOptions = [
      { label: 'Option 1', id: 'opt-1' },
      { label: 'Option 2', id: 'opt-2' },
    ];

    render(
      <RadioButton
        conceptUuid="test-uuid"
        formFieldPath="test1.1/1-0"
        nameKey="label"
        valueKey="id"
        onValueChange={mockOnValueChange}
        options={customOptions}
        validate={false}
        validateForm={false}
        validations={[]}
        value="opt-1"
      />
    );

    const radioInputs = screen.getAllByRole('radio');
    expect(radioInputs[0]).toBeChecked();
    expect(screen.getByText('Option 1')).toBeInTheDocument();
  });

  it('should change selection when a different radio button is clicked', () => {
    const { rerender } = render(
      <RadioButton
        conceptUuid="test-uuid"
        formFieldPath="test1.1/1-0"
        onValueChange={mockOnValueChange}
        options={options}
        validate={false}
        validateForm={false}
        validations={[]}
        value={true}
      />
    );

    let radioInputs = screen.getAllByRole('radio');
    expect(radioInputs[0]).toBeChecked();
    expect(radioInputs[1]).not.toBeChecked();

    fireEvent.click(screen.getByText('No'));
    expect(mockOnValueChange).toHaveBeenCalledWith(false, []);

    rerender(
      <RadioButton
        conceptUuid="test-uuid"
        formFieldPath="test1.1/1-0"
        onValueChange={mockOnValueChange}
        options={options}
        validate={false}
        validateForm={false}
        validations={[]}
        value={false}
      />
    );

    radioInputs = screen.getAllByRole('radio');
    expect(radioInputs[0]).not.toBeChecked();
    expect(radioInputs[1]).toBeChecked();
  });
});
