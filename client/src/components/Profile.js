import React, { Component, useState } from "react";
import "../styles/Profile.css";
import {
  Navbar,
  NavbarBrand,
  Col,
  Row,
  Jumbotron,
  ListGroup,
  ListGroupItem,
} from "reactstrap";
import { FormGroup, Form, Button } from "react-bootstrap";
import { GiPlagueDoctorProfile } from "react-icons/gi";
import { GoCreditCard } from "react-icons/go";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import axios from "axios";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customerName: "",
      cid: "",
      rewardPoints: 0,
      registeredCreditCard: [],
      orderHistory: [],
    };
  }

  getProfileInfo = () => {
    var request = new Request("http://localhost:3001/Customer/GetProfile", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify({ name: this.props.location.state.customerName }),
    });

    fetch(request)
      .then((res) => res.json())
      .then((res) => {
        const rewardPoints = res[0].reward_points;
        this.setState({
          rewardPoints,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  getOrderList = () => {
    var request = new Request("http://localhost:3001/Customer/GetOrders", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify({ cid: this.props.location.state.cid }),
    });

    fetch(request)
      .then((res) => res.json())
      .then((res) => {
        this.setState({
          orderHistory: res,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  getCreditCards = () => {
    var request = new Request("http://localhost:3001/Customer/GetCreditCards", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify({ cid: this.props.location.state.cid }),
    });

    fetch(request)
      .then((res) => res.json())
      .then((res) => {
        this.setState({
          registeredCreditCard: res,
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  componentDidMount() {
    this.setState({
      customerName: this.props.location.state.customerName,
      cid: this.props.location.state.cid,
    });
    this.getProfileInfo();
    this.getOrderList();
    this.getCreditCards();
  }

  addCreditCard = (event) => {
    const form = event.target;
    event.preventDefault();
    if (/\d{4}\-\d{4}\-\d{4}\-\d{4}$/.test(form.elements.card_number.value)) {
      let creditcard = {
        cid: this.state.cid,
        card_number: form.elements.card_number.value,
      };

      var request = new Request(
        "http://localhost:3001/Customer/AddCreditCard",
        {
          method: "POST",
          headers: new Headers({ "Content-Type": "application/json" }),
          body: JSON.stringify(creditcard),
        }
      );

      fetch(request)
        .then((res) => res.json())
        .then((res) => {
          if (res.length == 0) {
            this.setState({
              registeredCreditCard: [
                { card_number: creditcard.card_number },
                ...this.state.registeredCreditCard,
              ],
            });
          }
        })
        .catch((err) => {
          console.error(err);
        });
      this.creditcardform.reset();
    }
  };

  handleDelete = (index) => {
    let creditcards = this.state.registeredCreditCard;
    let card = creditcards[index];
    axios
      .post("http://localhost:3001/Customer/DeleteCreditCard", card)
      .then((res) => {
        console.log(res.data);
        if (res.data.length == 0) {
          creditcards.splice(index, 1);
          this.setState({
            registeredCreditCard: [...creditcards],
          });
        }
      })
      .catch((err) => console.error(err));
  };

  render() {
    return (
      <div>
        <Navbar dark color="dark">
          <NavbarBrand>Profile</NavbarBrand>
        </Navbar>

        <Col>
          <Jumbotron className="header-centered">
            <div>
              <h1 className="display-3">
                <GiPlagueDoctorProfile size="150px" /> Hi{" "}
                {this.state.customerName}
              </h1>
              <h5>Reward Points: {this.state.rewardPoints}</h5>
            </div>
          </Jumbotron>
        </Col>

        <Tabs className="centered">
          <TabList
            id="tabs"
            // defaultIndex={1}
          >
            <Tab eventKey="postOrderHistory">Post Order History</Tab>
            <Tab eventKey="preRegisteredCreditCard">
              Pre-registered credit card
            </Tab>
          </TabList>
          <TabPanel>
            <h2 className="title"> Order History </h2>
            <ListGroup>
              <ListGroupItem key={"title"}>
                <Row>
                  <Col className="order-list">Order Number</Col>
                  <Col className="order-list">Restaurant Name</Col>
                  <Col className="order-list">Food Name</Col>
                  <Col className="order-list">Food Quantity</Col>
                  <Col className="order-list">Cost</Col>
                </Row>
              </ListGroupItem>
              {this.state.orderHistory.map((item, index) => (
                <ListGroupItem key={index}>
                  <Row>
                    <Col className="order-list">{item.orderNum}</Col>
                    <Col className="order-list">{item.restaurantName}</Col>
                    <Col className="order-list"></Col>
                    <Col className="order-list"></Col>
                    <Col className="order-list"></Col>
                  </Row>
                  {item.foods.map((food) => (
                    <Row>
                      <Col className="order-list"></Col>
                      <Col className="order-list"></Col>
                      <Col className="order-list">{food.FoodName}</Col>
                      <Col className="order-list">{food.FoodQuantity}</Col>
                      <Col className="order-list">{food.FoodCost}</Col>
                    </Row>
                  ))}
                  <Row>
                    <Col className="order-list"></Col>
                    <Col className="order-list"></Col>
                    <Col className="order-list"></Col>
                    <Col className="order-list">Total Cost</Col>
                    <Col className="order-list">{item.cost}</Col>
                  </Row>
                </ListGroupItem>
              ))}
            </ListGroup>
          </TabPanel>
          <TabPanel>
            <h2 className="title"> Credit cards </h2>
            <div className="container">
              <Form
                ref={(form) => (this.creditcardform = form)}
                action="/"
                onSubmit={this.addCreditCard}
              >
                <Row>
                  <FormGroup>
                    <Col>
                      <Form.Label>Credit Cards Number: </Form.Label>
                      <Form.Control
                        name="card_number"
                        required
                        type="text"
                        placeholder="XXXX-XXXX-XXXX-XXXX"
                        pattern="\d{4}-\d{4}-\d{4}-\d{4}$"
                      />
                    </Col>
                  </FormGroup>
                  <div>
                    <Button className="submit-button" type="submit" size="sm">
                      Add Credit Card
                    </Button>
                  </div>
                </Row>
              </Form>
            </div>
            {this.state.registeredCreditCard.map((item, index) => (
              <div key={index}>
                <GoCreditCard size="100px" className="credit-card" />
                {item.card_number}
                <Button
                  className="deleteButton"
                  onClick={() => this.handleDelete(index)}
                >
                  Delete
                </Button>
              </div>
            ))}
          </TabPanel>
        </Tabs>
      </div>
    );
  }
}

export default Profile;
