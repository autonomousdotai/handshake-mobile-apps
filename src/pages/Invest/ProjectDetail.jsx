import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetch_project_detail, getImageUrl, toHexColor, date_diff_indays } from '@/reducers/invest/action';
import { Grid, Row, Col, ProgressBar ,Button } from 'react-bootstrap';
import _ from 'lodash';
import Utils from './Utils';
import StarRatings from 'react-star-ratings';
import './ProjectList.scss';
import iconBitcoin from '@/assets/images/icon/coin/btc.svg';
import iconEthereum from '@/assets/images/icon/coin/eth.svg';
import iconUsd from '@/assets/images/icon/coin/icons8-us_dollar.svg';
import InvestNavigation from './InvestNavigation';
// Refer to FeedCreditCard.jsx
const etherScanTxUrl = 'https://rinkeby.etherscan.io/tx';
const linkToEtherScan = (tx) => `${etherScanTxUrl}/${tx}`;
const transformString = str => str.substring(0, 7) + '...'+ str.substring(str.length-5, str.length);
import ProjectInfo from './ProjectDetailBlock/ProjectInfo';
import FormInvestBlock from './ProjectDetailBlock/FormInvestBlock';
import VoteStopBlock from './ProjectDetailBlock/VoteStopBlock';
import OrderHistory from './ProjectDetailBlock/OrderHistory';
export const CRYPTO_ICONS = {
  ETH: iconEthereum,
  BTC: iconBitcoin,
  USDT: iconUsd,
};
import Loading from '@/components/Loading';
const states = [
  'READY',
  'CLOSED',
  // 'INITFUND'
];
class ProjectDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    }
  }
  getProjectDetail = () => {
    this.props.fetch_project_detail(this.props.match.params.projectID).then(r => this.setState({ loading: false })).catch(err => console.log(err));
  }
  componentDidMount = () => {
    this.getProjectDetail();
  }
  
  renderProjects() {
    const { project } = this.props;
    const isNotExpired = date_diff_indays(new Date(), new Date(project.deadline)) > 0;
    const progressPercentage = (Number(project.fundingAmount || 0)/Number(project.target|| 1) * 100).toFixed(2);
      return (
        <div key={project.id} style={{ marginTop: '1em' }} >
          <div className="projectItem">
            <h5>
              {project.name}
            </h5>
            <div className="progressBlock">
              <span className="progressCount">{progressPercentage}%</span>
              <ProgressBar now={Number(progressPercentage)} className="progressbar" />

              <div className="userInfoBlock clearfix userInfoBlockProjectDetails">
                <div className="userItem">
                
                {project.User.avatar && <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}><img
                  src={getImageUrl(project.User.avatar)}
                  alt=""
                  className="userImage"
                />
                <span className="userName">{project.User.firstName + project.User.lastName}</span>
                </div>}
                {!project.User.avatar && <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <div className="avatar_non" style={{ backgroundColor: toHexColor(project.User.firstName)}}>
                      {`${project.User.firstName[0].toUpperCase() + project.User.lastName[0].toUpperCase()}`}
                    </div>
                    <span className="userName">{project.User.firstName + project.User.lastName}</span>
                </div>}
                <div className="star-ratings">
                  <StarRatings
                    className="stars"
                    rating={3}
                    isSelectable={false}
                    starDimension="12px"
                    starRatedColor="#546FF7"
                    starSpacing="3px"
                    numberOfStars={5}
                    name="rating"
                  />
                  {/* <span className="rating-count">(26)</span> */}
                </div>
              </div>
              </div>
              <div className="fundBlock clearfix">
                <div className="fund-item float-left">
                <label htmlFor="" className="fund-label">Req. Fund</label>
                <label htmlFor="" className="fund-label">Inv. Period</label>
                <label htmlFor="" className="fund-label">Progress</label>
                <label htmlFor="" className="fund-label">Deadline</label>
                {/* <label htmlFor="" className="fund-label">Target Earning</label> */}
                <label htmlFor="" className="fund-label">Number of investor</label>
                <label htmlFor="" className="fund-label">Your fund</label>
                <label htmlFor="" className="fund-label">State</label>
              </div>
              <ProjectInfo project={project} />
              </div>
            </div>
          </div>
          {isNotExpired && project.state === 'INITFUND' && <FormInvestBlock pid={project.id} trader={project.User.firstName + project.User.lastName} />}
          {project.state === 'READY' || project.state === 'RELEASE' && <VoteStopBlock pid={project.id} trader={project.User.firstName + project.User.lastName} />}
          <OrderHistory pid={project.id} />
        </div>
    );
  }

  render() {
    if (this.state.loading) return <Loading isLoading={this.state.loading}/>
    return (
      <div style={{ backgroundColor: '#fafbff', minHeight: '100vh' }}>
        <InvestNavigation header="Project" history={this.props.history} />
        {this.renderProjects()}
      </div>
    );
  }
}

const mapState = (state, ownProps) => ({
  project: state.invest && state.invest.project ? state.invest.project : {},
  ...ownProps
})

export default connect(mapState, { fetch_project_detail })(ProjectDetail);
