import React, { Component } from "react";

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
          <h3>Order Number: </h3> <p>{orderNumber}</p>
          <h3>Customer Name: </h3> <p>{cname}</p>
          <h3>Delivery Location: </h3> <p>{deliveryLocation}</p>
          <h3>Restaurant Location: </h3> <p>{restaurantLocation}</p>
          <button>Accept</button>
        </div>
      </React.Fragment>
    );
  }
}

export default Order;
