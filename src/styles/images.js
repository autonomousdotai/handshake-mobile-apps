import React from 'react';

export const ICON = {
  ArrowDown: (color='#000', css='fa-2x') => {
    return <svg aria-hidden="true" data-prefix="fal" data-icon="angle-down" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512" className={"svg-inline--fa fa-angle-up fa-w-8 " + css}>
    <path fill={color} d="M119.5 326.9L3.5 209.1c-4.7-4.7-4.7-12.3 0-17l7.1-7.1c4.7-4.7 12.3-4.7 17 0L128 287.3l100.4-102.2c4.7-4.7 12.3-4.7 17 0l7.1 7.1c4.7 4.7 4.7 12.3 0 17L136.5 327c-4.7 4.6-12.3 4.6-17-.1z"  className={"svg-inline--fa fa-angle-up fa-w-8 " + css}></path>
    </svg>
  },
  ArrowUp: (color='#000', css='fa-2x') => {
    return <svg aria-hidden="true" data-prefix="fal" data-icon="angle-up" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512" className={"svg-inline--fa fa-angle-up fa-w-8 " + css}>
    <path fill={color} d="M136.5 185.1l116 117.8c4.7 4.7 4.7 12.3 0 17l-7.1 7.1c-4.7 4.7-12.3 4.7-17 0L128 224.7 27.6 326.9c-4.7 4.7-12.3 4.7-17 0l-7.1-7.1c-4.7-4.7-4.7-12.3 0-17l116-117.8c4.7-4.6 12.3-4.6 17 .1z"  className={"svg-inline--fa fa-angle-up fa-w-8 " + css}>
    </path>
    </svg>
  },
  QRCode: (color='#8A8A8F') => {
    return <svg width="31px" height="18px" viewBox="0 0 31 18" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <g id="App--Wallet" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <g id="Discover-first-sight-Copy-9" transform="translate(-354.000000, -206.000000)" fill={color} fillRule="nonzero">
              <g id="icons8-palm_scan" transform="translate(354.000000, 206.000000)">
                  <path d="M6.13541667,0 C5.77827083,0 5.48958333,0.288 5.48958333,0.642857143 L5.48958333,4.5 C5.48958333,4.85485714 5.77827083,5.14285714 6.13541667,5.14285714 C6.4925625,5.14285714 6.78125,4.85485714 6.78125,4.5 L6.78125,1.28571429 L10.0104167,1.28571429 C10.3675625,1.28571429 10.65625,0.997714286 10.65625,0.642857143 C10.65625,0.288 10.3675625,0 10.0104167,0 L6.13541667,0 Z M21.6354167,0 C21.2782708,0 20.9895833,0.288 20.9895833,0.642857143 C20.9895833,0.997714286 21.2782708,1.28571429 21.6354167,1.28571429 L24.8645833,1.28571429 L24.8645833,4.5 C24.8645833,4.85485714 25.1532708,5.14285714 25.5104167,5.14285714 C25.8675625,5.14285714 26.15625,4.85485714 26.15625,4.5 L26.15625,0.642857143 C26.15625,0.288 25.8675625,0 25.5104167,0 L21.6354167,0 Z M6.86099358,8.35714286 L0.797200521,8.35714286 C0.534921549,8.35714286 0.322916667,8.64514286 0.322916667,9 C0.322916667,9.35485714 0.534921549,9.64285714 0.797200521,9.64285714 L10.6080215,9.64285714 L30.2027995,9.64285714 C30.4650785,9.64285714 30.6770833,9.35485714 30.6770833,9 C30.6770833,8.64514286 30.4650785,8.35714286 30.2027995,8.35714286 L22.9449598,8.35714286 L6.86099358,8.35714286 Z M6.13541667,12.8571429 C5.77827083,12.8571429 5.48958333,13.1451429 5.48958333,13.5 L5.48958333,17.3571429 C5.48958333,17.712 5.77827083,18 6.13541667,18 L10.0104167,18 C10.3675625,18 10.65625,17.712 10.65625,17.3571429 C10.65625,17.0022857 10.3675625,16.7142857 10.0104167,16.7142857 L6.78125,16.7142857 L6.78125,13.5 C6.78125,13.1451429 6.4925625,12.8571429 6.13541667,12.8571429 Z M25.5104167,12.8571429 C25.1532708,12.8571429 24.8645833,13.1451429 24.8645833,13.5 L24.8645833,16.7142857 L21.6354167,16.7142857 C21.2782708,16.7142857 20.9895833,17.0022857 20.9895833,17.3571429 C20.9895833,17.712 21.2782708,18 21.6354167,18 L25.5104167,18 C25.8675625,18 26.15625,17.712 26.15625,17.3571429 L26.15625,13.5 C26.15625,13.1451429 25.8675625,12.8571429 25.5104167,12.8571429 Z" id="Shape"></path>
              </g>
          </g>
      </g>
    </svg>
  },
  SuccessChecked: () => {
    return <svg width="18px" height="18px" viewBox="0 0 18 18" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <g id="App--Wallet" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g id="Discover-first-sight-Copy-14" transform="translate(-101.000000, -74.000000)">
          <g id="Group-11" transform="translate(102.000000, 75.000000)">
            <circle id="Oval-3" stroke="#155724" cx="8" cy="8" r="8"></circle>
            <path d="M10.7088916,4.0102581 C10.6032949,4.02767796 10.514371,4.08574295 10.4421199,4.19606605 L6.95185681,9.60772263 L5.30676465,7.91222507 C5.165042,7.68867507 4.89271291,7.6712552 4.75099027,7.8193211 L4.10629198,8.49287492 C3.96456934,8.71642493 3.96456934,9.01836285 4.10629198,9.16642874 L6.59616121,11.7677401 C6.73788386,11.8432249 6.93796263,12 7.15193559,12 C7.29365824,12 7.52152538,11.9216121 7.66324802,11.6980621 L11.9315953,5.1483318 C12.0733179,4.92478179 11.9927308,4.71574785 11.7092855,4.56768195 L10.9978943,4.03348409 C10.925644,3.99574204 10.8144891,3.99283897 10.7088916,4.0102581 Z" id="Path" fill="#155724"></path>
          </g>
        </g>
      </g>
    </svg>
  }
};
