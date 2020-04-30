import React, { Component } from "react";
import "../styles/Cart.css";
import { Navbar, NavbarBrand, Col, Jumbotron, Row } from "reactstrap";
import {
  Accordion,
  Card,
  Table,
  Form,
  Button,
  Dropdown,
  DropdownButton,
  FormGroup,
  // FormControl,
  // InputGroup,
} from "react-bootstrap";
import { AccountContext } from "./AccountProvider.js";
import axios from "axios";

class Cart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customerName: "",
      cid: "",
      rewardPoints: 0,
      orders: [],
      creditCards: [],
      paymentMethod: "cash",
      addCreditCard: "",
    };
  }

  static contextType = AccountContext;

  getCreditCards = (value) => {
    axios
      .post("http://localhost:3001/Customer/GetTopFiveCreditCards", {
        cid: value.state.cid,
      })
      .then((res) => {
        let creditCards = res.data;
        this.setState({
          creditCards,
        });
      })
      .catch((err) => console.error(err));
  };

  getCartOrder = (value) => {
    axios
      .post("http://localhost:3001/Customer/GetCartOrder", {
        cid: value.state.cid,
      })
      .then((res) => {
        let orders = res.data;
        orders.map((data) =>
          data.foods.map((food) => {
            food["itemCost"] = this.calculateCost(
              food.FoodCost,
              food.FoodQuantity,
              "individual"
            );
            food["originalQuantity"] = food.FoodQuantity;
          })
        );
        this.setState({
          orders: orders,
          cid: value.state.cid,
          customerName: value.state.name,
        });
      })
      .catch((err) => console.error(err));
  };

  getRewardPoint = (value) => {
    axios
      .post("http://localhost:3001/Customer/GetRewardPoints", {
        name: value.state.name,
      })
      .then((res) => {
        let rewardPoints = res.data[0].reward_points;
        this.setState({
          rewardPoints,
        });
      })
      .catch((err) => console.error(err));
  };

  componentDidMount() {
    let value = this.context;
    this.getCartOrder(value);
    this.getCreditCards(value);
    this.getRewardPoint(value);
  }

  addCost = (total_cost, costToBeAdded) => {
    const costInNum = parseFloat(costToBeAdded.slice(1));
    return (total_cost += costInNum);
  };

  calculateCost = (cost, quantity, convertion) => {
    const costInNum = parseFloat(cost.slice(1));
    const total_price =
      convertion === "total" ? costInNum * quantity : costInNum / quantity;
    var formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    });

    return formatter.format(total_price.toFixed(2));
  };

  calculateDeliveryFee = (total_cost) => {
    let result = (total_cost * 0.05).toFixed(2);
    return result;
  };

  calculateRewardPoint = (total_cost) => {
    let result = (total_cost * 0.1).toFixed(2);
    return result;
  };

  updateTotalValue = (event, food, foodIndex, index) => {
    let item = food;
    let value = event.target.value;
    if (value) {
      let orders = this.state.orders;
      orders[index].foods[foodIndex].FoodCost = this.calculateCost(
        food.itemCost,
        value,
        "total"
      );
      orders[index].foods[foodIndex].FoodQuantity = value;
      this.setState({
        orders,
      });
    }
  };

  deleteOrder = (index) => {
    axios
      .post("http://localhost:3001/Customer/DeleteOrder", {
        oid: this.state.orders[index].orderNum,
      })
      .then((res) => {
        let orders = this.state.orders;
        orders.splice(index, 1);
        this.setState({
          orders,
        });
      })
      .catch((err) => console.error(err));
  };

  handleDelete = (foodIndex, index) => {
    let orders = this.state.orders;
    axios
      .post("http://localhost:3001/Customer/DeleteFood", {
        oid: orders[index].orderNum,
        fid: orders[index].foods[foodIndex].FoodId,
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => console.error(err));

    orders[index].foods.splice(foodIndex, 1);
    if (orders[index].foods.length === 0) {
      // Empty order
      this.deleteOrder(index);
    } else {
      // Order still has item in it
      this.setState({
        orders,
      });
    }
  };

  renderFoodItem = (food, foodIndex, index) => {
    return (
      <tr key={foodIndex}>
        <td>{food.FoodName}</td>
        <td>{food.itemCost}</td>
        <td>
          <Form.Control
            pattern="[0-9]*"
            defaultValue={food.FoodQuantity}
            onChange={(event) =>
              this.updateTotalValue(event, food, foodIndex, index)
            }
          />
        </td>
        <td>{food.FoodCost}</td>
        <td>
          <Button onClick={() => this.handleDelete(foodIndex, index)} size="sm">
            {" "}
            Delete{" "}
          </Button>
        </td>
      </tr>
    );
  };

  renderOrder = (order, index) => {
    return (
      <Card key={index}>
        <Accordion.Toggle as={Card.Header} eventKey={index} className="order">
          Order Number: {order.orderNum}
        </Accordion.Toggle>

        <Accordion.Collapse eventKey={index}>
          <Card.Body>
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>Food Name</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total Cost</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {order.foods.map((food, foodIndex) =>
                  this.renderFoodItem(food, foodIndex, index)
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    );
  };

  updateFood = (food, orderNum) => {
    if (food.originalQuantity !== food.FoodQuantity) {
      console.log("quantity changed");
      axios
        .post("http://localhost:3001/Customer/UpdateFood", {
          oid: orderNum,
          fid: food.FoodId,
          quantity: food.FoodQuantity,
          total_price: food.FoodCost,
        })
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => console.error(err));
    }
  };

  updatePlaceDetails = (data) => {
    axios
      .post("http://localhost:3001/Customer/UpdatePlaceTable", {
        oid: data.orderNum,
        cid: this.state.cid,
        address: "BLK 845 #03-16 TAMPINES ST 45 S201536",
        payment_method:
          this.state.paymentMethod === "cash" ? "cash" : "creditcard",
        card_number: this.state.paymentMethod,
      })
      .then((res) => {
        this.setState({
          orders: [],
        });
      })
      .catch((err) => console.error(err));
  };

  updateRewardPoint = (total_cost) => {
    axios
      .post("http://localhost:3001/Customer/UpdateRewardPoint", {
        cid: this.state.cid,
        reward_points:
          this.state.rewardPoints + this.calculateRewardPoint(total_cost),
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => console.error(err));
  };

  updateOrder = (data) => {
    let total_cost = 0;
    data.foods.map((food) => {
      this.updateFood(food, data.orderNum);
      total_cost = this.addCost(total_cost, food.FoodCost);
    });

    // Update orders and Place tables after updating the Consists table
    // Update total_price, delivery_fee, order_Placed, promo_used
    axios
      .post("http://localhost:3001/Customer/UpdateOrder", {
        oid: data.orderNum,
        order_status: "paid",
        total_price: total_cost.toFixed(2),
        delivery_fee: this.calculateDeliveryFee(total_cost),
        promo_used: this.state.promo_id ? this.state.promo_id : "NIL",
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => console.error(err));

    // Update payment_method, address, card_number into Place table
    this.updatePlaceDetails(data);

    //Update rewards points
    this.updateRewardPoint(total_cost);
  };

  handleSubmit = (event) => {
    let form = event.target;
    event.preventDefault();

    this.state.orders.map((data) => {
      this.updateOrder(data);
    });

    this.orderForm.reset();
  };

  paymentMethod = (card_number) => {
    this.setState({
      paymentMethod: card_number,
    });
  };

  displayPaymentOptions = () => {
    return (
      <DropdownButton
        className="creditcards"
        id="creditcards"
        title={
          this.state.paymentMethod !== "" ? this.state.paymentMethod : "cash"
        }
      >
        <Dropdown.Item
          key="cash"
          eventKey="cash"
          onSelect={this.paymentMethod}
          className="paymentOption"
        >
          cash
        </Dropdown.Item>
        {this.state.creditCards.map((card, index) => {
          return (
            <div key={index}>
              <Dropdown.Divider key={index} />
              <Dropdown.Item
                key={card.card_number}
                eventKey={card.card_number}
                onSelect={this.paymentMethod}
              >
                {card.card_number}
              </Dropdown.Item>
            </div>
          );
        })}
      </DropdownButton>
    );
  };

  addCreditCard = () => {
    let card = this.state.addCreditCard;
    console.log(card);
    if (/\d{4}\-\d{4}\-\d{4}\-\d{4}$/.test(card)) {
      axios
        .post("http://localhost:3001/Customer/AddCreditCard", {
          cid: this.state.cid,
          card_number: card,
        })
        .then((res) => {
          let result = this.state.creditCards;
          result.push({ card_number: card });
          this.setState({
            creditCards: result,
            paymentMethod: card,
          });
        })
        .catch((err) => console.error(err));
    }
  };

  displayAddCreditCardInput = () => {
    return (
      <div className="container">
        <Row>
          <FormGroup>
            <Col>
              <Form.Label>Credit Cards Number: </Form.Label>
              <Form.Control
                name="card_number"
                required={false}
                type="text"
                placeholder="XXXX-XXXX-XXXX-XXXX"
                pattern="\d{4}-\d{4}-\d{4}-\d{4}$"
                onChange={(value) =>
                  this.setState({ addCreditCard: value.target.value })
                }
              />
            </Col>
          </FormGroup>
          <div>
            <Button
              size="sm"
              onClick={this.addCreditCard}
              className="addButton"
            >
              Add Credit Card
            </Button>
          </div>
        </Row>
      </div>
    );
  };

  render() {
    return (
      <div className="page">
        <Navbar dark color="dark">
          <NavbarBrand href="/CustomerMainPage">CustomerMainPage</NavbarBrand>
          <div className="icon-container"></div>
        </Navbar>

        <Row>
          <Col>
            <Jumbotron className="header-centered">
              <h1 className="display-3">Hi {this.state.customerName}</h1>
              {this.state.orders.length === 0 && (
                <p className="lead">
                  {" "}
                  You have no orders in the cart! Go select your foods for
                  delivery
                </p>
              )}
              {this.state.orders.length !== 0 && (
                <p className="lead">Quick! Confirm the orders!</p>
              )}
            </Jumbotron>
          </Col>
        </Row>

        <div className="body">
          {this.state.orders.length !== 0 && (
            <Form
              className="form"
              ref={(form) => (this.orderForm = form)}
              onSubmit={this.handleSubmit}
              action="/"
            >
              <Accordion className="orderListing">
                {this.state.orders.map((order, index) =>
                  this.renderOrder(order, index)
                )}
              </Accordion>
              {/* {this.displayAddCreditCardInput()} */}
              {this.displayPaymentOptions()}

              <Button className="confirm_button" type="submit">
                {" "}
                Confirm{" "}
              </Button>
            </Form>
          )}
        </div>
      </div>
    );
  }
}

export default Cart;
