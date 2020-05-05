import React, { Component } from "react";

import "../styles/OngoingOrder.css";

// Represents an order in progress
class OngoingOrder extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      order_number,
      cname,
      delivery_location,
      restaurant_name,
      restaurant_location,
    } = this.props.orderInfo;
    return (
      <div>
        <div className="ongoing-order-container">
          <div className="ongoing-order-col">
            <div>
              <h3>Order Number: </h3>
              <p>{order_number}</p>
            </div>
          </div>

          <div className="ongoing-order-col">
            <div>
              <h3>Customer Name: </h3>
              <p>{cname}</p>
            </div>
          </div>

          <div className="ongoing-order-col">
            <div>
              <h3>Delivery Location: </h3>
              <p>{delivery_location}</p>
            </div>
          </div>

          <div className="ongoing-order-col">
            <div>
              <h3>Restaurant: </h3>
              <p>{restaurant_name}</p>
            </div>
          </div>

          <div className="ongoing-order-col">
            <div>
              <h3>Restaurant Location: </h3>
              <p>{restaurant_location}</p>
            </div>
          </div>
        </div>

        <div className="ongoing-order-button-row">
          <button onClick={() => this.props.handleStatusUpdate(order_number)}>
            {this.props.orderStatusText}
          </button>
        </div>
      </div>
    );
  }
}

export default OngoingOrder;
