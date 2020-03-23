import React, { Component } from "react";
import "../styles/Order.css";

class Order extends Component {
  state = {};
  render() {
    const {
      orderNumber,
      cname,
      deliveryLocation,
      restaurantLocation
    } = this.props.orderInfo;

    return (
      <React.Fragment>
        <div>
          <div className="row">
            <h3>Order Number: </h3>
            <p>{orderNumber}</p>
          </div>

          <div className="row">
            <h3>Customer Name: </h3>
            <p>{cname}</p>
          </div>

          <div className="row">
            <h3>Delivery Location: </h3>
            <p>{deliveryLocation}</p>
          </div>

          <div className="row">
            <h3>Restaurant Location: </h3>
            <p>{restaurantLocation}</p>
          </div>

          <button>Accept</button>
        </div>
      </React.Fragment>
    );
  }
}

export default Order;
