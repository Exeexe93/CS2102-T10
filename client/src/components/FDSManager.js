import React, { Component } from 'react';
import { Link } from "react-router-dom";
import '../styles/FDSManager.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-dropdown/style.css';

import { Table } from "react-bootstrap";

import {
    Navbar,
    NavbarBrand,
    Col, 
    Jumbotron,
    Row,
    ListGroup,
    Button,
    Input,
    InputGroup,
    InputGroupAddon,
} from 'reactstrap';

class FDSManager extends Component {
    constructor(props) {
        super(props);
        let currentDate = new Date();
        this.state = {
            // Change to the FDSManager name here
            displayMonth: '',
            displayYear: '',
            displayDay: '',
            year: '',
            month: '',
            day: [],
            queryDate: '1',
            area: 'North',
            num: 0,
            orders: 0,
            cost: 0.00,
            customerStats : [],
            ridersStats : [],
            dailyLocationStats: [ 
                {hour: 10, num_orders: 0}, 
                {hour: 11, num_orders: 0},
                {hour: 12, num_orders: 0},
                {hour: 13, num_orders: 0},
                {hour: 14, num_orders: 0},
                {hour: 15, num_orders: 0},
                {hour: 16, num_orders: 0},
                {hour: 17, num_orders: 0},
                {hour: 18, num_orders: 0},
                {hour: 19, num_orders: 0},
                {hour: 20, num_orders: 0},
                {hour: 21, num_orders: 0}
            ],
            FDSManagerName: "Mr Eng"
        };
    }

    handleInputQueryMonth = (e) => {
        this.setState({ month: e.target.value })
        console.log("typeof month", typeof e.target.value)
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
            this.setState({
                ridersStats: res
            })
        })

    }

    validInput = (month, year) => {
        return !isNaN(month) && month > 0 && month < 13 && !isNaN(year);
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
        return returnString;
    }

    handleQuery = () => {
        if (this.state.month && this.state.year && this.validInput(this.state.month, this.state.year)) {
            this.handleQueryMonthNewCustomers();
            this.handleQueryMonthOrders();
            this.handleQueryMonthOrdersCost();
            this.handleQueryMonthCustomersStats();
            this.handleQueryMonthlyRidersStats();
            this.generateDays();
            this.setState({
                displayMonth: this.state.month,
                displayYear: this.state.year,
                month: '',
                year: ''
            });
        } else {
            console.log("error");
        }
    }

    generateDays = () => {
        if (this.state.day.length != 0) {
            this.state.day = [];
        }
        let daysInMonth = 0
        this.state.month && this.state.year 
            ? daysInMonth = new Date(this.state.year, this.state.month, 0).getDate() 
            : daysInMonth = 0
        let i;
        for (i = 1; i <= daysInMonth; i++) {
            this.state.day.push(i);
        }
        console.log("from generate days: %d month %d year %d",daysInMonth, this.state.month, this.state.year)
        return this.state.day;
    }

    renderDayDropdown = () => {
        let items = [];
        for (let i = 1; i <= this.state.day.length; i++) {
            items.push(<option key={i} value={i}>{i}</option>);
        }
        console.log("renderDayDropdown ran");
        return items;
    }

    renderAreaDropdown = () => {
        return ([
            <option key='north' values='north'>North</option>,
            <option key='north-east' values='north-east'>North-East</option>,
            <option key='west' values='west'>West</option>,
            <option key='east' values='east'>East</option>,
            <option key='central' values='central'>Central</option>
        ])
    }

    onDayDropdownSelected  = (e) => {
        console.log("The value selected", e.target.value);
        this.setState({
            queryDate: e.target.value
        })
    }

    onAreaDropdownSelected = (e) => {
        console.log("The value selected", e.target.value);
        this.setState({
            area: e.target.value
        })
    }

    handleLocationQueryHelper = () => {
        console.log("aaaaaaaaaaaaaaaaaa my querydate here: ", this.state.queryDate);
        fetch('http://localhost:3001/FDSManager/dailyLocationStats', {
            method: 'post',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ area: this.state.area, day: this.state.queryDate, month: this.state.displayMonth, year: this.state.displayYear})
        })
        .then(res => {
                return res.json();
            })
        .then(res => {
            // this.state.dailyLocationStats.
            let temp = [];
            for (let j = 10; j < 22; j++) {
                let found = false;
                for (let i = 0; i < res.length; i++) {
                    if (res[i].hour == j) {
                        found = true;
                        temp.push({hour: res[i].hour, num_orders: res[i].num_orders})
                    }
                }
                if (!found) {
                    temp.push({hour: j, num_orders: 0})
                }
            }
            console.log("what is temp: ", temp);
            this.setState({
                dailyLocationStats: temp
            })
        });
    }

    handleLocationQuery = () => {
        if (this.state.displayDay != this.state.queryDate) {
            console.log("queryDate: ", this.state.queryDate);
            console.log("area: ", this.state.area);
            this.setState({
                displayDay : this.state.queryDate
            })
            this.handleLocationQueryHelper();
            console.log("Query date: ", this.state.queryDate);
        }
    }

    renderDailyLocationStats = (dailyLocStats, index) => {
        return (
            <tr>
                <td key={dailyLocStats.hour}>{dailyLocStats.hour}</td>
                <td key={dailyLocStats.hour + '-order'}>{dailyLocStats.num_orders}</td>
            </tr>
        )
    }

    getName = () => {
        // TODO implement get fdsmanager name here if got time
    }

    componentDidMount() {
        this.getName();
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
                    <Tab eventKey="location" title="Location">Location</Tab>
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
                <TabPanel class="tab-panel" className="container">
                    <Row>
                        <Col xs="auto">
                            <InputGroup>
                                <Input type="select" onChange={this.onDayDropdownSelected}>{this.renderDayDropdown()}</Input>
                                <Input type="select" onChange={this.onAreaDropdownSelected}>{this.renderAreaDropdown()}</Input>
                                <InputGroupAddon addonType="append">
                                    <Button color="primary" onClick={this.handleLocationQuery}>Enter</Button>
                                </InputGroupAddon>
                            </InputGroup>
                        </Col>
                    </Row>
                    <Table id="location">
                        <thead>
                            <th>Report for Day</th>
                            <th>Report for Month</th>
                            <th>Report for Year</th>
                        </thead>
                        <tbody>
                            <td>{this.state.displayDay ? this.state.displayDay : 0}</td>
                            <td>{this.state.displayMonth ? this.state.displayMonth : 0}</td>
                            <td>{this.state.displayYear ? this.state.displayYear : 0}</td>
                        </tbody>
                    </Table>
                    <Table id="daily-stats">
                        <thead>
                            <th>Hour</th>
                            <th>Num of Orders</th>
                        </thead>
                        <tbody>
                            {this.state.dailyLocationStats.map(this.renderDailyLocationStats)}
                        </tbody>
                    </Table>
                </TabPanel>
            </Tabs>

        );
    }

}

export default FDSManager;