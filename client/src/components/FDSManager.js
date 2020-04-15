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
    InputGroup,
    Input,
    InputGroupAddon,
    ListGroup,
    Button
} from 'reactstrap';

class FDSManager extends Component {
    constructor(props) {
        super(props);
        let currentDate = new Date();
        this.state = {
            // Change to the FDSManager name here
            displayMonth: currentDate.getMonth(),
            displayYear: currentDate.getFullYear(),
            year: '',
            month: '',
            num: 0,
            orders: 0,
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
        console.log("before running method month %s year %s", this.state.month, this.state.year);
        fetch('http://localhost:3001/FDSManager/monthlyOrders', {
            method: 'post',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ month: this.state.month, year: this.state.year})
        })
        .then(res => {
                return res.json();
            })
        .then(res => {
            console.log("month in function, %s", this.state.month);
            this.setState(
                { 
                    orders: res.num
                });
        })
        console.log("after running method month %s year %s", this.state.month, this.state.year);
    }; 


    handleQuery = () => {
        this.handleQueryMonthNewCustomers();
        this.handleQueryMonthOrders();
        this.setState(
            {
                displayMonth: this.state.month,
                displayYear: this.state.year,
                month: '',
                year: ''
            }
        )
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
                <TabPanel>
                    <InputGroup>
                        <Input 
                            type="text" 
                            name="Month" 
                            value={this.state.month}
                            placeholder="Month 1-12"
                            onChange={this.handleInputQueryMonth}
                        />

                        <Input 
                            type="text" 
                            name="Year" 
                            value={this.state.year}
                            placeholder="Year"
                            onChange={this.handleInputQueryYear}
                        />
                        <InputGroupAddon addonType="append">
                            <Button color="primary" onClick={this.handleQuery}>
                                Enter
                            </Button>
                        </InputGroupAddon>
                    </InputGroup>
                    <ListGroup key="listgroup">
                        <p>
                          Number of new customers in Year:{this.state.displayYear} Month:{this.state.displayMonth} = {this.state.num}
                        </p>
                        <p>
                            Number of orders in Year:{this.state.displayYear} Month:{this.state.displayMonth} = {this.state.orders}  
                        </p>
                    </ListGroup>
                </TabPanel>
                <TabPanel>Text for Riders</TabPanel>
            </Tabs>

        );
    }

}

export default FDSManager;