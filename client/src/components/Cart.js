import React, { Component } from "react";
import "../styles/FoodItem.css";
import axios from "axios";

class Cart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      foodItem: [],
      restaurantName: this.props.location.state.restaurantName,
      customerName: this.props.location.state.customerName,
    };
  }

  render() {
    return <div></div>;
  }
}

export default Cart;
