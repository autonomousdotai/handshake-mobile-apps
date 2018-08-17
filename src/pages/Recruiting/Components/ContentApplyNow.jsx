import { FormattedMessage, injectIntl } from "react-intl";
import React from "react";
import Dropzone from "react-dropzone";
import $http from "@/services/api";
// import { BASE_API } from '@/constants';
import { connect } from "react-redux";
import { RECRUITING_SLACK_CHANNEL } from "@/constants";

import createForm from "@/components/core/form/createForm";
import { required } from "@/components/core/form/validation";
import {
  fieldDropdown,
  fieldInput,
  fieldTextArea
} from "@/components/core/form/customField";
import JobsDropdown from "./JobsDropdown";

const nameFormApplyNow = "formApplyNow";
const FormApplyNow = createForm({
  propsReduxForm: {
    form: nameFormApplyNow
  }
});

export class Component extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  state = {
    file: null,
    isUploadSuccessful: false
  };

  handleClickSubmit = (values) => {
    const jobName = this.props.jobName || values?.jobName?.text;
    const { file } = this.state;
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    $http({
      method: "POST",
      url: "https://www.autonomous.ai/api-v2/job-api/job-cv",
      data: formData
    })
      .then(res => {
        this.setState({ isUploadSuccessful: true });
        const cvUrl = res.data.data;

        fetch(RECRUITING_SLACK_CHANNEL, {
          body: JSON.stringify({
            attachments: [
              {
                color: "#db4437",
                text: "Somebody has just submitted CV by [Apply now] button!",
                fields: [
                  {
                    title: `Job: ${jobName}`,
                    value: `CV file: ${cvUrl}`,
                    short: false
                  }
                ]
              }
            ]
          }),
          cache: "no-cache",
          credentials: "same-origin",
          method: "POST",
          mode: "cors",
          redirect: "follow",
          referrer: "no-referrer"
        });
      })
      .catch(err => {
        console.log("err upload image", err);
      });
  };

  onDrop = acceptedFiles => {
    const file = acceptedFiles[0];
    this.setState({ file });
  };

  onOpenClick = () => {
    this.dropzone.open();
  };

  render() {
    const { file, isUploadSuccessful } = this.state;
    const { jobName } = this.props;
    return (
      <div>
        {!isUploadSuccessful ? (
          <div>
            <FormApplyNow onSubmit={this.handleClickSubmit}>
              <Dropzone
                disablePreview
                multiple={false}
                accept="image/*, .pdf, .doc, .docx"
                style={{
                  background: "#F9F9F9",
                  border: "2px dashed #CBCBCB",
                  height: "56px",
                  width: "100%",
                  borderRadius: "6px"
                }}
                ref={e => (this.dropzone = e)}
                onDrop={this.onDrop}
                // disableClick
              >
                <div className="text-center mt-3">
                  {file ? (
                    <div>{file.name}</div>
                  ) : (
                    <FormattedMessage id="landing_page.recruiting.applyNow.label.uploadDocs" />
                  )}
                </div>
              </Dropzone>
              <div className="mt-1">
                <FormattedMessage id="landing_page.recruiting.applyNow.label.weAccept" />
              </div>

              {
                !jobName && (
                  <div className="form-group mt-3">
                    <span>
                      <JobsDropdown />
                    </span>
                  </div>
                )
              }

              <div className="mt-2">
                <button type="submit" className="btn btn-primary btn-block">
                  <FormattedMessage id="landing_page.recruiting.applyNow.label.submit" />
                </button>
              </div>
              <hr />
              <div className="mt-2">
                <a
                  href="https://www.linkedin.com/in/duyhtq/"
                  target="__blank"
                  className="btn btn-primary btn-block"
                >
                  <FormattedMessage id="landing_page.recruiting.applyNow.label.connectToLinkedIn" />
                </a>
              </div>
            </FormApplyNow>
          </div>
        ) : (
          <div className="text-center">
            <div>
              <img src="https://d2q7nqismduvva.cloudfront.net/static/images/icon-svg/common/success.svg" />
            </div>
            <div>
              <h5>
                <strong>
                  <FormattedMessage id="landing_page.recruiting.applyNow.label.thankYou" />
                </strong>
              </h5>
            </div>
            <div className="text-muted">
              <FormattedMessage id="landing_page.recruiting.applyNow.label.weReview" />
            </div>
          </div>
        )}
      </div>
    );
  }
}

Component.propTypes = {};

const mapState = state => ({
  authProfile: state.auth.profile
});

const mapDispatch = {};

export default injectIntl(connect(mapState, mapDispatch)(Component));
