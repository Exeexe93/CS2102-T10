import React, { Component } from "react";
import "../styles/FoodItem.css";
import { GiShoppingCart } from "react-icons/gi";
import { Link } from "react-router-dom";
import { MdPerson } from "react-icons/md";
import { Navbar, NavbarBrand, Col, Jumbotron, Row } from "reactstrap";
import { Form, ListGroup, Button } from "react-bootstrap";
import axios from "axios";

class FoodItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      foodItem: [],
      filtered: [],
      restaurantName: this.props.location.state.restaurantName,
      customerName: this.props.location.state.customerName,
    };

    this.handleChange.bind(this);
  }

  sortingFoodItem = (first, second) => {
    if (first.category == second.category) {
      return 0;
    } else if (first.category == "Main Dish") {
      return -1;
    } else if (second.category == "Main Dish") {
      return 1;
    } else if (first.category == "Dessert") {
      return 1;
    } else if (second.category == "Dessert") {
      return -1;
    } else if (first.category == "Side Dish") {
      return -1;
    } else {
      return 1;
    }
  };

  updateFoods = () => {
    axios
      .post("http://localhost:3001/Customer/GetRestaurantFoods", {
        restaurantName: this.props.location.state.restaurantName,
      })
      .then((res) => {
        let result = res.data;
        let foodItem = [];
        result.map((food) => {
          foodItem.push({ ...food, amount: [] });
        });
        foodItem.sort((a, b) => this.sortingFoodItem(a, b));
        this.setState({
          foodItem,
          filtered: foodItem,
        });
        this.generateQuantity();
      })
      .catch((err) => console.error(err));
  };

  componentDidMount() {
    this.updateFoods();
  }

  handleProfile = () => {
    this.props.history.push("/");
  };

  handleCart = () => {
    this.props.history.push("/Login");
  };

  handleChange(e) {
    let newList = [];
    let currentList = this.state.foodItem;

    if (e.target.value !== "") {
      newList = currentList.filter((item) => {
        const lowercaseItem = item.foodName.toLowerCase();
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
      if (currentList[item].limit <= currentList[item].quantity) {
        for (i = 0; i <= currentList[item].limit; i++) {
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

  submit = () => {
    // Link to the receipt part send the foodItem to there.
  };

  render() {
    return (
      <div>
        <Navbar dark color="dark">
          <NavbarBrand href="/CustomerMainPage">CustomerMainPage</NavbarBrand>
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
            <ListGroup.Item className="listQuantityLeft">
              Quantity Left
            </ListGroup.Item>
            <ListGroup.Item className="listQuantity">Quantity</ListGroup.Item>
            <ListGroup.Item className="listLimit">Limit</ListGroup.Item>
            <ListGroup.Item className="listCategory">Category</ListGroup.Item>
          </ListGroup>
          {this.state.filtered.map((item, index) => (
            <ListGroup key={index} horizontal>
              <ListGroup.Item className="listName">{item.name}</ListGroup.Item>
              <ListGroup.Item className="listPrice">
                {item.price}
              </ListGroup.Item>
              <ListGroup.Item className="listQuantityLeft">
                {item.quantity}
              </ListGroup.Item>
              <ListGroup.Item className="listQuantity">
                <Form.Control
                  as="select"
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
              </ListGroup.Item>
              <ListGroup.Item className="listLimit">
                {item.food_limit}
              </ListGroup.Item>
              <ListGroup.Item className="listCategory">
                {item.category}
              </ListGroup.Item>
            </ListGroup>
          ))}
          <div className="separator"></div>
          <Button type="button" className="submitButton" onClick={this.submit}>
            Submit
          </Button>
        </ListGroup>
      </div>
    );
  }
}

export default FoodItem;
