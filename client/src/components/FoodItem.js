import React, { Component } from "react";
import "../styles/FoodItem.css";
import { GiShoppingCart, GiConsoleController } from "react-icons/gi";
import { MdPerson, MdArrowBack } from "react-icons/md";
import { Navbar, NavbarBrand, Col, Jumbotron, Row } from "reactstrap";
import { Form, ListGroup, Button } from "react-bootstrap";
import axios from "axios";

class FoodItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      errorAddingFoods: [],
      errorUpdateFoods: [],
      foodItem: [],
      filtered: [],
      orders: [],
      restaurantName: this.props.location.state.restaurantName,
      cid: this.props.location.state.cid,
      rest_id: this.props.location.state.rest_id,
      customerName: this.props.location.state.customerName,
    };

    this.handleChange.bind(this);
  }

  // Need to get the restaurant order threshold in order to allows the user to place orders.

  sortingFoodItem = (first, second) => {
    if (first.category === second.category) {
      return 0;
    } else if (first.category === "Main Dish") {
      return -1;
    } else if (second.category === "Main Dish") {
      return 1;
    } else if (first.category === "Dessert") {
      return 1;
    } else if (second.category === "Dessert") {
      return -1;
    } else if (first.category === "Side Dish") {
      return -1;
    } else {
      return 1;
    }
  };

  updateFoods = async () => {
    try {
      const res = await axios.post(
        "http://localhost:3001/Customer/GetRestaurantFoods",
        {
          restaurantName: this.props.location.state.restaurantName,
        }
      );
      let result = res.data;
      let foodItem = [];
      result.map((food) => {
        foodItem.push({ ...food, amount: [], actualQuantity: 0 });
      });
      foodItem.sort((a, b) => this.sortingFoodItem(a, b));
      this.setState({
        foodItem,
        filtered: foodItem,
      });
      this.generateQuantity();
    } catch (err) {
      console.error(err);
    }
  };

  componentDidMount() {
    this.updateFoods();
  }

  handleProfile = () => {
    this.props.history.push("/Profile");
  };

  handleCart = () => {
    this.props.history.push("/Cart");
  };

  handleChange(e) {
    let newList = [];
    let currentList = this.state.foodItem;

    if (e.target.value !== "") {
      newList = currentList.filter((item) => {
        const lowercaseItem = item.name.toLowerCase();
        const filter = e.target.value.toLowerCase();
        return lowercaseItem.includes(filter);
      });
    } else {
      newList = currentList;
    }
    this.setState({
      filtered: newList,
    });
  }

  handleQuantity = (quantity, index) => {
    let currentList = this.state.foodItem;
    currentList[index].actualQuantity = parseInt(quantity.target.value);
    this.setState({
      foodItem: currentList,
    });
  };

  generateQuantity = () => {
    let currentList = this.state.foodItem;
    let values = [];
    var item, i;
    for (item in currentList) {
      values.push({ value: 0 });
      if (currentList[item].food_limit <= currentList[item].quantity) {
        for (i = 0; i <= currentList[item].food_limit; i++) {
          currentList[item].amount.push({ value: i });
        }
      } else {
        for (i = 0; i <= currentList[item].quantity; i++) {
          currentList[item].amount.push({ value: i });
        }
      }
    }
    this.setState({
      foodItem: currentList,
      values: values,
    });
  };

  updateOrderIfExists = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/Customer/CheckOrderExists",
        {
          cid: this.state.cid,
          rest_id: this.state.rest_id,
        }
      );

      if (response.data.length !== 0) {
        var cartItems = response.data;

        this.state.foodItem.map((item, index) => {
          if (item.actualQuantity > 0) {
            let isFound = false;
            cartItems.map((cartItem) => {
              if (item.fid === cartItem.fid) {
                // Update oid, fid, quantity, total_price to be continued
                this.updateFood(
                  cartItem.oid,
                  cartItem.fid,
                  parseInt(cartItem.quantity) + item.actualQuantity,
                  this.addCost(
                    cartItem.total_price,
                    this.calculateCost(item.price, item.actualQuantity)
                  ),
                  index
                );
                isFound = true;
              }
            });
            if (!isFound && item.actualQuantity > 0) {
              this.addFood(item, cartItems[0].oid, index);
            }
          }
        });
      } else {
        const orderNumber = await this.insertEmptyOrder();
        await this.placeOrder(orderNumber, this.state.cid);
        this.state.foodItem.map(async (item, index) => {
          if (item.actualQuantity > 0) {
            await this.addFood(item, orderNumber, index);
          }
        });
      }

      this.setState({
        message: "Order has been added into the cart!",
      });
    } catch (err) {
      console.error(err);
    }
  };

  addOrder = (event) => {
    event.preventDefault();
    this.setState({
      errorUpdateFoods: [],
      errorAddingFoods: [],
      message: "",
    });
    // Check whether there are other order that has not paid which same restaurant as current
    this.updateOrderIfExists();
  };

  insertEmptyOrder = async (oid, fid, quantity, price) => {
    let order = {
      rest_id: this.state.rest_id,
      order_status: "cart",
    };

    try {
      const response = await axios.post(
        "http://localhost:3001/Customer/AddOrder",
        order
      );
      console.log(response);
      return response.data.num;
    } catch (err) {
      console.error(err);
    }
  };

  placeOrder = async (oid, cid) => {
    let details = {
      oid: oid,
      cid: cid,
    };
    try {
      await axios.post("http://localhost:3001/Customer/PlaceOrder", details);
      console.log("Place order");
    } catch (err) {
      console.error(err);
    }
  };

  addFood = async (item, orderNumber, index) => {
    let total_price = this.calculateCost(item.price, item.actualQuantity);
    let food = {
      oid: orderNumber,
      fid: item.fid,
      quantity: item.actualQuantity,
      total_price: total_price,
    };
    try {
      const response = await axios.post(
        "http://localhost:3001/Customer/AddFood",
        food
      );
      if (response.data.detail) {
        let errorFoods = this.state.errorAddingFoods;
        errorFoods.push(item.name);
        this.setState({
          errorAddingFoods: errorFoods,
          message:
            "Food items are unable to added into cart due to exceed limit:",
        });
      }
      var foodItem = this.state.foodItem;
      foodItem[index].actualQuantity = 0;
      this.setState({
        foodItem,
      });
    } catch (err) {
      console.error(err);
    }
  };

  updateFood = async (oid, fid, quantity, total_price, index) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/Customer/UpdateFood",
        {
          oid: oid,
          fid: fid,
          quantity: quantity,
          total_price: total_price,
        }
      );

      if (response.data.detail) {
        let errorFoods = this.state.errorUpdateFoods;
        errorFoods.push(this.state.foodItem[index].name);
        this.setState({
          errorUpdateFoods: errorFoods,
          message:
            "Food items are unable to added into cart due to exceed limit:",
        });
      }
      var foodItem = this.state.foodItem;
      foodItem[index].actualQuantity = 0;
      this.setState({
        foodItem,
      });
    } catch (err) {
      console.error(err);
    }
  };

  removeDollarSign(value) {
    return value.slice(1);
  }

  addCost = (total_price, priceToBeAdded) => {
    var result = parseFloat(this.removeDollarSign(total_price));
    var price = parseFloat(this.removeDollarSign(priceToBeAdded));
    result += price;
    var formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    });

    return formatter.format(result);
  };

  calculateCost = (cost, quantity) => {
    const costInNum = parseFloat(this.removeDollarSign(cost));
    const total_price = costInNum * quantity;
    var formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    });

    return formatter.format(total_price);
  };

  displayErrorFoods = () => {
    return (
      <div>
        {this.state.errorAddingFoods.map((food, index) => (
          <h4 className="errorFoods" key={index}>
            {food}
          </h4>
        ))}

        {this.state.errorUpdateFoods.map((food, index) => (
          <h4 className="errorFoods" key={index}>
            {food}
          </h4>
        ))}
      </div>
    );
  };

  render() {
    return (
      <div>
        <Navbar dark color="dark">
          <NavbarBrand href="/Customer">
            <MdArrowBack />
          </NavbarBrand>
          <div className="icon-container">
            <GiShoppingCart
              size="3em"
              color="black"
              onClick={this.handleCart}
            />
            <MdPerson size="3em" color="black" onClick={this.handleProfile} />
          </div>
        </Navbar>

        <Row>
          <Col>
            <Jumbotron className="header-centered">
              <h1 className="display-3">Welcome {this.state.customerName}</h1>
              <p className="lead">What foods to order today? Yum! Yum!</p>
            </Jumbotron>
          </Col>
        </Row>

        <div className="container">
          <div className="searchContainer">
            <input
              type="text"
              className="input"
              onChange={(e) => this.handleChange(e)}
              placeholder="Search..."
            />
          </div>
        </div>

        <div className="separator"></div>
        <ListGroup className="foodList">
          <ListGroup horizontal>
            <ListGroup.Item className="listName">Food Name</ListGroup.Item>
            <ListGroup.Item className="listPrice">Price</ListGroup.Item>
            <ListGroup.Item className="listQuantity">Quantity</ListGroup.Item>
            <ListGroup.Item className="listQuantityLeft">
              Quantity Left
            </ListGroup.Item>
            {/* <ListGroup.Item className="listLimit">Limit</ListGroup.Item> */}
            <ListGroup.Item className="listCategory">Category</ListGroup.Item>
          </ListGroup>
          {this.state.filtered.map((item, index) => (
            <ListGroup key={index} horizontal>
              <ListGroup.Item className="listName">{item.name}</ListGroup.Item>
              <ListGroup.Item className="listPrice">
                {item.price}
              </ListGroup.Item>
              <ListGroup.Item className="listQuantity">
                <Form.Group controlId={item.name}>
                  <Form.Control
                    as="select"
                    value={this.state.foodItem[index].actualQuantity}
                    onChange={(value) => this.handleQuantity(value, index)}
                  >
                    {item.amount.map((num, index) => {
                      return (
                        <option key={index} value={num.value}>
                          {num.value}
                        </option>
                      );
                    })}
                  </Form.Control>
                </Form.Group>
              </ListGroup.Item>
              <ListGroup.Item className="listQuantityLeft">
                {item.food_limit}
              </ListGroup.Item>
              {/* <ListGroup.Item className="listLimit">
                {item.food_limit}
              </ListGroup.Item> */}
              <ListGroup.Item className="listCategory">
                {item.category}
              </ListGroup.Item>
            </ListGroup>
          ))}
          <div className="separator"></div>
          {this.state.message && (
            <h4 className="message">{this.state.message}</h4>
          )}
          {(this.state.errorAddingFoods.length !== 0 ||
            this.state.errorUpdateFoods.length !== 0) &&
            this.displayErrorFoods()}
          {this.state.errorAddingFoods.length !== 0 && (
            <h4 className="errorFoods">{this.state.errorAddingFoods}</h4>
          )}
          <Button
            type="button"
            className="submitButton"
            onClick={this.addOrder}
          >
            Submit
          </Button>
        </ListGroup>
      </div>
    );
  }
}

export default FoodItem;
