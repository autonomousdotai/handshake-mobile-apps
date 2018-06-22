import React, { PropTypes } from 'react';
import { Progress } from 'reactstrap';

const PreviewImage = props => {
  const { className, file , onSelectFile, selected, disabled, ...rest } = props;
  const { url, percent } = file
  return (
    <div {...rest}>
      {
        typeof percent === 'number' && (
          <Progress
            // className={styles.progressBar}
            color="primary"
            value={percent}
          />
        )
      }
      <img src={url} className="img-fluid" width={300} height={300} />
    </div>
  );
};

PreviewImage.propTypes = {
};

export default PreviewImage;
