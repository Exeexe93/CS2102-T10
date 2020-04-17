import React, { Component } from "react";
import Order from "./Order";
import "../styles/PendingOrders.css";

class PendingOrders extends Component {
  // A list of orders needs to be passed in via props
  constructor(props) {
    super(props);
    this.state = {
      orders: this.props.orders,
    };
  }

  render() {
    return (
      <div className="pending-order-container">
        <h1>Pending Jobs</h1>
        <div>
          {this.state.orders.map((order, index) => (
            <Order key={index} orderInfo={order} />
          ))}
        </div>
      </div>
    );
  }
}

export default PendingOrders;
