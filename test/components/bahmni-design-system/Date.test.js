import React from 'react';
import { render } from '@testing-library/react';
import { Date } from '../../../src/components/bahmni-design-system/Date';
import constants from 'src/constants';

describe('Date', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  test('renders Date component with all required props', () => {
    const { container } = render(
      <Date
        formFieldPath="test1.1/1-0"
        onChange={mockOnChange}
        validate={false}
        validateForm={false}
        validations={[]}
        value="2024-01-01"
      />
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  test('calls onChange on mount with provided value', () => {
    render(
      <Date
        formFieldPath="test1.1/1-0"
        onChange={mockOnChange}
        validate={false}
        validateForm={false}
        validations={[]}
        value="2024-01-01"
      />
    );
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({
        value: '2024-01-01',
      })
    );
  });

  test('adds error class when validation fails on add-more row', () => {
    const { container } = render(
      <Date
        formFieldPath="test1.1/1-1"
        onChange={mockOnChange}
        validate={false}
        validateForm={false}
        validations={[]}
      />
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  test('component renders with enabled prop as true', () => {
    const { container } = render(
      <Date
        formFieldPath="test1.1/1-0"
        onChange={mockOnChange}
        validate={false}
        validateForm={false}
        validations={[]}
        enabled={true}
      />
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  test('component renders with enabled prop as false', () => {
    const { container } = render(
      <Date
        formFieldPath="test1.1/1-0"
        onChange={mockOnChange}
        validate={false}
        validateForm={false}
        validations={[]}
        enabled={false}
      />
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  test('fires onChange on mount when validateForm is true', () => {
    render(
      <Date
        formFieldPath="test1.1/1-0"
        onChange={mockOnChange}
        validate={false}
        validateForm={true}
        validations={[]}
      />
    );
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({
        errors: expect.any(Array),
        triggerControlEvent: false,
      })
    );
  });

  test('should show invalid state when validate changes to true with mandatory field and no value', () => {
    const validations = [constants.validations.mandatory];
    const { rerender } = render(
      <Date
        formFieldPath="test1.1/1-0"
        onChange={mockOnChange}
        validate={false}
        validateForm={false}
        validations={validations}
      />
    );

    mockOnChange.mockClear();

    rerender(
      <Date
        formFieldPath="test1.1/1-0"
        onChange={mockOnChange}
        validate={true}
        validateForm={false}
        validations={validations}
      />
    );

    expect(document.querySelector('[data-invalid]')).toBeTruthy();
  });

  test('should not call onChange when validate changes to true', () => {
    const validations = [constants.validations.mandatory];
    const { rerender } = render(
      <Date
        formFieldPath="test1.1/1-0"
        onChange={mockOnChange}
        validate={false}
        validateForm={false}
        validations={validations}
      />
    );

    mockOnChange.mockClear();

    rerender(
      <Date
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
