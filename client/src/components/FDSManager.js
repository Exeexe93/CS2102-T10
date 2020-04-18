import React, { Component } from 'react';
import { Link } from "react-router-dom";
import '../styles/FDSManager.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import { Table } from "react-bootstrap";

import {
    Navbar,
    NavbarBrand,
    Col, 
    Jumbotron,
    Row,
    ListGroup,
    Button
} from 'reactstrap';

class FDSManager extends Component {
    constructor(props) {
        super(props);
        let currentDate = new Date();
        this.state = {
            // Change to the FDSManager name here
            displayMonth: '',
            displayYear: '',
            year: '',
            month: '',
            num: 0,
            orders: 0,
            cost: 0.00,
            customerStats : [],
            ridersStats : [],
            FDSManagerName: "Mr Eng"
        };
    }

    handleInputQueryMonth = (e) => {
        this.setState({ month: e.target.value })
    };

    handleInputQueryYear = (e) => {
        this.setState({ year: e.target.value })
    };

    handleQueryMonthNewCustomers = () => {
        fetch('http://localhost:3001/FDSManager', {
            method: 'post',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ month: this.state.month, year: this.state.year})
        })
        .then(res => {
                return res.json();
            })
        .then(res => {
            this.setState(
                { 
                    num: res.num
                });
        })
    }; 


    handleQueryMonthOrders = () => {
        fetch('http://localhost:3001/FDSManager/monthlyOrders', {
            method: 'post',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ month: this.state.month, year: this.state.year})
        })
        .then(res => {
                return res.json();
            })
        .then(res => {
            this.setState(
                { 
                    orders: res.num
                });
        })
    }; 

    handleQueryMonthOrdersCost = () => {
        fetch('http://localhost:3001/FDSManager/monthlyOrdersCost', {
            method: 'post',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ month: this.state.month, year: this.state.year})
        })
        .then(res => {
                return res.json();
            })
        .then(res => {
            this.setState(
                { 
                    cost: res.price
                });
        })
    }; 

    handleQueryMonthCustomersStats = () => {
        fetch('http://localhost:3001/FDSManager/monthlyCustomersStats', {
            method: 'post',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ month: this.state.month, year: this.state.year})
        })
        .then(res => {
                return res.json();
            })
        .then(res => {
            this.setState({
                customerStats: res
            })
        })
    };
    
    handleQueryMonthlyRidersStats = () => {
        fetch('http://localhost:3001/FDSManager/monthlyRidersStats', {
            method: 'post',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ month: this.state.month, year: this.state.year})            
        })
        .then(res => {
            return res.json();
        })
        .then(res => {
            console.log(res);
            this.setState({
                ridersStats: res
            })
        })

    }

    validInput = (month, year) => {
        return !isNaN(month) && !isNaN(year);
    }

    renderCustomerStats = (customers, index) => {
        return (
            <tr>
                <td key={index}>{index + 1}</td>
                <td key={index + customers.name}>{customers.cust_name}</td>
                <td key={index + customers.num}>{customers.num}</td>
                <td key={index + customers.total_price}>{customers.total_price}</td>
            </tr>
        )
    }

    renderRidersStats = (riders, index) => {
        let customers = this.state.customers;
        console.log("i'm at render rider");
        console.log(riders);
        return (
            <tr key={index}>
                <td key={index + riders.name}>{riders.name ? riders.name : "abcdef"}</td>
                <td key={index + riders.num_orders}>{riders.num_orders}</td>
                <td key={index}>hours work</td>
                <td key={index + riders.salary}>{riders.salary}</td>
                <td key={index}>{this.extractDuration(riders.delivery_duration)}</td>
                <td key={index}>{riders.num_ratings}</td>
                <td key={index}>{riders.avg_rating}</td>
            </tr>
        )
    }

    extractDuration = (duration) => {
        let returnString = ''
        if (duration.hours) {
            returnString += duration.hours 
            returnString += duration.hours > 1 
                ? " hours " 
                : " hour "
            
        }
        if (duration.minutes) {
            returnString += "" + duration.minutes
            returnString += duration.minutes > 1 
                ? " minutes " 
                : " minute "
            
        }
        console.log(duration.minutes);
        console.log(returnString);
        return returnString;
    }

    handleQuery = () => {
        if (this.state.month && this.state.year && this.validInput(this.state.month, this.state.year)) {
            this.handleQueryMonthNewCustomers();
            this.handleQueryMonthOrders();
            this.handleQueryMonthOrdersCost();
            this.handleQueryMonthCustomersStats();
            this.handleQueryMonthlyRidersStats();
            this.setState({
                displayMonth: this.state.month,
                displayYear: this.state.year,
                month: '',
                year: ''
            });
        } 
    }

    render() {
        console.log("FDSManager active");
        return (
            <Tabs className='centered'>
                <Navbar dark color="dark">
                    <NavbarBrand href="/FDSManager">FDSManager</NavbarBrand>
                </Navbar>
                <Row>
                    <Col>
                        <Jumbotron>
                            <h1 className="display-3">Welcome { this.state.FDSManagerName }</h1>
                            <p className="lead">You can view all the stats below, Have fun working!</p>
                            <div class="input-group">
                            <input className="enter_button" 
                                type="text" 
                                name="Month" 
                                value={this.state.month}
                                placeholder="Month 1-12"
                                onChange={this.handleInputQueryMonth}
                            />
                            <input className="enter_button"
                                type="text" 
                                name="Year" 
                                value={this.state.year}
                                placeholder="Year"
                                onChange={this.handleInputQueryYear}
                            />
                            <Button color="primary" onClick={this.handleQuery}>
                                Enter
                            </Button>
                    </div>
                        </Jumbotron>
                    </Col>
                </Row>
                <TabList id="tabs" defaultIndex={1} onSelect={index => console.log(index)}>
                    <Tab eventKey="customers">Customers</Tab>
                    <Tab eventKey="riders" title="Riders">Riders</Tab>
                </TabList>
                <TabPanel class="tab-panel">
                    <h2>Monthly Statistics</h2>
                    <ListGroup key="listgroup" className="container">
                        <h3>Overall Summary</h3>
                        <Table>
                            <thead>
                                <th>Report for Month</th>
                                <th>Report for Year</th>
                            </thead>
                            <tbody>
                                <td>{this.state.displayMonth ? this.state.displayMonth : 0}</td>
                                <td>{this.state.displayYear ? this.state.displayYear : 0}</td>
                            </tbody>
                        </Table>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>New Customer</th>
                                    <th>Number of Orders in this month</th>
                                    <th>Total amount collected from all orders in this month</th>
                                </tr>
                            </thead>
                            <tbody>
                                <td>{this.state.num ? this.state.num : 0}</td>
                                <td>{this.state.orders ? this.state.orders : 0}</td>
                                <td>{this.state.cost ? this.state.cost : 0}</td>
                            </tbody>
                        </Table>
                        <h3>Specific Customer Summary</h3>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Customer Name</th>
                                    <th>Total Placed Orders</th>
                                    <th>Total Amount spent</th>
                                </tr>   
                            </thead>
                            <tbody>
                                {this.state.customerStats.map(this.renderCustomerStats)}
                            </tbody>
                        </Table>
                    </ListGroup>
                </TabPanel>
                <TabPanel class="tab-panel" className="container">
                    <h2>Monthly Statistics</h2>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th key="rider_name">Rider name</th>
                                <th key="num_orders">Total delivered orders</th>
                                <th key="hours_worked">Total hours worked</th>
                                <th key="salary_earned">Total salary earned</th>
                                <th key="avg_delivery">Average delivery time</th>
                                <th key="total_rating_received">Total rating received</th>
                                <th key="avg_rating">Average rating received</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.ridersStats.map(this.renderRidersStats)}
                        </tbody>
                    </Table>
                </TabPanel>
            </Tabs>

        );
    }

}

export default FDSManager;