import React, { Component } from "react";
import { Container, Navbar, NavbarBrand, Nav, NavLink } from "reactstrap";

import Calendar from "react-calendar";
import { MdHome } from "react-icons/md";

import "../styles/Schedule.css";
import FTSelectSchedule from "./FTSelectSchedule";
import PTSelectSchedule from "./PTSelectSchedule";

class Schedule extends Component {
  constructor(props) {
    super(props);

    this.state = {
      scheduleComponent: this.props.location.isFTRider ? (
        <FTSelectSchedule />
      ) : (
        <PTSelectSchedule />
      ),
    };
  }

  handleHomeNavigation = () => {
    this.props.history.push({
      pathname: "/",
    });
  };

  render() {
    return (
      <Container fluid className="container-fluid">
        <Navbar className="navbar" color="dark" dark>
          <NavbarBrand href="/">Schedule</NavbarBrand>
          <Nav className="mr-auto">
            <NavLink
              href=""
              onClick={this.handleHomeNavigation}
              className="link"
            >
              <MdHome />
              <span> Home</span>
            </NavLink>
          </Nav>
        </Navbar>

        <div className="centered-container">
          <Calendar className="react-calendar" />
        </div>

        {this.state.scheduleComponent}
      </Container>
    );
  }
}

export default Schedule;
