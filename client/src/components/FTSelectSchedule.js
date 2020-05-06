import React, { Component } from "react";
import { Form, FormGroup, Input, Label } from "reactstrap";
import "../styles/FTSelectSchedule.css";

class FTSelectSchedule extends Component {
  constructor(props) {
    super(props);
    this.state = { selectedDay: this.props.selectedDate };
  }

  render() {
    return (
      <div className="ft-schedule-container">
        <div className="ft-schedule-col">
          <h1>Selected Schedule</h1>
          {this.props.selectedScheduleList.map((schedule, index) => {
            return (
              <div key={index} className="ft-selected-schedule">
                <h3>{index + 1})</h3>
                <h3>{schedule.date}</h3>
                <h3>{schedule.shift}</h3>
              </div>
            );
          })}
          <div className="ft-schedule-form">
            <button onClick={this.props.handleSubmitUpdateSchedule}>
              Submit Schedule
            </button>
          </div>
        </div>

        <div className="ft-schedule-col">
          <h1>Select Daily Schedule for {this.props.selectedDate}</h1>

          <Form className="ft-schedule-form" onSubmit={this.props.handleSubmit}>
            <FormGroup check>
              <Label check>
                <Input
                  required
                  type="radio"
                  name="ft-shift"
                  value="Shift 1: 10am to 2pm and 3pm to 7pm"
                />
                Shift 1: 10am to 2pm and 3pm to 7pm
              </Label>
            </FormGroup>

            <FormGroup check>
              <Label check>
                <Input
                  type="radio"
                  name="ft-shift"
                  value="Shift 2: 11am to 3pm and 4pm to 8pm"
                />
                Shift 2: 11am to 3pm and 4pm to 8pm
              </Label>
            </FormGroup>

            <FormGroup check>
              <Label check>
                <Input
                  type="radio"
                  name="ft-shift"
                  value="Shift 3: 12pm to 4pm and 5pm to 9pm"
                />
                Shift 3: 12pm to 4pm and 5pm to 9pm
              </Label>
            </FormGroup>

            <FormGroup check>
              <Label check>
                <Input
                  type="radio"
                  name="ft-shift"
                  value="Shift 4: 1pm to 5pm and 6pm to 10pm"
                />
                Shift 4: 1pm to 5pm and 6pm to 10pm
              </Label>
            </FormGroup>

            <button>Submit</button>
          </Form>
        </div>
      </div>
    );
  }
}

export default FTSelectSchedule;
