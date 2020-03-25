import React, { Component } from "react";

import {
  Container,
  Navbar,
  NavbarBrand,
  Nav,
  NavLink,
  Jumbotron
} from "reactstrap";
import "../styles/FTRiderMainPage.css";

import PendingOrders from "./PendingOrders";
import { GiFoodTruck } from "react-icons/gi";
import { MdHome } from "react-icons/md";
import { FaRegCalendarAlt, FaMoneyBillAlt } from "react-icons/fa";

class FTRiderMainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFTRider: true,
      name: this.props.location.name,
      orders: this.props.location.orders
    };
  }

  handleViewSalary = () => {
    // if (this.state.isFTRider) {
    //   this.props.history.push("/FTriderMainPage/salary");
    // } else {
    //   this.props.history.push("/PTriderMainPage/salary");
    // }
  };

  handleViewSchedule = () => {
    if (this.state.isFTRider) {
      this.props.history.push({
        pathname: "/FTRiderMainPage/schedule",
        isFTRider: true
      });
    } else {
      // this.props.history.push({
      //   pathname: "PTRiderMainPage/schedule",
      //   isFTRider: false
      // });
    }
  };

  render() {
    return (
      <Container fluid className="container-fluid">
        <Navbar className="navbar" color="dark" dark>
          <NavbarBrand href="/">Full Time Rider</NavbarBrand>
          <Nav className="mr-auto">
            <NavLink href="#home" className="link">
              <MdHome />
              <span> Home</span>
            </NavLink>
          </Nav>
        </Navbar>

        <Jumbotron>
          <div className="centered">
            <h1 className="display-2">
              <GiFoodTruck />
              <span> Welcome back {this.state.name}! </span>
              <GiFoodTruck />
            </h1>
          </div>

          <p className="lead">Summary of your activities</p>

          {/* <RiderStatsPanel isFTRider={true} /> */}
          <div className="stats-panel">
            <button onClick={this.handleViewSalary}>
              <FaMoneyBillAlt />
              <span> Salary this week/month</span>
            </button>

            <p>Your Rating: </p>

            <button onClick={this.handleViewSchedule}>
              <FaRegCalendarAlt />
              <span> Schedule</span>
            </button>
          </div>
        </Jumbotron>

        <PendingOrders orders={this.state.orders} />
      </Container>
    );
  }
}

export default FTRiderMainPage;
