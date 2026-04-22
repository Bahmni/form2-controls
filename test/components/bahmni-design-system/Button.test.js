import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from 'components/bahmni-design-system/Button';
import constants from 'src/constants';

describe('Carbon Button', () => {
  let mockOnValueChange;
  const options = [
    { name: 'Yes', value: 'yes' },
    { name: 'No', value: 'no' },
    { name: 'Unknown', value: 'unknown' },
  ];

  beforeEach(() => {
    mockOnValueChange = jest.fn();
  });

  it('should render a SelectableTag for each option', () => {
    render(
      <Button
        formFieldPath="test1.1/1-0"
        onValueChange={mockOnValueChange}
        options={options}
        validate={false}
        validateForm={false}
        validations={[]}
      />
    );

    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
    expect(screen.getByText('Unknown')).toBeInTheDocument();
  });

  it('should show selected state for the active option (single select)', () => {
    render(
      <Button
        formFieldPath="test1.1/1-0"
        onValueChange={mockOnValueChange}
        options={options}
        validate={false}
        validateForm={false}
        validations={[]}
        value={options[0]}
      />
    );

    const yesTag = screen.getByText('Yes').closest('button');
    expect(yesTag).toHaveAttribute('aria-pressed', 'true');
  });

  it('should call onValueChange when a tag is clicked', () => {
    render(
      <Button
        formFieldPath="test1.1/1-0"
        onValueChange={mockOnValueChange}
        options={options}
        validate={false}
        validateForm={false}
        validations={[]}
      />
    );

    fireEvent.click(screen.getByText('Yes').closest('button'));
    expect(mockOnValueChange).toHaveBeenCalledWith(options[0], []);
  });

  it('should deselect the option when an already selected option is clicked (single select)', () => {
    render(
      <Button
        formFieldPath="test1.1/1-0"
        onValueChange={mockOnValueChange}
        options={options}
        validate={false}
        validateForm={false}
        validations={[]}
        value={options[0]}
      />
    );

    fireEvent.click(screen.getByText('Yes').closest('button'));
    expect(mockOnValueChange).toHaveBeenCalledWith(undefined, []);
  });

  it('should support multi-select — selecting multiple options', () => {
    render(
      <Button
        formFieldPath="test1.1/1-0"
        multiSelect
        onValueChange={mockOnValueChange}
        options={options}
        validate={false}
        validateForm={false}
        validations={[]}
        value={[options[0]]}
      />
    );

    fireEvent.click(screen.getByText('No').closest('button'));
    expect(mockOnValueChange).toHaveBeenCalledWith([options[0], options[1]], []);
  });

  it('should deselect one option in multi-select without clearing others', () => {
    render(
      <Button
        formFieldPath="test1.1/1-0"
        multiSelect
        onValueChange={mockOnValueChange}
        options={options}
        validate={false}
        validateForm={false}
        validations={[]}
        value={[options[0], options[1]]}
      />
    );

    fireEvent.click(screen.getByText('Yes').closest('button'));
    expect(mockOnValueChange).toHaveBeenCalledWith([options[1]], []);
  });

  it('should disable all tags when enabled is false', () => {
    render(
      <Button
        enabled={false}
        formFieldPath="test1.1/1-0"
        onValueChange={mockOnValueChange}
        options={options}
        validate={false}
        validateForm={false}
        validations={[]}
      />
    );

    const buttons = screen.getAllByRole('button');
    buttons.forEach((btn) => expect(btn).toBeDisabled());
  });

  it('should apply form-builder-error class when there are errors', () => {
    const validations = [constants.validations.mandatory];
    const { container } = render(
      <Button
        formFieldPath="test1.1/1-1"
        onValueChange={mockOnValueChange}
        options={options}
        validate={false}
        validateForm={false}
        validations={validations}
      />
    );

    expect(container.firstChild).toHaveClass('form-builder-error');
  });

  it('should use conceptUuid as container id', () => {
    const { container } = render(
      <Button
        conceptUuid="concept-uuid-btn"
        formFieldPath="test1.1/1-0"
        onValueChange={mockOnValueChange}
        options={options}
        validate={false}
        validateForm={false}
        validations={[]}
      />
    );

    expect(container.querySelector('#concept-uuid-btn')).toBeInTheDocument();
  });

  it('should call onValueChange on mount when value is defined', () => {
    render(
      <Button
        formFieldPath="test1.1/1-0"
        onValueChange={mockOnValueChange}
        options={options}
        validate={false}
        validateForm={false}
        validations={[]}
        value={options[0]}
      />
    );

    expect(mockOnValueChange).toHaveBeenCalledWith(options[0], [], true);
  });
});
