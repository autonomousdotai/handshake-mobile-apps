import React from 'react';
import { GoogleMap, Marker, withGoogleMap, withScriptjs } from 'react-google-maps';

import StationMarker from './StationMarker';
import './Map.scss';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import iconCurLocationButton from '@/assets/images/icon/current-location-button.png';
import currentLocationIndicator from '@/assets/images/icon/current-location-indicator.png';
import iconManageAtm from '@/assets/images/cash/ic-manage-atm.svg';
import iconManageDashboard from '@/assets/images/cash/ic-dashboard.svg';
import { HANDSHAKE_ID, URL } from '@/constants';
import cx from 'classnames';
import iconMyATM from './icons8-location_off.svg';

class Map extends React.Component {
  goToDashboard = () => {
    this.props.openNewTransaction();
  }

  goToManageAtm = () => {
    // this.props.history.push(`${URL.CASH_STORE_URL}`);
    this.props.openAtmManagement();
  }

  render() {
    const {
      isMarkerShown,
      onMarkerClick,
      stations,
      offers,
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
      curLocation,
      mapCenterLat,
      mapCenterLng,
      cashStore,
      curStationIdShowAllDetails,
      onChangeShowAllDetails
    } = this.props;

    let markers = [];
    if (stations && stations.length > 0) {
      markers = stations.map((station, index) => {
        const { id, ...rest } = station;
        const offer = offers[index];

        return (
          <StationMarker
            key={id}
            {...rest}
            actionActive={actionActive}
            currencyActive={currencyActive}
            onFeedClick={extraData => onFeedClick(station, extraData)}
            history={history}
            offer={offer}
            modalRef={modalRef}
            setLoading={setLoading}
            showAllDetails={curStationIdShowAllDetails === id}
            onChangeShowAllDetails={(newValue) => onChangeShowAllDetails(id, newValue)}
          />
        );
      });
    }

    return (
      <GoogleMap
        zoom={zoomLevel}
        center={{ lat: mapCenterLat, lng: mapCenterLng }}
        onZoomChanged={onZoomChanged}
        ref={onMapMounted}
        onCenterChanged={onCenterChanged}
        options={{
          gestureHandling: 'greedy',
          zoomControl: false,
          fullscreenControl: false,
          mapTypeControl: false,
          streetViewControl: false,
        }}
      >
        {markers}
        {
          cashStore && (<button
            className="btn-current-location"
            onClick={() => onGoToCurrentLocation()}
          >
            <img src={iconMyATM} width={30} />
          </button>)
        }

        <Marker
          defaultIcon={{
            url: currentLocationIndicator,
            scaledSize: { width: 30, height: 30 },
          }}
          position={curLocation}
          zIndex={-1111}
        />
        <div className="container-button">
          {
            cashStore && (
              <div className="d-inline-block w-50 pr-1">
                <button className="btn bg-white btn-block btn-dashboard" onClick={this.goToDashboard}>
                  <img src={iconManageDashboard} width={16} className="mr-2" />
                  <FormattedMessage id="ex.discover.label.dashboard" />
                </button>
              </div>
            )
          }

          <div className={cx('d-inline-block pl-1', cashStore ? 'w-50' : 'w-100')}>
            <button className="btn btn-block btn-manage-atm" onClick={this.goToManageAtm}>
              <img src={iconManageAtm} width={16} className="mr-2" />
              {
                cashStore ? <FormattedMessage id="ex.discover.label.manage.atm" /> : <FormattedMessage id="ex.discover.label.open.atm" />
              }

            </button>
          </div>
        </div>
      </GoogleMap>
    );
  }
}

const mapState = state => ({
  ipInfo: state.app.ipInfo,
  cashStore: state.exchange.cashStore,
});

const mapDispatch = dispatch => ({
  // rfChange: bindActionCreators(change, dispatch),
});

export default injectIntl(
  connect(mapState, mapDispatch)(withScriptjs(withGoogleMap(Map))),
);
