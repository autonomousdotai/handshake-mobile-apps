import React from 'react';
import cx from 'classnames';
import propTypes from 'prop-types';
import ScrollableList from '@/components/ScrollableList/ScrollableList';
import { generatedBackgroundCss } from '@/utils/css.js';
import { smartTrim, countWords } from '@/utils/string';
import { URL } from '@/constants';

const BACKGROUND_COLORS = [
  '#000000',
  '#FF2D55',
  '#9C27B0',
  '#007AFF',
  '#FF9500',
  '#009688',
  '#843CF6',
  '#381CE2',
  '#9D61FD',
  '#D5E969',
];

function buildOutcomeItem(outcome) {
  const { name } = outcome;
  const styleCss = {
    background: generatedBackgroundCss(null, BACKGROUND_COLORS),
  };
  let handledStr = [];
  if (countWords(name) === 2) {
    handledStr = name.trim().split(' ');
  } else {
    handledStr = smartTrim(name, name.length / 2);
  }
  const cls = cx('OutcomeItem', {
    AddMoreOutcome: outcome.id === URL.HANDSHAKE_PEX_CREATOR,
  });
  return (
    <div className={cls} style={styleCss}>
      {handledStr[0] && <span>{handledStr[0]}</span>}
      {handledStr[1] && <span>{handledStr[1]}</span>}
    </div>
  );
}

function OutcomeList(props) {
  const { event, onClick } = props;
  const { outcomes } = event;
  const data = outcomes.concat({ id: URL.HANDSHAKE_PEX_CREATOR, name: '+' });
  return (
    <div className="OutcomeList">
      <ScrollableList
        data={data}
        event={event}
        itemRenderer={(outcome) => buildOutcomeItem(outcome, event)}
        onClickItem={onClick}
      />
    </div>
  );
}

OutcomeList.propTypes = {
  event: propTypes.object,
  onClick: propTypes.func,
};

OutcomeList.defaultProps = {
  event: null,
  onClick: undefined,
};

export default OutcomeList;
