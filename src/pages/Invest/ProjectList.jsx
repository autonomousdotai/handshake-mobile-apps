import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetch_projects, exampleProjects } from '@/reducers/invest/action';
import { Grid, Row, Col, ProgressBar } from 'react-bootstrap';
import _ from 'lodash';
import Utils from './Utils';
import StarRatings from 'react-star-ratings';
import { wrapBoundary } from '../../components/ErrorBoundary';
import './ProjectList.scss';

const ProjectItem = wrapBoundary(({ handleOnClick, ...project }) => {
  const progressPercentage = Math.floor(project.fundingAmount / project.target * 100);
  const displayName = `${project.User.firstName} ${project.User.lastName}`.trim() || 'Anonymous';
  const displayLifeTime = Utils.duration(project.lifeTime);

  return (
    <div className="projectItem" onClick={handleOnClick}>
      <h4>
        {project.name}
      </h4>
      <div className="progressBlock">
        <span className="progressCount">{progressPercentage}%</span>
        <ProgressBar now={progressPercentage} className="progressbar" />
        <div className="fundBlock clearfix">
          <div className="fund-item float-left">
            <label htmlFor="" className="fund-label">Req. Fund</label>
            <label htmlFor="" className="fund-item-value">
              {project.target} {project.currency}
            </label>
          </div>

          <div className="fund-item">
            <label htmlFor="" className="fund-label">Progress</label>
            <label htmlFor="" className="fund-item-value">{project.fundingAmount} {project.currency}</label>
          </div>

          <div className="fund-item float-right">
            <label htmlFor="" className="fund-label">
              Inv. Period
            </label>
            <label htmlFor="" className="fund-item-value">{displayLifeTime}</label>
          </div>
        </div>
        <hr />
        <div className="userInfoBlock clearfix">
          <div className="userItem">
            <img
              src="https://randomuser.me/api/portraits/men/9.jpg"
              alt=""
              className="userImage"
            />
            <span className="userName">{displayName}</span>
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
              <span className="rating-count">(26)</span>
            </div>
          </div>
          <div className="duration-left">
          3 days left
          </div>
        </div>
      </div>
    </div>
  );
});

class ProjectList extends Component {
  constructor(props) {
    super(props);
    this.props.fetch_projects();
  }

  navigateToProjectDetails=(project)=>{
    this.props.history.push(`/invest/project/${project.id}`)
  }

  renderProjects() {
    return (
      this.props.projects.concat(exampleProjects).map((project, i) => <ProjectItem key={i} handleOnClick={this.navigateToProjectDetails.bind(this, project)} {...project} />)
    )
  }

  render() {
    return (
      <div style={{ backgroundColor: '#fafbff', minHeight: '100vh' }}>
        {this.renderProjects()}
      </div>
    );
  }
}

const mapState = state => ({
  projects: state.invest && state.invest.projects ? state.invest.projects : []
});

const mapDispatch = { fetch_projects }

export default connect(mapState, mapDispatch)(ProjectList);
