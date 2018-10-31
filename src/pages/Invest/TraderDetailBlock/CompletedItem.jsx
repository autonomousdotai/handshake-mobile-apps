import './TraderDetail.scss';
import React from 'react';
import { wrapBoundary } from '../../../components/ErrorBoundary';

const CompletedItem = wrapBoundary(({ name, lifeTime, deadline, fundingAmount, releasedAmount, retractAmount, currency }) => (
    <div className="completed-body-row">
        <div className="completed-body-row-title">{name}</div>
        <div className="completed-body-row-body">
            <div className="completed-body-row-body-left">
                <label>{'Duration'}</label>
                <label>{'Deadline'}</label>
                <label>{'Requested fund'}</label>
                <label>{'Returns'}</label>
                <label>{''}</label>
            </div>
            <div className="completed-body-row-body-right">
                <label>{`${lifeTime} months`}</label>
                <label>{new Date(deadline).toDateString()}</label>
                <label>
                    {fundingAmount}
                    <span className="colorTrader-grey">{` ${currency}`}</span>
                </label>
                <label>
                    {(Number(fundingAmount) - Number(releasedAmount) + Number(retractAmount)).toFixed(2)}
                    <span className="colorTrader-grey">{` ${currency}`}</span>
                </label>
                <label className="green">{Number(fundingAmount) ?((Number(releasedAmount) + Number(retractAmount))/Number(fundingAmount)).toFixed(2) : 0} %</label>
            </div>
        </div>
    </div>
));

export default CompletedItem;