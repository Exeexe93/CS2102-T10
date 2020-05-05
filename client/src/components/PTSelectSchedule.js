import React, { Component } from "react";
import { Form, Input, Label } from "reactstrap";
import "../styles/PTSelectSchedule.css";

class PTSelectSchedule extends Component {
  state = {};

  render() {
    const checkboxContent = [
      { value: "10am to 11am", text: "10am to 11am" },
      { value: "11am to 12pm", text: "11am to 12pm" },
      { value: "12pm to 1pm", text: "12pm to 1pm" },
      { value: "1pm to 2pm", text: "1pm to 2pm" },
      { value: "2pm to 3pm", text: "2pm to 3pm" },
      { value: "3pm to 4pm", text: "3pm to 4pm" },
      { value: "4pm to 5pm", text: "4pm to 5pm" },
      { value: "5pm to 6pm", text: "5pm to 6pm" },
      { value: "6pm to 7pm", text: "6pm to 7pm" },
      { value: "7pm to 8pm", text: "7pm to 8pm" },
      { value: "8pm to 9pm", text: "8pm to 9pm" },
      { value: "9pm to 10pm", text: "9pm to 10pm" },
    ];

    return (
      <div className="PT-schedule-container">
        <div className="pt-schedule-col">
          <h1>Selected Schedule</h1>
          {this.props.selectedScheduleList.map((schedule, index) => {
            return (
              <div key={index} className="pt-selected-schedule">
                <h3>{index + 1})</h3>
                <h3>{schedule.date}</h3>
                <div>
                  {schedule.shift.map((s, index) => {
                    return <h3 key={index}>{s}</h3>;
                  })}
                </div>
              </div>
            );
          })}
          <div className="pt-schedule-form">
            <button onClick={this.props.handleSubmitUpdateSchedule}>
              Submit Schedule
            </button>
          </div>
        </div>

        <div className="pt-schedule-col">
          <h1>Select your schedule for {this.props.selectedDate}</h1>

          <Form className="pt-schedule-form" onSubmit={this.props.handleSubmit}>
            {checkboxContent.map((content, index) => (
              <div key={index + content.text}>
                <Label check>
                  <Input
                    type="checkbox"
                    key={index}
                    name={"time"}
                    value={content.value}
                  />
                  {content.text}
                </Label>
              </div>
            ))}

            <button>Submit</button>
          </Form>
        </div>
      </div>
    );
  }
}

export default PTSelectSchedule;
