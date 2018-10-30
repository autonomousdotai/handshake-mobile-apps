import React from 'react';
import PropTypes from 'prop-types';
import isEqual from '@/utils/isEqual';
// component
import Image from '@/components/core/presentation/Image';
// style
import ExpandArrowSVG from '@/assets/images/icon/expand-arrow.svg';
import SEARCH_ICON_SVG from '@/assets/images/icon/ic_search.svg';
import './Dropdown.scss';

class Dropdown extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      text: props.placeholder,
      isShow: this.props.isShow || false,
      idActive: -1,
      itemList: props.source,
    };
    // bind
    this.toogle = ::this.toogle;
    this.onItemSelected = ::this.onItemSelected;
    this.setDefaultItem = ::this.setDefaultItem;
    this.filterSource = ::this.filterSource;
    this.handleShow = ::this.handleShow;
  }
  // will store item selecting
  itemSelecting = {};
  isDirtyDefault = false;

  onItemSelected(item) {
    this.itemSelecting = item;
    this.setState({ text: item.value, idActive: item.id });
    this.toogle();
    // call back
    this.props.hasOwnProperty('onItemSelected') && this.props.onItemSelected(item);
  }

  handleShow() {
    this.toogle();
    if (this.props.hasSearch) {
      this.searchBoxRef.focus();
    }
  }

  toogle() {
    this.setState(state => ({
      isShow: !state.isShow
    }));
  }

  setDefaultItem(nextProps=null) {
    const { defaultId, source } = nextProps ? nextProps : this.props;
    if (nextProps && !isEqual(nextProps.source, this.props.source)) {
      this.isDirtyDefault = false;
      this.setState({ itemList: nextProps.source });
    }
    const { idActive } = this.state;
    if (!this.isDirtyDefault && defaultId && source && source.length > 0 && idActive !== defaultId) {
      const itemDefault = source.find(item => item.id == defaultId);
      if (itemDefault) {
        this.setState({ text: itemDefault.value, idActive: itemDefault.id });
        this.itemSelecting = itemDefault;
        this.isDirtyDefault = true;
      }
      // call back
      this.props.hasOwnProperty('afterSetDefault') && this.props.afterSetDefault(itemDefault);
    }
  }

  filterSource(searchValue) {
    clearTimeout(this.searchTimeOut);
    this.searchTimeOut = setTimeout(() => {
      const { source } = this.props;
      const compareValue = value => value.toLowerCase().indexOf(searchValue.trim().toLowerCase()) !== -1;
      this.setState({
        itemList: source.filter(item => compareValue(item.value)),
      });
    }, 50);
  }

  componentDidMount() {
    this.setDefaultItem();
    this.props.hasOwnProperty('onRef') && this.props.onRef(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setDefaultItem(nextProps);
  }

  componentWillUnmount() {
    this.props.hasOwnProperty('onRef') && this.props.onRef(undefined);
  }

  render() {
    const { className, hasSearch } = this.props;
    const { itemList, text, isShow, idActive } = this.state;

    return (
      <div className={`dropdown dropdown-custom ${className || ''}`}>
        <button type="button" className={`btn ${isShow ? 'show-flex' : ''}`} onClick={this.handleShow}>
          <p>{text}</p>
          <div>
            <Image src={ExpandArrowSVG} alt="expand arrow" />
          </div>
        </button>
        <ul className={`dropdown-custom-menu ${isShow ? 'show' : 'hide'}`}>
          {
            hasSearch && (
              <li className="dropdown-custom-item search-block">
                <input
                  className="search-box"
                  onChange={e => this.filterSource(e.target.value)}
                  type="text"
                  ref={search => this.searchBoxRef = search}
                />
                <img className="search-icon" src={SEARCH_ICON_SVG} alt="search icon" />
              </li>
            )
          }
          <div className="result" style={this.props.customResultCss || {}}>
            {
              itemList.length > 0 ? (
                itemList.map(item => (
                  <li
                    key={item.id}
                    className={`dropdown-custom-item ${idActive === item.id ? 'active': ''} ${item.className ? item.className : ''}`}
                    style={item.style || null}
                    onClick={ () => !item.disableClick ? this.onItemSelected(item) : '' }>
                    {item.value}
                  </li>
                ))
              ) : (
                <li className="dropdown-custom-item no-results">
                  No results match
                </li>
              )
            }
          </div>
        </ul>
      </div>
    );
  }
}

Dropdown.propTypes = {
  placeholder: PropTypes.string,
  onRef: PropTypes.func,
  className: PropTypes.string,
  onItemSelected: PropTypes.func,
  defaultId: PropTypes.any,
  source: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.any,
    value: PropTypes.string,
    style: PropTypes.object,
  })).isRequired,
  afterSetDefault: PropTypes.func,
  hasSearch: PropTypes.bool,
  isShow: PropTypes.bool,

};

Dropdown.defaultProps = {
  hasSearch: false,
};

export default Dropdown;
