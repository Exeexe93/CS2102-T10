import React, { Component } from "react";
import "../styles/RestaurantSummaryPage.css";
import axios from 'axios';
import { MdHome } from "react-icons/md";
import { Navbar, NavbarBrand, Nav, NavLink, Jumbotron } from "reactstrap";
import { RiLogoutBoxLine } from "react-icons/ri";

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

    handleHomeNavigation = () => {
        this.props.history.push({
            pathname: '/RestaurantStaffMainPage',
            state: {
                account_id: this.props.location.state.account_id
            }
        });
    };

    render() {
        return(
            <div>
                <Navbar className="navbar" color="dark" dark>
                    <NavbarBrand> Summary Information </NavbarBrand>
                    <Nav className="mr-auto">
                        <NavLink href="" onClick={this.handleHomeNavigation}className="link">
                            <MdHome />
                            <span> Home</span>
                        </NavLink>
                    </Nav>
                    <Nav>
                        <NavLink href="/Login" className="link">
                            <RiLogoutBoxLine />
                            <span> Logout</span>
                        </NavLink>
                    </Nav>
                </Navbar>
                <Jumbotron>
                        <div className="centered-container">
                            <h1 className="display-3">
                                <span> <b>Total no. of completed orders: {' '}</b>
                                {this.state.numOfOrders}  </span>
                            </h1>
                        </div>
                </Jumbotron>

                <div className="body-container">
                    <h2>
                        <u>Top food items (up to 5): </u>
                        <br/>
                    </h2>
                    <h4>
                        <ul className="list-group">
                            {this.state.topItems.map(this.renderItem)}
                        </ul>
                    </h4>
                    <br/>
                    <h2><u>Promotion Campaign's Statistics</u></h2>
                    <p>
                    2. For each promotional campaign, the duration (in terms of the number of days/hours) of the
                    campaign, and the average number of orders received during the promotion (i.e., the ratio of
                    the total number of orders received during the campaign duration to the number of days/hours
                    in the campaign duration).
                    </p>
                </div>
            </div>
        );
    }
}

export default RestaurantSummaryPage;