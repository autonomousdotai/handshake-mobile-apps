import React from 'react';
import Dropzone from 'react-dropzone';
import PreviewImage from './PreviewImage';

import placeHolder from '@/assets/images/icon/upload-image.svg';

import $http from '@/services/api';
import { BASE_API } from '@/constants';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import axios from 'axios';

// const line = require('static/images/line.svg')

export class Component extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  state = {
    files: [],
  }

  onDrop = (acceptedFiles) => {
    const { onSuccess, multiple, authProfile } = this.props;

    const file = acceptedFiles[0];
    let newFiles = this.state.files;

    $http({
      method: 'POST',
      url: `${BASE_API.BASE_URL}/storage/user/upload?file=${authProfile?.id}-${Date.now()}-${file.name}`,
      data: file,
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        const correspondingFile = newFiles.find(item => item.name === file.name);
        if (correspondingFile) {
          correspondingFile.percent = percentCompleted;
        }
        this.setState({ files: newFiles });
        this.forceUpdate();
      },
    }).then((res) => {
      const correspondingFile = newFiles.find(item => item.name === file.name);
      if (correspondingFile) {
        correspondingFile.url = `https://cdn-handshake-staging.autonomous.ai/${res.data.data}`;
        delete correspondingFile.percent;
        this.setState({ files: newFiles });
        this.forceUpdate();
        onSuccess(newFiles);
      }
    }).catch((err) => {
      console.log('err upload image', err);
    });

    newFiles = [{
      name: file.name,
      percent: file.percent,
    }];
    this.setState({ files: newFiles });
    this.forceUpdate();


    // const {onSuccess} = this.props;
    // // const newUploadFiles = [acceptedFiles[0]]
    // const newUploadFiles = acceptedFiles
    //
    // var metadata = {
    //   contentType: 'image/jpeg'
    // };
    // // Create a root reference
    // var storageRef = firebase.storage().ref();
    //
    // let newFiles = this.state.files
    // for (const file of newUploadFiles) {
    //   var uploadTask = storageRef.child('images/' + file.name).put(file, metadata);
    //
    //   // Listen for state changes, errors, and completion of the upload.
    //   uploadTask.on(
    //     firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
    //     (snapshot) => {
    //       // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    //       var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    //       // console.log('Upload is ' + progress + '% done');
    //       switch (snapshot.state) {
    //         case firebase.storage.TaskState.PAUSED: // or 'paused'
    //           // console.log('Upload is paused');
    //           break;
    //         case firebase.storage.TaskState.RUNNING: // or 'running'
    //           // console.log('Upload is running');
    //           break;
    //       }
    //       const correspondingFile = newFiles.find(item => item.name === file.name);
    //       if (correspondingFile) {
    //         correspondingFile.percent = progress
    //       }
    //       this.setState({ files: newFiles })
    //       this.forceUpdate();
    //     }, (error) => {
    //       // A full list of error codes is available at
    //       // https://firebase.google.com/docs/storage/web/handle-errors
    //       switch (error.code) {
    //         case 'storage/unauthorized':
    //           // User doesn't have permission to access the object
    //           break;
    //
    //         case 'storage/canceled':
    //           // User canceled the upload
    //           break;
    //
    //         case 'storage/unknown':
    //           // Unknown error occurred, inspect error.serverResponse
    //           break;
    //       }
    //     }, () => {
    //       // Upload completed successfully, now we can get the download URL
    //       const correspondingFile = newFiles.find(item => item.name === file.name);
    //       if (correspondingFile) {
    //         correspondingFile.url = uploadTask.snapshot.downloadURL
    //         delete correspondingFile.percent;
    //         this.setState({ files: newFiles })
    //         this.forceUpdate();
    //
    //         //Send file upload success to parent
    //         onSuccess(newFiles);
    //       }
    //     });
    //
    //   // request.on('progress', e => {
    //   //   // eslint-disable-next-line
    //   //   // if (!request._aborted) {
    //   //   //   // eslint-disable-next-line
    //   //   //   newValue = newValue.filter(f => !f.request || !f.request._aborted);
    //   //   //   const correspondingFile = newValue.find(item => isTheSameFile(item, file));
    //   //   //   if (correspondingFile) {
    //   //   //     correspondingFile.percent = e.percent;
    //   //   //   }
    //   //   //   onChange(newValue);
    //   //   //   this.forceUpdate();
    //   //   // }
    //   // });
    //   // request.end((err, res) => {
    //   //   if (!err) {
    //   //     const { image_id, image_url, thumb_url } = res.body;
    //   //     const foundFile = newValue.find(item => isTheSameFile(item, file));
    //   //     /* eslint-disable */
    //   //     foundFile.image_id = image_id;
    //   //     foundFile.image_url = image_url.replace('http://','https://').replace('aithumb_0', 'mob_thumbs_app');
    //   //     foundFile.thumb_url = thumb_url.replace('http://','https://').replace('aithumb_0', 'mob_thumbs_app');
    //   //     /* eslint-enable */
    //   //     delete foundFile.request;
    //   //     delete foundFile.percent;
    //   //     onChange(newValue);
    //   //     this.forceUpdate();
    //   //   } else {
    //   //     // this.setState({
    //   //     //   componentError: [
    //   //     //     ...this.state.componentError,
    //   //     //     'Có lỗi upload ảnh, vui lòng kiểm tra (định dạng, dung lượng, ...) ảnh và thử lại.'
    //   //     //   ]
    //   //     // });
    //   //     // setTimeout(() => {
    //   //     //   newValue = newValue.filter(item => !isTheSameFile(item, file));
    //   //     //   onChange(newValue);
    //   //     //   this.forceUpdate();
    //   //     // }, 2000);
    //   //   }
    //   // });
    //   newFiles = [...newFiles, {
    //     name: file.name,
    //     percent: file.percent,
    //   }];
    // }
    // this.setState({ files: newFiles })
    // this.forceUpdate()
  }
  // onChange(newValue);


  onOpenClick = () => {
    this.dropzone.open();
  }
  render() {
    const { files } = this.state;
    // eslint-disable-next-line
    const { imgSample, onSuccess, authProfile, ...rest } = this.props
    return (
      <div>
        {/* <button className='btn btn-primary mb-1' type='button' onClick={this.onOpenClick}> */}
        {/* UPLOAD FILE */}
        {/* </button> */}
        <div>
          <div>
            <Dropzone
              disablePreview
              accept="image/*"
              style={{
                // backgroundImage: `url(${placeHolder})`,
                // backgroundSize: 'contain',
                // backgroundPosition: 'center',
                // backgroundRepeat: 'no-repeat',
                /* Rectangle 12: */
                background: '#F9F9F9',
                border: '2px dashed #CBCBCB',
                height: '169px',
                width: '100%',
                borderRadius: '6px',
              }}
              ref={e => (this.dropzone = e)}
              onDrop={this.onDrop}
              // disableClick
              {...rest}
            >
              <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                {
                  files.length > 0 ? files.map((file, index) => (
                    <PreviewImage
                      key={index}
                      file={file}
                    />
                  )) : (
                    <div>
                      <img src={placeHolder} className="img-fluid" />
                    </div>
                  )
                }
              </div>
            </Dropzone>
          </div>
          {/* <div className='col-1 d-flex align-items-center justify-content-center'> */}
          {/* <img src={line} /> */}
          {/* </div> */}
          <div className="col-5 d-flex align-items-center justify-content-center">
            <div><img src={null} className="img-fluid" /></div>
          </div>
        </div>

      </div>
    );
  }
}

Component.propTypes = {
};

const mapState = state => ({
  authProfile: state.auth.profile,
});

const mapDispatch = ({
});

export default injectIntl(connect(mapState, mapDispatch, null, { withRef: true })(Component), { withRef: true });
