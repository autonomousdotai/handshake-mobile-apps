import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import cn from 'classnames';
import loading from '@/assets/images/icon/loading.svg.raw';
// style
import './Button.scss';

class Button extends React.PureComponent {
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

  static defaultProps = {
    disabled: false,
    immunity: true,
    block: false,
    to: '',
    small: false,
    link: false,
    onClick: () => {},
  }

  typeClass(type) {
    switch (type) {
      case 'primary': return 'btn-primary';
      case 'secondary': return 'btn-secondary';
      case 'success': return 'btn-success';
      case 'danger': return 'btn-danger';
      case 'warning': return 'btn-warning';
      case 'info': return 'btn-info';
      default: return 'btn-primary';
    }
  }

  render() {
    const {
      type, cssType, onClick, link, block, small, className, children, to, disabled, immunity,
    } = this.props;
    const typeClass = this.typeClass(cssType);
    const Tag = link ? Link : 'button';

    return (
      <Tag
        to={to || ''}
        className={cn(
          'btn',
          typeClass,
          className,
          `${block ? 'btn-block' : ''}`,
          `${small ? 'small' : ''}`,
          `${disabled ? 'disabled' : ''}`,
          `${this.props.app.isCalling && !immunity ? 'disabled' : ''}`,
        )}
        type={type || ''}
        onClick={onClick}
        disabled={this.props.app.isCalling || disabled}
      >
        {
          this.props.app.isCalling && !immunity && (
            <span dangerouslySetInnerHTML={{ __html: loading }} />
          )
        }
        {this.props.app.isCalling && !immunity ? '' : children}
      </Tag>
    );
  }
}

export default connect(state => ({ app: state.app }))(Button);
