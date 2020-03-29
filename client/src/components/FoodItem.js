import React, { Component } from "react";
import "../styles/FoodItem.css";
import { GiShoppingCart } from "react-icons/gi";
import { Link } from "react-router-dom";
import { MdPerson } from "react-icons/md";
import { Navbar, NavbarBrand, Col, Jumbotron, Row } from "reactstrap";
import { Form, ListGroup } from "react-bootstrap";

class FoodItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      foodItem: [
        {
          foodName: "Chicken Wing",
          limit: 7,
          quantity: 0,
          amount: []
        },
        {
          foodName: "Fries",
          limit: 2,
          quantity: 0,
          amount: []
        },
        {
          foodName: "Coke",
          limit: 3,
          quantity: 0,
          amount: []
        }
      ],
      filtered: [],
      restaurantName: this.props.location.state.restaurantName,
      customerName: this.props.location.state.customerName
    };

    this.handleChange.bind(this);
  }

  componentDidMount() {
    this.setState({
      filtered: this.state.foodItem
    });

    this.generateQuantity();
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
      newList = currentList.filter(item => {
        const lowercaseItem = item.foodName.toLowerCase();
        const filter = e.target.value.toLowerCase();
        return lowercaseItem.includes(filter);
      });
    } else {
      newList = currentList;
    }
    this.setState({
      filtered: newList
    });
  }

  handleQuantity = (quantity, index) => {
    let currentList = this.state.foodItem;
    currentList[index].quantity = parseInt(quantity.target.value);
    this.setState({
      foodItem: currentList
    });
  };

  generateQuantity = () => {
    let currentList = this.state.foodItem;
    var item, i;
    for (item in currentList) {
      for (i = 1; i <= currentList[item].limit; i++) {
        currentList[item].amount.push({ value: i });
      }
    }
    this.setState({
      foodItem: currentList
    });
  };

  render() {
    return (
      <div>
        <Navbar dark color="dark">
          <NavbarBrand href="/CustomerMainPage">CustomerMainPage</NavbarBrand>
          <div calssName="icon-container">
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
              onChange={e => this.handleChange(e)}
              placeholder="Search..."
            />
          </div>
        </div>
        <div className="separator"></div>
        <ListGroup className="foodList">
          <ListGroup horizontal>
            <ListGroup.Item>Food Name</ListGroup.Item>
            <ListGroup.Item>Quantity</ListGroup.Item>
            <ListGroup.Item>Limit</ListGroup.Item>
          </ListGroup>
          {this.state.filtered.map((item, index) => (
            <ListGroup horizontal>
              <ListGroup.Item>{item.foodName}</ListGroup.Item>
              <ListGroup.Item>
                <Form.Control
                  as="select"
                  onChange={value => this.handleQuantity(value, index)}
                >
                  {item.amount.map(num => {
                    return <option value={num.value}>{num.value}</option>;
                  })}
                </Form.Control>
              </ListGroup.Item>
              <ListGroup.Item>{item.limit}</ListGroup.Item>
            </ListGroup>
          ))}
        </ListGroup>
      </div>
    );
  }
}

export default FoodItem;
