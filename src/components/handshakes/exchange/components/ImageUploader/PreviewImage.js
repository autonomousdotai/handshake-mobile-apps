import React, { PropTypes } from 'react';
import { Progress } from 'reactstrap';
import './styles.scss';

const PreviewImage = props => {
  const { className, file , onSelectFile, selected, disabled, ...rest } = props;
  const { url, percent } = file
  return (
    <div {...rest} className="w-100 h-100 d-flex align-items-center justify-content-center">
      {
        typeof percent === 'number' && (
          <Progress
            className="progressBar"
            color="primary"
            value={percent}
          />
        )
      }
      <img src={url} className="img-uploaded" />
    </div>
  );
};

PreviewImage.propTypes = {
};

export default PreviewImage;
