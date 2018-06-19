import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';
import { URL, BASE_API, API_URL } from '@/constants';
import $http from '@/services/api';
import Helper from '@/services/helper';

// style
import addAComment from '@/assets/images/icon/comment/add-a-comment.svg';
import './FeedComment.scss';

class FeedComment extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      commentCount: 0,
    };
    this.getCommentCount = ::this.getCommentCount;
  }

  componentDidMount() {
    this.getCommentCount(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.objectId !== this.props.objectId) {
      this.setState({ commentCount: 0 });
      this.getCommentCount(nextProps);
    }
  }

  getCommentCount(props) {
    const { objectId } = props;
    if (objectId) {
      const fullObjectId = Helper.getObjectIdOfComment({ id: objectId });
      const url = `${BASE_API.BASE_URL}/${API_URL.COMMENT.GET_COMMENT_COUNT}?object_id=${fullObjectId}`;
      const getCommentCountPromise = $http({ url, method: 'get' });
      getCommentCountPromise.then((response) => {
        const { status, data } = response.data;
        if (status === 1 && data > 0) {
          this.setState({ commentCount: data });
        }
      });
    }
  }

  render() {
    const { objectId } = this.props;
    const { commentCount } = this.state;
    const commentLink = `${URL.COMMENTS_BY_SHAKE_INDEX}?objectId=${objectId}`;
    return (
      <div className="feedComment">
        <Link className="addAComment" to={`${commentLink}&addComment=true`} title="add a comment">
          <img src={addAComment} alt="add a comment" /> <span>Add a comment</span>
        </Link>
        {
          commentCount > 0 && (
            <Link className="numComments" to={commentLink} title="numComments">
              {commentCount} {commentCount > 1 ? 'comments' : 'comment'}
            </Link>
          )
        }
      </div>
    );
  }
}

export default FeedComment;
