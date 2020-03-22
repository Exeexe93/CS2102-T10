import React, { Component } from "react";
import "../styles/OrderInProgress.css";

class OrderInProgress extends Component {
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
        <h1>Job details</h1>

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

        <div className="buttonRow">
          <span>
            <button>Depart for the restaurant to collect order</button>
          </span>
          <span>
            <button>Arrive at restaurant</button>
          </span>
          <span>
            <button>Depart from restaurant to delivery location</button>
          </span>
          <span>
            <button>Order delivered</button>
          </span>
        </div>
      </React.Fragment>
    );
  }
}

export default OrderInProgress;
