import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  box-shadow: 0 0.125rem 0.25rem 0 rgba(203, 203, 203, 0.5);
  margin-bottom: 10px;
`;
const Tab = styled.span`
  color: ${props => (props.active ? '#1E4EFF' : '#C8C7CC')};
  display: inline-block;
  padding: 10px;
  cursor: pointer;
`;

export class Component extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const {
      activeId, list, onClickTab,
    } = this.props;
    const activeIdInt = parseInt(activeId, 10);
    return (
      <Wrapper>
        {
          list.map((button, index) => {
            const { id, text } = button;
            const idInt = parseInt(id, 10);
            const isActive = idInt === activeIdInt;
            return (
              <Tab
                key={index}
                className="text-center"
                active={isActive}
                onClick={() => onClickTab && onClickTab(idInt)}
                style={{
                  width: `${100 / list.length}%`,
                }}
              >
                {text}
              </Tab>
            );
          })
        }
      </Wrapper>
    );
  }
}

Component.propTypes = {
};

export default Component;
