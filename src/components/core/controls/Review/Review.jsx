import React from 'react';
import PropTypes from 'prop-types';
// component
import Button from '@/components/core/controls/Button/Button';
// style
import './Review.scss';
import createForm from '@/components/core/form/createForm';
import { Field, formValueSelector } from 'redux-form';
import { required } from '@/components/core/form/validation';
import { fieldInput } from '@/components/core/form/customField';
import { injectIntl } from 'react-intl';

const LENGTH = 5;

const nameReviewForm = 'reviewForm';
const ReviewCrypto = createForm({
  propsReduxForm: {
    form: nameReviewForm,
    initialValues: {

    },
  },
});
const selectorFormReview = formValueSelector(nameReviewForm);

const textColor = '#000000';

class Rate extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  render() {
    const { className, onSubmit } = this.props;
    const { messages } = this.props.intl;
    return (
      <ReviewCrypto onSubmit={onSubmit} className="review">
        <p className="title">{messages.review.label.description}</p>
        <div className="w-100 mt-2 mr-2">

          <Field
            name="review"
            type="text"
            className="form-control w-100"
            placeholder=""
            component={fieldInput}
            validate={[required]}
          />
        </div>
        <Button className="mt-5 w-100" >{messages.review.label.submitButtonTitle}</Button>
      </ReviewCrypto>
    );
  }
}

Rate.propTypes = {
  className: PropTypes.string,
  onSubmit: PropTypes.func,
};

export default injectIntl(Rate);
