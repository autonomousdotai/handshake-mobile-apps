import React from 'react';

class MobileOnly extends React.PureComponent {
  static displayName = 'MobileOnly';

  render() {
    return (
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <p>Opps!</p>
        <p>Please open Ninja on your mobile to play.</p>
      </div>
    );
  }
}


export default MobileOnly;
