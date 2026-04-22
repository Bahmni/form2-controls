import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

  describe('Single-select (Dropdown)', () => {
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

    it('should call onValueChange with selected item and no errors when option is clicked', () => {
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

      fireEvent.click(screen.getByRole('combobox'));
      fireEvent.click(screen.getByText('Option B'));

      expect(mockOnValueChange).toHaveBeenCalledWith(options[1], []);
    });

    it('should not crash when formFieldPath is undefined', () => {
      expect(() =>
        render(
          <DropDown
            onValueChange={mockOnValueChange}
            options={options}
            validate={false}
            validateForm={false}
            validations={[]}
          />
        )
      ).not.toThrow();
    });

    it('should treat add-more instance (formFieldPath index !== 0) as created by add-more', () => {
      const validations = [constants.validations.mandatory];
      render(
        <DropDown
          formFieldPath="test1.1/1-2"
          onValueChange={mockOnValueChange}
          options={options}
          validate={false}
          validateForm={false}
          validations={validations}
        />
      );

      expect(mockOnValueChange).toHaveBeenCalledWith(undefined, expect.arrayContaining([
        expect.objectContaining({ message: constants.validations.mandatory }),
      ]));
    });
  });

  describe('Multi-select (FilterableMultiSelect)', () => {
    const multiSelectProps = {
      multiSelect: true,
      onValueChange: undefined,
      options,
      validate: false,
      validateForm: false,
      validations: [],
    };

    beforeEach(() => {
      multiSelectProps.onValueChange = mockOnValueChange;
    });

    it('should render a combobox input for filtering', () => {
      render(
        <DropDown
          {...multiSelectProps}
          formFieldPath="test1.1/1-0"
        />
      );

      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('should display a count tag for pre-selected items', () => {
      render(
        <DropDown
          {...multiSelectProps}
          formFieldPath="test1.1/1-0"
          value={[options[0], options[1]]}
        />
      );

      const countTag = document.querySelector('.cds--tag__label');
      expect(countTag).toBeInTheDocument();
      expect(countTag.title).toBe('2');
    });

    it('should be disabled when enabled is false', () => {
      render(
        <DropDown
          {...multiSelectProps}
          enabled={false}
          formFieldPath="test1.1/1-0"
        />
      );

      expect(screen.getByRole('combobox')).toBeDisabled();
    });

    it('should call onValueChange on mount when value array is defined', () => {
      render(
        <DropDown
          {...multiSelectProps}
          formFieldPath="test1.1/1-0"
          value={[options[0]]}
        />
      );

      expect(mockOnValueChange).toHaveBeenCalledWith([options[0]], []);
    });

    it('should not call onValueChange on mount when value is undefined and no errors', () => {
      render(
        <DropDown
          {...multiSelectProps}
          formFieldPath="test1.1/1-0"
        />
      );

      expect(mockOnValueChange).not.toHaveBeenCalled();
    });

    it('should call onValueChange with selectedItems array when selection changes', async () => {
      const user = userEvent.setup();
      render(
        <DropDown
          {...multiSelectProps}
          formFieldPath="test1.1/1-0"
        />
      );

      await user.click(screen.getByRole('button', { name: 'Open' }));
      await user.click(screen.getByRole('option', { name: /Option A/ }));

      expect(mockOnValueChange).toHaveBeenCalledWith(
        expect.arrayContaining([expect.objectContaining({ name: 'Option A' })]),
        []
      );
    });

    it('should show invalid state for add-more instance with mandatory error', () => {
      const validations = [constants.validations.mandatory];
      render(
        <DropDown
          {...multiSelectProps}
          formFieldPath="test1.1/1-1"
          validations={validations}
        />
      );

      expect(document.querySelector('[data-invalid]')).toBeTruthy();
    });

    it('should use conceptUuid as the component id', () => {
      const { container } = render(
        <DropDown
          {...multiSelectProps}
          conceptUuid="multi-concept-uuid"
          formFieldPath="test1.1/1-0"
        />
      );

      expect(container.querySelector('#multi-concept-uuid')).toBeInTheDocument();
    });

    it('should fall back to dropdown id when conceptUuid is not provided', () => {
      const { container } = render(
        <DropDown
          {...multiSelectProps}
          formFieldPath="test1.1/1-0"
        />
      );

      expect(container.querySelector('#dropdown')).toBeInTheDocument();
    });

    it('should call onValueChange on mount when validateForm is true', () => {
      render(
        <DropDown
          {...multiSelectProps}
          formFieldPath="test1.1/1-0"
          validateForm
        />
      );

      expect(mockOnValueChange).toHaveBeenCalledWith(undefined, []);
    });

    it('should not crash when formFieldPath is undefined', () => {
      expect(() =>
        render(
          <DropDown
            {...multiSelectProps}
          />
        )
      ).not.toThrow();
    });

    it('should default selectedItems to empty array when value is undefined', () => {
      render(
        <DropDown
          {...multiSelectProps}
          formFieldPath="test1.1/1-0"
          value={undefined}
        />
      );

      // No tags should be shown for an empty selection
      expect(screen.queryByText('Option A')).not.toBeInTheDocument();
      expect(screen.queryByText('Option B')).not.toBeInTheDocument();
    });
  });
});
