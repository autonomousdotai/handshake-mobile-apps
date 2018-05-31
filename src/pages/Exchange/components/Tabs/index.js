import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import _keys from 'lodash/keys';

const Header = styled.span.attrs({
  className: 'text-center',
})`
  border-top: ${props => (props.active ? '3px solid #278AFF' : '')};
  box-shadow: ${props => (props.active ? '0 -5px 6px 1px rgba(236,236,236,0.50)' : '')};
  color: ${props => (props.active ? '' : '#B3B3B3')};
  display: inline-block;
  padding: 10px;
  cursor: pointer;
`;

export class Component extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const {
      activeIndex, data, onClickTab, className,
    } = this.props;
    const activeIndexInt = parseInt(activeIndex, 10);
    return (
      <div className={className}>
        {
          _keys(data).map((key, index) => {
            const tabKeyInt = parseInt(key, 10);
            return (
              <Header
                key={index}
                active={tabKeyInt === activeIndexInt}
                onClick={() => onClickTab && onClickTab(tabKeyInt)}
                style={{
                  width: `${100 / _keys(data).length}%`,
                }}

              >
                {data[key].header}
              </Header>
            );
          })
        }
        {data[activeIndexInt].element}
      </div>
    );
  }
}

Component.propTypes = {
};

export default Component;
