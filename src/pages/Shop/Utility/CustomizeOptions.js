import React from 'react';
import PropTypes from 'prop-types';
import { showAlert } from '@/reducers/app/action';
import { connect } from 'react-redux';
// style
import './CustomizeOptions.scss';
import ExpandArrowSVG from '@/assets/images/icon/expand-arrow.svg';

class CustomizeOptions extends React.Component {

  constructor(props) {
    super(props);
    this.options = props.optionSelecting;
    // state
    this.state = {
      bottomSheet: false,
      optionList: {
        package_option_values: [],
        itemSelecting: {},
      },
    };
    // bind
    this.handlePackageOptionClick = ::this.handlePackageOptionClick;
    this.handleHideOptionUnvailable = ::this.handleHideOptionUnvailable;
    this.handleShowOption =::this.handleShowOption;
  }

  handleHideOptionUnvailable(packageId, packageOptionId) {
    const { product } = this.props;
    const hideOptionUnvailableObj = product.hide_option_unvailable;
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
                  this.props.showAlert({
                    message: <div className="text-center">{message}</div>,
                    timeOut: 5000,
                    type: 'danger',
                    callBack: () => {},
                  });
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
    this.setState(prevState => ({
      optionList: {
        ...prevState.optionList,
        itemSelecting: packageOption,
      },
    }));
    afterSelectNewOption && afterSelectNewOption(optionSelecting);
  }

  get optionsHtml() {
    const { product, optionSelecting } = this.props;
    if (!product.packages) {
      return null;
    }
    const packagesReal = product.packages.map(item => { if (item.package_options && item.package_options.length > 0) return item; });
    const optionsList = [];
    for (let i = 0, len = packagesReal.length; i < len; i++) {
      if (packagesReal[i]) {
        packagesReal[i].package_options.map(option => {
          if (option.package_option_values.length > 1) {
            let isBreak = false;
            let itemSelecting = {};
            for (let j = 0, jlen = option.package_option_values.length; j < jlen; j++) {
              const optionValue = option.package_option_values[j];
              for (let idSelecting in optionSelecting) {
                if (optionSelecting[idSelecting] === optionValue.id) {
                  itemSelecting =  optionValue;
                  isBreak = true;
                  break;
                }
              }
              if (isBreak) break;
            }
            option.itemSelecting = itemSelecting;
            optionsList.push(
              <div key={option.id} className="option" onClick={() => this.handleShowOption(option)}>
                <strong className="title">{option.name}:</strong>
                <strong className="optionName">{itemSelecting.name || ''}</strong>
                <img className="expand-arrow" src={ExpandArrowSVG} alt="expand arrow" />
              </div>
            );
          }
        });
      }
    }
    return optionsList;
  }

  handleShowOption(option) {
    this.optionListRef.classList.add('expand');
    this.optionListRef.classList.add('slideInUp');
    this.setState({ optionList: option });
  }

  render() {
    const { className } = this.props;
    const { optionList } = this.state;

    return (
      <div className={`CustomizeOptions ${className || ''}`}>
        {this.optionsHtml}
        {/* menu choose option */}
        <div 
          className="option-list animated"
          ref={optionList => this.optionListRef = optionList}
          onClick={() => this.optionListRef.classList.remove('expand')}
        >
          <p className="package">{optionList.name}: <strong>{optionList.itemSelecting.name}</strong></p>
          {
            optionList.package_option_values.map(optionValue => <p key={optionValue.id} className={`option-value ${optionList.itemSelecting.id === optionValue.id && 'active'}`} onClick={() => { this.handlePackageOptionClick(optionList, optionValue) }}>{optionValue.name}</p>)
          }
        </div>
      </div>
    );
  }
}

CustomizeOptions.propTypes = {
  className: PropTypes.string,
  product: PropTypes.object.isRequired,
  optionSelecting: PropTypes.object.isRequired,
  afterSelectNewOption: PropTypes.func.isRequired,
  showAlert: PropTypes.func.isRequired,
};

const mapDispatch = ({
  showAlert,
});

export default connect(null, mapDispatch)(CustomizeOptions);
