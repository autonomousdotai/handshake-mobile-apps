import React from 'react';
import PropTypes from 'prop-types';
import Input from '@/components/core/forms/Input/Input';
import {Formik} from 'formik';
import Button from '@/components/core/controls/Button';


import './css/BettingShake.scss';
const defaultAmount = 1;
class BetingShake extends React.Component {
    static propTypes = {
        remaining: PropTypes.number.isRequired,
        odd: PropTypes.number.isRequired,
        onSubmitClick: PropTypes.func,
        onCancelClick: PropTypes.func,
      }
    static defaultProps = {
        remaining: 10
    }
    constructor(props) {
        super(props);
        const {odd} = props;
        this.state = {
            total: defaultAmount * odd,
        };

        this.onSubmit = this.onSubmit.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.validateForm = this.validateForm.bind(this);
        this.renderForm = this.renderForm.bind(this);
    }
    onSubmit(values, {setSubmitting, setErrors /* setValues and other goodies */}) {
        console.log("Submit");
        this.props.onSubmitClick();
      }
    onCancel(){
      console.log('Cancel')
      this.props.onCancelClick();
    }
    
    validateForm(values) {
        // same as above, but feel free to move this into a class method now.
        let errors = {};
        return errors;
      }
    renderForm({values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting}) {
      const {total} = this.state;
      const {remaining} = this.props;

        return (
          <form className="wrapper" onSubmit={handleSubmit}>
          <div className="rowWrapper">
            <label className="label" >Betting amount</label>
            <div className="amountInput">
                <Input
                  className="form-control-custom input"
                  type='number'
                  min='0.0001'
                  max={remaining}
                  name="amount"
                  defaultValue='1'
                  onChange={(evt)=> this.updateTotal(evt.target.value)}
                  onBlur={handleBlur}
                  //value={values.amount}
                />
                <label className="label remaining">/ {remaining} ETH</label>
              </div>
          </div>
            {touched.amount && errors.amount && <div>{errors.amount}</div>}
            <div className="line"/>
            <div className="rowWrapper">

           <label className="label">You will win</label>
           <label className="total">{total} ETH</label>
           </div>

           <div className="rowWrapper">
           <Button block className="cancelBtn" onClick={this.onCancel}
           >
              Cancel
            </Button>
            <Button  type="submit" block className="submitBtn">
              Submit
            </Button>
            </div>
          </form>
        );
      }
    render() {
        const {remaining} = this.props;
        const {total} = this.state;
        return(<Formik
            initialValues={{
              amount: 1,
            }}
            validate={this.validateForm}
            onSubmit={this.onSubmit}
            render={this.renderForm}
          />);
    }
    updateTotal(value){
       console.log('value:', value);
        const {odd} = this.props;
        const amount = value * odd;
        this.setState({
            total: amount.toFixed(4)
        })
    }
}
export default BetingShake;