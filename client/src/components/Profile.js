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
      rewardPoints: 0,
      registeredCreditCard: [
        "4000-1523-1652-4534",
        "1543-4894-1561-1564",
        "1565-3158-1564-1945",
        "1596-1345-1894-1564",
      ],
      orderHistory: [
        {
          orderNum: "123856498",
          restaurantName: "Cranston's Best Fish",
          Foods: [
            {
              FoodName: "Fish",
              FoodQuantity: "2",
              FoodCost: "$20.00",
            },
            {
              FoodName: "KingFisher",
              FoodQuantity: "1",
              FoodCost: "$12.50",
            },
          ],
          Cost: "$52.50",
        },
        {
          orderNum: "1598421",
          restaurantName: "Kenny's Dare To Eat Burger",
          Foods: [
            {
              FoodName: "Bomb till you cannot tank Burger",
              FoodQuantity: "1",
              FoodCost: "$30.00",
            },
            {
              FoodName: "Eat till you drop Burger",
              FoodQuantity: "1",
              FoodCost: "$10.00",
            },
            {
              FoodName: "Drink till you full",
              FoodQuantity: "1",
              FoodCost: "$8.00",
            },
          ],
          Cost: "$48.00",
        },
      ],
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

  componentDidMount() {
    this.setState({
      customerName: this.props.location.state.customerName,
    });
    this.getProfileInfo();
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
            defaultIndex={1}
            onSelect={(index) => console.log(index)}
          >
            <Tab eventKey="post-order-history">Post Order History</Tab>
            <Tab eventKey="pre-registered-credit-card">
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
                    <Col className="order-list">{item.Cost}</Col>
                  </Row>
                  {item.Foods.map((food) => (
                    <Row>
                      <Col className="order-list"></Col>
                      <Col className="order-list"></Col>
                      <Col className="order-list">{food.FoodName}</Col>
                      <Col className="order-list">{food.FoodQuantity}</Col>
                      <Col className="order-list">{food.FoodCost}</Col>
                    </Row>
                  ))}
                </ListGroupItem>
              ))}
            </ListGroup>
          </TabPanel>
          <TabPanel>
            {this.state.registeredCreditCard.map((item) => (
              <div key={item}>
                <GoCreditCard size="100px" className="credit-card" />
                {item}
              </div>
            ))}
          </TabPanel>
        </Tabs>
      </div>
    );
  }
}

export default Profile;
