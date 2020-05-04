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
        this.state = {
            // Change to the FDSManager name here
            name: "",
            id: "",
            displayMonth: '',
            displayYear: '',
            displayDay: '',
            year: '',
            month: '',
            day: [],
            queryDate: '',
            previousArea: '',
            area: '',
            num: 0,
            orders: 0,
            cost: 0.00,
            customerStats : [],
            ridersStats : [],
            ridersName : [],
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
            // Promotion
            promoStartDay: '',
            promoStartMonth: '',
            promoStartYear: '',
            promoEndDay: '',           
            promoEndMonth: '',
            promoEndYear: '',
            promoCategory: '',
            promoType: '',
            promoDetails: '',
            discountValue: '',
            triggerValue: '',
            details: '',
            specificOrderSelected : false,
            // Error message
            errorMessage : ''
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
            if (res.length === 0) {
                // TODO set empty list
                this.setState({ridersStats : this.state.ridersName})
                console.log('res length = 0 ',res);
            } else {
                console.log('printing from riderstats query in component ', res);
                this.setState({
                    ridersStats: res
                })
            }
        })

    }

    validInput = (month, year) => {
        return !isNaN(month) && month > 0 && month < 13 && !isNaN(year);
    }

    renderCustomerStats = (customers, index) => {
        return (
            <tr key={index}>
                <td>{index + 1}</td>
                <td>{customers.cust_name}</td>
                <td>{customers.num}</td>
                <td>{customers.total_price}</td>
            </tr>
        )
    }

    renderRidersStats = (riders, index) => {
        return (
            <tr key={index}>
                <td>{riders.name ? riders.name : "abcdef"}</td>
                <td>{riders.num_orders ? riders.num_orders : 0}</td>
                <td>{riders.total_hours ? riders.total_hours : 0}</td>
                <td>{riders.salary ? riders.salary : '$0.00'}</td>
                <td>{this.extractDuration(riders.delivery_duration)}</td>
                <td>{riders.num_ratings ? riders.num_ratings : 0}</td>
                <td>{riders.avg_rating ? riders.avg_rating : 0}</td>
            </tr>
        )
    }

    extractDuration = (duration) => {
        let returnString = ''
        let emptyDuration = duration == null || (!duration.hours && !duration.minutes) 
        if (emptyDuration) {
            return '0 hour 0 minute';
        }
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

    generateDays = (month, year) => {
        let returnDay = [];
        let daysInMonth = 0
        month && year 
            ? daysInMonth = new Date(year, month, 0).getDate() 
            : daysInMonth = 0
        let i;
        for (i = 1; i <= daysInMonth; i++) {
            returnDay.push(i);
        }
        console.log("from generate days: %d month %d year %d",daysInMonth, month, year)
        return returnDay;
    }

    renderDayDropdown = (month, year) => {
        let day = this.generateDays(month, year)
        let items = [];
        items.push(<option value="none" selected disabled hidden>Day</option>)
        for (let i = 1; i <= day.length; i++) {
            items.push(<option key={i} value={i}>{i}</option>);
        }
        console.log("renderDayDropdown ran");
        return items;
    }

    renderAreaDropdown = () => {
        let areas = [
            'Marina Bay', 
            'Marina Centre',
            'Raffles Place', 
            'Tanjong Pagar',
            'Outram',
            'Sentosa',
            'Rochor',
            'Orchard',
            'Newton',
            'River Valley',
            'Bukit Timah',
            'Holland Road',
            'Tanglin',
            'Novena',
            'Thomson',
            'Bishan',
            'Bukit Merah',
            'Geylang',
            'Kallang',
            'Marine Parade',
            'Queenstown',
            'Toa Payoh',
            'Central Water Catchment',
            'Lim Chu Kang',
            'Mandai',
            'Sembawang',
            'Simpang',
            'Sungei Kadut',
            'Woodlands',
            'Yishun',
            'Ang Mo Kio',
            'Hougang',
            'Punggol',
            'Seletar',
            'Sengkang New Town', 
            'Rivervale', 
            'Compassvale', 
            'Buangkok', 
            'Anchorvale', 
            'Fernvale', 
            'Jalan Kayu',
            'Serangoon',
            'Bedok',
            'Changi',
            'Changi Bay',
            'Paya Lebar',
            'Pasir Ris',
            'Tampines',
            'Bukit Batok',
            'Bukit Panjang',
            'Boon Lay',
            'Choa Chu Kang',
            'Clementi',
            'Jurong East',
            'Jurong West',
            'Tengah',
            'Tuas',
            'Benoi',
            'Ghim Moh',
            'Gul',
            'Pandan Gardens',
            'Jurong Island',
            'Kent Ridge',
            'Nanyang',
            'Pioneer',
            'Pasir Laba',
            'Teban Gardens',
            'Toh Tuck',
            'Tuas South',
            'West Coast',
        ].sort();
        let listOfOptions = [<option value="none" selected disabled hidden>Area</option>]
        for (let i = 0; i < areas.length; i++) {
            listOfOptions.push(<option key={areas[i]} values={areas[i]}>
                {areas[i]}
            </option>)
        }
        return listOfOptions;
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
        let emptyArea = this.state.area === ""
        let emptyDay = this.state.queryDate === ""
        if (!emptyArea && !emptyDay) {
            this.setState({
                previousArea : this.state.area,
                displayDay : this.state.queryDate
            })
            this.handleLocationQueryHelper();
        }
    }

    renderDailyLocationStats = (dailyLocStats, index) => {
        return (
            <tr key={index}>
                <td>{dailyLocStats.hour}</td>
                <td>{dailyLocStats.num_orders}</td>
            </tr>
        )
    }

    getName = () => {
        // TODO implement get fdsmanager name here if got time
        let account_id = { accountid : this.props.location.state.account_id}
        console.log("getName ran")
        fetch('http://localhost:3001/FDSManager/getName', {
            method: 'post',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(account_id)
        })
        .then(res => {
            return res.json();
        })
        .then(res => {
            this.setState({
                name : res[0].name,
                id : res[0].fds_id
            })
        })
    }

    getAllRidersName = () => {
        fetch('http://localhost:3001/FDSManager/getAllRidersName')
            .then(res => {
                return res.json()
            })
            .then(res => {
                this.setState({
                    ridersStats : res,
                    ridersName : res
                })
            })
    }

    // Promotion
    renderPromoType = () => {
        return ([
            <option value="none" selected disabled hidden>Type</option>,
            <option key='percent'>Percent</option>, 
            <option key='flat-rate'>Flat Rate</option>
            ])
    }

    renderPromoCategory = () => {
        return ([
            <option value="none" selected disabled hidden>Category</option>,
            <option key='all-orders'>All orders</option>,
            <option key='specific-orders'>Specific orders</option>,
            <option key='new-customers'>New customers</option>
        ])
    }

    renderSpecificOrder = () => {
        return ([
            <option value="none" selected disabled hidden>Order Type</option>,
            <option key='main-dish'>Main Dish</option>,
            <option key='side-dish'>Side Dish</option>,
            <option key='drinks'>Drinks</option>,
            <option key='dessert'>Dessert</option>
        ]) 
    }

    onPromoTypeChanged = (e) => {
        this.setState({
            promoType : e.target.value
        })
    }

    onPromoCategoryChanged = (e) => {
        if (e.target.value === 'Specific orders') {
            this.setState({
                promoCategory : e.target.value,
                specificOrderSelected : true
            })
        } else {
            this.setState({
                promoCategory : e.target.value,
                specificOrderSelected : false
            })
        } 
    }

    onSpecificOrderChanged = (e) => {
        this.setState({
            promoCategory : e.target.value
        })
    }

    onPromoStartDayChanged = (e) => {
        this.setState({
            promoStartDay : e.target.value
        })
    }

    onPromoStartMonthChanged = (e) => {
        this.setState({
            promoStartMonth : e.target.value
        })
        if (this.state.promoStartMonth && this.state.promoStartYear) {
            this.renderDayDropdown(this.promoStartMonth, this.state.promoStartYear)
        }
    }

    onPromoStartYearChanged = (e) => {
        this.setState({
            promoStartYear : e.target.value
        })
        if (this.state.promoStartMonth && this.state.promoStartYear) {
            this.renderDayDropdown(this.promoStartMonth, this.state.promoStartYear)
        }
    }

    onPromoEndDayChanged = (e) => {
        this.setState({
            promoEndDay : e.target.value
        })
    }

    onPromoEndMonthChanged = (e) => {
        this.setState({
            promoEndMonth : e.target.value
        })
        if (this.state.promoEndMonth && this.state.promoEndYear) {
            this.renderDayDropdown(this.promoEndMonth, this.state.promoEndYear)
        }
    }

    onPromoEndYearChanged = (e) => {
        this.setState({
            promoEndYear : e.target.value
        })
        if (this.state.promoEndMonth && this.state.promoEndYear) {
            this.renderDayDropdown(this.promoEndMonth, this.state.promoEndYear)
        }
    }

    onDetailsChanged = (e) => {
        this.setState({
            details : e.target.value
        })
    }

    renderMonthDropdown = () => {
        let monthOptions = [<option value="none" selected disabled hidden>Month</option>]
        for (let i = 1; i <= 12; i++) {
            monthOptions.push(<option key={i} value={i}>{i}</option>)
        }
        return monthOptions;
    }

    renderYearDropdown = () => {
        let yearOptions = [<option value="none" selected disabled hidden>Year</option>]
        let date = new Date();
        let currentYear = date.getFullYear();
        for (let k = 2000; k <= currentYear; k++) {
            yearOptions.push(<option key={k} value={k}>{k}</option>)
        }
        return yearOptions;
    }

    onPromoDiscountValueChanged = (e) => {
        this.setState({
            discountValue : e.target.value
        })
    }

    onPromoMinValChanged = (e) => {
        this.setState({
            triggerValue : e.target.value
        })
    }

    inputValidityCheck = () => {
        let isValidTriggerVal = (this.state.triggerValue > 0) && !isNaN(this.state.triggerValue)
        let isValidDiscountVal = (this.state.discountValue > 0) && !isNaN(this.state.discountValue)
        let isStartDayPresent = this.state.promoStartDay
        let isEndDayPresent = this.state.promoEndDay
        let isCategoryPresent = this.state.promoCategory
        let isTypePresent = this.state.promoType
        let isDetailsPresent = this.state.details
        let missingField = !isStartDayPresent && !isEndDayPresent && !isCategoryPresent && !isTypePresent && !isDetailsPresent
        let isValidTriggerValueAndDiscountValue = isValidDiscountVal && isValidTriggerVal
        let promoStartDay = new Date(this.state.promoStartYear, this.state.promoStartMonth - 1, this.state.promoStartDay)
        let promoEndDay = new Date(this.state.promoEndYear, this.state.promoEndMonth - 1, this.state.promoEndDay)
        let invaliPromotionEndDate = promoStartDay.getTime() > promoEndDay.getTime()
        console.log("start: ",promoStartDay)
        console.log("end: ",promoEndDay)
        console.log("invalidpromoenddate: ", invaliPromotionEndDate)   
        if (missingField) {
            this.setState({
                errorMessage : 'Fill in the fields please'
            })
            return false;
        } else if (!isValidTriggerValueAndDiscountValue) {
            this.setState({
                errorMessage : 'Discount value and minimum value have to be positive integer'
            })
            return false;
        } else if (invaliPromotionEndDate) {
            this.setState({
                errorMessage : 'Promo must end after it starts'
            })
            return false;
        }
        this.setState({
            errorMessage : ''
        })
        return true;
    }

    formatDateForQuery = (day, month, year) => {
        let formatDay = ''
        let formatMonth = ''
        if (day.length == 1) {
            formatDay += '0'
        }
        if (month.length == 1) {
            formatMonth += '0'
        }
        return formatDay + day + formatMonth + month + year + ''
    }

    handleAddPromo = () => {
        if (this.inputValidityCheck()) {
            let promoStart = this.formatDateForQuery(this.state.promoStartDay, this.state.promoStartMonth, this.state.promoStartYear)
            let promoEnd = this.formatDateForQuery(this.state.promoEndDay, this.state.promoEndMonth, this.state.promoEndYear)
            console.log('promostart : %s\npromoend : %s', promoStart, promoEnd)
            fetch('http://localhost:3001/FDSManager/addPromo', {
                method: 'post',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({
                    start_time: promoStart, 
                    end_time: promoEnd,
                    promo_type: this.state.promoType,
                    category: this.state.promoCategory,
                    details: this.state.details,
                    discount_value: this.state.discountValue,
                    trigger_value: this.state.triggerValue,
                    creator_id: this.state.id
                })
            })
            console.log('success')
        }
        console.log("Data needed\nStart Promo day %s/%s/%s\nEnd Promo day %s/%s/%s\nCategory: %s\nType: %s\nDetails: %s\nDiscountV: %s\nTrigger V:%s",
            this.state.promoStartDay, this.state.promoStartMonth, this.state.promoStartYear, this.state.promoEndDay, this.state.promoEndMonth,
            this.state.promoEndYear, this.state.promoCategory, this.state.promoType, this.state.details, this.state.discountValue, this.state.triggerValue);
    }

    componentDidMount() {
        this.getName();
        this.getAllRidersName();
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
                            <h1 className="display-3">Welcome { this.state.name }</h1>
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
                    <Tab eventKey="promotion" titile="Promotion">Promotion</Tab>
                </TabList>
                <TabPanel class="tab-panel">
                    <h2>Monthly Statistics</h2>
                    <ListGroup key="listgroup" className="container">
                        <h3>Overall Summary</h3>
                        <Table>
                            <thead>
                                <tr key="report-date-header">
                                    <th>Report for Month</th>
                                    <th>Report for Year</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr key="report-date-content">
                                    <td>{this.state.displayMonth ? this.state.displayMonth : 0}</td>
                                    <td>{this.state.displayYear ? this.state.displayYear : 0}</td>
                                </tr>
                            </tbody>
                        </Table>
                        <Table striped bordered hover>
                            <thead>
                                <tr key="report-customer-header">
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
                <TabPanel class="tab-panel">
                    <h2>Monthly Statistics</h2>
                    <div className="container">
                        <Table>
                                <thead>
                                    <tr>
                                        <th>Report for Month</th>
                                        <th>Report for Year</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{this.state.displayMonth ? this.state.displayMonth : 0}</td>
                                        <td>{this.state.displayYear ? this.state.displayYear : 0}</td>
                                    </tr>
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
                    </div>
                </TabPanel>
                <TabPanel class="tab-panel" className="container">
                    <Row>
                        <Col xs="auto">
                            <InputGroup>
                                <Input type="select" onChange={this.onDayDropdownSelected}>{this.renderDayDropdown(this.state.displayMonth, this.state.displayYear)}</Input>
                                <Input type="select" onChange={this.onAreaDropdownSelected}>{this.renderAreaDropdown()}</Input>
                                <InputGroupAddon addonType="append">
                                    <Button color="primary" onClick={this.handleLocationQuery}>Enter</Button>
                                </InputGroupAddon>
                            </InputGroup>
                        </Col>
                    </Row>
                    <Table id="location">
                        <thead>
                            <tr>
                                <th>Report for Day</th>
                                <th>Report for Month</th>
                                <th>Report for Year</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{this.state.displayDay ? this.state.displayDay : 0}</td>
                                <td>{this.state.displayMonth ? this.state.displayMonth : 0}</td>
                                <td>{this.state.displayYear ? this.state.displayYear : 0}</td>
                            </tr>
                        </tbody>
                    </Table>
                    <Table id="daily-stats">
                        <thead>
                            <tr>
                                <th>Hour</th>
                                <th>Num of Orders</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.dailyLocationStats.map(this.renderDailyLocationStats)}
                        </tbody>
                    </Table>
                </TabPanel>
                <TabPanel class="tab-panel">
                    <InputGroup className="container">
                        <h2>Start date</h2>
                        <InputGroupAddon addonType="append">
                            <Input type="select" onChange={this.onPromoStartDayChanged}>{this.renderDayDropdown(this.state.promoStartMonth, this.state.promoStartYear)}</Input>
                            <Input type="select" onChange={this.onPromoStartMonthChanged}>{this.renderMonthDropdown()}</Input>
                            <Input type="select" onChange={this.onPromoStartYearChanged}>{this.renderYearDropdown()}</Input>
                        </InputGroupAddon>
                    </InputGroup>
                    <InputGroup className="container">
                        <h2>End date</h2>
                        <InputGroupAddon addonType="append">
                            <Input type="select" onChange={this.onPromoEndDayChanged}>{this.renderDayDropdown(this.state.promoEndMonth, this.state.promoEndYear)}</Input>
                            <Input type="select" onChange={this.onPromoEndMonthChanged}>{this.renderMonthDropdown()}</Input>
                            <Input type="select" onChange={this.onPromoEndYearChanged}>{this.renderYearDropdown()}</Input>
                        </InputGroupAddon>
                    </InputGroup>
                    <div className="container">
                        <Row>
                            <textarea placeholder="Details of discount..." onChange={this.onDetailsChanged}></textarea>
                            <Input placeholder="Discount value" onChange={this.onPromoDiscountValueChanged}></Input>
                            <Input placeholder="Minimum value to apply discount" onChange={this.onPromoMinValChanged}></Input>
                        </Row>
                        <Row>
                            <Col xs="auto">
                                <InputGroup>
                                    <Input type="select" onChange={this.onPromoCategoryChanged}>{this.renderPromoCategory()}</Input>
                                    {this.state.specificOrderSelected && (<Input type="select" onChange={this.onSpecificOrderChanged}>{this.renderSpecificOrder()}</Input>)}
                                    <Input type="select" onChange={this.onPromoTypeChanged}>{this.renderPromoType()}</Input>
                                    <InputGroupAddon addonType="append">
                                        <Button color="primary" onClick={this.handleAddPromo}>Add Promotion</Button>
                                    </InputGroupAddon>
                                </InputGroup>
                            </Col>
                        </Row>
                    </div>
                    <div>
                        {this.state.errorMessage && <h3 className="error">{this.state.errorMessage}</h3>}
                    </div>
                </TabPanel>
            </Tabs>

        );
    }

}

export default FDSManager;