/**
 * Here is write function use common
 * @class Helper
 */
class Helper {
  /**
   * Is browser?
   * https://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser?answertab=votes#tab-top
   */
  static get broswer() {
    // don't support at server
    if (typeof window === 'undefined') {
      return {};
    }
    return {
      // Opera 8.0+
      isOpera: (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0, // eslint-disable-line
      // Firefox 1.0+
      isFirefox: typeof InstallTrigger !== 'undefined',
      // Safari 3.0+ "[object HTMLElementConstructor]"
      isSafari: /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === '[object SafariRemoteNotification]'; }(!window.safari || (typeof safari !== 'undefined' && safari.pushNotification))),  // eslint-disable-line
      // Internet Explorer 6-11
      isIE: /* @cc_on!@ */false || !!document.documentMode,
      // Chrome 1+
      isChrome: !!window.chrome && !!window.chrome.webstore,
    };
  }
}

export default Helper;
