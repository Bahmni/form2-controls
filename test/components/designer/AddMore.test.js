import React from 'react';
import { render, screen } from '@testing-library/react';
import { AddMoreDesigner } from 'src/components/designer/AddMore.jsx';

describe('AddMore', () => {
  it('should render AddMore designer component', () => {
    render(<AddMoreDesigner />);

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);
    expect(screen.getByLabelText('Add')).toBeInTheDocument();
    expect(screen.getByLabelText('Remove')).toBeInTheDocument();
  });
});
