import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { RadioButton } from "components/bahmni-design-system/RadioButton";
import constants from "src/constants";

describe("Carbon RadioButton", () => {
  const options = [
    { name: "Yes", value: true },
    { name: "No", value: false },
  ];

  let mockOnValueChange;

  beforeEach(() => {
    mockOnValueChange = jest.fn();
  });

  it("should render radio buttons for each option", () => {
    render(
      <RadioButton
        conceptUuid="test-uuid"
        formFieldPath="test1.1/1-0"
        onValueChange={mockOnValueChange}
        options={options}
        validate={false}
        validateForm={false}
        validations={[]}
      />,
    );

    const radioInputs = screen.getAllByRole("radio");
    expect(radioInputs).toHaveLength(2);
    expect(screen.getByText("Yes")).toBeInTheDocument();
    expect(screen.getByText("No")).toBeInTheDocument();
  });

  it("should render radio button with selected value", () => {
    render(
      <RadioButton
        conceptUuid="test-uuid"
        formFieldPath="test1.1/1-0"
        onValueChange={mockOnValueChange}
        options={options}
        validate={false}
        validateForm={false}
        validations={[]}
        value={{ name: "Yes", value: true }}
      />,
    );

    const radioInputs = screen.getAllByRole("radio");
    expect(radioInputs[0]).toBeChecked();
    expect(radioInputs[1]).not.toBeChecked();
  });

  it("should call onValueChange with full option when clicked", () => {
    render(
      <RadioButton
        conceptUuid="test-uuid"
        formFieldPath="test1.1/1-0"
        onValueChange={mockOnValueChange}
        options={options}
        validate={false}
        validateForm={false}
        validations={[]}
      />,
    );

    const noOption = screen.getByText("No");
    fireEvent.click(noOption);

    expect(mockOnValueChange).toHaveBeenCalledWith(
      { name: "No", value: false },
      [],
    );
  });

  it("should show error class when validation fails", () => {
    const { container } = render(
      <RadioButton
        conceptUuid="test-uuid"
        formFieldPath="test1.1/1-1"
        onValueChange={mockOnValueChange}
        options={options}
        validate
        validateForm={false}
        validations={[constants.validations.mandatory]}
      />,
    );

    expect(container.firstChild).toHaveClass("form-builder-error");
  });

  it("should not show error class when formFieldPath suffix is 0", () => {
    const { container } = render(
      <RadioButton
        conceptUuid="test-uuid"
        formFieldPath="test1.1/1-0"
        onValueChange={mockOnValueChange}
        options={options}
        validate={false}
        validateForm={false}
        validations={[constants.validations.mandatory]}
      />,
    );

    expect(container.firstChild).not.toHaveClass("form-builder-error");
  });

  it("should use conceptUuid as container id", () => {
    const { container } = render(
      <RadioButton
        conceptUuid="test-uuid"
        formFieldPath="test1.1/1-0"
        onValueChange={mockOnValueChange}
        options={options}
        validate={false}
        validateForm={false}
        validations={[]}
      />,
    );

    expect(container.querySelector("#test-uuid")).toBeInTheDocument();
  });

  it("should disable radio buttons when enabled is false", () => {
    render(
      <RadioButton
        conceptUuid="test-uuid"
        formFieldPath="test1.1/1-0"
        onValueChange={mockOnValueChange}
        options={options}
        enabled={false}
        validate={false}
        validateForm={false}
        validations={[]}
      />,
    );

    const radioInputs = screen.getAllByRole("radio");
    radioInputs.forEach((input) => expect(input).toBeDisabled());
  });

  it("should call onValueChange on mount when value is defined", () => {
    const value = { name: "Yes", value: true };
    render(
      <RadioButton
        conceptUuid="test-uuid"
        formFieldPath="test1.1/1-0"
        onValueChange={mockOnValueChange}
        options={options}
        validate={false}
        validateForm={false}
        validations={[]}
        value={value}
      />,
    );

    expect(mockOnValueChange).toHaveBeenCalledWith(value, [], true);
  });

  it("should call onValueChange on mount when validateForm is true", () => {
    render(
      <RadioButton
        conceptUuid="test-uuid"
        formFieldPath="test1.1/1-0"
        onValueChange={mockOnValueChange}
        options={options}
        validate={false}
        validateForm
        validations={[]}
      />,
    );

    expect(mockOnValueChange).toHaveBeenCalledWith(undefined, [], true);
  });

  it("should not crash when formFieldPath is undefined", () => {
    expect(() =>
      render(
        <RadioButton
          conceptUuid="test-uuid"
          onValueChange={mockOnValueChange}
          options={options}
          validate={false}
          validateForm={false}
          validations={[]}
        />,
      ),
    ).not.toThrow();
  });

  it("should change selection when a different radio button is clicked", () => {
    const { rerender } = render(
      <RadioButton
        conceptUuid="test-uuid"
        formFieldPath="test1.1/1-0"
        onValueChange={mockOnValueChange}
        options={options}
        validate={false}
        validateForm={false}
        validations={[]}
        value={{ name: "Yes", value: true }}
      />,
    );

    let radioInputs = screen.getAllByRole("radio");
    expect(radioInputs[0]).toBeChecked();
    expect(radioInputs[1]).not.toBeChecked();

    fireEvent.click(screen.getByText("No"));
    expect(mockOnValueChange).toHaveBeenCalledWith(
      { name: "No", value: false },
      [],
    );

    rerender(
      <RadioButton
        conceptUuid="test-uuid"
        formFieldPath="test1.1/1-0"
        onValueChange={mockOnValueChange}
        options={options}
        validate={false}
        validateForm={false}
        validations={[]}
        value={{ name: "No", value: false }}
      />,
    );

    radioInputs = screen.getAllByRole("radio");
    expect(radioInputs[0]).not.toBeChecked();
    expect(radioInputs[1]).toBeChecked();
  });
});
