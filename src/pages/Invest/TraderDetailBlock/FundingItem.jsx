import React from 'react';
import { ProgressBar } from 'react-bootstrap';
import { wrapBoundary } from '../../../components/ErrorBoundary';
import './TraderDetail.scss';
import { date_diff_indays } from '@/reducers/invest/action';

const handleProgressBar = (values) => [
    { label: 'success', value: 100 },
    { label: 'warning', value: 80 },
    { label: 'info', value: 30 },
    { label: 'danger', value: 0 } 
].find(e => values >= e.value).label;
const getProgressPercent = (p, total) => Number(((Number(p || 0)/ Number(Number(total) || 1))*100).toFixed(2));
const getProgressBar = (p, total) => handleProgressBar(getProgressPercent(p, total));
const getDaysLeft = (e) => e > 0 ? `${e} Days Left` : 'Expired';

const FundingItem = wrapBoundary(({ index, name, fundingAmount, target, deadline }) => (
    <div className="funding-body-row">
        <div className="funding-body-row-left">
            <label>{index}. {name.toUpperCase()}</label>
            <ProgressBar className="progress" bsStyle={getProgressBar(fundingAmount, target)} now={getProgressPercent(fundingAmount, target)} />
            <label className="progress-title">
                {fundingAmount}
                <span className="colorTrader-grey">{` of ${target} ETH`}</span>
            </label>
        </div>
        <div className="funding-body-row-right">
            <label className="colorTrader-grey">{getDaysLeft(date_diff_indays(new Date(), new Date(deadline)))}</label>
            <label className="colorTrader-green">{getProgressPercent(fundingAmount, target)}%</label>
        </div>
    </div>
));

export default FundingItem;
