/**
 * VideoYoutube Component.
 */
import React from 'react';
import PropTypes from 'prop-types';
// services
// components
import YouTube from 'react-youtube';
// style
import './VideoYoutube.scss';
// import PLAY_BUTTON_ICON from '@/assets/images/shop/icon/play-button.svg';

const SpinnerSVG = 'https://d2q7nqismduvva.cloudfront.net/static/images/icon-svg/common/spinner.svg';
const VIDEO_ID_REGEXP = /([^/]+)(?=$)/;
const VIDEO_HEIGHT = '300';


class VideoYoutube extends React.Component {
  constructor(props) {
    super(props);
    // state
    this.state = {
      mvideoId: props.videoUrl.match(VIDEO_ID_REGEXP)[0],
      status: 0, // video off
    };
    // bind
    this.videoReady = this.videoReady.bind(this);
    this.playVideo = this.playVideo.bind(this);
    this.stopVideo = this.stopVideo.bind(this);
    this.hiddenLoading = this.hiddenLoading.bind(this);
    this.processPlayVideo = this.processPlayVideo.bind(this);
    this.hiddenPostImage = this.hiddenPostImage.bind(this);
  }

  videoReady({ target }) {
    this.youTubeRef = target;
    this.hiddenPostImage();
    if (this.props.hasOwnProperty('mute')) {
      this.youTubeRef.mute();
    }
    if (this.props.hasOwnProperty('youTubeRef')) {
      this.props.youTubeRef(target);
    }
  }

  processPlayVideo(e) {
    const { playVideo } = this.props;
    if (playVideo && typeof playVideo === 'function') {
      playVideo();
    } else {
      this.playVideo(e);
    }
  }

  playVideo(e) {
    const { status } = this.state;
    // stop all video playing
    // SystemEvent.emit(VIDEO_STOP);
    e && e.stopPropagation();
    if (this.youTubeRef) {
      this.youTubeRef.playVideo();
      this.hiddenPostImage();
    } else if (status === 0) {
      // init video
      this.setState({ status: 1 });
    }
    const { callbackPlayVideo } = this.props;
    if (callbackPlayVideo && typeof callbackPlayVideo === 'function') {
      callbackPlayVideo();
    }
  }

  pauseVideo(videoId) {
    if (videoId) {
      // only pause video has id === videoId
    } else {
      // force pause but video must playing
      if (this.youTubeRef && this.youTubeRef.getPlayerState() === 1) {
        this.youTubeRef.pauseVideo();
      }
    }
  }

  stopVideo(videoId) {
    if (videoId) {
      // only pause video has id === videoId
    } else {
      // force stop - status is 1 –> playing
      if (this.youTubeRef && this.youTubeRef.getPlayerState() === 1) {
        this.youTubeRef.stopVideo();
        this.imgCoverRef.style.display = 'block';
        this.youTubeContainerRef.style.display = 'none';
      }
    }
  }

  hiddenLoading() {
    // hidden loading - show image poster
    this.loadingRef.style.display = 'none';
    this.imgCoverRef.style.display = 'block';
  }

  hiddenPostImage() {
    this.imgCoverRef.style.display = 'none';
    this.youTubeContainerRef.style.display = 'block';
  }

  shouldComponentUpdate(nextProps, nexState) {
    return (nextProps.videoUrl !== this.props.videoUrl || nexState.status !== this.state.status);
  }

  componentDidMount() {
    if (this.props.hiddenLoading) {
      this.hiddenLoading();
    }
    // auto play video
    const { autoPlayVideo } = this.props;
    if (autoPlayVideo) {
      if (document.readyState !== 'complete') {
        window.addEventListener('load', () => {
          this.playVideo();
        }, false);
      } else {
        this.playVideo();
      }
    }
    // on event
    // SystemEvent.on(VIDEO_PAUSE, (videoId) => { this.pauseVideo(videoId); });
    // SystemEvent.on(VIDEO_STOP, (videoId) => { this.stopVideo(videoId); });
  }

  componentWillReceiveProps(nextProps) {
    const newVideoId = nextProps.videoUrl.match(VIDEO_ID_REGEXP)[0];
    if (newVideoId !== this.state.mvideoId) {
      this.setState({
        mvideoId: newVideoId,
      });
    }
  }

  componentWillUnmount() {
    // SystemEvent.removeListener(VIDEO_PAUSE);
    // SystemEvent.removeListener(VIDEO_STOP);
  }

  render() {
    const {
      imageUrl, imageAlt, autoPlayVideo, showLoading, playButtonIcon,
    } = this.props;
    const opts = {
      height: VIDEO_HEIGHT,
      width: '100%',
      playerVars: {
        autoplay: 1, // allway auto play
        rel: 0,
        showinfo: 0,
      },
    };
    const { mvideoId, status } = this.state;

    return (
      <div className="video-youtube">
        <div className="imgCover" ref={(imgCover => this.imgCoverRef = imgCover)}>
          <img className="img-fluid" src={imageUrl} alt={imageAlt} onLoad={this.hiddenLoading} />
          <div className="icon" onClick={this.processPlayVideo}>
            {
              playButtonIcon ? <img className="img-fluid" onClick={this.playVideo} src={playButtonIcon} /> : <span className="play-icon" onClick={this.playVideo} />
            }
            {/* <img className="img-fluid" onClick={this.playVideo} src={playButtonIcon || PLAY_BUTTON_ICON} alt="play" /> */}
          </div>
        </div>
        <div className="youTubeContainer embed-responsive embed-responsive-16by9" ref={(youTube => this.youTubeContainerRef = youTube)}>
          {
            status !== 0 && (
              <YouTube
                videoId={mvideoId}
                opts={opts}
                onReady={this.videoReady}
              />
            )
          }
        </div>
        <div className="loading" ref={loading => this.loadingRef = loading}>
          <img className="img-fluid" src={SpinnerSVG} alt="loading" />
        </div>
      </div>
    );
  }
}

VideoYoutube.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  imageAlt: PropTypes.string.isRequired,
  videoUrl: PropTypes.string.isRequired,
  autoPlayVideo: PropTypes.bool,
  hiddenLoading: PropTypes.bool,
  playVideo: PropTypes.func,
  callbackPlayVideo: PropTypes.func,
  youTubeRef: PropTypes.func,
  playButtonIcon: PropTypes.string,
};

VideoYoutube.defaultProps = {
  hiddenLoading: false,
};

export default VideoYoutube;