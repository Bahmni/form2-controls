import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AddMore } from 'src/components/AddMore.jsx';

describe('AddMore', () => {
  let mockOnAdd;
  let mockOnRemove;

  beforeEach(() => {
    mockOnAdd = jest.fn();
    mockOnRemove = jest.fn();
  });

  it('should render both add and remove buttons with proper callbacks', () => {
    render(<AddMore canAdd canRemove onAdd={mockOnAdd} onRemove={mockOnRemove} />);

    expect(screen.getByLabelText('Add')).toBeInTheDocument();
    expect(screen.getByLabelText('Remove')).toBeInTheDocument();
  });

  it('should not render add button when canAdd is false', () => {
    render(<AddMore canAdd={false} canRemove onAdd={mockOnAdd} onRemove={mockOnRemove} />);

    expect(screen.queryByLabelText('Add')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Remove')).toBeInTheDocument();
  });

  it('should not render remove button when canRemove is false', () => {
    render(<AddMore canAdd canRemove={false} onAdd={mockOnAdd} onRemove={mockOnRemove} />);

    expect(screen.getByLabelText('Add')).toBeInTheDocument();
    expect(screen.queryByLabelText('Remove')).not.toBeInTheDocument();
  });

  it('should call correct callbacks on button clicks', async () => {
    render(<AddMore canAdd canRemove onAdd={mockOnAdd} onRemove={mockOnRemove} />);

    await userEvent.click(screen.getByLabelText('Add'));
    expect(mockOnAdd).toHaveBeenCalledTimes(1);

    await userEvent.click(screen.getByLabelText('Remove'));
    expect(mockOnRemove).toHaveBeenCalledTimes(1);
  });

  it('should enable plus & remove buttons when enabled is true', () => {
    render(<AddMore canAdd canRemove onAdd={mockOnAdd} onRemove={mockOnRemove} />);

    expect(screen.getByLabelText('Add')).not.toBeDisabled();
    expect(screen.getByLabelText('Remove')).not.toBeDisabled();
  });

  it('should disable plus & remove buttons when enabled is false', () => {
    render(<AddMore canAdd canRemove enabled={false} onAdd={mockOnAdd} onRemove={mockOnRemove} />);

    expect(screen.getByLabelText('Add')).toBeDisabled();
    expect(screen.getByLabelText('Remove')).toBeDisabled();
  });
});
