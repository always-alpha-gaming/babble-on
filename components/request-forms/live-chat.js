import React from 'react';
import { Button } from 'reactstrap';

function onClick(onSuccess) {
  return async () => {
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

export default ({ onSuccess }) => (
  <>
    <h2>Live Chat</h2>
    <Button onClick={onClick(onSuccess)} color="primary" block>
      Join live chat
    </Button>
  </>
);
