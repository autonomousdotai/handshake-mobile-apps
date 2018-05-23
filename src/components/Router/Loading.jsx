import React from 'react';

class Loading extends React.PureComponent {
  render() {
    return (
      <div className="content-loading">
        <div className="content-header-container">
          <h1 className="content-header"><span /></h1>
        </div>
        <p />
        <p className="last" />
      </div>
    );
  }
}

export default Loading;
