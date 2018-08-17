import React from 'react';
import { connect } from 'react-redux';
import LandingWrapper from '@/components/LandingWrapper';
import axios from 'axios';
// import PropTypes from 'prop-types';
import './styles.scss';
import { bindActionCreators } from 'redux';
import { updateModal } from '@/reducers/app/action';
import CategoryItem from './Components/CategoryItem';
import Job from './Components/Job';
import FBChat from './Components/FBChat';
import ContentApplyNow from './Components/ContentApplyNow';
import ButtonApplyNow from './Components/ButtonApplyNow';
import { FormattedMessage, FormattedHTMLMessage, injectIntl } from 'react-intl';

import { Link } from 'react-router-dom';
import { URL } from '@/constants';
const idAllCategories = 0;

class Recruiting extends React.Component {
  state = {
    selectedCategoryId: idAllCategories,
    categories: [],
    jobs: [],
    showFilters: false,
  };
  componentDidMount() {
    const { selectedCategoryId } = this.state;
    axios
      .get('https://www.autonomous.ai/api-v2/job-api/categories')
      .then(res => {
        this.setState({ categories: res.data.data });
      })
      .catch(err => console.log('err get categories', err));

    this.getJobs(selectedCategoryId);
  }
  getJobs = id => {
    let qs = '?group_id=1';
    if (id !== idAllCategories) {
      qs += `&category_id=${id}`;
    }
    axios
      .get(`https://www.autonomous.ai/api-v2/job-api/jobs${qs}`)
      .then(res => {
        this.setState({ jobs: res.data.data.items });
      })
      .catch(err => console.log('err get jobs', err));
  };
  handleClickCategoryItem = id => {
    this.setState({ selectedCategoryId: id, showFilters: false });
    this.getJobs(id);
  };

  handleClickApplyNow = (name) => {
    this.props.updateModal({
      show: true,
      title: (
        <div><FormattedMessage id="landing_page.recruiting.applyNow.title" /></div>
      ),
      body: <ContentApplyNow jobName={name} />
    })
  }

  handleToggleFilter = () => {
    this.setState({ showFilters: !this.state.showFilters })
  }

  render() {
    const { categories, selectedCategoryId, jobs, showFilters } = this.state;

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
            id, name, seo_url, priority,
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
    )
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
            {
              jobs && jobs.length > 0 ?
                jobs.map(job => {
                  return (
                    <Link key={job.id} to={`${URL.RECRUITING}/${job.seo_url}`}>
                      <Job {...job} onClickApplyNow={this.handleClickApplyNow} />
                    </Link>
                  )
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

const mapState = state => ({});

const mapDispatch = dispatch => ({
  // rfChange: bindActionCreators(change, dispatch),
  updateModal: bindActionCreators(updateModal, dispatch),
});

export default injectIntl(connect(mapState, mapDispatch)(Recruiting));
