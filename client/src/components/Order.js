import React, { Component } from "react";
import "../styles/Order.css";

class Order extends Component {
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
      <React.Fragment>
        <div className="container-fluid">
          <div className="order-container">
            <div className="order-row">
              <h3>Order Number: </h3>
              <p>{order_number}</p>
            </div>

            <div className="order-row">
              <h3>Customer Name: </h3>
              <p>{cname}</p>
            </div>

            <div className="order-row">
              <h3>Delivery Location: </h3>
              <p>{delivery_location}</p>
            </div>

            <div className="order-row">
              <h3>Restaurant: </h3>
              <p>{restaurant_name}</p>
            </div>

            <div className="order-row">
              <h3>Restaurant Location: </h3>
              <p>{restaurant_location}</p>
            </div>

            <button
              onClick={() => this.props.handleAcceptOrder(this.props.orderInfo)}
              className="order-button"
            >
              Accept
            </button>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Order;
