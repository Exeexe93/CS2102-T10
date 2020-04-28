import React, { Component } from "react";
import CompletedOrder from "./CompletedOrder";
import "../styles/CompletedOrderList.css";

class CompletedOrderList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: this.props.orders,
      title: this.props.title,
    };
  }

  render() {
    return (
      <div className="completed-order-list-container">
        <h1 className="completed-order-list-title">{this.state.title}</h1>
        <div>
          {this.state.orders.map((order, index) => {
            return <CompletedOrder key={index} orderInfo={order} />;
          })}
        </div>
      </div>
    );
  }
}

export default CompletedOrderList;
