import React, { Component } from "react";
import "../styles/RiderStatsPanel.css";
import { FaRegCalendarAlt, FaMoneyBillAlt } from "react-icons/fa";

class RiderStatsPanel extends Component {
  state = {};
  render() {
    return (
      <React.Fragment>
        <div className="panel">
          <button>
            <FaMoneyBillAlt />
            <span> Salary this week/month</span>
          </button>
          <p>Your Rating: </p>
          <button>
            <FaRegCalendarAlt />
            <span> Schedule</span>
          </button>
        </div>
      </React.Fragment>
    );
  }
}

export default RiderStatsPanel;
