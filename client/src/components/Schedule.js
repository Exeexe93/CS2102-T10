import React, { Component } from "react";
import { Navbar, NavbarBrand, Nav } from "reactstrap";
import { Link } from "react-router-dom";
import swal from "sweetalert";

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
      selectedScheduleList: [],
      originalScheduleList: [],
    };
  }

  /* For a given date, get the ISO week number
   *
   * Based on information at:
   *
   *    http://www.merlyn.demon.co.uk/weekcalc.htm#WNR
   *
   * Algorithm is to find nearest thursday, it's year
   * is the year of the week number. Then get weeks
   * between that date and the first day of that year.
   *
   * Note that dates in one year can be weeks of previous
   * or next year, overlap is up to 3 days.
   *
   * e.g. 2014/12/29 is Monday in week  1 of 2015
   *      2012/1/1   is Sunday in week 52 of 2011
   */
  getWeekNumber = (d) => {
    // Copy date so don't modify original
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    // Get first day of year
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    // Calculate full weeks to nearest Thursday
    var weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
    // Return array of year and week number
    return [d.getUTCFullYear(), weekNo];
  };

  getPTSchedule = () => {
    const monthNum = new Date(this.state.date).getMonth() + 1;
    const weekNum = this.getWeekNumber(new Date(this.state.date))[1];
    // Get PT Schedule for current month
    //TODO
  };

  // Get FT Schedule for current month (based on current date)
  getFTSchedule = () => {
    // getMonth() returns a zero-based value
    const monthNum = new Date(this.state.date).getMonth() + 1;
    const weekNum = this.getWeekNumber(new Date(this.state.date))[1];
    // Get FT Schedule for current month
    // TODO
  };

  getScheduleComponent = () => {
    if (this.props.location.state.isFTRider) {
      return (
        <FTSelectSchedule
          handleSubmit={this.handleFTSubmit}
          selectedDate={this.state.date}
          selectedScheduleList={this.state.selectedScheduleList}
          handleSubmitUpdateSchedule={this.handleSubmitUpdateFTSchedule}
        />
      );
    } else {
      return (
        <PTSelectSchedule
          handleSubmit={this.handlePTSubmit}
          selectedDate={this.state.date}
          selectedScheduleList={this.state.selectedScheduleList}
          handleSubmitUpdateSchedule={this.handleSubmitUpdatePTSchedule}
        />
      );
    }
  };

  handleSubmitUpdateFTSchedule = () => {
    // TODO
    console.log(this.state.selectedScheduleList);
    let scheduleList = [];
    // Check difference in selected and original
    this.state.selectedScheduleList.map((selected) => {
      const index = this.state.originalScheduleList.findIndex((original) => {
        return (
          selected.date === original.date && selected.shift === original.shift
        );
      });
      if (index === -1) {
        scheduleList.push(selected);
      }
    });
    console.log("FTSchedule unique schedule addition: ", scheduleList);
  };

  handleSubmitUpdatePTSchedule = () => {
    // TODO
    console.log(this.state.selectedScheduleList);
    let scheduleList = [];
    // Check difference in selected and original
    this.state.selectedScheduleList.map((selected) => {
      const index = this.state.originalScheduleList.findIndex((original) => {
        const isSameDate = selected.date === original.date;
        const isSameShiftCount =
          selected.shift.length === original.shift.length;
        let isSameShiftValues = true;
        selected.shift.map((selected_shift_value) => {
          const value_index = original.shift.findIndex(
            (original_shift_value) => {
              return original_shift_value === selected_shift_value;
            }
          );
          if (value_index === -1) {
            isSameShiftValues = false;
          }
        });
        if (!(isSameDate && isSameShiftCount && isSameShiftValues)) {
          // Unique addition
          scheduleList.push(selected);
        }
      });
    });
  };

  handleFTSubmit = (e) => {
    e.preventDefault();
    const selectedDate = this.state.date;
    let selectedShift;
    const selectedRadio = document.querySelectorAll(
      'input[name="ft-shift"]:checked'
    );
    selectedRadio.forEach((radio) => {
      selectedShift = radio.value;
    });

    const selectedDateShift = {
      date: selectedDate,
      shift: selectedShift,
    };

    const newScheduleList = this.state.selectedScheduleList.slice();
    // Check for same date entry in schedule list
    const index = newScheduleList.findIndex((o) => o.date === selectedDate);
    if (index === -1) {
      newScheduleList.push(selectedDateShift);
    } else {
      newScheduleList[index] = selectedDateShift;
    }
    // Sort date in ascending order
    newScheduleList.sort((a, b) => new Date(a.date) - new Date(b.date));

    this.setState({
      selectedScheduleList: newScheduleList,
    });
  };

  handlePTSubmit = (e) => {
    e.preventDefault();

    const selectedDate = this.state.date;
    let selectedShift = [];
    let hasSelectedShift = false;

    const checkboxes = document.querySelectorAll('input[name="time"]:checked');
    checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        hasSelectedShift = true;
        selectedShift.push(checkbox.value);
        console.log("AAAA");
        console.log(selectedShift);
        console.log(checkbox.value);
      }
    });

    const selectedDateShift = {
      date: selectedDate,
      shift: selectedShift,
    };

    const newScheduleList = this.state.selectedScheduleList.slice();
    // Check for same date entry in schedule list
    const index = newScheduleList.findIndex((o) => o.date === selectedDate);
    if (index === -1) {
      newScheduleList.push(selectedDateShift);
    } else {
      newScheduleList[index] = selectedDateShift;
    }

    if (hasSelectedShift) {
      // Sort date in ascending order
      newScheduleList.sort((a, b) => new Date(a.date) - new Date(b.date));
      this.setState({
        selectedScheduleList: newScheduleList,
      });
    } else {
      const date = this.state.date;
      swal("Please select at least one shift for " + date);
    }
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
    console.log(this.props.location.state);
    return (
      <div>
        <Navbar className="navbar" color="dark" dark>
          <NavbarBrand href="/">Schedule</NavbarBrand>
          <Nav className="mr-auto">
            <Link
              to={{
                pathname: this.props.location.state.isFTRider
                  ? "/FTRiderMainPage"
                  : "/PTRiderMainPage",
                state: {
                  account_id: this.props.location.state.id,
                },
              }}
              className="link"
            >
              <MdHome size="2em" />
              <span> Home</span>
            </Link>
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
