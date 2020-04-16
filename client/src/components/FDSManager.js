import React, { Component } from 'react';
import { Link } from "react-router-dom";
import '../styles/FDSManager.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

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
        console.log("how many times im called");
        this.state = {
            // Change to the FDSManager name here
            displayMonth: currentDate.getMonth(),
            displayYear: currentDate.getFullYear(),
            year: currentDate.getFullYear(),
            month: currentDate.getMonth(),
            num: 0,
            orders: 0,
            cost: 0.00,
            FDSManagerName: "Mr Eng"
        };
        this.handleQuery()

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

    validInput = (month, year) => {
        return !isNaN(month) && !isNaN(year);
    }


    handleQuery = () => {
        if (this.state.month && this.state.year && this.validInput(this.state.month, this.state.year)) {
            this.handleQueryMonthNewCustomers();
            this.handleQueryMonthOrders();
            this.handleQueryMonthOrdersCost();
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
                        </Jumbotron>
                    </Col>
                </Row>
                <TabList id="tabs" defaultIndex={1} onSelect={index => console.log(index)}>
                    <Tab eventKey="customers">Customers</Tab>
                    <Tab eventKey="riders" title="Riders">Riders</Tab>
                </TabList>
                <TabPanel class="tab-panel">
                    <h2>Monthly stats</h2>
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
                    <ListGroup key="listgroup">
                        <p>
                          Number of new customers in Year:{this.state.displayYear} Month:{this.state.displayMonth} = {this.state.num ? this.state.num : 0}
                        </p>
                        <p>
                            Number of orders in Year:{this.state.displayYear} Month:{this.state.displayMonth} = {this.state.orders ? this.state.orders : 0}  
                        </p>
                        <p>
                            Number of orders cost in Year:{this.state.displayYear} Month:{this.state.displayMonth} = {this.state.cost ? this.state.cost : 0.00}  
                        </p>
                    </ListGroup>
                </TabPanel>
                <TabPanel>Text for Riders</TabPanel>
            </Tabs>

        );
    }

}

export default FDSManager;