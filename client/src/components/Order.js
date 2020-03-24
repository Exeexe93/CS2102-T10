import React, { Component } from "react";
import { Container } from "reactstrap";
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
        <Container fluid className="container-fluid">
          <div className="container">
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
        </Container>
      </React.Fragment>
    );
  }
}

export default Order;
