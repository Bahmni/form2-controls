import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import NotificationContainer from 'src/helpers/Notification.js';

describe('NotificationContainer', () => {
  it('renders notification message with correct structure', () => {
    const notification = { message: 'Success message', type: 'success' };
    render(<NotificationContainer notification={notification} />);

    expect(screen.getByText('Success message')).toBeInTheDocument();
    expect(screen.getByText('Success message').closest('.message-text')).toBeInTheDocument();
  });

  it('renders close button when onClose prop is provided', () => {
    const notification = { message: 'Test message', type: 'success' };
    const onClose = jest.fn();
    const { container } = render(<NotificationContainer notification={notification} onClose={onClose} />);

    const closeButton = container.querySelector('.notification-close-btn');
    expect(closeButton).toBeInTheDocument();
    expect(closeButton.querySelector('.fa.fa-times')).toBeInTheDocument();
  });

  it('does not render close button when onClose prop is not provided', () => {
    const notification = { message: 'Test message', type: 'success' };
    const { container } = render(<NotificationContainer notification={notification} />);

    const closeButton = container.querySelector('.notification-close-btn');
    expect(closeButton).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const notification = { message: 'Test message', type: 'success' };
    const onClose = jest.fn();
    const { container } = render(<NotificationContainer notification={notification} onClose={onClose} />);

    const closeButton = container.querySelector('.notification-close-btn');
    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('close button has proper accessibility attributes', () => {
    const notification = { message: 'Test message', type: 'success' };
    const onClose = jest.fn();
    const { container } = render(<NotificationContainer notification={notification} onClose={onClose} />);

    const closeButton = container.querySelector('.notification-close-btn');
    expect(closeButton).toHaveAttribute('aria-label', 'Close notification');
    expect(closeButton).toHaveAttribute('type', 'button');
  });

  it('applies correct CSS classes based on notification type', () => {
    const notification = { message: 'Error occurred', type: 'error' };
    const { container } = render(<NotificationContainer notification={notification} />);

    expect(container.querySelector('.message-container.error-message-container')).toBeInTheDocument();
    expect(container.querySelector('.message-icon.error')).toBeInTheDocument();
  });

  it('renders check-circle icon', () => {
    const notification = { message: 'Test message', type: 'info' };
    const { container } = render(<NotificationContainer notification={notification} />);

    expect(container.querySelector('.fa.fa-check-circle')).toBeInTheDocument();
  });

  it('renders empty div when message is empty string', () => {
    const notification = { message: '', type: 'success' };
    const { container } = render(<NotificationContainer notification={notification} />);

    expect(container.firstChild).toEqual(expect.any(HTMLDivElement));
    expect(container.firstChild.children).toHaveLength(0);
  });

  it('renders empty div when message is null', () => {
    const notification = { message: null, type: 'success' };
    const { container } = render(<NotificationContainer notification={notification} />);

    expect(container.firstChild).toEqual(expect.any(HTMLDivElement));
    expect(container.firstChild.children).toHaveLength(0);
  });

  it('renders empty div when message is undefined', () => {
    const notification = { message: undefined, type: 'success' };
    const { container } = render(<NotificationContainer notification={notification} />);

    expect(container.firstChild).toEqual(expect.any(HTMLDivElement));
    expect(container.firstChild.children).toHaveLength(0);
  });

  it('handles different notification types correctly', () => {
    const types = ['success', 'error', 'warning', 'info'];

    types.forEach(type => {
      const notification = { message: `${type} message`, type };
      const { container } = render(<NotificationContainer notification={notification} />);

      expect(container.querySelector(`.message-container.${type}-message-container`)).toBeInTheDocument();
      expect(container.querySelector(`.message-icon.${type}`)).toBeInTheDocument();
    });
  });

  it('renders messages wrapper with correct structure', () => {
    const notification = { message: 'Test message', type: 'success' };
    const { container } = render(<NotificationContainer notification={notification} />);

    const messagesWrapper = container.querySelector('.messages');
    expect(messagesWrapper).toBeInTheDocument();
    expect(messagesWrapper.children).toHaveLength(1);
    expect(messagesWrapper.firstChild).toHaveClass('message-container');
  });

  it('maintains component structure with all required elements', () => {
    const notification = { message: 'Complete structure test', type: 'info' };
    const { container } = render(<NotificationContainer notification={notification} />);

    const messagesDiv = container.querySelector('.messages');
    const messageContainer = messagesDiv.querySelector('.message-container.info-message-container');
    const messageIcon = messageContainer.querySelector('.message-icon.info');
    const messageText = messageContainer.querySelector('.message-text');
    const icon = messageIcon.querySelector('.fa.fa-check-circle');

    expect(messagesDiv).toBeInTheDocument();
    expect(messageContainer).toBeInTheDocument();
    expect(messageIcon).toBeInTheDocument();
    expect(messageText).toBeInTheDocument();
    expect(icon).toBeInTheDocument();
    expect(messageText).toHaveTextContent('Complete structure test');
  });
});
