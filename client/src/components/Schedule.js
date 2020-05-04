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
      date: this.formatDate(new Date()),
    };
  }

  getScheduleComponent = () => {
    if (this.props.location.isFTRider) {
      return (
        <FTSelectSchedule
          handleSubmit={this.handleFTSubmit}
          selectedDate={this.state.date}
        />
      );
    } else {
      return (
        <PTSelectSchedule
          handleSubmit={this.handlePTSubmit}
          selectedDate={this.state.date}
        />
      );
    }
  };

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

  // Format given Date object into a string of Format:
  // DAY MONTH YEAR (e.g. 4 May 2020)
  formatDate = (date) => {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString
    const options = { year: "numeric", month: "long", day: "numeric" };
    const selectedDate = date.toLocaleDateString("en-GB", options);
    return selectedDate;
  };

  onDateSelection = (date) => {
    this.setState({ date: this.formatDate(date) });
  };

  render() {
    return (
      <div>
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
            defaultValue={new Date(this.state.date)}
          />
        </div>

        {this.getScheduleComponent()}
      </div>
    );
  }
}

export default Schedule;
