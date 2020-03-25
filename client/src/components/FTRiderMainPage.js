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

import RiderStatsPanel from "./RiderStatsPanel";
import PendingOrders from "./PendingOrders";
import { GiFoodTruck } from "react-icons/gi";
import { MdHome } from "react-icons/md";

class FTRiderMainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.location.name,
      orders: this.props.location.orders
    };
  }

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

          <RiderStatsPanel isFTRider={true} />
        </Jumbotron>

        <PendingOrders orders={this.state.orders} />
      </Container>
    );
  }
}

export default FTRiderMainPage;
