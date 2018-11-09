import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FormattedMessage, FormattedHTMLMessage, injectIntl } from 'react-intl';
import queryString from 'query-string';
import { isEmpty } from 'lodash';

import { URL } from '@/constants';
import LandingWrapper from '@/components/LandingWrapper';
// import PropTypes from 'prop-types';
import { updateModal } from '@/reducers/app/action';
import CategoryItem from './Components/CategoryItem';
import Job from './Components/Job';
import FBChat from './Components/FBChat';
import ContentApplyNow from './Components/ContentApplyNow';
import ButtonApplyNow from './Components/ButtonApplyNow';

const idAllCategories = 0;

class Recruiting extends React.Component {
  constructor(props) {
    super(props);

    const values = queryString.parse(this.props.location.search);

    this.state = {
      selectedCategoryId: values.categoryId || idAllCategories,
      categories: [],
      jobs: [],
      showFilters: false,
      searchKey: values.project || '',
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const values = queryString.parse(nextProps.location.search);
    const result = {};
    if (values.categoryId && values.categoryId !== prevState.selectedCategoryId) {
      result.selectedCategoryId = values.categoryId;
    }
    if (values.project && values.project !== prevState.searchKey) {
      result.searchKey = values.project;
    }
    if (isEmpty(result)) {
      return null;
    }
    return result;
  }


  componentDidMount() {
    const { selectedCategoryId, searchKey } = this.state;
    axios
      .get('https://www.autonomous.ai/api-v2/job-api/categories')
      .then(res => {
        this.setState({ categories: res.data.data });
      })
      .catch(err => console.log('err get categories', err));

    this.getJobs(selectedCategoryId, searchKey);
  }

  getJobs = (id, projectName = '') => {
    let qs = '?group_id=1';
    if (id !== idAllCategories) {
      qs += `&category_id=${id}`;
    }
    qs += `&project=${projectName}`;

    const search = {};
    if (projectName) search.project = projectName;
    if (id && id !== 0) search.categoryId = id;

    this.props.history.push({
      pathname: '/recruiting',
      search: `?${queryString.stringify(search)}`,
    });

    axios
      .get(`https://www.autonomous.ai/api-v2/job-api/jobs${qs}`)
      .then(res => {
        this.setState({ jobs: res.data.data.items });
      })
      .catch(err => console.log('err get jobs', err));
  };

  handleClickCategoryItem = id => {
    const { searchKey } = this.state;
    this.setState({ selectedCategoryId: id, showFilters: false });
    this.getJobs(id, searchKey);
  };

  handleClickApplyNow = (name) => {
    this.props.updateModal({
      show: true,
      title: (
        <div><FormattedMessage id="landing_page.recruiting.applyNow.title" /></div>
      ),
      body: <ContentApplyNow jobName={name} />,
    });
  }

  handleToggleFilter = () => {
    this.setState({ showFilters: !this.state.showFilters });
  }

  searchByProjectName = (e, projectName) => {
    const { selectedCategoryId, searchKey: stateSearchKey } = this.state;
    let searchKey = stateSearchKey;
    if (e) {
      searchKey = this.searchProjectInput.value || '';
      this.setState({ searchKey });
      this.getJobs(selectedCategoryId, searchKey);
    } else {
      searchKey = projectName === 'All' ? '' : projectName;
      this.setState({ searchKey });
      this.getJobs(selectedCategoryId, searchKey);
    }
  }

  render() {
    const { categories, selectedCategoryId, jobs, showFilters, searchKey } = this.state;

    const allCategories = (
      <div>
        <CategoryItem
          id={idAllCategories}
          active={selectedCategoryId === idAllCategories}
          name="All"
          onClick={() => this.handleClickCategoryItem(idAllCategories)}
        />
        {categories.map(category => {
          const {
            id, name,
          } = category;
          return (
            <CategoryItem
              key={id}
              active={selectedCategoryId === id}
              name={name}
              onClick={() => this.handleClickCategoryItem(id)}
            />
          );
        })}
      </div>
    );

    const projectLists = [
      'All',
      'Ninja',
      'Constant',
    ];

    const projectFilter = (
      <div className="recruiting-filter-by-project">
        <div className="recruiting-filter-by-project-title">Projects:</div>
        <div className="recruiting-filter-by-project-list">
          <ul>
            {projectLists.map(projectName => (
              <li key={projectName} className={projectName === searchKey || (projectName === 'All' && searchKey === '') ? 'active' : ''}>
                <span onClick={() => this.searchByProjectName(null, projectName)}>{projectName}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="recruiting-filter-by-project-search">
          Or
          <input className="form-control" type="text" name="recruiting-filter-by-project-search-input" id="recruiting-filter-by-project-search-input" placeholder="Search project name" onChange={this.searchByProjectName} ref={div => { this.searchProjectInput = div; return null; }} />
        </div>
      </div>
    );

    return (
      <LandingWrapper
        btnToggleLeftMenu={(
          <div className="d-md-none">
            <button onClick={this.handleToggleFilter} className="btn-lg bg-transparent btn-menu">☰</button>
          </div>
        )}
      >

        <div className="row text-center d-none d-md-block">
          <div className="col">
            <div className="recruiting-intro">
              <div><div className="intro-text w-75 d-inline-block"><FormattedHTMLMessage id="landing_page.recruiting.intro.label" /></div></div>
              <ButtonApplyNow className="mt-4" text={<FormattedMessage id="landing_page.recruiting.intro.btn" />} onClick={(e) => { e.preventDefault(); this.handleClickApplyNow(); }} />
            </div>
          </div>
        </div>
        <div className="row mt-3 recruiting">

          {/* ========== MOBILE ========== */}
          {
            showFilters && (
              <div className="d-md-none">
                <div className="backdrop" onClick={this.handleToggleFilter} />
                <div className="left-menu">
                  <div className="text-right mb-1">
                    <button onClick={this.handleToggleFilter} className="btn btn-lg bg-transparent">&times;</button>
                  </div>
                  <div className="category-items">
                    {allCategories}
                  </div>
                </div>
              </div>
            )
          }
          {/* ============================= */}

          {/* ========== DESKTOP ========== */}
          <div className="d-none d-md-block col-md-4">
            {allCategories}
          </div>
          {/* ============================= */}

          <div className="col-12 col-md-8">
            {projectFilter}
            {
              jobs && jobs.length > 0 ?
                jobs.map(job => {
                  return (
                    <Link key={job.id} to={`${URL.RECRUITING}/${job.seo_url}`}>
                      <Job {...job} onClickApplyNow={this.handleClickApplyNow} />
                    </Link>
                  );
                }) : (
                  <div>
                    <FormattedMessage id="landing_page.recruiting.label.noJobs" />
                  </div>
                )
            }
          </div>
        </div>
        <FBChat />
      </LandingWrapper>
    );
  }
}

const mapDispatch = dispatch => ({
  // rfChange: bindActionCreators(change, dispatch),
  updateModal: bindActionCreators(updateModal, dispatch),
});

export default injectIntl(connect(null, mapDispatch)(Recruiting));
