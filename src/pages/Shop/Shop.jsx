import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { URL, AUTONOMOUS_END_POINT } from '@/constants';
import { withRouter } from 'react-router-dom';
import $http from '@/services/api';
// component
import VideoYoutube from './Utility/VideoYoutube';
// style
import './Shop.scss';
const EthSVG = 'https://d2q7nqismduvva.cloudfront.net/static/images/icon-svg/common/eth-sign.svg';

class Shop extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      products: [],
    };
  }

  componentDidMount() {
    // get products
    const url = `${AUTONOMOUS_END_POINT.BASE}${AUTONOMOUS_END_POINT.PRODUCTS}?is_marketplace=0&group=1&page_size=20`;
    const products = $http({ url, method: 'GET' });
    products.then(result =>  {
      const { data:source } = result;
      this.setState({ products: source.data.products});
    });
    // $zopim.livechat.button.hide();
  }

  videoOrImage(firstGallery, productName) {
    if (firstGallery.is_video) {
      // video
      return  <VideoYoutube
                videoUrl={firstGallery.youtube_url}
                imageUrl={firstGallery.image}
                imageAlt={productName}
              />
    } else {
      // image
      return <img src={firstGallery.image} alt={productName} />
    }
  }

  onSeeMore = (slug) => {
    const { history } = this.props;
    history.push(`${URL.SHOP_URL}/${slug}`);
  }

  render() {
    const { products } = this.state;
    return (
      <div className="Shop">
        {/* <div className="header-block">
          <h1>Ninja Shop</h1>
        </div> */}
        <div className="products">
        {
          products.map(product => <div key={product.product_id} className="product" onClick={() => this.onSeeMore(product.product_slug)}>
            {this.videoOrImage(product.galleries[0], product.product_name)}
            <p className="product-name">
              {product.product_name}
            </p>
            <div className="price-review">
              <div className="price">
                <img src={EthSVG} alt="Eth" />&nbsp;
                {product.product_eth_price}
              </div>
              <div className="review">
                <span>{product.product_review * 2} reviews</span>
              </div>
            </div>
          </div>)
        }
        </div>
      </div>
    );
  }
}

export default injectIntl(connect(null, null)(withRouter(Shop)));
