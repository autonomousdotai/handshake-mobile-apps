/* eslint  react/prop-types:0 */
import React from 'react';
import Switch from '@/components/core/controls/Switch/Switch';
import moment from 'moment';
import RelocationMap from '../components/RelocationMap';
import './styles.scss';

export const fieldTypeAtm = ({ input, texts, atmType }) => {
  const { onChange, value } = input;
  return (
    <div className="rf-type-atm-container d-table w-100" onChange={({ target }) => onChange(target.value)}>
      {Object.entries(atmType).map(([key, name]) => {
        const label = name === atmType.PERSONAL ? texts.personalAtm : texts.storeAtm;
        return (
          <label key={key} className="radio-inline rf-type-atm-radio-container d-table-cell w-50">
            <input
              value={name}
              type="radio"
              name="typeAtm"
              checked={value === name}
              onChange={() => null}
            />
            <span className="checkmark" />
            <span>{label}</span>
          </label>
        );
      })}
    </div>
  );
};

export const fieldAtmStatus = ({ input, texts, atmStatus }) => {
  const { onChange, value } = input;
  return (
    <div className="rf-status-atm">
      <div className="rf-status-atm-title">
        <span>{value === atmStatus.OPEN ? texts.open : texts.closed}</span>
      </div>
      <div>
        <Switch
          isChecked={value === atmStatus.OPEN}
          onChange={_value => {
          return onChange(_value ? atmStatus.OPEN : atmStatus.CLOSE);
          }}
        />
      </div>
    </div>
  );
};

export const fieldTimePicker = ({ input, defaultTime, minHour }) => {
  const { onChange, value } = input;
  const TIME_FORMAT = 'HH:mm';
  let timeValue = value || defaultTime || moment('08:00', TIME_FORMAT);
  const [MIN_HOUR, MAX_HOUR] = [parseInt(minHour, 10) || 0, 23];
  const hoursItem = [];

  if (!timeValue?._isAMomentObject) {
    timeValue = moment();
  }
  for (let i = MIN_HOUR; i <= MAX_HOUR; i += 1) {
    const hour = i < 10 ? `0${i}` : i;
    hoursItem.push(
      <option value={hour} key={hour}>{hour}:00</option>,
    );
  }
  return (
    <div className="form-group hour-selector-container">
      <select
        value={timeValue.format('HH')}
        className="form-control"
        onChange={({ target }) => {
          const time = moment(`${target.value}:00`, TIME_FORMAT);
          onChange(time);
        }}
      >
        {hoursItem}
      </select>
    </div>
  );
};

export const mapField = ({ input }) => {
  const { value, onChange } = input;
  const position = { lat: value.lat, lng: value.lng };
  return (
    <RelocationMap
      position={position}
      onAddressResolved={onChange}
    />
  );
};
