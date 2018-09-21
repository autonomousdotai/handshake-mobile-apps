import React from 'react';
import { URL } from '@/constants';

export default class Disclaimer extends React.PureComponent {
  static displayName = 'Disclaimer';

  render() {
    return (
      <p className={Disclaimer.displayName}>
        <span>Disclaimer:</span> <br />
        Ninja is open-source, decentralized software that never holds user data, or user funds.
        As such, Ninja does not have the power to alter or restrict any actions made on the platform and so cannot be responsible for policing it.
        By freely choosing to use Ninja, the user accepts sole responsibility for their behavior and agrees to abide by the legalities of their governing jurisdiction.
        Ninja cannot be liable for legal, monetary or psychological damages should you do something stupid.
        Never stake more than you are willing to lose. Play safe!<br />
        Need more information? Check out our FAQ and <a href={URL.PEX_INSTRUCTION_URL}>instructions</a> on how to play.
      </p>
    );
  }
}
