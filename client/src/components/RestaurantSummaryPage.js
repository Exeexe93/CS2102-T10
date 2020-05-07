import React, { Component } from "react";
import "../styles/RestaurantSummaryPage.css";
import axios from "axios";
import { MdHome } from "react-icons/md";
import { Navbar, NavbarBrand, Nav } from "reactstrap";
import { RiLogoutBoxLine } from "react-icons/ri";
import Form from "react-bootstrap/Form";
import { Link } from "react-router-dom";

class RestaurantSummaryPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            monthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            orders: [],
            selectedOrders: [],
            topItems: [],
            selectedTopItems: [],
            promos: [],
            selectedPromo: ""
        }
    }

    getOrders() {
        let data = { rest_id: this.props.location.state.rest_id };
        axios.post("http://localhost:3001/RestaurantStaff/getOrders", data)
        .then(res => this.setState({ orders: res.data, selectedOrders: res.data }));
    }

    getTopItems() {
        let data = { rest_id: this.props.location.state.rest_id };
        axios.post("http://localhost:3001/RestaurantStaff/getTopItems", data)
        .then(res => this.setState({ topItems: res.data, selectedTopItems: res.data }));
    }

    getPromoStats() {
        let data = { rest_id: this.props.location.state.rest_id };
        axios.post("http://localhost:3001/RestaurantStaff/getPromoStats", data)
        .then(res => this.setState({ promos: res.data, selectedPromo: res.data[0] }));
    }

    componentDidMount() {
        this.getOrders();
        this.getTopItems();
        this.getPromoStats();
    }

    renderItem = (listItem, index) => {
        return (
            <li key={index} className="list-group-item list-group-item-secondary">
                {index + 1}. {listItem.name} - {listItem.totalquantity} sold
            </li>
        );
    }

    renderPromoDetails = () => {
        return (
            <div>
                Period: {this.state.selectedPromo.start_time} {' TO '} {this.state.selectedPromo.end_time}
                <br />
                Duration: {this.state.selectedPromo.duration} {this.state.selectedPromo.duration > 1 ? "days" : "day"}
                <br />
                Details: {this.state.selectedPromo.details}
                <br />
                Discount: {this.state.selectedPromo.promo_type === "flat-rate" ? "$" : ""}{this.state.selectedPromo.discount_value}{this.state.selectedPromo.promo_type === "percent" ? "%" : ""}
                <br />
                Minimum Spending: {this.state.selectedPromo.trigger_value}
                <h1 />
                <strong>Average number of orders received:</strong>
                <br />
                Per day: {parseFloat(this.state.selectedPromo.num_of_times_used/this.state.selectedPromo.duration).toFixed(3)} orders 
                <br/>
                Per hour: {parseFloat(this.state.selectedPromo.num_of_times_used/this.state.selectedPromo.duration/24).toFixed(3)} orders
            </div>
        );
    }

    handleHomeNavigation = () => {
        return {
            pathname: "/RestaurantStaffMainPage",
            state: {
                account_id: this.props.location.state.account_id
            },
        };
    }

    handleSelect = event => {
        this.setState({ selectedPromo: this.state.promos[event.target.value.slice(10, 11) - 1] });
    }

    handleMonth = event => {
        if (event.target.value === "All") {
            this.setState({ selectedOrders: this.state.orders, selectedTopItems: this.state.topItems });
        } else {
            let filteredOrders = this.state.orders.filter(order => order.order_date === event.target.value);
            let filteredTopItems = this.state.topItems.filter(topItems => topItems.order_date === event.target.value);
            this.setState({ selectedOrders : filteredOrders, selectedTopItems: filteredTopItems });
        }
    }

    createDate = months => {
        let date = new Date(); 
        date.setMonth(date.getMonth() + months);
        return date;
    }

    render() {
        return(
            <div>
                <Navbar className="navbar" color="dark" dark>
                    <NavbarBrand>Summary Information</NavbarBrand>
                    <Nav className="mr-auto">
                        <Link to={this.handleHomeNavigation} className="icon">
                            <MdHome />
                            <span>Home</span>
                        </Link>
                    </Nav>
                    <Nav>
                        <Link to="/Login" className="icon">
                            <RiLogoutBoxLine />
                            <span>Logout</span>
                        </Link>
                    </Nav>
                </Navbar>
                <div className="summary-container">
                    <h1><u><center>Restaurant Sales Summary</center></u></h1>
                    <h5 />
                    <h4><Form.Label>Select Month:</Form.Label></h4>
                    <Form.Control as="select" custom onChange={this.handleMonth}>
                        <option>All</option>
                        <option>{this.state.monthNames[new Date().getMonth()]}-{new Date().getFullYear()} </option>
                        <option>{this.state.monthNames[this.createDate(-1).getMonth()]}-{this.createDate(-1).getFullYear()}</option>
                        <option>{this.state.monthNames[this.createDate(-2).getMonth()]}-{this.createDate(-2).getFullYear()}</option>
                        <option>{this.state.monthNames[this.createDate(-3).getMonth()]}-{this.createDate(-3).getFullYear()}</option>
                        <option>{this.state.monthNames[this.createDate(-4).getMonth()]}-{this.createDate(-4).getFullYear()}</option>
                        <option>{this.state.monthNames[this.createDate(-5).getMonth()]}-{this.createDate(-5).getFullYear()}</option>
                        <option>{this.state.monthNames[this.createDate(-6).getMonth()]}-{this.createDate(-6).getFullYear()}</option>
                        <option>{this.state.monthNames[this.createDate(-7).getMonth()]}-{this.createDate(-7).getFullYear()}</option>
                        <option>{this.state.monthNames[this.createDate(-8).getMonth()]}-{this.createDate(-8).getFullYear()}</option>
                        <option>{this.state.monthNames[this.createDate(-9).getMonth()]}-{this.createDate(-9).getFullYear()}</option>
                        <option>{this.state.monthNames[this.createDate(-10).getMonth()]}-{this.createDate(-10).getFullYear()}</option>
                        <option>{this.state.monthNames[this.createDate(-11).getMonth()]}-{this.createDate(-11).getFullYear()}</option> 
                    </Form.Control>
                </div>
                <h3 />
                <div className="body-container">
                    <h2><center><b>Top food items (up to 5):</b></center></h2>
                    <h1 />
                    <h4>
                        <ul className="list-group">
                            {this.state.selectedTopItems.slice(0, 5).map(this.renderItem)}
                        </ul>
                        <h5 />
                        <b>Total no. of completed orders: {" "}</b>
                        {this.state.selectedOrders.length}
                        <h2 />
                        <b>Total cost of all completed orders: {" "}</b>
                        ${this.state.selectedOrders.reduce((prev, curr) => prev + parseFloat(curr.total_price.slice(1).replace(",", "")), 0)}
                    </h4>
                
                    <h2>
                        <h1><u><center>Promotion Campaign Statistics</center></u></h1>
                        <h1 />
                        <h3>
                            <Form.Label>Select Promotion:</Form.Label>
                            <Form.Control as="select" custom onChange={this.handleSelect}>
                                {this.state.promos.length > 0 ? this.state.promos.map((promo, index) => <option>Promotion {index + 1}</option>) : <option>No promotion available</option>}
                            </Form.Control>
                            <h1 />
                        </h3>
                        <h4>
                            <strong>Promotion Info:</strong>
                            <br />
                            {this.state.promos.includes(this.state.selectedPromo) ? this.renderPromoDetails() : ""}
                        </h4>
                    </h2>
                </div>
            </div>
        );
    }
}

export default RestaurantSummaryPage;