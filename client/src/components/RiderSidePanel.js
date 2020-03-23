import React, { Component } from "react";
import "../styles/RiderSidePanel.css";

class RiderSidePanel extends Component {
  state = {};
  render() {
    return (
      <React.Fragment>
        <div className="side-panel">
          <button>Salary this week/month</button>
          <p>Your Rating: </p>
          <button>Schedule</button>
        </div>
      </React.Fragment>
    );
  }
}

export default RiderSidePanel;
