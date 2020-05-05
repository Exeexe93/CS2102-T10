import React, { Component } from "react";
import 'react-dates/initialize';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FormGroup from 'react-bootstrap/FormGroup'
import InputGroup from 'react-bootstrap/InputGroup'
import axios from 'axios';
import { MdHome } from "react-icons/md";
import { Navbar, NavbarBrand, Nav, NavLink } from "reactstrap";
import { RiLogoutBoxLine } from "react-icons/ri";
import { DateRangePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import { Table } from "react-bootstrap";

class RestaurantPromotions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            promos: [],
            rest_id: this.props.location.state.rest_id,
            startDate: null,
            endDate: null
        }
    }

    getPromo() {
        let data = { rest_id: this.state.rest_id };
        axios.post('http://localhost:3001/RestaurantStaff/getPromo', data)
        .then(res => this.setState({ promos: res.data }));
    };

    componentDidMount() {
        this.getPromo();
    }

    handleSubmit = (event) => {
        let form = event.target;
        event.preventDefault();
        let new_promo = {
            creator_id: this.props.location.state.account_id,
            details: form.elements.promotion_details.value,
            category: "restaurant",
            promo_type: "percentage",
            discount_value: Math.round(form.elements.discount_percent.value),
            trigger_value: "$" + parseFloat(form.elements.minimum_spending.value).toFixed(2),
            start_time: this.state.startDate._d.toLocaleDateString('en-GB', {day: '2-digit', month: 'short', year: 'numeric'}).replace(/ /g, '-'),
            end_time: this.state.endDate._d.toLocaleDateString('en-GB', {day: '2-digit', month: 'short', year: 'numeric'}).replace(/ /g, '-')
        }

        axios.post('http://localhost:3001/RestaurantStaff/addPromo', new_promo)
        .then(() => console.log('Promo Created'))
        .catch(err => {
            console.error(err);
        });
        this.setState ({ 
            promos: [...this.state.promos, new_promo]
        });
        form.reset();
    }

    handleHomeNavigation = () => {
        this.props.history.push({
            pathname: '/RestaurantStaffMainPage',
            state: {
                account_id: this.props.location.state.account_id
            }
        });
    };

    renderItem = (promo, index) => {
        return(
            <tr key={promo.promo_id}>
                <td>{index + 1}</td>
                <td>{promo.start_time}</td>
                <td>{promo.end_time}</td>
                <td>{promo.details}</td>
                <td>{promo.discount_value}%</td>
                <td>{promo.trigger_value}</td>
            </tr>
        )
    }
    
    render() {
        return(
            <div>
                <Navbar className="navbar" color="dark" dark>
                    <NavbarBrand> Promotional Campaigns </NavbarBrand>

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
                <div className="content">
                    <div className="container">
                        <h1>Add a new promotion</h1>
                        <form onSubmit = {this.handleSubmit}>
                            <FormGroup>
                                <Form.Label>Promotion Date: </Form.Label> <br/>
                                <DateRangePicker
                                    required={true}
                                    startDate={this.state.startDate}
                                    startDateId="your_unique_start_date_id"
                                    endDate={this.state.endDate}
                                    endDateId="your_unique_end_date_id"
                                    onDatesChange={({ startDate, endDate }) => this.setState({ startDate, endDate })}
                                    focusedInput={this.state.focusedInput}
                                    onFocusChange={focusedInput => this.setState({ focusedInput })}
                                    displayFormat="DD/MM/YYYY"
                                />
                                <h1/>
                                <Form.Label>Promotion Details: </Form.Label>
                                <Form.Control name = "promotion_details" required={true} type="text" placeholder="Promotion Details" as="textarea" rows="3"/>
                                <h1/>
                                <Form.Label>Discount Percent: </Form.Label>
                                <InputGroup>
                                <Form.Control name = "discount_percent" required={true} type="number" min="1" max="100" step="1" data-number-to-fixed="0" placeholder="Discount Percent"/>
                                <InputGroup.Prepend>
                                        <InputGroup.Text id="inputGroupPrepend">%</InputGroup.Text>
                                </InputGroup.Prepend>
                                </InputGroup>
                                <h1/>
                                <Form.Label> Minimum Spending: </Form.Label>
                                <InputGroup>
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="inputGroupPrepend">$</InputGroup.Text>
                                </InputGroup.Prepend>
                                <Form.Control name = "minimum_spending" required={true} type="number" type="number" min="0.01" step="0.01" 
                                    data-number-to-fixed="2" placeholder="Minimum Spending"/>
                                </InputGroup>
                                <br/>
                                <div className="text-center">
                                    <Button type="submit"> Add Promo </Button>
                                </div>
                            </FormGroup>
                        </form>
                        <h1>Ongoing/Past Promotions</h1> <br/>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                    <th>Details</th>
                                    <th>Discount Amount</th>
                                    <th>Minimum Spending</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.promos.map(this.renderItem)}
                            </tbody>
                        </Table>
                    </div>
                </div>
            </div>
        );
    }

}

export default RestaurantPromotions;