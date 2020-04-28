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
        <FTSelectSchedule handleSubmit={this.handleFTSubmit} />
      ) : (
        <PTSelectSchedule handleSubmit={this.handlePTSubmit} />
      ),
      date: new Date(),
    };
  }

  handleFTSubmit = (e) => {
    e.preventDefault();

    console.log(this.state.date);

    const selected = document.querySelectorAll(
      'input[name="ft-shift"]:checked'
    );
    selected.forEach((selectedRadio) => {
      console.log(selectedRadio.value);
    });
  };

  handlePTSubmit = (e) => {
    e.preventDefault();

    console.log(this.state.date);

    const checkboxes = document.querySelectorAll('input[name="time"]:checked');
    checkboxes.forEach((checkbox) => {
      console.log(checkbox.value);
    });
  };

  handleHomeNavigation = () => {
    this.props.history.push({
      pathname: "/",
    });
  };

  onDateSelection = (date) => {
    this.setState({ date });
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
          <Calendar
            className="react-calendar"
            onClickDay={this.onDateSelection}
            defaultValue={this.state.date}
          />
        </div>

        {this.state.scheduleComponent}
      </Container>
    );
  }
}

export default Schedule;
