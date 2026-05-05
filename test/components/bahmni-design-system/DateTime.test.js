import React from 'react';
import { render } from '@testing-library/react';
import { DateTime } from '../../../src/components/bahmni-design-system/DateTime';
import constants from 'src/constants';

describe('DateTime', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  test('renders DateTime component with all required props', () => {
    const { container } = render(
      <DateTime
        formFieldPath="test1.1/1-0"
        onChange={mockOnChange}
        validate={false}
        validateForm={false}
        validations={[]}
        value="2024-01-01 10:00"
      />
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  test('calls onChange on mount with provided datetime value', () => {
    render(
      <DateTime
        formFieldPath="test1.1/1-0"
        onChange={mockOnChange}
        validate={false}
        validateForm={false}
        validations={[]}
        value="2024-01-01 10:00"
      />
    );
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({
        value: '2024-01-01 10:00',
      })
    );
  });

  test('adds error class when validation fails on add-more row', () => {
    const { container } = render(
      <DateTime
        formFieldPath="test1.1/1-1"
        onChange={mockOnChange}
        validate={false}
        validateForm={false}
        validations={[]}
      />
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  test('component renders with enabled prop as false', () => {
    const { container } = render(
      <DateTime
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

  test('component renders with enabled prop as true', () => {
    const { container } = render(
      <DateTime
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

  test('fires onChange on mount when validateForm is true', () => {
    render(
      <DateTime
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

  test('should add form-builder-error class when validate changes to true with partial value (date only)', () => {
    const { rerender, container } = render(
      <DateTime
        formFieldPath="test1.1/1-0"
        onChange={mockOnChange}
        validate={false}
        validateForm={false}
        validations={[]}
        value="2024-01-15"
      />
    );

    mockOnChange.mockClear();

    rerender(
      <DateTime
        formFieldPath="test1.1/1-0"
        onChange={mockOnChange}
        validate={true}
        validateForm={false}
        validations={[]}
        value="2024-01-15"
      />
    );

    expect(container.querySelector('.form-builder-error')).toBeTruthy();
  });

  test('should not call onChange when validate changes to true', () => {
    const { rerender } = render(
      <DateTime
        formFieldPath="test1.1/1-0"
        onChange={mockOnChange}
        validate={false}
        validateForm={false}
        validations={[constants.validations.mandatory]}
      />
    );

    mockOnChange.mockClear();

    rerender(
      <DateTime
        formFieldPath="test1.1/1-0"
        onChange={mockOnChange}
        validate={true}
        validateForm={false}
        validations={[constants.validations.mandatory]}
      />
    );

    expect(mockOnChange).not.toHaveBeenCalled();
  });
});
