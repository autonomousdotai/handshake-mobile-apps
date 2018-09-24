import React from "react";
import { Fade, Flip, Zoom, Slide, LightSpeed } from 'react-reveal';
import imgNinjawallet from '@/assets/images/landing/pay-for-devs/ninja-wallet.png';
import imgAnywhere from '@/assets/images/landing/pay-for-devs/anywhere.png';
import imgChargeBack from '@/assets/images/landing/pay-for-devs/chargeback.png';
import imgFastPayments from '@/assets/images/landing/pay-for-devs/fast-payments.svg';
import imgSaveMoney from '@/assets/images/landing/pay-for-devs/save-money.svg';
import imgSimpleUse from '@/assets/images/landing/pay-for-devs/simple-use.svg';
import img1 from '@/assets/images/landing/home/hivepay-online.jpg';


const PayForDevs = () => (
  <div className="container project-detail pay-for-devs">
    <div className="row getstart">
    <Slide top>
      <div className="col-12 col-md-6 pd-subHeading">
        <p>We wanted to create a platform that would allow businesses to seamlessly integrate cryptocurrency payments into their current business model.</p>
        <p className="pd-content font-normal">Give your customers more choices when paying.</p>
        <div><a href="/pay-for-devs-get-started"><button className="btn btn-primary disable ml-1">Get Started</button></a></div>
      </div>
    </Slide>
      <div className="col-12 col-md-6 text-right"><Flip right><img src={img1} /></Flip></div>
    </div>

    <div className="row pb-4 desc">
    <Slide bottom>
      <div className="col-12 col-md-6 pd-content">
        <p className="pd-heading">Pay for Devs</p>
        <p className="pb-4">Pay for Devs will allow your ecommerce platform to connect to truly borderless payment networks and checkout with plenty of different cryptocurrencies, including BTC, BCH and ETH. This means that you will be able to receive payments instantly, from anywhere in the world.</p>
        <p className="pb-4">Customers will be able to pay safely and securely without handing over any personal information. All refunds are made through the merchants, meaning there are no chargeback fees.</p>
      </div>
    </Slide>
      <div className="col-12 col-md-6"><Zoom bottom><img src={imgNinjawallet} /></Zoom></div>
    </div>

    <div className="row why-use">
      <Flip bottom><div className="pd-heading">Why use Pay for Devs in your business?</div></Flip>
      <div className="card-deck">
      <Slide bottom cascade>
        <div className="card">
          <img className="card-img-top" src={imgFastPayments} alt="Fast payments" />
          <div className="card-body">
            <h5 className="card-title">Fast payments</h5>
              <p className="card-text">Traditional payment gateways are slow and inefficient. It can take days for the money to land in your bank account.</p>
              <p>Pay for Devs uses Ninja Wallet - meaning you only have to wait for as long as it takes a transaction to be verified on the blockchain to see the cryptocurrency in your wallet.</p>
              <p>Cutting the time it takes to receives funds from days to minutes.</p>
          </div>
        </div>
        <div className="card">
          <img className="card-img-top" src={imgSaveMoney} alt="Save money" />
          <div className="card-body">
            <h5 className="card-title">Save money</h5>
            <p className="card-text">We think that high fees and costly payment gateways are unnecessary. </p>
            <p className="card-text">That is why Pay for Devs is free to use and install. We don’t charge you any transaction fees. </p>
          </div>
        </div>
        <div className="card">
          <img className="card-img-top" src={imgSimpleUse} alt="Simple to use" />
          <div className="card-body">
            <h5 className="card-title">Simple to use</h5>
            <p className="card-text">Pay for Devs is quick and easy to set up and easily integrates into your existing online mobile app or web-based stores.</p>
          </div>
        </div>
      </Slide>
      </div>

    </div>

    <div className="row anywhere">
    <LightSpeed left cascade>
      <div className="col-12 col-md-6 pd-content">
        <p className="pd-heading">Sell to anyone, anywhere</p>
        <p>Pay for Devs allows you to connect with the millions of cryptocurrency users all over the world.  </p>
      </div>
      </LightSpeed>
      <div className="col-12 col-md-6"><Zoom right><img src={imgAnywhere} /></Zoom></div>
    </div>

    <div className="row chargeback">
      <div className="col-12 col-md-6"><Zoom left><img src={imgChargeBack} /></Zoom></div>
      <LightSpeed right cascade>
      <div className="col-12 col-md-6 pd-content">
        <p className="pd-heading">End chargeback fraud and identity theft.</p>
        <p>By using cryptocurrency for payments, customers can pay without handing over sensitive personal information reducing the risk of identity theft occurring.</p>
        <p>All refunds are made through the merchant - meaning no chargebacks.</p>
      </div>
      </LightSpeed>
    </div>
  </div>
);

export default PayForDevs;
