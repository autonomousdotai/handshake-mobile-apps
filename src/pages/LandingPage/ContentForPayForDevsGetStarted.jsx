import React from "react";
import { Fade, Flip, Zoom, Slide, LightSpeed } from 'react-reveal';
import imgAnywhere from '@/assets/images/landing/pay-for-devs/anywhere.png';
import imgChargeBack from '@/assets/images/landing/pay-for-devs/chargeback.png';
import img1 from '@/assets/images/landing/pay-for-devs/gs-img1.png';
import img2 from '@/assets/images/landing/pay-for-devs/gs-img2.png';
import img3 from '@/assets/images/landing/pay-for-devs/gs-img3.png';

import './ContentForPayForDevsGetStarted.scss';

const PayForDevsGetStarted = () => (
  <div className="project-detail pay-for-devs-get-started">

    <div className="container">
      <div className="row getstart">
      <Fade left>
        <div className="col-12 col-md-6 pd-subHeading">
          <p className="pd-heading">Pay for Devs Quickstart</p>
          <p>A crypto payment gateway for developers that is easy to integrate into their mobile app or website.</p>
          <div className="pt-4"><a href="/payment"><button className="btn btn-primary-landing ml-1">GET STARTED for FREE</button></a></div>
        </div>
        </Fade>
        <div className="col-12 col-md-6 text-right pt-4"><Flip right><img src={img1} /></Flip></div>
      </div>

      <div className="row none-register">
        <Slide bottom>
        <div className="col-12 col-md-6 pd-content">
          <p className="pd-heading">Make an outgoing payment without having to register with Ninja</p>
          <p className="pb-4">Once an order is created, your server-side code redirects you to Ninja Payment to create a one off payment. </p>
          <p className="pb-4">This redirect contains the recipient wallet address, cryptocurrency, amount,... from Ninja’s options (edit for clarity) </p>
        </div>
        </Slide>
        <div className="col-12 col-md-6"><Zoom right><img src={img2} /></Zoom></div>
      </div>

      <div className="code row">
      <LightSpeed left>
        <div className="col-lg-6 col-12 mt-4">
          <div className="card bg-dark">
            <div className="card-body">
              <h5 className="card-title text-warning">Request</h5>
              <h6 className="card-subtitle mb-2 text-muted">https://www.ninja.org/payment</h6>
              <div className="card-text text-light">
                <div className="row">
                  <div className="col-4 label">order_id</div>
                  <div className="col-8 value">orderId from shop website</div>
                </div>
                <div className="row">
                  <div className="col-4 label">amount</div>
                  <div className="col-8 value">amount to charge</div>
                </div>
                <div className="row">
                  <div className="col-4 label">currency</div>
                  <div className="col-8 value">fiat currency or crypto currency. Default is USD</div>
                </div>
                <div className="row">
                  <div className="col-4 label">to</div>
                  <div className="col-8 value">crypto currencies & addresses (e.g ETH:xxx , BTC:xxx, BCH:xxx)</div>
                </div>
                <div className="row">
                  <div className="col-4 label">confirm_url</div>
                  <div className="col-8 value">callback url after finishing</div>
                </div>

              </div>
              <div className="text-secondary">Sample: <span className="text-primary">
                https://www.ninja.org/payment?<span className="text-info">order_id</span>=123456&<span className="text-info">amount</span>=99&
                <span className="text-info">currency</span>=USD&
                <span className="text-info">to</span>=ETH:0x56xx,BTC:1Kenxx,BCH:1Trixx,XRP:r4fxx&
                <span className="text-info">confirm_url</span>=https://www.autonomous.ai/confirmation</span>
              </div>
            </div>
          </div>
        </div>
        </LightSpeed>
        <LightSpeed right>
        <div className="col-lg-6 col-12 mt-4">
          <div className="card bg-dark" style={{height: '100%'}}>
            <div className="card-body">
              <h5 className="card-title text-warning">Response</h5>
              <h6 className="card-subtitle mb-2 text-muted">{"{confirm_url}"}</h6>
              <div className="card-text text-light">
                <div className="row">
                  <div className="col-4 label">status</div>
                  <div className="col-8 value">0-incomplete, 1-success, 2-failed</div>
                </div>
                <div className="row">
                  <div className="col-4 label">transaction</div>
                  <div className="col-8 value">transaction number, e.g hash of ETH, transaction of BTC</div>
                </div>
                <div className="row">
                  <div className="col-4 label">order_id</div>
                  <div className="col-8 value">outgoing payments wallet address</div>
                </div>
              </div>
              <div className="text-secondary">Sample: <span className="text-primary">https://www.autonomous.ai/confirmation?<span className="text-info">order_id</span>=123456&<span className="text-info">status</span>=1&<span className="text-info">transaction</span>=0x8b77xx</span></div>
            </div>
          </div>
        </div>
        </LightSpeed>
      </div>

      <div className="row register">
        <Slide top>
        <div className="col-12 col-md-6 pd-content">
          <p className="pd-heading">Register to make regular payments</p>
          <p>Register your username on Ninja Wallet. Then, set your default crypto wallet which you want to use for outgoing and incoming payments. With each order, your server will automatically redirect to Ninja Payment to process the charge. This redirect link will contain the recipient’s wallet address, payment amount, and any additional information you wish you include.</p>
        </div>
        </Slide>
        <div className="col-12 col-md-6"><Zoom right><img src={img3} /></Zoom></div>
      </div>

      <div className="code row">
      <LightSpeed left>
        <div className="col-lg-6 col-12  mt-4">
          <div className="card bg-dark">
            <div className="card-body">
              <h5 className="card-title text-warning">Request</h5>
              <h6 className="card-subtitle mb-2 text-muted">https://www.ninja.org/payment</h6>
              <div className="card-text text-light">
                <div className="row">
                  <div className="col-4 label">order_id</div>
                  <div className="col-8 value">orderId from shop website</div>
                </div>
                <div className="row">
                  <div className="col-4 label">amount</div>
                  <div className="col-8 value">amount to charge</div>
                </div>
                <div className="row">
                  <div className="col-4 label">currency</div>
                  <div className="col-8 value">fiat currency or crypto currency. Default is USD</div>
                </div>
                <div className="row">
                  <div className="col-4 label">shop_id</div>
                  <div className="col-8 value">Shop username</div>
                </div>
              </div>
              <div className="text-secondary">Sample: <span className="text-primary">
                https://www.ninja.org/payment?<span className="text-info">order_id</span>=123456&<span className="text-info">amount</span>=99&
                <span className="text-info">currency</span>=USD&
                <span className="text-info">shop_id</span>=autonomous</span>
              </div>
            </div>
          </div>

        </div>
        </LightSpeed>
        <LightSpeed right>
        <div className="col-lg-6 col-12 mt-4">
          <div className="card bg-dark" style={{height: '100%'}}>
            <div className="card-body">
              <h5 className="card-title text-warning">Response</h5>
              <h6 className="card-subtitle mb-2 text-muted">{"{confirm_url}"}</h6>
              <div className="card-text text-light">
                <div className="row">
                  <div className="col-4 label">status</div>
                  <div className="col-8 value">0-incomplete, 1-success, 2-failed</div>
                </div>
                <div className="row">
                  <div className="col-4 label">transaction</div>
                  <div className="col-8 value">transaction number, e.g hash of ETH, transaction of BTC</div>
                </div>
                <div className="row">
                  <div className="col-4 label">order_id</div>
                  <div className="col-8 value">outgoing payments wallet address</div>
                </div>
              </div>
              <div className="text-secondary">Sample: <span className="text-primary">https://www.autonomous.ai/confirmation?<span className="text-info">order_id</span>=123456&<span className="text-info">status</span>=1&<span className="text-info">transaction</span>=0x8b77xx</span></div>
            </div>
          </div>

        </div>
        </LightSpeed>
      </div>
    </div>

  </div>
);

export default PayForDevsGetStarted;
