import React, { Component } from "react";

import { Navbar, NavbarBrand, Nav } from "reactstrap";
import "../styles/Salary.css";

import { Table } from "react-bootstrap";
import { MdHome } from "react-icons/md";
import { RiLogoutBoxLine } from "react-icons/ri";
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { Link } from "react-router-dom";

class Salary extends Component {
    constructor(props) {
      super(props);

      this.state = {
          rid: this.props.location.state.account_id,
          salaries: [],
          selectedSalaries: [],
          monthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          totalSalary: 0.00
      };
    }

    getSalaries() {
        let data = { rid: this.state.rid };
        axios.post("http://localhost:3001/FTRider/getSalaries", data)
        .then(res => this.setState({ salaries: res.data, selectedSalaries: res.data }));
    };

    componentDidMount() {
        this.getSalaries();
    }

    renderSalary = (salary, index) => {
        return(
            <tr key={salary.sid}>
                <td>{index + 1}</td>
                <td>{salary.start_date}</td>
                <td>{salary.end_date}</td>
                <td>{salary.amount.replace(",", "")}</td>
            </tr>
        )        
    }

    createDate = months => {
        let date = new Date(); 
        date.setMonth(date.getMonth() + months);
        return date;
    }

    handleSelect = event => {
        if (event.target.value === "All") {
            this.setState({ selectedSalaries: this.state.salaries });
        } else {
            let filteredSalaries = this.state.salaries.filter(salary => salary.start_date.slice(3) === event.target.value || salary.end_date.slice(3) === event.target.value);
            this.setState({ selectedSalaries : filteredSalaries });
        }
    }

    getTotalSalary = () => {
        return this.state.selectedSalaries.reduce((prev, curr) => prev + parseFloat(curr.amount.slice(1).replace(",", "")), 0);
    }

    handleHomeNavigation = () => {
        return {
            pathname: this.props.location.state.isFTRider ? "/FTRiderMainPage" : "/PTRiderMainPage",
            state: {
                account_id: this.state.rid
            },
        };
    }

    render() {
        return(
            <div>
                <Navbar className="navbar" color="dark" dark>
                    <NavbarBrand>Salary</NavbarBrand>
                    <Nav className="mr-auto">
                        <Link to={this.handleHomeNavigation} className="icon">
                        <MdHome />
                        <span> Home</span>
                        </Link>
                    </Nav>
                    <Nav>
                        <Link to="/Login" className="icon">
                            <RiLogoutBoxLine />
                            <span> Logout</span>
                            </Link>
                    </Nav>
                </Navbar>
                <h1><center>Your Salaries</center></h1>
                <div className="salary-container">
                    <Form.Label>Select Month: </Form.Label>
                    <Form.Control as="select" custom onChange={this.handleSelect}>
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
                    <br/>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.selectedSalaries.map(this.renderSalary)}<tr>
                            <td></td>
                            <td></td>
                            <td><strong>Total Salary:</strong></td>
                            <td><strong>${this.getTotalSalary()}</strong></td>
                        </tr>
                    </tbody>
                </Table>
                </div>
            </div>
        );
    }
}

export default Salary;