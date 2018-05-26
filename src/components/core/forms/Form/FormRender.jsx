import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { Row, Col } from 'react-bootstrap';
import Input from '@/components/Input/Input';
import Radio from '@/components/Radio/Radio';
import DropdownInput from '@/components/DropdownInput/DropdownInput';
import AppField from '@/components/Field/AppField';
import Error from '@/components/Error/Error';
import valid from '@/services/validate';

class FormRender extends React.Component {
  static propTypes = {
    form: PropTypes.array.isRequired,
  }

  infoRender(field) {
    const label = field.label || field.name.replace(/[-_]/ig, ' ');
    const Label = `${label.charAt(0).toUpperCase()}${label.substr(1)}`;
    const moreAgrus = field.agru ? field.agru : [];
    return {
      label,
      Label,
      moreAgru,
    };
  }

  inputRender(field) {
    const { label, Label, moreAgru } = this.infoRender(field);
    return (
      <Field name={field.name} validate={field.valid} key={field.name}>
        {({ input, meta }) => (
          <AppField>
            <label>{Label}{field.valid ? ' *' : ''}</label>
            <Input
              {...input}
              meta={meta}
              checkError={meta.touched}
              type="text"
              placeholder={field.placeholder || `Enter ${Label}`}
            />
            <Error show={meta.touched} error={valid.text(meta.error, Label, ...moreAgru)} />
          </AppField>
        )}
      </Field>
    );
  }


  radioRender(field) {
    const { label, Label, moreAgru } = this.infoRender(field);
    return (
      <Field name={field.name} validate={field.valid} key={field.name}>
        {({ input, meta }) => (
          <AppField>
            <Row className="field-radio">
              <Col sm={6}><label>{Label}{field.valid ? ' *' : ''}</label></Col>
              <Col sm={6}>
                <Radio
                  {...input}
                  meta={meta}
                  list={field.list}
                  type={field.radio_type}
                  checkError={meta.touched}
                />
              </Col>
            </Row>
            <Error show={meta.touched} error={valid.text(meta.error, Label, ...moreAgru)} />
          </AppField>
        )}
      </Field>
    );
  }

  selectRender(field) {
    const { label, Label, moreAgru } = this.infoRender(field);
    return (
      <Field name={field.name} validate={field.valid} key={field.name}>
        {({ input, meta }) => (
          <AppField>
            <label>{Label}{field.valid ? ' *' : ''}</label>
            <select {...input} className="form-control">
              {field.data.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
            <Error show={meta.touched} error={valid.text(meta.error, Label, ...moreAgru)} />
          </AppField>
        )}
      </Field>
    );
  }

  dropdownRender(field) {
    const { label, Label, moreAgru } = this.infoRender(field);
    return (
      <Field name={field.name} validate={field.valid} key={field.name}>
        {({ input, meta }) => {
          return (
            <AppField>
              <label>{Label}{field.valid ? ' *' : ''}</label>
              <DropdownInput
                {...input}
                meta={meta}
                checkError={meta.touched}
                placeholder={field.placeholder || `${Label}`}
                list={field.list.map((item) => ({ value: item[field.key], name: item[field.keyName] }))}
              />
              <Error show={meta.touched} error={valid.text(meta.error, Label, ...moreAgru)} />
            </AppField>
          );
        }}
      </Field>
    );
  }

  fieldRender(field) {
    if (field.type === 'input') {
      return this.inputRender(field);
    }
    if (field.type === 'radio') {
      return this.radioRender(field);
    }
    if (field.type === 'select') {
      return this.selectRender(field);
    }
    if (field.type === 'dropdown') {
      return this.dropdownRender(field);
    }
  }

  preRender() {
    const { form } = this.props;
    return form.map((field, index) => {
      return (
        <Row key={index}>
          {
            (field.type === 'row')
            ? (
              field.childs.map((item, z) => {
                if (item.type === 'row') {
                  return (
                    <Col sm={12} md={12/field.childs.length} key={z}>
                      <Row>
                      {
                        item.childs.map((i, y) => {
                          return (
                            <Col sm={12} md={12/item.childs.length} key={y}>
                              {this.fieldRender(i)}
                            </Col>
                          );
                        })
                      }
                      </Row>
                    </Col>
                  );
                } else {
                  return (
                    <Col sm={12} md={12/field.childs.length} key={z}>
                      {this.fieldRender(item)}
                    </Col>
                  );
                }
              })
            )
            : (
              <Col sm={12}>{this.fieldRender(field)}</Col>
            )
          }
        </Row>
      );
    });
  }

  render() {
    return <div className="form-section">{this.preRender()}</div>;
  }
}

export default FormRender;
