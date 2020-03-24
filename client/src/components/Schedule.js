import React, { Component } from "react";
import {
  Container,
  Navbar,
  NavbarBrand,
  Nav,
  NavLink,
  Jumbotron
} from "reactstrap";

import Calendar from "react-calendar";
import { MdHome } from "react-icons/md";

import "../styles/Schedule.css";
import FTSelectSchedule from "./FTSelectSchedule";

class Schedule extends Component {
  state = {};
  render() {
    return (
      <Container fluid className="container-fluid">
        <Navbar className="navbar" color="dark" dark>
          <NavbarBrand href="/">Schedule</NavbarBrand>
          <Nav className="mr-auto">
            <NavLink href="#home" className="link">
              <MdHome />
              <span> Home</span>
            </NavLink>
          </Nav>
        </Navbar>

        <div className="centered">
          <Calendar className="react-calendar" />
        </div>

        <FTSelectSchedule />
        <div className="centered submit-button">
          <button>Submit</button>
        </div>
      </Container>
    );
  }
}

export default Schedule;
