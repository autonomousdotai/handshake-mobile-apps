import React from 'react';
import {
  GoogleMap,
  Marker,
  withGoogleMap,
  withScriptjs,
} from 'react-google-maps';

import StationMarker from './StationMarker';
import './Map.scss';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import iconCurLocationButton from '@/assets/images/icon/current-location-button.png';
import currentLocationIndicator from '@/assets/images/icon/current-location-indicator.png';
import OfferShop from '@/models/OfferShop';


class Map extends React.Component {

  constructor(props) {
    super(props);

    // const { lat, lng } = this.props;

    this.state = {
      curStationIdShowAllDetails: null
    };
  }

  isEmptyBalance = item => {
    if (!item) {
      return;
    }

    const { actionActive } = this.props;
    const { buyAmount, sellAmount } = item;
    if (actionActive.includes('buy')) {
      return sellAmount <= 0;
    }
    return buyAmount <= 0;
  };

  handleOnChangeShowAllDetails = (id, newValue) => {
    this.setState({ curStationIdShowAllDetails: newValue ? id : null })
  }

  render() {
    const {
      isMarkerShown,
      onMarkerClick,
      stations,
      actionActive,
      currencyActive,
      onFeedClick,
      modalRef,
      setLoading,
      history,
      onGoToCurrentLocation,
      zoomLevel,
      lat, lng,
      onZoomChanged,
      onCenterChanged,
      onMapMounted,
      curLocation
    } = this.props;
    const { curStationIdShowAllDetails } = this.state;

    const center = { lat, lng }

    return (
      <GoogleMap
        zoom={zoomLevel}
        center={center}
        onZoomChanged={onZoomChanged}
        ref={onMapMounted}
        onCenterChanged={onCenterChanged}
        options={{ gestureHandling: 'greedy' }}
      >
        {stations &&
          stations.map(station => {
            const { id, ...rest } = station;
            const offer = OfferShop.offerShop(JSON.parse(station.extraData));
            const allowRender =
              offer.itemFlags[currencyActive] &&
              !this.isEmptyBalance(offer.items[currencyActive]);

            if (!allowRender) {
              return null;
            }
            return (
              <StationMarker
                key={id}
                {...rest}
                actionActive={actionActive}
                currencyActive={currencyActive}
                onFeedClick={extraData => onFeedClick(station, extraData)}
                offer={offer}
                modalRef={modalRef}
                setLoading={setLoading}
                showAllDetails={curStationIdShowAllDetails === id}
                onChangeShowAllDetails={(newValue) => this.handleOnChangeShowAllDetails(id, newValue)}
              />
            );
          })}
        <button
          className="btn-current-location"
          onClick={onGoToCurrentLocation}
        >
          <img src={iconCurLocationButton} width={30} />
        </button>
        <Marker
          defaultIcon={{
            url: currentLocationIndicator,
            scaledSize: { width: 30, height: 30 },
          }}
          position={curLocation}
          zIndex={-1111}
        />
      </GoogleMap>
    );
  }
}

const mapState = state => ({
  ipInfo: state.app.ipInfo,
});

const mapDispatch = dispatch => ({
  // rfChange: bindActionCreators(change, dispatch),
});

export default injectIntl(
  connect(mapState, mapDispatch)(withScriptjs(withGoogleMap(Map))),
);
