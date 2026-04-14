import React from 'react';
import { action } from '@storybook/addon-actions';
import { AddMore } from 'src/components/AddMore.jsx';

export default {
  title: 'Simple Controls',
  component: AddMore,
};

export const AddMoreWithAddButton = {
  render: () => (
    <AddMore canAdd={true} canRemove={false} onAdd={action('add-clicked')} onRemove={action('delete-clicked')} />
  ),
};

export const AddMoreWithDeleteButton = {
  render: () => (
    <AddMore canAdd={false} canRemove={true} onAdd={action('add-clicked')} onRemove={action('delete-clicked')} />
  ),
};

export const AddMoreWithAddAndDeleteButton = {
  render: () => (
    <AddMore canAdd={true} canRemove={true} onAdd={action('add-clicked')} onRemove={action('delete-clicked')} />
  ),
};
