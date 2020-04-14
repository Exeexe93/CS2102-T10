import React, { Component } from "react";
import "../styles/RestaurantSummaryPage.css";
import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';

class RestaurantSummaryPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            numOrders: 0,
            topItems: [
                "Crab",
                "Salmon",
                "Bubble tea",
                "Exe",
                "Hotcakes"
            ]
        }
    }

    renderItem = (listItem, index) => {
        return(
            <li key={index} className="list-group-item list-group-item-secondary">
                {index + 1}.{listItem}
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
                                <Link to='/RestaurantStaffMainPage'>
                                    <Button variant={"primary"}>Main Page</Button>
                                </Link>
                            </h1>
                            <br/>
                            <h3>
                            <b>Total no. of completed orders: {' '}</b>
                           {this.state.numOrders}  
                        </h3>
                        </center>
                        <br/>
                        <h4>
                            <u>Top 5 food items: </u>
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