import { FormattedMessage, injectIntl } from "react-intl";
import React from "react";
import Dropzone from "react-dropzone";
// import { BASE_API } from '@/constants';
import { connect } from "react-redux";
import { RECRUITING_SLACK_CHANNEL } from "@/constants";
import createForm from "@/components/core/form/createForm";
import { required } from "@/components/core/form/validation";
import $http from '@/services/api';
import {
  fieldDropdown,
  fieldInput,
  fieldTextArea
} from "@/components/core/form/customField";
import { Field } from "redux-form";

import JobsDropdown from "./JobsDropdown";
// import PreviewImage from './PreviewImage';

// import placeHolder from '@/assets/images/icon/upload-image.svg';

const nameFormReferFriend = "formReferFriend";
const FormReferFriend = createForm({
  propsReduxForm: {
    form: nameFormReferFriend
  }
});

export class Component extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  state = {
    file: null,
    isUploadSuccessful: false
  };
  handleSubmit = values => {
    const { file } = this.state;
    if (!file) return;

    const { email, phone, jobName, description } = values;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("job_name", jobName.text);
    formData.append("description", description);
    $http({
      method: "POST",
      url: "https://www.autonomous.ai/api-v2/job-api/job-cv",
      data: formData
      // onUploadProgress: (progressEvent) => {
      //   const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      //   const correspondingFile = newFiles.find(item => item.name === file.name);
      //   if (correspondingFile) {
      //     correspondingFile.percent = percentCompleted;
      //   }
      //   this.setState({ files: newFiles });
      //   this.forceUpdate();
      // },
    })
      .then(res => {
        this.setState({ isUploadSuccessful: true });
        fetch(RECRUITING_SLACK_CHANNEL, {
          body: JSON.stringify({
            attachments: [
              {
                color: "#db4437",
                text: `Somebody has just Referral CV with email: ${email} - phone ${phone}`,
                fields: [
                  {
                    title: `Job: ${jobName.text}`,
                    value: `CV file: ${
                      res.data.data
                    } - description: ${description}`,
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
    const { intl } = this.props;
    return (
      <div>
        {!isUploadSuccessful ? (
          <div>
            <FormReferFriend onSubmit={this.handleSubmit}>
              <div className="form-group">
                <Field
                  name="phone"
                  type="text"
                  className="form-control"
                  placeholder={intl.formatMessage({
                    id: "landing_page.recruiting.referFriend.placeholder.phone"
                  })}
                  component={fieldInput}
                />
              </div>
              <div className="form-group">
                <Field
                  name="email"
                  type="text"
                  className="form-control"
                  placeholder={intl.formatMessage({
                    id: "landing_page.recruiting.referFriend.placeholder.email"
                  })}
                  component={fieldInput}
                />
              </div>
              <div className="form-group">
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
                  <div
                    className="text-center mt-3"
                    style={{ fontWeight: "400" }}
                  >
                    {file ? (
                      <div>{file.name}</div>
                    ) : (
                      <FormattedMessage id="landing_page.recruiting.referFriend.label.uploadCV" />
                    )}
                  </div>
                </Dropzone>
                <div className="mt-1">
                  <FormattedMessage id="landing_page.recruiting.applyNow.label.weAccept" />
                </div>
              </div>

              <div className="form-group">
                <span>
                  <JobsDropdown />
                </span>
              </div>

              <div className="form-group">
                <Field
                  name="description"
                  rows={4}
                  className="form-control"
                  placeholder={intl.formatMessage({
                    id:
                      "landing_page.recruiting.referFriend.placeholder.saySomething"
                  })}
                  component={fieldTextArea}
                />
              </div>
              <div className="mt-2">
                <button
                  type="submit"
                  className="btn btn-primary btn-block"
                  onClick={this.handleClickSubmit}
                >
                  <FormattedMessage id="landing_page.recruiting.applyNow.label.submit" />
                </button>
              </div>
            </FormReferFriend>
          </div>
        ) : (
          <div className="text-center">
            <div>
              <img src="https://d2q7nqismduvva.cloudfront.net/static/images/icon-svg/common/success.svg" />
            </div>
            <div>
              <h5>
                <strong>
                  <FormattedMessage id="landing_page.recruiting.referFriend.label.thankYou" />
                </strong>
              </h5>
            </div>
            <div className="text-muted">
              <FormattedMessage id="landing_page.recruiting.referFriend.label.weReview" />
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
