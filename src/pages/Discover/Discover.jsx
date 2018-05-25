import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// service, constant
import { load } from '@/reducers/discover/action';
// components
import { Grid, Row, Col } from 'react-bootstrap';
import Button from '@/components/core/controls/Button';
import Feed from '@/components/core/presentation/Feed';
import Modal from '@/components/core/controls/Modal';
import ModalDialog from '@/components/core/controls/ModalDialog';
import SearchBarContainer from '@/components/core/controls/SearchBarContainer';
import Category from '@/components/core/controls/Category';
import { handShakeList } from '@/data/shake.js';
import BettingItem from '@/components/Betting/BettingItem';
import BettingShake from '@/components/Betting/BettingShake';

// style
import './Discover.scss';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
  }

  get feedHtml() {
    return handShakeList.data.map(handShake => (
      <Col md={12} xs={12} key={handShake.id} className="feed-wrapper">
        <Feed className="feed">
          {handShake.industries_type === 18 ?  <BettingItem item={handShake}/>:
            <div>
            <p className="description">{handShake.description}</p>
            <p className="email">{handShake.from_email}</p>
          </div>}
        </Feed>
        <Button block onClick={()=> this.shakeItem(handShake)}>Shake now</Button>

      </Col>
    ));
  }
  shakeItem(item){
    switch(item.industries_type){
      case 18:
      this.modalBetRef.open();

      console.log('Shake Betting:', item);
      break;
      default:
      console.log('Shake Item:', item);
      break;
    }
  }

  get searchBar() {
    return (
      <Col md={12} xs={12}>
        <SearchBarContainer />
      </Col>
    );
  }

  get categoryBar() {
    return  <Col md={12} xs={12}>
    <Category className="category-wrapper" />
      </Col>;
  }

  render() {
    return (
      <Grid>
        <Row>{this.searchBar}</Row>
        <Row>
          {this.categoryBar}
        </Row>
        <ModalDialog title="Make a bet"
        onRef={modal => this.modalBetRef = modal}>
            <BettingShake remaining={10} odd={0.1}
            onCancelClick={()=> this.modalBetRef.close()}
            onSubmitClick={()=> this.modalBetRef.close()}/>
           </ModalDialog>
        <Row>{this.feedHtml}</Row>
      </Grid>

    );
  }
}

Dashboard.propTypes = {
  discover: PropTypes.object,
  load: PropTypes.func,
};

const mapState = state => ({
  discover: state.discover,
});

const mapDispatch = {
  load,
};

// export default Dashboard;
// export default connect(null, ({ load }))(Dashboard);
export default connect(mapState, mapDispatch)(Dashboard);
