import React from 'react';
import PropTypes from 'prop-types';

const NotificationContainer = (props) => {
  const messageType = `message-container ${props.notification.type}-message-container`;
  const notificationType = `message-icon ${props.notification.type}`;
  if (props.notification.message) {
    return (
      <div className="messages">
        <div className={ messageType }>
          <div className={ notificationType }>
            <i className="fa fa-check-circle" />
          </div>
          <div className="message-text">
            { props.notification.message }
          </div>
          {props.onClose && (
            <button
              className="notification-close-btn"
              onClick={props.onClose}
              aria-label="Close notification"
              type="button"
            >
              <i className="fa fa-times" />
            </button>
          )}
        </div>
      </div>
    );
  }
  return (<div />);
};

NotificationContainer.propTypes = {
  notification: PropTypes.shape({
    message: PropTypes.string,
    type: PropTypes.string,
  }).isRequired,
  onClose: PropTypes.func,
};

export default NotificationContainer;
