import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// services, constants
import { loadCommentList } from '@/reducers/comment/action';
import { API_URL } from '@/constants';
import qs from 'qs';
import Helper from '@/services/helper';

// components
import { Grid, Row, Col } from 'react-bootstrap';
import CreateComment from '@/components/Comment/CreateComment';
import CommentItem from '@/components/Comment/CommentItem';

// self
import './Comment.scss';

class Comment extends React.PureComponent {
  constructor(props) {
    super(props);
    this.scrollToBottom = ::this.scrollToBottom;
  }

  componentDidMount() {
    const { location, loadCommentList } = this.props;
    const queryObject = qs.parse(location.search.slice(1));
    if (queryObject.objectId) {
      loadCommentList({
        PATH_URL: API_URL.COMMENT.LIST,
        qs: { object_id: Helper.getObjectIdOfComment({ id: queryObject.objectId }) }
      });
    }
    this.scrollToBottom();
  }

  componentDidUpdate() {
    setTimeout(this.scrollToBottom, 300);
  }

  scrollToBottom() {
    if (this.commentsRef && typeof window !== 'undefined') {
      window.scrollTo({
        top: this.commentsRef.scrollHeight,
        behavior: 'smooth'
      });
    }
  }

  render() {
    const { list, isFetching } = this.props.comment;
    const queryObject = qs.parse(this.props.location.search.slice(1));
    return (
      <Grid>
        <Row>
          <Col md={12} xs={12}>
            {
              list.length > 0 ? (
                <div className="comments" ref={element => this.commentsRef = element} id="listComments">
                  {list.map((item) => <CommentItem key={item.id} {...item} />)}
                </div>
              ) : !isFetching ? (
                <div className="noData">
                  <p className="text">No comment yet</p>
                </div>
              ) : null
            }
            <CreateComment
              onCreateCb={this.scrollToBottom}
              {...queryObject}
            />
          </Col>
        </Row>
      </Grid>
    );
  }
}

Comment.propTypes = {
  comment: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  loadCommentList: PropTypes.func.isRequired
};

const mapState = state => ({
  comment: state.comment,
  router: state.router
});

const mapDispatch = ({
  loadCommentList
});

export default connect(mapState, mapDispatch)(Comment);
