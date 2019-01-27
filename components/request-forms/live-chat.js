import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';

function onClick(onSuccess) {
  return async () => {
    // eslint-disable-next-line no-undef
    const res = await fetch('/requests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'livechat',
      }),
    });

    if (!res.ok) {
      throw new Error(`Failed to request live chat: ${res.statusText}`);
    }

    onSuccess('Successfully requested live chat');
  };
}

const LiveChat = ({ onSuccess }) => (
  <>
    <h2>Live Chat</h2>
    <Button onClick={onClick(onSuccess)} color="primary" block>
      Join live chat
    </Button>
  </>
);
LiveChat.propTypes = {
  onSuccess: PropTypes.func.isRequired,
};

export default LiveChat;
