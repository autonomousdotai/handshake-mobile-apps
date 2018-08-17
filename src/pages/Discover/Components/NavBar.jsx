import React from 'react';
import { connect } from 'react-redux';
import { Field } from 'redux-form';
import createForm from '@/components/core/form/createForm';
import { fieldDropdown, fieldRadioButton } from '@/components/core/form/customField';
import { injectIntl } from 'react-intl';
import './NavBar.scss';
import {
  CRYPTO_CURRENCY,
  CRYPTO_CURRENCY_COLORS,
  CRYPTO_CURRENCY_NAME,
  EXCHANGE_ACTION,
  EXCHANGE_ACTION_COLORS,
  EXCHANGE_ACTION_NAME,
} from '@/constants';

const nameFormFilterStation = 'formFilterStation';
const FormFilterStation = createForm({
  propsReduxForm: {
    form: nameFormFilterStation,
    initialValues: {
      type: EXCHANGE_ACTION.BUY,
      coin: { id: CRYPTO_CURRENCY.ETH, text: <span><img src={CRYPTO_CURRENCY_COLORS[CRYPTO_CURRENCY.ETH].icon} width={25} /> {CRYPTO_CURRENCY_NAME[CRYPTO_CURRENCY.ETH]}</span> },
    },
  },
});

const listAction = Object.values(EXCHANGE_ACTION).map((item) => {
  return { value: item, text: EXCHANGE_ACTION_NAME[item], bgColorActive: EXCHANGE_ACTION_COLORS[item].color };
});

const listCoin = Object.values(CRYPTO_CURRENCY).map((item) => {
  return { id: item, text: <span><img src={CRYPTO_CURRENCY_COLORS[item].icon} width={25} /> {CRYPTO_CURRENCY_NAME[item]}</span> };
});

class NavBar extends React.Component {
  render() {
    const { messages } = this.props.intl;
    const { onActionChange, onCurrencyChange } = this.props;
    return (
      <div className="cash-nav-bar">
        <FormFilterStation>
          {/*<button type="button" className="btn bg-transparent mr-2" onClick={() => console.log('clickmenu')}>☰</button>*/}
          <span className="mx-2">{messages.discover.feed.cash.menu.actionDescription}</span>
          <div className="d-inline-block mr-1">
            <Field
              name="type"
              component={fieldRadioButton}
              type="tab-7"
              list={listAction}
              // validate={[required]}
              onChange={onActionChange}
            />
          </div>
          <div className="d-inline-block">
            <Field
              name="coin"
              component={fieldDropdown}
              classNameWrapper=""
              defaultText="Coin"
              classNameDropdownToggle="bg-white border-0"
              // classNameDropdownToggle={`dropdown-sort bg-white ${sortIndexActive === CASH_SORTING_CRITERIA.PRICE ? 'dropdown-sort-selected' : ''}  `}
              list={listCoin}
              onChange={onCurrencyChange}
            />
          </div>

        </FormFilterStation>
      </div>
    );
  }
}

const mapState = state => ({
});

const mapDispatch = dispatch => ({
  // rfChange: bindActionCreators(change, dispatch),
});

export default injectIntl(connect(mapState, mapDispatch)(NavBar));
