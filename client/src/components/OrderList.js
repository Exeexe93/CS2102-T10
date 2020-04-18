import React, { Component } from "react";
import Order from "./Order";
import "../styles/OrderList.css";

class OrderList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: this.props.orders,
      title: this.props.title,
    };
  }

  render() {
    return (
      <div className="order-list-container">
        <h1>{this.state.title}</h1>
        <div>
          {this.state.orders.map((order, index) => (
            <Order key={index} orderInfo={order} />
          ))}
        </div>
      </div>
    );
  }
}

export default OrderList;
