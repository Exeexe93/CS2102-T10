import React, { Component } from "react";
import { Form, FormGroup, CustomInput } from "reactstrap";

class FTSelectSchedule extends Component {
  state = {};
  render() {
    return (
      <div>
        <Form>
          <FormGroup>
            <div>
              <CustomInput
                type="radio"
                name="ft-shift"
                label="Shift 1: 10am to 2pm and 3pm to 7pm"
                value="Shift 1: 10am to 2pm and 3pm to 7pm"
                checked
              />
              <CustomInput
                type="radio"
                name="ft-shift"
                label="Shift 2: 11am to 3pm and 4pm to 8pm"
                value="Shift 2: 11am to 3pm and 4pm to 8pm"
                checked
              />
            </div>
          </FormGroup>
        </Form>
      </div>
    );
  }
}

export default FTSelectSchedule;
