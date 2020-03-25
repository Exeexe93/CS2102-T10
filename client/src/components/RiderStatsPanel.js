import React, { Component } from "react";
import "../styles/RiderStatsPanel.css";
import { FaRegCalendarAlt, FaMoneyBillAlt } from "react-icons/fa";

class RiderStatsPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFTRider: this.props.isFTRider
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
        pathName: "/FTriderMainPage/schedule",
        isFTRider: true
      });
    } else {
      this.props.history.push({
        pathName: "PTriderMainPage/schedule",
        isFTRider: false
      });
    }
  };

  render() {
    return (
      <React.Fragment>
        <div className="panel">
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
      </React.Fragment>
    );
  }
}

export default RiderStatsPanel;
