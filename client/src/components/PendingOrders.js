import React, { Component } from "react";
import Order from "./Order";

class PendingOrders extends Component {
  // A list of orders needs to be passed in via props
  constructor(props) {
    super(props);
  }

  state = {
    orders: this.props.orders
  };

  render() {
    return (
      <React.Fragment>
        <h1>Pending Jobs</h1>
        {this.state.orders.map(order => (
          <Order orderInfo={order} />
        ))}
      </React.Fragment>
    );
  }
}

export default PendingOrders;
