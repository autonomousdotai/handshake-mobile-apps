import React from 'react';
import { connect } from 'react-redux';
import { getFundAmount, getSMProjectInfo } from '../../../reducers/invest/action';
import LoadingGif from '../loading.svg';
import WithDrawalSVG from '../withdraw.svg';
import WithDrawalBlock from './WithDrawalBlock';

class ProjectInfo extends React.Component {
  constructor(props) {
    super(props);
    this.props.getSMProjectInfo(props.project.id).then(r=> {
      this.props.getFundAmount(props.project.id).catch(err => console.log('err', err));
    }).catch(err => console.log('err', err));
  }
  render() {
    const { project, smProject } = this.props;
    const progressPrev = (Number(project.fundingAmount || 0)/Number(project.target|| 1) * 100).toFixed(2);
    const progress = smProject ? (Number(smProject.fundingAmount || 0)/Number(smProject.target|| 1) * 100).toFixed(2) : progressPrev;
    const numFunder = smProject ? smProject.numFunder : (project.numberOfFunder || (<img src={LoadingGif} style={{ width: '50px', height: '50px' }} />));
    const fundAmount = smProject ? smProject.fundAmount : '';
    return (
      <div className="fund-item float-right" style={{ marginTop: '-10px' }}>
        <label htmlFor="" className="fund-item-value">{project.displayLifeTime}</label>
        <label htmlFor="" className="fund-item-value">
          {project.target} {project.currency}
        </label>
        <label htmlFor="" className="fund-item-value">
          {project.lifeTime} {'days'}
        </label>
        <label htmlFor="" className="fund-item-value">
          {progress} % 
        </label>
        <label htmlFor="" className="fund-item-value">
          {new Date(project.deadline).toDateString()}
        </label>
        <label htmlFor="" className="fund-item-value">
          {numFunder}
        </label>
        {fundAmount && <label htmlFor="" className="fund-item-value space_between">
          {fundAmount} ETH
           <img onClick={()=> this.refs['withdrawalBlock'].getWrappedInstance().onSubmitWithDrawal()} src={WithDrawalSVG} style={{ width: '20px', height: '20px' }}/>
        </label>}
        <WithDrawalBlock pid={project.id} trader={project.User.firstName + project.User.lastName} fundAmount={fundAmount} ref={'withdrawalBlock'} />
      </div>
    )
  }
}
const projectMapState = (state) => ({
  smProject: state.invest && state.invest.smProject ? state.invest.smProject : null
})
export default connect(projectMapState, { getSMProjectInfo, getFundAmount })(ProjectInfo)