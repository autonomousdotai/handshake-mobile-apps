import React from 'react';
//
import Button from '@/components/core/controls/Button/Button';
import Modal from '@/components/core/controls/Modal';
// import CustomizeOptions from './Utility/CustomizeOptions';
//
import { set, getJSON } from 'js-cookie';
// import createForm from '@/components/core/form/createForm';
// import { fieldDropdown, fieldInput } from '@/components/core/form/customField';
// import { required } from '@/components/core/form/validation';
// import { Field, clearFields, change, formValues } from 'redux-form';
import { connect } from 'react-redux';
import Input from '@/components/core/forms/Input/Input';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';
import $http from '@/services/api';
import SimpleSlider from '@/components/core/controls/Slider';
import Tabs from '@/components/handshakes/betting/Feed/Tabs';
import { hideHeader, clearNotFound } from '@/reducers/app/action';
import { CUSTOMER_ADDRESS_INFO } from '@/constants';
// style
import './ShopDetail.scss';
const EthSVG = 'https://d2q7nqismduvva.cloudfront.net/static/images/icon-svg/common/eth-sign.svg';

// const BuyNowForm = createForm({ 
//   propsReduxForm: {
//     form: 'BuyNowForm',
//     enableReinitialize: true,
//     clearSubmitErrors: true,
//     initialValues: {},
//   },
// });

const SELLER_CONFIG = {
  ETH_ADDRESS: 'ETH:0xA8a6d153C3c3F5098eEc885E6c39437dE5cA74Fd',
  URL_CONFIRM: `${location.origin}/shop/confirm`,
  CURRENCY: 'ETH',
};
const ETH_GATEWAY_ID = 9;
const OPTION_TEXT = 'option';

class ShopDetail extends React.Component {

  static propTypes = {
    hideHeader: PropTypes.func.isRequired,
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
    };
    // need hide header
    props.hideHeader();
    // bind
    this.placeOrder = ::this.placeOrder;
    this.updateQuantity = ::this.updateQuantity;
  }

  addOptionTextToObject(object) {
    let newObject = {};
    for (let prop in object) {
      newObject[`${OPTION_TEXT}${prop}`] = object[prop];
    }
    return newObject;
  }

  get totalInfo() {
    const { productInfo, quantity } = this.state;
    if (!productInfo.cart) {
      return {
        totalPrice: 0,
        totalShippingPrice: 0,
        totalTaxPrice: 0,
      };
    }
    const ethRate = productInfo.cart.eth_rate;
    const totalPrice = (productInfo.cart.total_items_price / ethRate) * quantity;
    const totalShippingPrice = (productInfo.cart.total_shipping_price / ethRate) * quantity;
    const totalTaxPrice = (productInfo.cart.total_tax / ethRate) * quantity;
    const totalAmount = totalPrice + totalShippingPrice + totalTaxPrice;
    return { totalPrice, totalShippingPrice, totalTaxPrice, totalAmount };
  }
  
  async componentDidMount() {
    // get product buy slug
    const { slug } =  this.props.match.params;
    if (!slug) {
      // redirect to shop
      return;
    }
    // get product id and option default, ...
    const urlSlug = `https://www.autonomous.ai/api-v2/product-api/product/${slug}`;
    const { data: productBuySlug } = await $http({ url: urlSlug, method: 'GET' });
    this.setState({ product: productBuySlug.product });
    // get product information: price, option name, ...
    const urlProductInfo = `https://www.autonomous.ai/api-v2/product-api/product-info/${productBuySlug.product.id}`;
    const { data: productInfo } = await $http({ url: urlProductInfo, data: this.addOptionTextToObject(productBuySlug.product.selected_option), method: 'POST' });
    this.setState({ productInfo: productInfo.product_info, optionSelecting: productBuySlug.product.selected_option });
    // get product info design
    const urlProductInfoDesign = `https://www.autonomous.ai/api-v2/product-api/product-spec/${productBuySlug.product.id}?type=1`;
    const { data: productInfoHtml } = await $http({ url: urlProductInfoDesign, method: 'GET' });
    this.setState({ productInfoHtml: productInfoHtml.data });
    // get specs
    const urlProductSpecs = `https://www.autonomous.ai/api-v2/product-api/product-spec/${productBuySlug.product.id}?type=2`;
    const { data: productSpecs } = await $http({ url: urlProductSpecs, method: 'GET' });
    this.setState({ productSpecs: productSpecs.data });
    // get faq
    const urlProductFAQ = `https://www.autonomous.ai/api-v2/product-api/product-questions/${productBuySlug.product.id}`;
    const { data: productFAQ } = await $http({ url: urlProductFAQ, method: 'GET' });
    this.setState({ productFAQ: productFAQ.product_questions });
    // get reviews
    const urlProductReviews = `https://www.autonomous.ai/api-v2/product-api/product-reviews/${productBuySlug.product.id}?page=1&page_size=10`;
    const { data: productReviews } = await $http({ url: urlProductReviews, method: 'GET' });
    this.setState({ productReviews : productReviews.data });

    // set init form field
    const addressInfo = getJSON(CUSTOMER_ADDRESS_INFO);
    const { ipInfo } = this.props.app;

    this.quantityRef.value = this.state.quantity;
    if (addressInfo) {
      this.nameRef.value = addressInfo.fullname;
      this.emailRef.value = addressInfo.email;
      this.addressRef.value = addressInfo.shipping_address;
      this.zipRef.value = addressInfo.zip;
      this.cityRef.value = addressInfo.city;
      this.stateRef.value = addressInfo.state;
      this.countryRef.value = addressInfo.country;
    } else if (ipInfo) {
      this.cityRef.value = ipInfo.city;
      this.stateRef.value = ipInfo.regionCode;
      this.countryRef.value = ipInfo.country;
    }
  }

  videoOrImage(firstGallery, productName) {
    if (firstGallery.is_video) {
      // video
      return <iframe src={firstGallery.youtube_url} />
    } else {
      // image
      return <img src={firstGallery.image} alt={productName} />
    }
  }

  updateQuantity(e) {
    this.setState({ quantity: parseInt(e.target.value) });
  }

  async placeOrder(e) {
    e.preventDefault();

    const { optionSelecting, product } = this.state;
    // call place order
    const url = 'https://dev.autonomous.ai/api-v2/order-api/order/cart/checkout?use_wallet=false&promo=0';
    const data = {
      customer: {
        billing_address: '',
        city: this.cityRef.value.trim(),
        country: this.countryRef.value.trim(),
        email: this.emailRef.value.trim(),
        fullname: this.nameRef.value.trim(),
        phone: this.phoneRef.value.trim(),
        shipping_address: this.addressRef.value.trim(),
        state: this.stateRef.value.trim(),
        zip: this.zipRef.value.trim(),
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
      console.log(1111, amount);
      const paymentUrl = `${location.origin}/payment?order_id=${order_id}&amount=${amount}&currency=${SELLER_CONFIG.CURRENCY}&to=${SELLER_CONFIG.ETH_ADDRESS}&confirm_url=${SELLER_CONFIG.URL_CONFIRM}`;
      window.location.href = paymentUrl;
    } else {
      // fail
      alert(placeOrder.message);
    }
  }

  updateFieldForm = e => {
    console.log('e.target', e.target);
  }

  render() {
    const { product, productInfo, productInfoHtml, productSpecs, productFAQ, productReviews, quantity } = this.state;
    const imageSetting = {
      customPaging: i => <span className="dot" />,
      initialSlide: 1,
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
              productFAQ.map((item, index) => <p key={'product-faq' + index} dangerouslySetInnerHTML={{ __html: item.question }} />)
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
              <Input type="number" onRef={quantity => this.quantityRef = quantity} onChange={this.updateQuantity} />
              {/* <Field
                key="0"
                name="quantity"
                type="number"
                className="form-control"
                validate={[required]}
                component={fieldInput}
                ref={quantity => this.quantityRef = quantity}
                value={this.state.quantity}
                onChange={evt => this.updateFieldForm(evt)}
                autoComplete="off" /> */}
            </div>
            <div className="input-group">
              <label htmlFor="">Name</label>
              <Input type="text" onRef={name => this.nameRef = name} placeholder="Your name" />
              {/* <Field
                key="1"
                name="name"
                placeholder="Your name"
                type="text"
                className="form-control"
                validate={[required]}
                component={fieldInput}
                ref={name => this.nameRef = name}
                autoComplete="off" /> */}
            </div>
            <div className="input-group">
              <label htmlFor="">Email</label>
              <Input type="email" onRef={email => this.emailRef = email} placeholder={"Email for order confirmation"} />
              {/* <Field 
                key="2"
                name="email"
                placeholder={"Email for order confirmation"}
                type="text"
                className="form-control"
                validate={[required]}
                component={fieldInput}
                ref={email => this.emailRef = email}
                autoComplete="off" /> */}
            </div>
            <div className="input-group">
              <label htmlFor="">Address</label>
              <Input type="text" onRef={address => this.addressRef = address} placeholder="Shipping address" />
              {/* <Field 
                key="3"
                name="address"
                placeholder="Shipping address"
                type="text"
                className="form-control"
                validate={[required]}
                component={fieldInput}
                ref={address => this.addressRef = address}
                autoComplete="off" /> */}
            </div>
            <div className="area">
              <Input type="text" onRef={zip => this.zipRef = zip} placeholder="Zip code" />
              <Input type="text" onRef={city => this.cityRef = city} placeholder="City" />
              <Input type="text" onRef={state => this.stateRef = state} placeholder="State" />
              <Input type="text" onRef={country => this.countryRef = country} placeholder="Country" />
              {/* <Field key="4" name="zip" placeholder="Zip code" type="text" className="form-control" component={fieldInput} validate={[required]} ref={zip => this.zipRef = zip}
                autoComplete="off" />
              <Field key="5" name="city" placeholder="City" type="text" className="form-control" component={fieldInput} validate={[required]} ref={city => this.cityRef = city}
                autoComplete="off" />
              <Field key="6" name="state" placeholder="State" type="text" className="form-control" component={fieldInput} validate={[required]} ref={state => this.stateRef = state}
                autoComplete="off" />
              <Field key="7" name="country" placeholder="Country" type="text" className="form-control" component={fieldInput} validate={[required]} ref={country => this.countryRef = country}
              autoComplete="off" /> */}
            </div>
            <div className="input-group">
              <label htmlFor="">Phone</label>
              <Input type="tel" onRef={phone => this.phoneRef = phone} placeholder="Phone for delivery" />
              {/* <Field key="8" name="phone" placeholder="Phone for delivery" type="text" className="form-control" component={fieldInput} validate={[required]}
                     ref={phone => this.phoneRef = phone}
                autoComplete="off" /> */}
            </div>
            <Button block >
              Submit
            </Button>
            <div className="order-information">
              <div className="field-info">
                <strong>{product.name}</strong> <span className="red">ETH&nbsp;{productInfo.eth_price}</span>&nbsp;&nbsp;<span>(x{quantity})</span>
              </div>
              <div className="field-info">
                <span>Shipping:&nbsp;</span> <span>ETH&nbsp;{this.totalInfo.totalShippingPrice}</span>
              </div>
              <div className="field-info">
                <span>Tax:&nbsp;</span> <span>ETH&nbsp;{this.totalInfo.totalTaxPrice}</span>
              </div>
              <div className="field-info">
                <strong>Total:&nbsp;</strong> <strong className="red">ETH&nbsp;{this.totalInfo.totalAmount}</strong>
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

export default injectIntl(connect(mapState, ({ hideHeader }))(withRouter(ShopDetail)));