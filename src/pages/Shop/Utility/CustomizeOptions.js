import React from 'react';
import PropTypes from 'prop-types';


class CustomizeOptions extends React.PureComponent {

  constructor(props) {
    super(props);
    this.options = props.optionSelecting;
    // bind
    this.isActiveItem = this.isActiveItem.bind(this);
    this.handlePackageOptionClick = this.handlePackageOptionClick.bind(this);
    this.handleHideOptionUnvailable = this.handleHideOptionUnvailable.bind(this);
  }

  isActiveItem(optionValueSelecting, optionValue) {
    return optionValueSelecting.id === optionValue.id;
  }

  handleHideOptionUnvailable(packageId, packageOptionId) {
    const { product } = this.props;
    const hideOptionUnvailableObj = product.hideOptionUnvailable;
    const optionMustHide = [];

    // get list option unvailable
    for (const prop in this.options) {
      const combineCode = `${prop}_${this.options[prop]}`; // package id_package option id
      if (hideOptionUnvailableObj.hasOwnProperty(combineCode)) {
        const optionsTemp = hideOptionUnvailableObj[combineCode];
        optionsTemp.forEach((option) => {
          optionMustHide.push(option);
        });
      }
    }

    const packages = product.packages;
    for (const prop in this.options) {
      const combineCode = `${prop}_${this.options[prop]}`;
      if (optionMustHide.indexOf(combineCode) !== -1) {
        // must choose option else
        for (let i = 0, len = packages.length; i < len; i++) {
          // ignore package options is null
          if (!packages[i].package_options) {
            continue;
          }
          const packageOptions = packages[i].package_options;
          for (let j = 0, jlen = packageOptions.length; j < jlen; j++) {
            if (packageOptions[j].id === parseInt(prop)) {
              const packageOptionValues = packageOptions[j].package_option_values;
              for (let k = 0, klen = packageOptionValues.length; k < klen; k++) {
                const combineId = `${prop}_${packageOptionValues[k].id}`;
                if (optionMustHide.indexOf(combineId) === -1) {
                  this.options[prop] = packageOptionValues[k].id;
                  const message = 'Sorry! The package not available.';
                  // SystemEvent.emit(OPEN_ALERTS, { message, timeOut: 3000 });
                  alert(message);
                  break;
                }
              }
            }
          }
        }
      }
    }
  }

  handlePackageOptionClick(packageObj, packageOption) {
    // don't need call ajax again
    if (this.options[packageObj.id] === packageOption.id) {
      return;
    }

    this.options[packageObj.id] = packageOption.id;
    // checking package option selecting is option unvailable ?
    this.handleHideOptionUnvailable(packageObj.id, packageOption.id);
    const { afterSelectNewOption } = this.props;
    const optionSelecting = Object.assign(this.props.optionSelecting, this.options);
    afterSelectNewOption && afterSelectNewOption(optionSelecting);
    // check GA
    try {
      // ga('send', 'event', 'Product', 'choose option on customize smart desk 2', `${packageObj.packageName}-${packageOption.name}-smart desk 2`);
    } catch (error) {
      console.error(error);
    } 
  }

  get optionsHtml() {
    const { options } = this.props;

    return options.map(option => {
      return option.packageOptionValues.length > 1 ? (
        <div key={option.id} className={s.package}>
          <strong className={s.title}>{option.packageName}</strong>
          {
            option.packageOptionValues.map(optionValue => (
              <span 
                key={optionValue.id}
                className={`${'optionValue'} ${this.isActiveItem(option.packageOptionValueSelecting, optionValue) ? 'active' : ''}`}
                onClick={() => { this.handlePackageOptionClick(option, optionValue) }}
                >
                  {optionValue.name}
              </span>
            ))
          }
        </div>
      ) : null;
    });
  }

  render() {
    const { className } = this.props;

    return (
      <div className={`${'customizeOptions'} ${className}`}>
        {this.optionsHtml}
      </div>
    );
  }
}

CustomizeOptions.propTypes = {
  className: PropTypes.string,
  product: PropTypes.object.isRequired,
  options: PropTypes.array.isRequired,
  optionSelecting: PropTypes.object.isRequired,
  afterSelectNewOption: PropTypes.func.isRequired,
};

CustomizeOptions.defaultProps = {
  className: '',
};

export default CustomizeOptions;
