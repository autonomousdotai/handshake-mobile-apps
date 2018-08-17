import React from 'react';
import { FormattedMessage } from 'react-intl';
import ShareSocial from '@/components/core/presentation/ShareSocial';
import ButtonApplyNow from './ButtonApplyNow'
// import SocialButtons from './SocialButtons'
import { URL } from '@/constants';

const CategoryItem = (props) => {
  // const { id, active, name, onClick } = props;
  const { id, name, seo_url, project, job_location, skill, summary, onClickApplyNow } = props;
  const normalizedSkills = skill.split(', ')
  return (
    <div key={id} className={`recruiting-job`}>
      <div className="row align-items-center">
        <div className="col-12 col-lg-8">
          <div className="job-name">{name}</div>
          <div className="job-project">{project}</div>
          <div className="job-location">{job_location.name}</div>
          <div className="job-summary">{summary}</div>
          <div className="mt-2">
            {
              normalizedSkills.map((skillItem, index) => {
                return <span key={index} className="job-skill">{skillItem}</span>
              })
            }
          </div>
        </div>
        <div className="col-12 col-lg-4 text-center">
          <ButtonApplyNow className="btn-block" onClick={(e) => { e.preventDefault(); onClickApplyNow(name); }} />
          <div className="job-text-pr mt-2"><FormattedMessage id="landing_page.recruiting.label.getTheWordOut" /></div>
          {/*<SocialButtons />*/}
          <ShareSocial
            title={name}
            className="center-block mt-2"
            shareUrl={`${window.location.origin}${URL.RECRUITING}/${seo_url}`}
          />
        </div>
      </div>
    </div>
  )
}

export default CategoryItem;
