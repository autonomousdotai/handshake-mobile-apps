
import React from 'react';
import { connect } from 'react-redux';
import md5 from 'md5';
import Pagination from "react-js-pagination";
import { showAlert } from '@/reducers/app/action';
import { loadUsers } from '@/reducers/admin/action';
import { API_URL, URL } from '@/constants';
import moment from 'moment';
import { Table, Button } from 'react-bootstrap';
import Helper from '@/services/helper';
import {required} from '@/components/core/form/validation'


import './AcvitvityLog.scss';

const itemsCountPerPage = 5;
const pageRangeDisplayed = 5;

class AcvitvityLog extends React.Component {

  constructor(props) {
    super(props);

    this.state = {      
      currentPage: 1,
      totalPage: 0,
      activityLogData: [],
    };
  }

  handlePageChange(pageNumber) {
    console.log(`active page is ${pageNumber}`);
    this.setState({currentPage: pageNumber}, ()=>{
      this.loadActivityLogs();
    });
  }

  componentDidMount() {
    this.loadActivityLogs();
  }

  loadActivityLogs() {    
    const { uid } = Helper.getQueryStrings(window.location.search);
    
    this.props.loadUsers({
      PATH_URL: `${API_URL.ADMIN_MANAGER.ACTIVITY_LOG.LIST}?page=${this.state.currentPage}&limit=${itemsCountPerPage}`,
      headers: { AdminHash: this.token },      
      successFn: (response) => {        
        if (response.status === 1) {
          let totalPage = response.data.page_size;
          let activityLogData = response.data.data;
          let currentPage = response.data.page;
          this.setState({ activityLogData, currentPage, totalPage });
        }
      },
    });
  } 
  
  render() {

    return (
      <div>

        <Table striped condensed hover>
            <thead>
              <tr>
                <th>ID</th>    
                <th>User ID</th>                            
                <th>Name</th>
                <th>Action</th>                
                <th>Description</th>
                <th>Path</th>
                <th>IP</th>
                <th>User agent</th>
                <th>Date created</th>
                
              </tr>
            </thead>
            <tbody>
              {this.state.activityLogData.map((item, i) => {                
                const createDate = moment(item.date_created).format('MM/DD/YYYY');                

                return (
                  <tr key={`logs_item_${item.id}`}>
                    <td>{item.id}</td>                    
                    <td>{item.user_id}</td>                                                            
                    <td>{item.name}</td>
                    <td>{item.action}</td> 
                    <td>{item.description}</td>                                                                               
                    <td>{item.path}</td>
                    <td>{item.host}</td>
                    <td>{item.user_agent}</td>
                    <td>{createDate}</td>                    
                  </tr>
                );
              })}
            </tbody>
          </Table>

        <Pagination
          activePage={this.state.currentPage}
          itemsCountPerPage={itemsCountPerPage}
          totalItemsCount={this.state.totalPage}
          pageRangeDisplayed={pageRangeDisplayed}
          onChange={::this.handlePageChange}
        />
      </div>
    );

  }
}

const mapState = state => ({

});

const mapDispatch = ({
  loadUsers,  
  showAlert,  
});
export default connect(mapState, mapDispatch)(AcvitvityLog);
