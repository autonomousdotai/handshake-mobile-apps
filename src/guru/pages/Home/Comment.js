import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { URL } from '@/constants';

const Comment = (props) => {
  const htmlClassName = 'Comment';
  const { event } = props;
  const commentLink = `${URL.COMMENTS}?objectId=${event.id}`;
  return (
    <div className={htmlClassName}>
      <i className="far fa-comment" />
      <Link to={commentLink}>Write a comment</Link>
    </div>
  );
};

Comment.propTypes = {
  event: PropTypes.object
};

Comment.defaultProps = {
  event: undefined
};

export default Comment;
