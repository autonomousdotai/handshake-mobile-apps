import React from 'react';
//
import Button from '@/components/core/controls/Button/Button';
import Modal from '@/components/core/controls/Modal';
import Dropdown from '@/components/core/controls/Dropdown';
import CustomizeOptions from './Utility/CustomizeOptions';
//
import { set, getJSON } from 'js-cookie';
import { showAlert } from '@/reducers/app/action';
import { connect } from 'react-redux';
import Input from '@/components/core/forms/Input/Input';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';
import $http from '@/services/api';
import SimpleSlider from '@/components/core/controls/Slider';
import Tabs from '@/components/handshakes/betting/Feed/Tabs';
import { hideHeader } from '@/reducers/app/action';
import { URL, CUSTOMER_ADDRESS_INFO, AUTONOMOUS_END_POINT, COUNTRY_LIST } from '@/constants';
// style
import './ShopDetail.scss';
const EthSVG = 'https://d2q7nqismduvva.cloudfront.net/static/images/icon-svg/common/eth-sign.svg';

const SELLER_CONFIG = {
  ETH_ADDRESS: 'ETH:0xA8a6d153C3c3F5098eEc885E6c39437dE5cA74Fd',
  URL_CONFIRM: `${location.origin}${URL.SHOP_URL_CONFIRM}`,
  CURRENCY: 'ETH',
};
const ETH_GATEWAY_ID = 9;
const OPTION_TEXT = 'option';

class ShopDetail extends React.Component {

  static propTypes = {
    hideHeader: PropTypes.func.isRequired,
    showAlert: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      tabActive: 0,
      product: {},
      productInfo: {
        image_info: [],
      },
      productInfoHtml: [],
      productReviews: [],
      productSpecs: [],
      productFAQ: [],
      optionSelecting: {},
      quantity: 1, // form field
      countryCode: '', // country code
    };
    // need hide header
    props.hideHeader();
    // bind
    this.placeOrder = ::this.placeOrder;
    this.updateQuantity = ::this.updateQuantity;
    this.updateShippingAndTax = ::this.updateShippingAndTax;
    this.afterSelectNewOption = ::this.afterSelectNewOption;
  }

  addOptionTextToObject(object) {
    let newObject = {};
    for (let prop in object) {
      newObject[`${OPTION_TEXT}${prop}`] = object[prop];
    }
    return newObject;
  }

  get converCountrySource() {
    const source = [];
    for (const key in COUNTRY_LIST) {
      source.push({
        id: key,
        value: COUNTRY_LIST[key],
      });
    }
    return source;
  }

  get totalInfo() {
    const { productInfo, quantity } = this.state;
    if (!productInfo.cart) {
      return {
        totalPrice: 0,
        totalPricePretty: 0,
        totalShippingPrice: 0,
        totalShippingPricePretty: 0,
        totalTaxPrice: 0,
        totalTaxPricePretty: 0,
        totalAmount: 0,
        totalAmountPretty: 0
      };
    }
    const ethRate = productInfo.cart.eth_rate;
    const totalPrice = (productInfo.cart.total_items_price / ethRate) * quantity;
    const totalShippingPrice = (productInfo.cart.total_shipping_price / ethRate) * quantity;
    const totalTaxPrice = (productInfo.cart.total_tax / ethRate) * quantity;
    const totalAmount = totalPrice + totalShippingPrice + totalTaxPrice;
    return {
            totalPrice,
            totalPricePretty: totalPrice.toFixed(2),
            totalShippingPrice,
            totalShippingPricePretty: totalShippingPrice.toFixed(2),
            totalTaxPrice,
            totalTaxPricePretty: totalTaxPrice.toFixed(2),
            totalAmount,
            totalAmountPretty: totalAmount.toFixed(2),
          };
  }
  
  async componentDidMount() {
    // get product buy slug
    const { slug } =  this.props.match.params;
    if (!slug) {
      // redirect to shop
      return;
    }
    // get product id and option default, ...
    const urlSlug = `${AUTONOMOUS_END_POINT.BASE}${AUTONOMOUS_END_POINT.PRODUCT}/${slug}`;
    const { data: productBuySlug } = await $http({ url: urlSlug, method: 'GET' });
    this.setState({ product: productBuySlug.product });
    // get product information: price, option name, ...
    const urlProductInfo = `${AUTONOMOUS_END_POINT.BASE}${AUTONOMOUS_END_POINT.PRODUCT_INFO}/${productBuySlug.product.id}`;
    const { data: productInfo } = await $http({ url: urlProductInfo, data: this.addOptionTextToObject(productBuySlug.product.selected_option), method: 'POST' });
    this.setState({ productInfo: productInfo.product_info, optionSelecting: productBuySlug.product.selected_option }, () => this.imagesSliderRef.slider.slickGoTo(0));
    // get product info design
    const urlProductInfoDesign = `${AUTONOMOUS_END_POINT.BASE}${AUTONOMOUS_END_POINT.PRODUCT_SPEC}/${productBuySlug.product.id}?type=1`;
    const { data: productInfoHtml } = await $http({ url: urlProductInfoDesign, method: 'GET' });
    this.setState({ productInfoHtml: productInfoHtml.data });
    // get specs
    const urlProductSpecs = `${AUTONOMOUS_END_POINT.BASE}${AUTONOMOUS_END_POINT.PRODUCT_SPEC}/${productBuySlug.product.id}?type=2`;
    const { data: productSpecs } = await $http({ url: urlProductSpecs, method: 'GET' });
    this.setState({ productSpecs: productSpecs.data });
    // get faq
    const urlProductFAQ = `${AUTONOMOUS_END_POINT.BASE}${AUTONOMOUS_END_POINT.PRODUCT_QUESTIONS}/${productBuySlug.product.id}`;
    const { data: productFAQ } = await $http({ url: urlProductFAQ, method: 'GET' });
    this.setState({ productFAQ: productFAQ.product_questions });
    // get reviews
    const urlProductReviews = `${AUTONOMOUS_END_POINT.BASE}${AUTONOMOUS_END_POINT.PRODUCT_REVIEWS}/${productBuySlug.product.id}?page=1&page_size=10`;
    const { data: productReviews } = await $http({ url: urlProductReviews, method: 'GET' });
    this.setState({ productReviews : productReviews.data });

    // set init form field
    const addressInfo = getJSON(CUSTOMER_ADDRESS_INFO);
    const { ipInfo } = this.props.app;
    let countryCode = '';

    this.quantityRef.value = this.state.quantity;
    if (addressInfo) {
      this.nameRef.value = addressInfo.fullname;
      this.emailRef.value = addressInfo.email;
      this.addressRef.value = addressInfo.shipping_address;
      this.zipRef.value = addressInfo.zip;
      this.cityRef.value = addressInfo.city;
      this.stateRef.value = addressInfo.state;
      countryCode = addressInfo.country;
    } else if (ipInfo) {
      this.cityRef.value = ipInfo.city;
      this.stateRef.value = ipInfo.regionCode;
      countryCode = ipInfo.country;
    }
    this.setState({ countryCode });
  }

  afterSelectNewOption(optionSelecting) {
    this.setState({ optionSelecting }, () => { this.updateShippingAndTax(); this.imagesSliderRef.slider.slickGoTo(0); });
  }

  updateQuantity(e) {
    this.setState({ quantity: parseInt(e.target.value) }, () => {
      // after set state
      this.updateShippingAndTax();
    });
  }

  get yourInformationForm() {
    return {
      city: this.cityRef.value.trim(),
      country: this.countryRef.itemSelecting.id ? this.countryRef.itemSelecting.id.trim() : '',
      email: this.emailRef.value.trim(),
      fullname: this.nameRef.value.trim(),
      phone: this.phoneRef.value.trim(),
      shipping_address: this.addressRef.value.trim(),
      state: this.stateRef.value.trim(),
      zip: this.zipRef.value.trim(),
    };
  }

  async placeOrder(e) {
    e.preventDefault();

    const { optionSelecting, product } = this.state;
    // call place order
    const url = `${AUTONOMOUS_END_POINT.BASE}${AUTONOMOUS_END_POINT.CHECKOUT}?use_wallet=false&promo=0`;
    const data = {
      customer: {
        billing_address: '',
        ... this.yourInformationForm,
      },
      payment: {
        cc: null,
        credit: 0,
        gateway_id: ETH_GATEWAY_ID,
      },
      product: {
        options: this.addOptionTextToObject(optionSelecting),
        product_id: product.id,
        quantity: parseInt(this.quantityRef.value.trim()),
      },
    };
    const { data: placeOrder } = await $http({ url, data, method: 'POST' });
    if (placeOrder.status > 0) {
      // success
      const { order_id, order_num } = placeOrder.order;
      data.customer.orderNum = order_num;
      set(CUSTOMER_ADDRESS_INFO, JSON.stringify(data.customer));
      // redirect to payment
      const amount = this.totalInfo.totalAmount;
      const paymentUrl = `${location.origin}/payment?order_id=${order_id}&amount=${amount}&currency=${SELLER_CONFIG.CURRENCY}&to=${SELLER_CONFIG.ETH_ADDRESS}&confirm_url=${SELLER_CONFIG.URL_CONFIRM}`;
      window.location.href = paymentUrl;
    } else {
      // fail
      this.props.showAlert({
        message: <div className="text-center">{placeOrder.message}</div>,
        timeOut: 5000,
        type: 'danger',
        callBack: () => {},
      });
    }
  }

  async updateShippingAndTax() {
    const { product, quantity, optionSelecting } = this.state;
    const customerInformation = this.yourInformationForm;
    const urlProductInfo = `${AUTONOMOUS_END_POINT.BASE}${AUTONOMOUS_END_POINT.PRODUCT_INFO}/${product.id}?city=${customerInformation.city}&country=${customerInformation.country}&email=${customerInformation.email}&quantity=${quantity}&state=${customerInformation.state}&street=${customerInformation.shipping_address}&zip=${customerInformation.zip}`;
    const { data: productInfo } = await $http({ url: urlProductInfo, data: this.addOptionTextToObject(optionSelecting), method: 'POST' });
    this.setState({ productInfo: productInfo.product_info });
  }

  render() {
    const { product,
            productInfo,
            productInfoHtml,
            productSpecs,
            productFAQ,
            productReviews,
            quantity,
            countryCode,
            optionSelecting } = this.state;
    const imageSetting = {
      customPaging: i => <span className="dot" />,
      initialSlide: 0,
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      lazyLoad: 'progressive',
      className: 'carousel',
    };

    return (
      <div className="ShopDetail">
        <div className="header-info">
          <div className="vendor">
            <img src={product.vendor_thumb} alt={product.vendor_name} />
            <span>{product.vendor_name}</span>
          </div>
          <p className="product-name">{product.name}</p>
        </div>
        <SimpleSlider settings={imageSetting} onRef={images => this.imagesSliderRef = images}>
          {
            productInfo.image_info.map(img =>
              <img key={img.image_alt} src={img.image_url} alt={img.image_alt} />
            )
          }
        </SimpleSlider>
        <p className="price">
          <img src={EthSVG} alt="Eth" />&nbsp;
          {productInfo.eth_price}
          <span className="shipping-date">
            <img src="https://d2q7nqismduvva.cloudfront.net/static/images/icon-svg/common/shipping-icon.svg" alt="shipping" />
            {productInfo.shipping_date}
          </span>
        </p>
        <CustomizeOptions
          className="customize-options"
          product={product}
          optionSelecting={optionSelecting}
          afterSelectNewOption={this.afterSelectNewOption}
        />
        <div className="buy-now-btn">
          <Button block onClick={() => this.modalBuyNowRef.open()}>
            Buy now
          </Button>
        </div>
        <div className="warranty-block">
          <div>
            <strong>30-DAY TRIAL.</strong>
          </div>
          <div>
            <strong>5-YEAR WARRANTY.</strong>
          </div>
        </div>
        <Tabs htmlClassName="information-tab">
          <div label="Product info">
            {
              productInfoHtml.map((item, index) => <p key={'product-info' + index} dangerouslySetInnerHTML={{ __html: item }} />)
            }
          </div>
          <div label="Specs">
            {
              productSpecs.map((item, index) => <p key={'product-specs' + index} dangerouslySetInnerHTML={{ __html: item }} />)
            }
          </div>
          <div label="FAQ">
            {
              productFAQ.map((item, index) => <div key={'product-faq' + index} className="faq">
                <strong>{item.question}</strong>
                <p dangerouslySetInnerHTML={{ __html: item.answers[0].answer }} />
              </div>)
            }
          </div>
          <div label={`Reviews (${product.review_count * 2})`}>
            {
              productReviews.map(item => <div key={item.id}>
                  <p>{item.name}</p>
                  <p>{item.review_date}</p>
                  <p>{item.title}</p>
                  <p>{item.content}</p>
                </div>)
            }
          </div>
        </Tabs>
        {/* modal buy now */}
        <Modal title="Your Information" onRef={modal => this.modalBuyNowRef = modal}>
          <form onSubmit={this.placeOrder} className="your-information-form">
            <div className="input-group">
              <label htmlFor="">Quantity</label>
              <Input type="number" name="quantity" onRef={quantity => this.quantityRef = quantity} onChange={this.updateQuantity} />
            </div>
            <div className="input-group">
              <label htmlFor="">Name</label>
              <Input type="text" name="name" onRef={name => this.nameRef = name} placeholder="Your name" />
            </div>
            <div className="input-group">
              <label htmlFor="">Email</label>
              <Input name="email" type="email" onRef={email => this.emailRef = email} placeholder={"Email for order confirmation"} />
            </div>
            <div className="input-group">
              <label htmlFor="">Address</label>
              <Input name="address" type="text" onRef={address => this.addressRef = address} onBlur={this.updateShippingAndTax} placeholder="Shipping address" />
            </div>
            <div className="area">
              <Input type="text" name="zip" onRef={zip => this.zipRef = zip} onBlur={this.updateShippingAndTax} placeholder="Zip code" />
              <Input type="text" name="city" onRef={city => this.cityRef = city} onBlur={this.updateShippingAndTax} placeholder="City" />
              <Input type="text" name="state" onRef={state => this.stateRef = state} onBlur={this.updateShippingAndTax} placeholder="State" />
            </div>
            <Dropdown
              className="country"
              hasSearch
              placeholder="Choose country"
              defaultId={countryCode}
              source={this.converCountrySource}
              onRef={country => this.countryRef = country}
              onItemSelected={this.updateShippingAndTax}
            />
            <div className="input-group">
              <label htmlFor="">Phone</label>
              <Input type="tel" name="phone" onRef={phone => this.phoneRef = phone} placeholder="Phone for delivery" />
            </div>
            <Button block >
              Submit
            </Button>
            <div className="order-information">
              <div className="field-info">
                <strong>{product.name}</strong> <span className="red">ETH&nbsp;{productInfo.eth_price}</span>&nbsp;&nbsp;<span>(x{quantity})</span>
              </div>
              <div className="field-info">
                <span>Shipping:&nbsp;</span> <span>ETH&nbsp;{this.totalInfo.totalShippingPricePretty}</span>
              </div>
              <div className="field-info">
                <span>Tax:&nbsp;</span> <span>ETH&nbsp;{this.totalInfo.totalTaxPricePretty}</span>
              </div>
              <div className="field-info">
                <strong>Total:&nbsp;</strong> <strong className="red">ETH&nbsp;{this.totalInfo.totalAmountPretty}</strong>
              </div>
            </div>
          </form>
        </Modal>
        {/* end modal buy now */}
      </div>
    );
  }
}

const mapState = state => ({
  app: state.app,
});

const mapDispatch = ({
  hideHeader,
  showAlert,
});

export default injectIntl(connect(mapState, mapDispatch)(withRouter(ShopDetail)));