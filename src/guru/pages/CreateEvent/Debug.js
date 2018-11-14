/* eslint-disable react/prop-types */
import React from 'react';

/**
 * @return {null}
 */
export default function Debug(props) {
  return (props.hide || process.env.NODE_ENV === 'production') ? null : (
    <pre
      style={{
        background: '#f6f8fa',
        fontSize: '9px',
        padding: '.5rem',
        fontFamily: 'monospace',
        margin: '20px'
      }}
    >
      {JSON.stringify(props, null, 2)}
    </pre>
  );
}
