/* eslint react/prop-types:0 */
import React from 'react';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledButtonDropdown } from 'reactstrap';
import Cleave from 'cleave.js/react';
import { BigNumber } from 'bignumber.js';
import cx from 'classnames';
import './styles.scss';
// import phoneCountryCodes from './country-calling-codes.min.json';
import SelectCountryCode from './components/SelectCountryCode';

const customField = element => ({
  input,
  meta: { touched, error, warning },
  elementPrepend,
  elementAppend,
  className,
  ...rest
}) => {
  const { name, onChange, value } = input;
  let newClassName = '';
  if (touched) {
    if (error) newClassName = 'has-error';
    else if (warning) newClassName = 'has-warning';
  }

  const allElements = [];
  if (elementPrepend) allElements.push(React.cloneElement(elementPrepend, { key: 0 }));
  allElements.push(React.createElement(element, {
    ...rest, ...input, key: 1, className: cx(className, newClassName),
  }));
  if (elementAppend) allElements.push(React.cloneElement(elementAppend, { key: 4 }));
  allElements.push(touched &&
    ((error && <span key={2} className="w-100 text-danger text-left">{error}</span>) ||
      (warning && <span key={3} className="w-100 text-warning text-left">{warning}</span>)));
  return allElements;
};

export const fieldInput = customField('input');
export const fieldTextArea = customField('textarea');
export const fieldDropdown = customField(({
  onChange, value, list, defaultText = 'Select an item', classNameWrapper = 'btn-block', classNameDropdownToggle = '', disabled = false, caret = true,
}) => {
  let txtSelectedItem = defaultText;
  const selectedItem = list.find(i => i.id === value.id);

  if (selectedItem) {
    txtSelectedItem = selectedItem.text;
  }
  return (
    <UncontrolledButtonDropdown className={classNameWrapper}>
      <DropdownToggle caret={caret} color="light" block className={classNameDropdownToggle} disabled={disabled}>
        {txtSelectedItem}
      </DropdownToggle>
      {
        caret && (
          <DropdownMenu>
            {
              list.map(item => (
                <DropdownItem
                  key={item.id}
                  onClick={() => onChange(item)}
                >
                  {item.text}
                </DropdownItem>
              ))
            }
          </DropdownMenu>
        )
      }
    </UncontrolledButtonDropdown>
  );
});

// type = tab|radio-big|default
export const fieldRadioButton = customField(({
  onChange, value, list, name, color = '', styleButton = {}, type, fullWidth,
}) => {
  let containerClass = '';
  let _fullWidth = false;
  let hasPrefixIcon = false;
  switch (type) {
    case 'tab':
      containerClass = 'tab';
      _fullWidth = true;
      hasPrefixIcon = false;
      break;
    case 'tab-1':
      containerClass = 'tab-1';
      hasPrefixIcon = false;
      _fullWidth = true;
      break;
    case 'tab-2':
      containerClass = 'tab-2';
      _fullWidth = true;
      hasPrefixIcon = true;
      break;
    case 'tab-3':
      containerClass = 'tab-3';
      _fullWidth = true;
      hasPrefixIcon = false;
      break;
    case 'tab-4':
      containerClass = 'tab-4';
      _fullWidth = true;
      hasPrefixIcon = true;
      break;
    case 'tab-5':
      containerClass = 'tab-5';
      _fullWidth = true;
      hasPrefixIcon = false;
      break;
    case 'tab-6':
      containerClass = 'tab-6';
      _fullWidth = true;
      hasPrefixIcon = true;
      break;
    case 'tab-7':
      containerClass = 'tab-7';
      _fullWidth = true;
      hasPrefixIcon = false;
      break;
    case 'radio-big':
      containerClass = 'big';
      hasPrefixIcon = false;
      break;
    default:
      hasPrefixIcon = true;
      containerClass = 'default';
  }
  if (typeof fullWidth !== 'undefined') {
    _fullWidth = fullWidth;
  }
  return (
    <span style={{ width: _fullWidth ? '100%' : '' }}>
      {
      list.map((item, index) => {
        const {
          value: itemValue, text, icon, hide, bgColorActive,
        } = item;
        if (hide) return null;
        const isChecked = itemValue === value;
        return (
          <div key={index} className={cx('radio-container', containerClass)} style={_fullWidth ? { width: `${100 / list.length}%` } : {}}>
            <input
              type="radio"
              name={name}
              checked={isChecked}
              readOnly
            />
            <button
              type="button"
              className="btn"
              onClick={() => onChange(itemValue)}
              style={{ color, minWidth: '58px', background: bgColorActive && isChecked ? bgColorActive : '', ...styleButton }}
            >
              {/* <span style={{ fontSize: '28px' }}>&sdot;</span> */}
              {
                hasPrefixIcon && (<span className="align-middle">{icon || <span>&#x25cf;</span>}&nbsp;</span>)
              }
              {text}
            </button>
          </div>
        );
      })
    }
    </span>
  );
});

export const fieldNumericInput = customField(({
  onChange, onBlur, onFocus, value, list, name, color = '', step = 0.25, suffix, btnBg = '',
}) => {
  const valueFloat = parseFloat(value || 0, 10);
  let _value = new BigNumber(value).toNumber();
  _value = isNaN(_value) ? '' : _value;
  return (
    <span className="btn-group" role="group" style={{ color }}>
      <button type="button" className="btn numeric-input" style={{ color }} onClick={() => onChange(valueFloat - step)} onBlur={() => onBlur()} onFocus={() => onFocus()}>–</button>
      &nbsp;
      <span className="text-center" style={{ minWidth: '70px', lineHeight: '36px' }}>
        <input className="form-control text-right" style={{ width: '57px', display: 'inline-block', padding: '0.375rem 0.2rem' }} step="any" type="number" onChange={onChange} value={_value} />
        &nbsp;
        { suffix && <span>{suffix}</span>}
      </span>
      &nbsp;
      <button type="button" className="btn numeric-input" style={{ color }} onClick={() => onChange(valueFloat + step)} onBlur={() => onBlur()} onFocus={() => onFocus()}>+</button>
    </span>
  );
});

export const fieldCleave = customField(({
  onChange, onBlur, onFocus, value, propsCleave, className,
}) => (
  <Cleave
    {...propsCleave}
    onChange={e => onChange(e.target.rawValue)}
    onBlur={onBlur}
    onFocus={onFocus}
    value={value}
    className={className}
  />
));

export const fieldPhoneInput = customField(({
  onChange, onBlur, onFocus, value, propsCleave, className, placeholder, color, showFlag
}) => {
  const splittedNumbers = value.split('-');
  let countryCode = '';
  let phoneNumber = '';
  if (splittedNumbers.length === 1) {
    countryCode = '';
    phoneNumber = splittedNumbers[0];
  } else {
    countryCode = splittedNumbers[0];
    phoneNumber = splittedNumbers[1] || '';
  }
  return (
    <span>
      <span className="phone-input-country" style={{ display: 'table-cell' }}>
        <SelectCountryCode showFlag={showFlag} countryCode={countryCode} onChange={newCountryCode => onChange(`${newCountryCode}-${phoneNumber}`)} color={color} />
      </span>
      <span style={{ display: 'table-cell' }} className="pl-2 phone-input-number"><input type="tel" placeholder={placeholder} className="form-control-custom form-control-custom-ex w-100 input-no-border" value={phoneNumber} onChange={e => onChange(`${countryCode}-${e.target.value}`)} /></span>
    </span>
  );
});

export const fieldDaySelector = customField(({ onChange, value, intl }) => {
  const { messages } = intl;

  // { `${id_od_day}`: `${name_of_day}` }
  const days = {
    1: messages.create.atm.days.sunday,
    2: messages.create.atm.days.monday,
    3: messages.create.atm.days.tuesday,
    4: messages.create.atm.days.wednesday,
    5: messages.create.atm.days.thursday,
    6: messages.create.atm.days.friday,
    7: messages.create.atm.days.saturday,
  };

  // select all as default
  if (Object.keys(value).length === 0) {
    const selectAll = {};
    Object.keys(days).forEach(key => { selectAll[key] = true; });
    onChange(selectAll);
  }

  return (
    <ul className="date-selector">
      {Object.entries(days).map(([id, name]) => {
        return (
          <li key={id}>
            <label>
              <input
                checked={value[id]}
                type="checkbox"
                name="selectedDay"
                onChange={
                  ({ target: { checked } }) => {
                    let newValue = { ...value };
                    if (checked === true) {
                      newValue = { ...newValue, [id]: true };
                    } else {
                      delete newValue[id];
                    }
                    return onChange(newValue);
                  }
                }
              />
              {name}
            </label>
          </li>
        );
      })}
    </ul>
  );
});

export default customField;
