import React, {Component} from 'react';
import { connect } from 'react-redux';
import { fetch_traders } from '../../reducers/invest/action';
import ('./TraderList.scss');
import StarRatings from 'react-star-ratings';
import ErrorBoundary from '../../components/ErrorBoundary';
import { currencyFormat }from '../../utils/number';
const IMAGE_PREFIX = 'http://35.198.235.226:9000/api/file-storages/avatar/download';
const toHexColor = (str) => {
	var hex = '';
	for(var i=0;i<str.length;i++) {
		hex += ''+str.charCodeAt(i).toString(16);
	}
	return `#${hex.substring(0, 6)}`;
};

const TraderItem = ({ avatar, firstName, lastName, rating, average = 0, amount, handleOnClick }) => (
    <div className="traderItem" onClick={handleOnClick}>
        <div className="userInfoBlock clearfix">
            <div className="traderItem-left">
            {avatar && <img
                src={avatar.indexOf('http') >= 0 ? avatar :`${IMAGE_PREFIX}/${avatar}`}
                alt=""
                className="userImage"
            />}
            {!avatar && <div className="avatar_non" style={{ backgroundColor: toHexColor(firstName)}}>
                {`${firstName[0].toUpperCase() + lastName[0].toUpperCase()}`}
            </div>}
            <label>{firstName}</label>
            <div className="star-ratings">
                <StarRatings
                className="stars"
                rating={rating}
                isSelectable={false}
                starDimension="14px"
                starRatedColor="#546FF7"
                starSpacing="3px"
                numberOfStars={5}
                name="rating"
                />
                {/* <span className="rating-count">(26)</span> */}
            </div>
            </div>
            <div className="traderItem-right">
            <div>
                <label className={ average > 0 ? "green" : "red" }>{`${average*100}%`}</label>
                <label className="grey fontSmall">AVERAGE RETURNS</label>
            </div>
            <div>
                <label>{currencyFormat.format(amount || 0)}</label>
                <label className="grey fontSmall">CUM EARNINGS</label>
            </div>
            </div>
        </div>
    </div>
);

const TraderItemBoudary = (props) => (
    <ErrorBoundary>
        <TraderItem {...props} />
    </ErrorBoundary>
);

class TraderList extends Component {
    constructor(props) {
        super(props);
        this.props.fetch_traders().then().catch(err => err);
    }
    shouldComponentUpdate = (nextProps) => nextProps.traders.length !== this.props.traders.length

    navigateToDetail = item => this.props.history.push(`/invest/trader/${item.id}`)
    
    render() {
        return (
            this.props.traders.map((e, i) => (<TraderItemBoudary handleOnClick={this.navigateToDetail.bind(this, e)} key={i} {...e} />))
        )
    }
}

const mapState = state => ({
    traders: state.invest && state.invest.traders ? state.invest.traders : []
});
const mapDispatch = { fetch_traders }

export default connect(mapState, mapDispatch)(TraderList)