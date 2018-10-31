import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetch_projects } from '@/reducers/invest/action';
import _ from 'lodash';
import ProjectItem, { date_diff_indays } from './ProjectList/ProjectItem';
import './ProjectList/ProjectList.scss';

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
      this.props.projects.map((project, i) => <ProjectItem key={i} handleOnClick={this.navigateToProjectDetails.bind(this, project)} {...project} />)
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
