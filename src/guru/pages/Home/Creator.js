import React from 'react';
import PropTypes from 'prop-types';
import Icon from '@/guru/components/Icon/Icon';
import Creator from '@/guru/components/Creator/Creator';
import MeIcon from '@/assets/images/icon/extension_logo.svg';
import { shortAddress } from '@/utils/string';

const BetCreator = ({ walletAddress, onClick }) => {
  const htmlClassName = 'CardCreator';
  const alias = (!!walletAddress && walletAddress) || '0x3d00536dc2869cc7ee11c45f2fcc86c0336bffed';
  return (
    <div
      className={htmlClassName}
      onClick={onClick}
    >
      <Creator alias={shortAddress(alias, '...')}>
        <Icon path={MeIcon} />
      </Creator>
    </div>
  );
};

BetCreator.propTypes = {
  walletAddress: PropTypes.string,
  onClick: PropTypes.func
};

BetCreator.defaultProps = {
  walletAddress: undefined,
  onClick: undefined
};

export default BetCreator;
