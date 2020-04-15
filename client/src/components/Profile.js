import React, { Component } from "react";
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
import { GiPlagueDoctorProfile } from "react-icons/gi";
import { GoCreditCard } from "react-icons/go";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";

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
    var request = new Request("http://localhost:3001/Customer/Profile", {
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
    var request = new Request("http://localhost:3001/Customer/Orders", {
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
    var request = new Request("http://localhost:3001/Customer/CreditCards", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify({ cid: this.props.location.state.cid }),
    });

    fetch(request)
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        this.setState({
          registeredCreditCard: res,
        });
      })
      .catch((err) => {
        console.log(err);
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
            onSelect={(index) => console.log(index)}
          >
            <Tab eventKey="postOrderHistory">Post Order History</Tab>
            <Tab eventKey="preRegisteredCreditCard">
              Pre-registered credit card
            </Tab>
          </TabList>
          <TabPanel>
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
                <ListGroupItem key={item}>
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
            {this.state.registeredCreditCard.map((item) => (
              <div key={item}>
                <GoCreditCard size="100px" className="credit-card" />
                {item.card_number}
              </div>
            ))}
          </TabPanel>
        </Tabs>
      </div>
    );
  }
}

export default Profile;
