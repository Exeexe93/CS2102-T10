import React, { Component } from "react";
import { AccountContext } from "./AccountProvider";
import "../styles/Profile.css";
import { Navbar, Col, Row, Jumbotron } from "reactstrap";
import {
  FormGroup,
  Form,
  Button,
  Accordion,
  Card,
  Table,
} from "react-bootstrap";
import { GiPlagueDoctorProfile } from "react-icons/gi";
import { GoCreditCard } from "react-icons/go";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { MdArrowBack } from "react-icons/md";
import { Link } from "react-router-dom";
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
      isInEditMode: false,
      password: "",
    };
  }

  static contextType = AccountContext;

  getCustomerDetails = async (cid) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/Customer/GetCustomerDetails",
        {
          cid: cid,
        }
      );
      this.setState({
        password: response.data[0].account_pass,
      });
    } catch (err) {
      console.error(err);
    }
  };

  getRewardPoints = (customerName) => {
    var request = new Request(
      "http://localhost:3001/Customer/GetRewardPoints",
      {
        method: "POST",
        headers: new Headers({ "Content-Type": "application/json" }),
        body: JSON.stringify({ name: customerName }),
      }
    );

    fetch(request)
      .then((res) => res.json())
      .then((res) => {
        const rewardPoints = res[0].reward_points;
        this.setState({
          rewardPoints,
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  getOrderList = (cid) => {
    var request = new Request("http://localhost:3001/Customer/GetOrders", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify({ cid: cid }),
    });

    fetch(request)
      .then((res) => res.json())
      .then((res) => {
        let orderHistory = res;
        orderHistory.map((order) => {
          order["total_price"] =
            "$" +
            this.calculateOrderTotalPrice(
              order.cost,
              order.promoDiscount,
              order.deliveryFee,
              order.pointsUsed
            );
        });
        this.setState({
          orderHistory: res,
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  getCreditCards = (cid) => {
    var request = new Request("http://localhost:3001/Customer/GetCreditCards", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify({ cid: cid }),
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
    let value = this.context;
    this.getCustomerDetails(value.state.cid);
    this.getRewardPoints(value.state.name);
    this.getOrderList(value.state.cid);
    this.getCreditCards(value.state.cid);
    this.setState({
      cid: value.state.cid,
      customerName: value.state.name,
    });
  }

  calculateOrderTotalPrice = (
    rawCost,
    promoDiscount,
    deliveryFee,
    rewardPointsOffset
  ) => {
    let total_price =
      parseFloat(rawCost.slice(1)) +
      parseFloat(deliveryFee.slice(1)) -
      parseFloat(promoDiscount.slice(1)) -
      rewardPointsOffset;
    return parseFloat(total_price.toFixed(2));
  };

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
        if (res.data.length == 0) {
          creditcards.splice(index, 1);
          this.setState({
            registeredCreditCard: [...creditcards],
          });
        }
      })
      .catch((err) => console.error(err));
  };

  handleReviewInput = (foodIndex, index, review) => {
    let orders = this.state.orderHistory;
    orders[index].foods[foodIndex].Review = review;
    this.setState({
      orderHistory: orders,
    });
  };

  displayReviewInput = (foodIndex, index) => {
    let order = this.state.orderHistory[index];
    return (
      <div>
        {order.order_status === "Food delivered" ? (
          order.foods[foodIndex].ReviewSubmitted ? (
            <h6>{order.foods[foodIndex].Review}</h6>
          ) : (
            <Form.Control
              name="card_number"
              required={false}
              type="text"
              placeholder="No review yet"
              onChange={(input) => {
                this.handleReviewInput(foodIndex, index, input.target.value);
              }}
            />
          )
        ) : (
          ""
        )}
      </div>
    );
  };

  handleRatingInput = (input, index) => {
    let orders = this.state.orderHistory;
    orders[index].rating = input;
    this.setState({
      orderHistory: orders,
    });
  };

  displayRatingInput = (index, order) => {
    return (
      <div className="ratingInput">
        {order.order_status === "Food delivered" ? (
          order.ratingSubmitted ? (
            <div>
              <Form.Label>Rating</Form.Label>
              <h6>{order.rating}</h6>
            </div>
          ) : (
            <div>
              <Form.Label>Rating</Form.Label>
              <Form.Control
                as="select"
                size="sm"
                custom
                onChange={(input) => {
                  this.handleRatingInput(input.target.value, index);
                }}
              >
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
              </Form.Control>
            </div>
          )
        ) : (
          ""
        )}
      </div>
    );
  };

  submitReviewAndRating = async (index) => {
    let orders = this.state.orderHistory;
    let order = orders[index];
    let queryList = [];
    let valueList = [];

    try {
      order.foods.map((food, foodIndex) => {
        if (!food.ReviewSubmitted) {
          if (foodIndex === 0) {
            queryList.push(
              "Update Consists SET review = $3 WHERE oid = $1 AND fid = $2"
            );
            valueList.push([]);
          }

          if (food.Review && food.Review !== "") {
            valueList[0].push([order.orderNum, food.FoodId, food.Review]);
          } else {
            orders[index].errorMessage = "Review cannot leave blank!";
            this.setState({
              orderHistory: orders,
            });
            throw "Review leaving blank!";
          }
        }
      });
    } catch (err) {
      return;
    }

    if (!order.ratingSubmitted) {
      if (order.rating) {
        queryList.push("UPDATE Orders SET rating = $2 WHERE oid = $1");
        valueList.push([[order.orderNum, order.rating]]);
      } else {
        orders[index].errorMessage = "Please choose the rating for the order";
        this.setState({
          orderHistory: orders,
        });
        return;
      }
    }

    try {
      await axios.post("http://localhost:3001/Customer/UpdateRatingAndReview", {
        queryList: queryList,
        valueList: valueList,
      });
      orders[index].ratingSubmitted = true;
      orders[index].foods.map((food) => {
        food.ReviewSubmitted = true;
      });
      this.setState({ orderHistory: orders });
    } catch (err) {
      console.error(err);
    }
  };

  displaySubmitButton = (index) => {
    return (
      <div>
        {!this.state.orderHistory[index].ratingSubmitted &&
          this.state.orderHistory[index].order_status === "Food delivered" && (
            <Button
              className="reviewAndRatingButton"
              onClick={() => {
                this.submitReviewAndRating(index);
              }}
            >
              {" "}
              Confirm review and rating{" "}
            </Button>
          )}
      </div>
    );
  };

  displayErrorMessage = (index) => {
    return <h6>{this.state.orderHistory[index].errorMessage}</h6>;
  };

  renderOrderCost = (order) => {
    return (
      <tr key={"totalCost - " + order.orderNum} className="orderTable">
        <td>Total Cost</td>
        <td></td>
        <td>{order.total_price}</td>
        <td></td>
      </tr>
    );
  };

  renderPromoDiscount = (order) => {
    return (
      <tr key={"promoDiscount - " + order.orderNum} className="orderTable">
        <td>Promo Discount</td>
        <td></td>
        <td>- {order.promoDiscount}</td>
        <td></td>
      </tr>
    );
  };

  renderDeliveryFee = (order) => {
    return (
      <tr key={"deliveryFee - " + order.orderNum} className="orderTable">
        <td>Delivery Fee</td>
        <td></td>
        <td>{order.deliveryFee}</td>
        <td></td>
      </tr>
    );
  };

  renderRewardPointsUsed = (order) => {
    return (
      <tr key={"rewardPoints - " + order.orderNum} className="orderTable">
        <td>Reward Points Used</td>
        <td></td>
        <td>- {order.pointsUsed}</td>
        <td></td>
      </tr>
    );
  };

  renderFoodItem = (food, foodIndex, index) => {
    return (
      <tr key={foodIndex} className="orderTable">
        <td>{food.FoodName}</td>
        <td>{food.FoodQuantity}</td>
        <td>{food.FoodCost}</td>
        <td>{this.displayReviewInput(foodIndex, index)}</td>
      </tr>
    );
  };

  renderOrder = (order, index) => {
    return (
      <Card key={index}>
        <Accordion.Toggle
          as={Card.Header}
          eventKey={index}
          className="orderHeader"
        >
          <h6> Order Number: {order.orderNum}</h6>
          <h6>Order status: {order.order_status}</h6>
        </Accordion.Toggle>

        <Accordion.Collapse eventKey={index}>
          <Card.Body>
            <div className="tableHeader">
              <h4>{order.restaurantName}</h4>
              {this.displayRatingInput(index, order)}
            </div>

            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>Food Name</th>
                  <th>Quantity</th>
                  <th>Total Cost</th>
                  <td>Review</td>
                </tr>
              </thead>
              <tbody>
                {order.foods.map((food, foodIndex) =>
                  this.renderFoodItem(food, foodIndex, index)
                )}

                {this.renderPromoDiscount(order)}
                {this.renderDeliveryFee(order)}
                {this.renderRewardPointsUsed(order)}
                {this.renderOrderCost(order)}
              </tbody>
            </Table>
            {this.displayErrorMessage(index)}
            {this.displaySubmitButton(index)}
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    );
  };

  displayPostOrderTab = () => {
    return (
      <TabPanel className="postOrderTab">
        <h2 className="title"> Order History </h2>

        <Accordion className="orderListing">
          {this.state.orderHistory.map((order, index) =>
            this.renderOrder(order, index)
          )}
        </Accordion>

        <div className="footer"></div>
      </TabPanel>
    );
  };

  displayPreregisteredCreditCardTab = () => {
    return (
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
        <div className="footer"></div>
      </TabPanel>
    );
  };

  changeEditMode = () => {
    this.setState({ isInEditMode: !this.state.isInEditMode });
  };

  handleUpdate = async (event) => {
    let form = event.target;
    event.preventDefault();
    let customerName = form.elements.name.value;
    let password = form.elements.password.value;
    this.setState({
      customerName: customerName,
      password: password,
      isInEditMode: false,
    });
    try {
      await axios.post("http://localhost:3001/Customer/updateCustomerDetails", {
        cid: this.state.cid,
        name: customerName,
        account_pass: password,
      });
    } catch (err) {
      console.error(err);
    }
  };

  renderEditView = () => {
    return (
      <form onSubmit={this.handleUpdate}>
        <FormGroup>
          <Form.Label>Name: </Form.Label>
          <Form.Control
            className="nameInput"
            name="name"
            required={true}
            type="text"
            defaultValue={this.state.customerName}
            placeholder="Name"
          />
          <Form.Label>Password: </Form.Label>
          <Form.Control
            className="passwordInput"
            name="password"
            required={true}
            type="password"
            defaultValue={this.state.password}
            placeholder="Password"
          />
          <Button type="submit"> Update </Button>{" "}
          <Button onClick={this.handleCancel}> Cancel </Button>
        </FormGroup>
      </form>
    );
  };

  renderDefaultView = () => {
    return (
      <div>
        <h3>Name: {this.state.customerName}</h3>
        <h3>Password:{this.state.password}</h3>
      </div>
    );
  };

  handleCancel = () => {
    this.setState({ isInEditMode: false });
  };

  displayPersonalInfoTab = () => {
    return (
      <TabPanel className="personalInfoTab">
        <h2 align="center" className="personalInfoTitle">
          <span> Personal Information </span>
          {this.state.isInEditMode ? (
            ""
          ) : (
            <Button onClick={this.changeEditMode}>Update Profile</Button>
          )}
        </h2>
        <h3>
          {" "}
          {this.state.isInEditMode
            ? this.renderEditView()
            : this.renderDefaultView()}{" "}
        </h3>
      </TabPanel>
    );
  };

  render() {
    return (
      <div>
        <Navbar dark color="dark">
          <Link
            to={{
              pathname: "/Customer",
              state: {
                account_id: this.state.cid,
              },
            }}
          >
            <div className="backIcon">
              <MdArrowBack />
              To Home Page
            </div>
          </Link>
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
          <TabList id="tabs">
            <Tab>Post Order History</Tab>
            <Tab>Pre-registered credit card</Tab>
            <Tab>Personal's information</Tab>
          </TabList>
          {this.displayPostOrderTab()}
          {this.displayPreregisteredCreditCardTab()}
          {this.displayPersonalInfoTab()}
        </Tabs>
      </div>
    );
  }
}

export default Profile;
