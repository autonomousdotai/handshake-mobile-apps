import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// service
import $http from '@/services/api';
import Helper from '@/services/helper';
import { showAlert } from '@/reducers/app/action';
// import GA from '@/services/googleAnalytics';

import './ShareSocial.scss';

const Clipboard = (function (window, document, navigator) {
  let textArea,
    copy;

  function isOS() {
    return navigator.userAgent.match(/ipad|iphone/i);
  }

  function createTextArea(text) {
    textArea = document.createElement('textArea');
    textArea.value = text;
    document.body.insertBefore(textArea, document.body.firstChild);
  }

  function selectText() {
    let range,
      selection;
    if (isOS()) {
      range = document.createRange();
      range.selectNodeContents(textArea);
      selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      textArea.setSelectionRange(0, 999999);
    } else {
      textArea.select();
    }
  }

  function copyToClipboard() {
    const execCommand = document.execCommand('copy');
    document.body.removeChild(textArea);
    return execCommand;
  }
  copy = function (text) {
    createTextArea(text);
    selectText();
    return copyToClipboard();
  };
  return {
    copy,
  };
}(window, document, navigator));

class ShareSocial extends PureComponent {
  constructor(props) {
    super(props);
    this.clickShare = ::this.clickShare;
  }

  converToShortLink(longUrl) {
    const url = `https://www.googleapis.com/urlshortener/v1/url?key=${process.env.GOOGLE_API_KEY}`;
    const data = {
      longUrl,
    };
    return $http({ url, data, method: 'POST' });
  }

  async clickShare(e, shareType) {
    e.stopPropagation();
    const { title, shareUrl, sharePage } = this.props;
    let rawUrlShare = '';
    let shortLink = shareUrl;

    // Send GA
    // GA.createShareButton({
    //   category: sharePage,
    //   title,
    //   shareType,
    //   shareUrl,
    // });

    switch (shareType) {
      case 'TWITTER':
        // if (!Helper.broswer.isSafari) {
        //   try {
        //     const { data } = await this.converToShortLink(shareUrl);
        //     shortLink = data.id;
        //   } catch (error) {
        //     console.log(error);
        //   }
        // }
        rawUrlShare = `http://twitter.com/intent/tweet?text=${title}+${shareUrl}`;
        break;

      case 'LINKEDIN':
        rawUrlShare = `https://www.linkedin.com/shareArticle?mini=true&url=${shortLink}&summary=${title}&source=LinkedIn`;
        break;
      case 'COPY':
        // copy to clip board
        const resultCopy = Clipboard.copy(shortLink);
        if (Clipboard.copy(shortLink)) {
          this.props.showAlert({
            message: <div className="text-center">Copied to clipboard!</div>,
            timeOut: 3000,
            type: 'success',
          });
        } else {
          this.props.showAlert({
            message: <div className="text-center">Copy to clipboard fail! <p style={{ margin: 0 }}>{shortLink}</p></div>,
            timeOut: 20000,
            type: 'danger',
            isShowClose: true,
          });
        }
        return;
      default:
        // facebook
        rawUrlShare = `https://www.facebook.com/sharer/sharer.php?u=${shortLink}&quote=${title}`;
        break;
    }
    Helper.popupCenter(rawUrlShare, 'facebook', 670, 340);
  }

  render() {
    const { className, socialList } = this.props;
    return (
      <div className={`share-social ${className}`}>
        {
          socialList.map((social, index) => (
            <img key={index + 1} src={social.img} alt={social.title} onClick={(e) => { e.preventDefault(); this.clickShare(e, social.title); }} />
          ))
        }
      </div>
    );
  }
}

ShareSocial.propTypes = {
  shareUrl: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  showAlert: PropTypes.func.isRequired,
  className: PropTypes.string,
  socialList: PropTypes.instanceOf(Array),
};

ShareSocial.defaultProps = {
  className: '',
  socialList: [
    {
      img: 'https://d2q7nqismduvva.cloudfront.net/static/images/icon-svg/common/share/facebook.svg',
      title: 'FACEBOOK',
    }, {
      img: 'https://d2q7nqismduvva.cloudfront.net/static/images/icon-svg/common/share/twitter.svg',
      title: 'TWITTER',
    },
    {
      img: 'https://d2q7nqismduvva.cloudfront.net/static/images/icon-svg/common/share/linkedin.svg',
      title: 'LINKEDIN',
    },
  ],
};

const mapDispatch = ({
  showAlert,
});

export default connect(null, mapDispatch)(ShareSocial);
