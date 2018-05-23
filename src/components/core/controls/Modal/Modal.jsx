import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import cn from 'classnames';
import loading from '@/assets/images/icon/loading.svg.raw';
// style
import './Button.scss';

class Button extends React.Component {
  static propTypes = {
    children: PropTypes.any.isRequired,
    className: PropTypes.string,
    type: PropTypes.string,
    link: PropTypes.bool,
    to: PropTypes.string,
    block: PropTypes.bool,
    small: PropTypes.bool,
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
    isSubmit: PropTypes.bool,
    cssType: PropTypes.string,
    app: PropTypes.object,
    immunity: PropTypes.bool,
  }

  typeClass(type) {
    switch (type) {
      case 'primary': return 'btn-primary';
      case 'secondary': return 'btn-secondary';
      default: return 'btn-primary';
    }
  }

  render() {
    const { type, cssType, onClick, link, block, small, className, children, to, disabled = false, immunity = false } = this.props;
    let typeClass = this.typeClass(cssType);
    let Tag = link ? Link : 'button';

    return (
      <Tag
        to={to || ''}
        className={cn(
          'btn',
          'button',
          typeClass,
          className,
          `${block ? 'block' : ''}`,
          `${small ? 'small' : ''}`,
          `${disabled ? 'disabled' : ''}`,
          `${this.props.app.isCalling && !immunity ? 'disabled' : ''}`
        )}
        type={type || ''}
        onClick={onClick}
        disabled={this.props.app.isCalling || disabled}
      >
        <span
          className={`${this.props.app.isCalling && !immunity ? '': 'hidden'}`}
          dangerouslySetInnerHTML={{ __html: loading }}
        />
        {this.props.app.isCalling && ! immunity ? '' : children}
      </Tag>
    );
  }
}

export default connect((state) => ({ app: state.app }))(Button);
