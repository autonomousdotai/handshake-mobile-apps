/* eslint-disable react/prop-types */
import React from 'react';

/**
 * @return {null}
 */
export default function Debug(props) {
  return props.hide ? null : (
    <pre
      style={{
        background: '#f6f8fa',
        fontSize: '.65rem',
        padding: '.5rem',
        fontFamily: 'monospace',
        margin: '20px 50px'
      }}
    >
      {JSON.stringify(props, null, 2)}
    </pre>
  );
}
