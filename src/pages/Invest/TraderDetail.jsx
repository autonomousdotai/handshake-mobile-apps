import React, { Component } from 'react';
import { connect } from 'react-redux';
import InvestNavigation from './InvestNavigation';
import TraderDetailBlock from './TraderDetailBlock';
import { fetch_trader_detail } from '@/reducers/invest/action';
import Loading from '@/components/Loading';

class TraderDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
        }
    }

    getTraderDetail = () => {
        this.props.fetch_trader_detail(this.props.match.params.traderID).then(r => this.setState({ loading: false })).catch(err => console.log(err));
    }
    componentDidMount = () => {
        this.getTraderDetail();
    }

    render(){
        const item = {
            rating: 1,
            avatarUrl: 'https://randomuser.me/api/portraits/men/9.jpg',
            name: 'Quang Vo',
            activeProjects: 115,
            managedFunds: 200000000,
            averageReturn: 0.32,
            cumEarning: 15000,
            currentlyFundings: [],
            completedProjects: []
        };
        if (this.state.loading) return <Loading isLoading={this.state.loading} />
        return (
            <div style={{ backgroundColor: '#fafbff', minHeight: '100vh' }}>
                <InvestNavigation header="Trader" history={this.props.history} />
                <TraderDetailBlock {...this.props.trader} />
            </div>
        )
    }
}

const mapState = state => ({
    trader: state.invest && state.invest.trader ? state.invest.trader : null
})
const mapDispatch = { fetch_trader_detail }
export default connect(mapState, mapDispatch)(TraderDetail);