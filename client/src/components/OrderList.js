import React, { Component } from "react";
import Order from "./Order";
import "../styles/OrderList.css";

class OrderList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: this.props.orders,
      title: this.props.title,
      id: this.props.id,
    };
  }

  render() {
    return (
      <div className="order-list-container">
        <h1 className="order-list-title">{this.state.title}</h1>
        <div>
          {this.state.orders.map((order, index) => {
            return (
              <Order
                key={index}
                orderInfo={order}
                id={this.state.id}
                handleAcceptOrder={this.props.handleAcceptOrder}
              />
            );
          })}
        </div>
      </div>
    );
  }
}

export default OrderList;
