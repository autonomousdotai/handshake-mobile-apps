import React from "react";
import NavigationBar from "@/modules/NavigationBar/NavigationBar";
import DynamicImport from "@/components/App/DynamicImport";
import Prediction from '@/pages/Prediction/Prediction';
import Loading from "@/components/core/presentation/Loading";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { URL } from '@/constants';
import { withRouter } from 'react-router-dom';

import local from '@/services/localStore';

const Discover = props => (
  <DynamicImport
    loading={Loading}
    load={() => import("@/pages/Discover/Discover")}
  >
    {Component => <Component {...props} />}
  </DynamicImport>
);

// export default function Exchange() {
//   return (
//     <div className="Exchange">
//       <NavigationBar />
//       {/*<Prediction />*/}
//       <Discover />
//     </div>
//   );
// }
const keyLastSelectedExchangeId = 'lastSelectedExchangeId';

const mapComponent = {
  [URL.HANDSHAKE_PREDICTION]: { url: URL.HANDSHAKE_PREDICTION, component: <Prediction /> },
  [URL.HANDSHAKE_CASH]: { url: URL.HANDSHAKE_CASH, component: <Discover history={{}} /> },
}

const defaultUrl = URL.HANDSHAKE_PREDICTION;

class Exchange extends React.Component {
  state = {
    selectedMenuId: defaultUrl,
  }

  handleClickMenuItem = (url) => {
    const { history } = this.props;
    this.setState({ selectedMenuId: url });
    local.save(keyLastSelectedExchangeId, url);
    history.push(url);
  }
  componentDidMount() {
    const { match: { path }, history } = this.props;
    let selectedMenuId = defaultUrl;
    if (path === URL.HANDSHAKE_EXCHANGE) {
      selectedMenuId = local.get(keyLastSelectedExchangeId) || defaultUrl;
    } else {
      selectedMenuId = mapComponent[path] ? path : defaultUrl;
    }
    this.setState({ selectedMenuId });
    local.save(keyLastSelectedExchangeId, selectedMenuId);

    // if pathname === /cash, redirect to /cash to use a different layout!
    // if (selectedMenuId === URL.HANDSHAKE_CASH) {
    //   history.push(selectedMenuId);
    // }
  }

  render() {
    const { messages } = this.props.intl;
    const { intl, hideNavigationBar } = this.props;

    const { selectedMenuId } = this.state;

    return (
      <div className="Exchange">
        {
          !hideNavigationBar && (
            <NavigationBar
              selectedMenuId={selectedMenuId}
              onClickMenuItem={this.handleClickMenuItem}
            />
          )
        }
        {mapComponent[selectedMenuId].component}
      </div>
    );
  }
}

const mapState = state => ({
  // discover: state.discover,
});

const mapDispatch = dispatch => ({
  // rfChange: bindActionCreators(change, dispatch),
});

export default injectIntl(connect(null, null)(withRouter(Exchange)));
