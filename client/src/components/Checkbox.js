import React, { Component } from "react";
import { FormGroup, Input, Label } from "reactstrap";
import "../styles/Checkbox.css";

class Checkbox extends Component {
  state = {};
  render() {
    const { value, text } = this.props;

    return (
      <FormGroup check className="checkbox-form-group">
        <Label check>
          <Input type="checkbox" value={value} />
          {text}
        </Label>
      </FormGroup>
    );
  }
}

export default Checkbox;
