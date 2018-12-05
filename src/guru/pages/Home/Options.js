import React from 'react';
import { PropTypes } from 'prop-types';

const Options = (props) => {
  const { opts, event, onClickOutcome } = props;
  return (
    <div className="CardActions">
      {
        opts.map(o => (
          <button
            key={o.side}
            className={`btn ${o.className}`}
            onClick={() => onClickOutcome({ ...props, side: o.side }, event.outcomes[0])}
          >
            {o.label}
          </button>
        ))
      }
    </div>
  );
};

Options.propTypes = {
  opts: PropTypes.arrayOf(
    PropTypes.shape({
      side: PropTypes.number,
      label: PropTypes.string,
      className: PropTypes.string
    })
  ),
  event: PropTypes.object,
  onClickOutcome: PropTypes.func
};

Options.defaultProps = {
  opts: [{
    side: 1,
    label: 'yes',
    className: 'btn-primary'
  },
  {
    side: 2,
    label: 'no',
    className: 'btn-secondary'
  }],
  event: undefined,
  onClickOutcome: undefined
};

export default Options;
