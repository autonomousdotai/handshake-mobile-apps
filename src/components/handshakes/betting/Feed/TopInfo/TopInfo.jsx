import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getCommentCountById } from '@/reducers/comment/action';
import { API_URL, URL } from '@/constants';
import Helper from '@/services/helper';
// components
import ModalDialog from '@/components/core/controls/ModalDialog';
import { Link } from 'react-router-dom';

import './TopInfo.scss';
import commentIcon from '@/assets/images/icon/comment/comment-icon-top-info.svg';


class TopInfo extends React.Component {
  static propTypes = {
    marketTotal: PropTypes.number,
    percentFee: PropTypes.number,
    getCommentCountById: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      commentNo: 0,
    };
  }
  isFirstCallCommmentCount = false;

  componentDidMount() {
    this.getCommentCount(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.objectId !== this.props.objectId) {
      this.getCommentCount(nextProps);
    }
  }

  getCommentCount(props) {
    const { objectId, getCommentCountById } = props;
    if (objectId) {
      getCommentCountById({
        PATH_URL: API_URL.COMMENT.GET_COMMENT_COUNT,
        qs: { object_id: Helper.getObjectIdOfComment({ id: objectId }) },
        successFn: ({ status, data }) => {
          this.setState({ commentNo: data });
          this.isFirstCallCommmentCount = true;
        },
        errorFn: () => {
          this.setState({ commentNo: 0 });
          this.isFirstCallCommmentCount = true;
        },
      });
    }
  }

  render()  {
    const { marketTotal, percentFee, objectId } = this.props;
    const { commentNo } = this.state;
    const commentLink = `${URL.COMMENTS_BY_SHAKE_INDEX}?objectId=${objectId}`;
    const addCommentLink = `${commentLink}&addComment=true`;
    return (
      <div className="wrapperTopInfoContainer">
        <div className="boxInfo" onClick={() => this.modalTradedVolumeRef.open()}>
          <div className="number">{marketTotal === 0 ? marketTotal : marketTotal.toFixed(3)} ETH</div>
          <div className="des">Market volume</div>
        </div>
        {/*<div className="boxInfo" onClick={() => this.modalWiningFeeRef.open()}>
          <div className="number">{percentFee}%</div>
          <div className="des">Market fee</div>
    </div>*/}
        {
          (commentNo > 0 || !this.isFirstCallCommmentCount) ? (
            <Link className="boxInfo" to={commentLink}>
              <div className="number">
                <img src={commentIcon} alt="comment icon" />
                <span>{commentNo}</span>
                </div>
              <div className="des">Comment{(commentNo === 0 || commentNo > 1) ? 's' : ''}</div>
            </Link>
          ) : (
            <Link className="boxInfo" to={addCommentLink}>
              {/*<div className="des">Say something</div>*/}
              <div className="number">
                <img src={commentIcon} alt="comment icon" />
                <span>0</span>
              </div>
              <div className="des">Comments</div>
            </Link>
          )
        }
        <ModalDialog className="modal-info-betting" title="Market volume" onRef={modal => this.modalTradedVolumeRef = modal}>
          <p>The market volume of this prediction is the current amount wagered by all participating ninjas.</p>
        </ModalDialog>
        <ModalDialog className="modal-info-betting" title="Market fee" onRef={modal => this.modalWiningFeeRef = modal}>
          <p>The Ninja that created this prediction is free to set his own fees.</p>
          <p>It will be a percentage of the total amount wagered by all participating ninjas.</p>
        </ModalDialog>
      </div>
    );
  }
}

const mapDispatch = ({
  getCommentCountById,
});

export default connect(null, mapDispatch)(TopInfo);
