import React, { Component } from "react";
import "../styles/RestaurantSummaryPage.css";
import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import axios from 'axios';

class RestaurantSummaryPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            numOfOrders: "",
            topItems: []
        }
    }

    getNumOfOrders() {
        let data = { rest_id: this.props.location.state.rest_id };
        axios.post('http://localhost:3001/RestaurantStaff/getNumOfOrders', data)
        .then(res => this.setState({ numOfOrders: res.data[0].count }));
      };

    getTopItems() {
        let data = { rest_id: this.props.location.state.rest_id };
        axios.post('http://localhost:3001/RestaurantStaff/getTopItems', data)
        .then(res => this.setState({ topItems: res.data }));
    }

    componentDidMount() {
        this.getNumOfOrders();
        this.getTopItems();
    }

    renderItem = (listItem, index) => {
        return(
            <li key={index} className="list-group-item list-group-item-secondary">
                {index + 1}. {listItem.name} - {listItem.totalquantity} sold
            </li>
        )
    }

    render() {
        return(
            <div className="content" >
                <div className="container">
                    <div className="header">
                        <center>
                            <h1>
                                <strong>Summary Information {' '}</strong>
                                <Link to={{
                                    pathname: '/RestaurantStaffMainPage',
                                    state: { account_id: this.props.location.state.account_id}
                                    }}>
                                    <Button variant={"primary"}>Main Page</Button>
                                </Link>
                            </h1>
                            <br/>
                            <h3>
                            <b>Total no. of completed orders: {' '}</b>
                           {this.state.numOfOrders}  
                        </h3>
                        </center>
                        <br/>
                        <h4>
                            <u>Top food items (up to 5): </u>
                            <br/>
                        </h4>
                        <h4>
                            <ul className="list-group">
                                {this.state.topItems.map(this.renderItem)}
                            </ul>
                        </h4>
                        <br/>
                        <h4><u>Promotion Campaign's Statistics</u></h4>
                        <p>
                        2. For each promotional campaign, the duration (in terms of the number of days/hours) of the
                        campaign, and the average number of orders received during the promotion (i.e., the ratio of
                        the total number of orders received during the campaign duration to the number of days/hours
                        in the campaign duration).
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}

export default RestaurantSummaryPage;