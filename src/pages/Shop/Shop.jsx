import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { URL } from '@/constants';
import { withRouter } from 'react-router-dom';
import $http from '@/services/api';
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
    const url = 'https://www.autonomous.ai/api-v2/product-api/v2/products?is_marketplace=0&group=1&page_size=12';
    const products = $http({ url, method: 'GET' });
    products.then(result =>  {
      const { data:source } = result;
      this.setState({ products: source.data.products});
    });
  }

  videoOrImage(firstGallery, productName) {
    if (firstGallery.is_video) {
      // video
      return  <div className="embed-responsive embed-responsive-16by9">
                <iframe className="embed-responsive-item" src={firstGallery.youtube_url}  />
              </div>
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
                <span>{product.product_review} reviews</span>
              </div>
            </div>
          </div>)
        }
      </div>
    );
  }
}

const mapState = state => ({
  // discover: state.discover,
});

const mapDispatch = dispatch => ({
  // rfChange: bindActionCreators(change, dispatch),
});

export default injectIntl(connect(null, null)(withRouter(Shop)));
