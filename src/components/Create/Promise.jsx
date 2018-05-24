import React from 'react';
import Button from '@/components/core/controls/Button';

class CreatePromise extends React.Component {
  render() {
    return (
      <div>
        <input type="text" />
        <Button block type="submit">Sign &amp; Send</Button>
      </div>
    )
  }
}

export default CreatePromise;
