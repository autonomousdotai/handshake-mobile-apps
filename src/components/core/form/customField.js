import React from 'react';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledButtonDropdown } from 'reactstrap';
import Cleave from 'cleave.js/react';
import cx from 'classnames';

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
export const fieldDropdown = customField(({
  onChange, value, list, defaultText = 'Select an item',
}) => {
  let txtSelectedItem = defaultText;
  const selectedItem = list.find(i => i.name === value);
  if (selectedItem) {
    txtSelectedItem = selectedItem.text;
  }
  return (
    <UncontrolledButtonDropdown className="btn-block">
      <DropdownToggle caret color="light" block>
        {txtSelectedItem}
      </DropdownToggle>
      <DropdownMenu>
        {
            list.map((item, index) => {
              const { name, text } = item;
              return (
                <DropdownItem
                  key={index}
                  onClick={() => onChange(name)}
                >
                  {text}
                </DropdownItem>
              );
            })
          }
      </DropdownMenu>
    </UncontrolledButtonDropdown>
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

export default customField;
