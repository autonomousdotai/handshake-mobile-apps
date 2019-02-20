import React, { Component } from 'react';
import { Input } from 'reactstrap';
import PropTypes from 'prop-types';


class TokenOptions extends Component {
    static propTypes = {
      onChangeToken: PropTypes.func
    }

    static defaultProps = {
      onChangeToken: undefined
    }

    constructor(props) {
      super(props);
      this.state = {
        tokenList: [
          { symbol: 'ETH', name: 'Etherum', checked: false },
          { symbol: 'CST', name: 'Constant', checked: false }
        ]
      };
    }

    componentDidMount() {
      const { tokenList } = this.state;
      const newTokenList = tokenList;
      const firstItem = newTokenList[0];
      firstItem.checked = true;
      this.setState ({
        tokenList: newTokenList
      });
      this.props.onChangeToken(firstItem);
    }
    onChangeToken = (token) => {
      const { tokenList } = this.state;
      tokenList.forEach(item => {
        // eslint-disable-next-line no-param-reassign
        item.checked = false;
        if (item.symbol === token.symbol) {
          // eslint-disable-next-line no-param-reassign
          item.checked = true;
        }
      });
      this.props.onChangeToken(token);
      this.setState({
        tokenList
      });
    }

    renderTokenOption = (item) => {
      return (
        <div className="TokenItem">
          <Input type="radio" checked={item.checked} name={item.symbol} onChange={() => { this.onChangeToken(item); }} value={item.symbol} />{' '}
          {item.name}
        </div>

      );
    }
    render() {
      const { tokenList } = this.state;
      return (
        <div className="TokenList">
          <div className="GroupTitle">Choose a token</div>
          {tokenList.map(item =>
          this.renderTokenOption(item)
        )}
        </div>
      );
    }
}

export default TokenOptions;
