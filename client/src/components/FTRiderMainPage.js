import React, { Component } from "react";

import {
  Container,
  Navbar,
  NavbarBrand,
  Nav,
  NavLink,
  Row,
  Col,
  Jumbotron,
  NavbarText
} from "reactstrap";
import "../styles/FTRiderMainPage.css";

import RiderSidePanel from "./RiderSidePanel";
import PendingOrders from "./PendingOrders";
import { GiFoodTruck } from "react-icons/gi";
import { MdHome } from "react-icons/md";

class FTriderMainPage extends Component {
  state = {};
  render() {
    const { name, orders } = this.props;

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
              <span> Welcome back {name}! </span>
              <GiFoodTruck />
            </h1>
          </div>

          <p className="lead">Summary of your activities</p>
        </Jumbotron>
      </Container>
    );
  }
}

export default FTriderMainPage;
