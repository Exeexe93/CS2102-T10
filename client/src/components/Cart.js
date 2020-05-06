import React, { Component } from "react";
import "../styles/Cart.css";
import { Navbar, Col, Jumbotron, Row } from "reactstrap";
import {
  Accordion,
  Card,
  Table,
  Form,
  Button,
  Dropdown,
  DropdownButton,
  FormGroup,
} from "react-bootstrap";
import { MdArrowBack } from "react-icons/md";
import { AccountContext } from "./AccountProvider.js";
import { Link } from "react-router-dom";
import axios from "axios";

class Cart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customerName: "",
      cid: "",
      rewardPoints: 0,
      rewardPointsUsed: 0,
      orders: [],
      creditCards: [],
      errorUpdateFoods: [],
      paymentMethod: "cash",
      addCreditCard: "",
      addDeliveryLocation: "",
      errorMessage: "",
      rawCost: 0,
      promoDiscount: 0,
      paymentCost: 0,
      deliveryFee: 0,
      discountedCost: 0,
      selectedPromoId: 0,
      addressSelected: "",
      addresses: [],
      selectedPromo: null,
      promos: [],
      isFreeDelivery: false,
    };
  }

  static contextType = AccountContext;

  limitToTwoDecimalPlaces = (value) => {
    return parseFloat(value.toFixed(2));
  };

  getPromoDetails = async (cid, rest_id) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/Customer/GetPromotions",
        {
          cid: cid,
          rest_id: rest_id,
        }
      );

      let promos = response.data;
      promos.map((promo) => {
        promo.trigger_value = parseFloat(promo.trigger_value.slice(1));
      });
      this.setState({
        promos: promos,
      });
    } catch (err) {
      console.error(err);
    }
  };

  getCreditCards = async (value) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/Customer/GetTopFiveCreditCards",
        {
          cid: value.state.cid,
        }
      );
      this.setState({
        creditCards: response.data,
      });
    } catch (err) {
      console.error(err);
    }
  };

  getDeliveryLocations = async (value) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/Customer/GetFiveRecentDeliveryLocations",
        {
          cid: value.state.cid,
        }
      );
      this.setState({
        addresses: response.data,
      });
    } catch (err) {
      console.error(err);
    }
  };

  getCartOrder = (value) => {
    axios
      .post("http://localhost:3001/Customer/GetCartOrder", {
        cid: value.state.cid,
      })
      .then((res) => {
        let orders = res.data;
        let singleOrderCost = 0;
        let rawCost = 0;
        orders.map((data) => {
          data.foods.map((food) => {
            const singleFoodCost = parseFloat(food.FoodCost.slice(1));
            singleOrderCost += singleFoodCost;
            let individualFoodCost = singleFoodCost / food.FoodQuantity;
            food["itemCost"] = this.limitToTwoDecimalPlaces(individualFoodCost);
            food["originalQuantity"] = food.FoodQuantity;
            food["FoodCost"] = singleFoodCost;
          });
          data["total_cost"] = this.limitToTwoDecimalPlaces(singleOrderCost);
          rawCost = rawCost + singleOrderCost;
        });
        rawCost = this.limitToTwoDecimalPlaces(rawCost);
        const deliveryFee = this.calculateDeliveryFee(rawCost);
        const paymentCost = this.limitToTwoDecimalPlaces(deliveryFee + rawCost);
        this.setState({
          orders: orders,
          cid: value.state.cid,
          customerName: value.state.name,
          rawCost: rawCost,
          paymentCost: paymentCost,
          deliveryFee: deliveryFee,
        });
        this.getPromoDetails(value.state.cid, orders[0].rest_id);
      })
      .catch((err) => console.error(err));
  };

  getRewardPoint = (value) => {
    axios
      .post("http://localhost:3001/Customer/GetRewardPoints", {
        name: value.state.name,
      })
      .then((res) => {
        let rewardPoints = this.limitToTwoDecimalPlaces(
          res.data[0].reward_points
        );
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
    this.getDeliveryLocations(value);
  }

  calculateDeliveryFee = (total_cost) => {
    const conversionRate = 0.05;
    let deliveryFee = this.limitToTwoDecimalPlaces(total_cost * conversionRate);
    if (this.state.isFreeDelivery) {
      this.setState({ promoDiscount: deliveryFee, deliveryFee });
      return 0;
    }
    return deliveryFee;
  };

  calculateRewardPoint = (total_cost) => {
    const conversionRate = 0.1;
    let result = this.limitToTwoDecimalPlaces(total_cost * conversionRate);
    return result;
  };

  calculateDiscount = (promo, rawCost) => {
    if (promo === null) {
      this.setState({
        promoDiscount: 0,
        errorMessage: "",
      });
      return 0;
    }
    if (promo.trigger_value > rawCost) {
      this.setState({
        promoDiscount: 0,
        isFreeDelivery: false,
        errorMessage:
          "Promotion cannot be used due to did not meet the requirement!",
      });
      return 0;
    }
    switch (promo.promo_type) {
      case "Percent":
        const promoDiscount = this.limitToTwoDecimalPlaces(
          (rawCost * promo.discount_value) / 100
        );
        this.setState({
          errorMessage: "",
          isFreeDelivery: false,
          promoDiscount: promoDiscount,
        });
        return promoDiscount;
      case "Flat Rate":
        this.setState({
          isFreeDelivery: false,
          errorMessage: "",
          promoDiscount: promo.discount_value,
        });
        return promo.discount_value;
      case "Delivery":
        this.setState({
          rewardPointsUsed: 0,
          isFreeDelivery: true,
          //promoDiscount: this.state.deliveryFee,
        });
        return 0;
      default:
        this.setState({
          promoDiscount: 0,
          errorMessage: "The promotion type is not recognised!",
        });
        return 0;
    }
  };

  updateTotalValue = (event, food, foodIndex, index) => {
    let value = event.target.value;
    if (value) {
      // Calculate total cost for the food based on quantity
      let orders = this.state.orders;
      const FoodCost = this.limitToTwoDecimalPlaces(
        parseFloat(food.itemCost) * value
      );
      let costChanged = FoodCost - orders[index].foods[foodIndex].FoodCost;
      costChanged = this.limitToTwoDecimalPlaces(costChanged);
      const total_cost = this.limitToTwoDecimalPlaces(
        orders[index].total_cost + costChanged
      );

      const rawCost = this.limitToTwoDecimalPlaces(
        this.state.rawCost + costChanged
      );
      const discountedCost =
        rawCost - this.calculateDiscount(this.state.selectedPromo, rawCost);
      const deliveryFee = this.calculateDeliveryFee(discountedCost);
      const paymentCost = this.limitToTwoDecimalPlaces(
        discountedCost + deliveryFee
      );

      orders[index].foods[foodIndex].FoodQuantity = value;
      orders[index].total_cost = total_cost;
      orders[index].foods[foodIndex].FoodCost = FoodCost;
      this.setState({
        orders,
        rawCost,
        discountedCost,
        paymentCost,
      });
    }
  };

  deleteOrder = async (index) => {
    try {
      await axios.post("http://localhost:3001/Customer/DeleteOrder", {
        oid: this.state.orders[index].orderNum,
      });
      let orders = this.state.orders;
      orders.splice(index, 1);
      this.setState({
        orders,
      });
    } catch (err) {
      console.error(err);
    }
  };

  handleDelete = async (foodIndex, index) => {
    let orders = this.state.orders;
    try {
      await axios.post("http://localhost:3001/Customer/DeleteFood", {
        oid: orders[index].orderNum,
        fid: orders[index].foods[foodIndex].FoodId,
      });
    } catch (err) {
      console.error(err);
    }

    const foodCost = orders[index].foods[foodIndex].FoodCost;
    const orderCost = this.limitToTwoDecimalPlaces(
      orders[index].total_cost - foodCost
    );
    const rawCost = this.limitToTwoDecimalPlaces(this.state.rawCost - foodCost);
    const discountedCost = this.limitToTwoDecimalPlaces(
      rawCost - this.calculateDiscount(this.state.selectedPromo, rawCost)
    );
    const deliveryFee = this.calculateDeliveryFee(discountedCost);
    const paymentCost = this.limitToTwoDecimalPlaces(
      discountedCost + deliveryFee
    );

    orders[index].foods.splice(foodIndex, 1);
    orders[index].total_cost = orderCost;

    if (orders[index].foods.length === 0) {
      // Empty order
      this.deleteOrder(index);
    } else {
      // Order still has item in it
      this.setState({
        orders,
        rawCost,
        discountedCost,
        paymentCost,
      });
    }
  };

  // Prepare queries and values for transaction

  updateFood = async (food, orderNum, queryList, valueList) => {
    if (food.originalQuantity !== food.FoodQuantity) {
      console.log("Food: " + food.FoodName + "(" + food.FoodQuantity + ")");
      if (queryList.length === 0) {
        queryList.push(
          "UPDATE Consists SET quantity = $3, total_price = $4 WHERE oid = $1 AND fid = $2"
        );
        valueList[0] = [];
      }

      if (food.FoodQuantity === "0") {
        if (queryList.length === 1) {
          queryList.push("DELETE FROM Consists WHERE oid = $1 AND fid = $2");
          valueList[1] = [];
        }
        valueList[1].push([orderNum, food.FoodId]);
      } else {
        valueList[0].push([
          orderNum,
          food.FoodId,
          food.FoodQuantity,
          food.FoodCost,
        ]);
      }
    }
  };

  updatePlaceDetails = async (data, queryList, valueList) => {
    if (this.state.paymentMethod !== "cash") {
      queryList.push(
        "UPDATE Places SET address = $3, payment_method = $4, card_number = $5 WHERE oid = $1 AND cid = $2"
      );
      valueList.push([
        [
          data.orderNum,
          this.state.cid,
          this.state.addressSelected,
          "creditcard",
          this.state.paymentMethod,
        ],
      ]);
    } else {
      queryList.push(
        "UPDATE Places SET address = $3, payment_method = $4 WHERE oid = $1 AND cid = $2"
      );
      valueList.push([
        [data.orderNum, this.state.cid, this.state.addressSelected, "cash"],
      ]);
    }
  };

  updateRewardPoint = (total_cost, queryList, valueList) => {
    queryList.push(
      "UPDATE Customers SET reward_points = TO_NUMBER($2,'9999.99') WHERE cid = $1"
    );

    let rewardPointLeft = this.limitToTwoDecimalPlaces(
      this.state.rewardPoints -
        this.state.rewardPointsUsed +
        this.calculateRewardPoint(total_cost)
    );
    valueList.push([[this.state.cid, rewardPointLeft]]);
  };

  updateTimeStamp = (orderNum, queryList, valueList) => {
    queryList.push(
      "UPDATE Orders SET order_placed = (SELECT to_timestamp(to_char(current_timestamp, 'YYYY-MM-DD HH24:MI:SS'), 'YYYY-MM-DD HH24:MI:SS')) WHERE oid = $1"
    );
    valueList.push([[orderNum]]);
  };

  updateOrder = async (data) => {
    let queryList = [];
    let valueList = [];
    data.foods.map((food) => {
      this.updateFood(food, data.orderNum, queryList, valueList);
    });

    if (queryList.length === 2 && valueList[0].length === 0) {
      queryList.shift();
      valueList.shift();
    }

    queryList.push(
      "UPDATE Orders SET order_status = $2, total_price = $3, delivery_fee = $4 WHERE oid = $1"
    );
    valueList.push([
      [data.orderNum, "paid", this.state.rawCost, this.state.deliveryFee],
    ]);

    if (this.state.selectedPromoId !== 0) {
      queryList.push(
        "INSERT INTO Uses (oid, promo_id, amount) VALUES ($1, $2, $3)"
      );
      valueList.push([
        [data.orderNum, this.state.selectedPromoId, this.state.promoDiscount],
      ]);
    }

    this.updateTimeStamp(data.orderNum, queryList, valueList);
    this.updatePlaceDetails(data, queryList, valueList);
    this.updateRewardPoint(this.state.paymentCost, queryList, valueList);

    // Send transaction
    try {
      const response = await axios.post(
        "http://localhost:3001/Customer/UpdateOrder",
        {
          queryList: queryList,
          valueList: valueList,
        }
      );
      console.log(response.data);
      if (response.data) {
        if (response.data.where) {
          if (response.data.where.includes("reject_order_below_threshold")) {
            this.setState({
              errorMessage:
                "Order's total price does not meet the minimum threshold",
            });
          } else if (response.data.where.includes("reject_above_food_limit")) {
            // Need to clear the respective order after transaction
            this.setState({
              errorMessage:
                "Please make sure that the food quantity does not exceed the purchase limit",
            });
          } else if (
            response.data.where.includes("reject_negative_food_quantity")
          ) {
            this.setState({
              errorMessage:
                "Please make sure that the food quantity is less than the food quantity left",
            });
          }
        } else {
          this.setState({
            orders: [],
          });
        }
      }
    } catch (err) {
      console.log(err);
      console.error("Transaction failed!");
    }
  };

  handleSubmit = (event) => {
    let form = event.target;
    event.preventDefault();

    if (this.state.addressSelected === "") {
      this.setState({
        errorMessage: "Please choose a delivery location!",
      });
    } else {
      this.state.orders.map((data) => {
        this.updateOrder(data);
      });
      this.orderForm.reset();
    }
  };

  // Display the respective components to user

  renderOrderCost = (order) => {
    return (
      <tr key="orderCost" className="orderTable">
        <td>Total Cost</td>
        <td></td>
        <td></td>
        <td>${order.total_cost}</td>
        <td></td>
        <td></td>
      </tr>
    );
  };

  renderFoodItem = (food, foodIndex, index) => {
    return (
      <tr key={foodIndex} className="orderTable">
        <td>{food.FoodName}</td>
        <td>${food.itemCost}</td>
        <td>
          <Form.Control
            pattern="[0-9]*"
            defaultValue={food.FoodQuantity}
            onChange={(event) =>
              this.updateTotalValue(event, food, foodIndex, index)
            }
          />
        </td>
        <td>${food.FoodCost}</td>
        <td>{food.FoodLimit}</td>
        <td>{food.FoodQuantityLeft}</td>
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
        <Accordion.Toggle
          as={Card.Header}
          eventKey={index}
          className="orderTitle"
        >
          Order Number: {order.orderNum}
        </Accordion.Toggle>

        <Accordion.Collapse eventKey={index}>
          <Card.Body>
            <div className="restaurantHeader">
              <h3>{order.restaurantName}</h3>
              <h6 className="orderThreshold">
                Minimum order cost: {order.order_threshold}
              </h6>
            </div>

            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>Food Name</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total Cost</th>
                  <th>Purchase Limit</th>
                  <th>Quantity Left</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {order.foods.map((food, foodIndex) =>
                  this.renderFoodItem(food, foodIndex, index)
                )}
                {this.renderOrderCost(order)}
              </tbody>
            </Table>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    );
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
            errorMessage: "Credit card has been added!",
          });
        })
        .catch((err) => {
          this.setState({
            errorMessage:
              "Credit card has been registered! Please add a unregistered card!",
          });
        });
    } else {
      this.setState({
        errorMessage: "Please input a valid 16 digit credit card number!",
      });
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

  updateRewardPointUsed = (event) => {
    let value = event.target.value;
    if (value) {
      console.log(value);
      if (value > this.state.rewardPoints) {
        this.setState({
          errorMessage:
            "Points deducted cannot be more than available Reward Points!",
        });
      } else {
        if (value > this.state.deliveryFee) {
          this.setState({
            errorMessage: "Points deducted cannot be more than delivery fee!",
          });
        } else {
          if (value.includes(".") && value.split(".")[1].length >= 3) {
            this.setState({
              errorMessage: "Points must be at most 2 decimal places!",
            });
          } else {
            // 1 reward point = $1 offset in delivery fee
            const conversionRate = 1;
            const maxRewardPointsUsed = Math.min(value, this.state.deliveryFee);
            const discount = conversionRate * maxRewardPointsUsed;
            const paymentCost = parseFloat(
              (
                this.state.rawCost +
                this.state.deliveryFee -
                this.state.promoDiscount -
                discount
              ).toFixed(2)
            );
            this.setState({
              rewardPointsUsed: maxRewardPointsUsed,
              paymentCost: paymentCost,
              errorMessage: "",
            });
          }
        }
      }
    }
  };

  displayRewardPoints = () => {
    return (
      <div className="rewardPointContainer">
        <h6 className="rewardPointTitle">Reward Points: </h6>
        <h6>{this.state.rewardPoints}</h6>
        <div className="rewardPointInput">
          {!this.state.isFreeDelivery ? (
            <Form.Control
              pattern="^[0-9]+(\.[0-9]{1,2})?$"
              defaultValue="0"
              onChange={(event) => this.updateRewardPointUsed(event)}
            />
          ) : (
            <Form.Control
              plaintext
              readOnly
              defaultValue="0"
              className="rewardPointsUsed"
            />
          )}
        </div>
      </div>
    );
  };

  displayErrorFoodList = () => {
    return (
      <div className="errorFoodList">
        {this.state.errorUpdateFoods.map((food) => (
          <h6 className="errorMessage">{food}</h6>
        ))}
      </div>
    );
  };

  displayRawCost = () => {
    return (
      <div className="totalCostContainer">
        <h6 className="totalCostTitle">Total Price: </h6>
        <h6>${this.state.rawCost}</h6>
      </div>
    );
  };

  handlePromoSelection = (promoIndex) => {
    const NoPromotionSelected = "-1";
    let promos = this.state.promos;
    let selectedPromo = null;
    let selectedPromoId = 0;

    if (promoIndex !== NoPromotionSelected) {
      selectedPromo = promos[promoIndex];
      selectedPromoId = promos[promoIndex].promo_id;
    }
    const discountedCost = this.limitToTwoDecimalPlaces(
      this.state.rawCost -
        this.calculateDiscount(selectedPromo, this.state.rawCost)
    );

    setTimeout(() => {
      const deliveryFee = this.calculateDeliveryFee(discountedCost);
      const paymentCost = this.limitToTwoDecimalPlaces(
        discountedCost + deliveryFee
      );

      this.setState({
        selectedPromo,
        selectedPromoId,
        discountedCost,
        paymentCost,
      });
    }, 50);
  };

  displayPromoInput = () => {
    return (
      <FormGroup>
        <div className="promoInputContainer">
          <Form.Label>Promotion: </Form.Label>

          <Form.Control
            as="select"
            onChange={(input) => {
              this.handlePromoSelection(input.target.value);
            }}
          >
            {this.state.promos.length !== 0 ? (
              <>
                <option key={-1} value={-1}>
                  No promotion selected
                </option>
                {this.state.promos.map((promo, index) => (
                  <option key={index} value={index}>
                    {promo.details}
                  </option>
                ))}
              </>
            ) : (
              <option>No promotion available</option>
            )}
          </Form.Control>
        </div>
      </FormGroup>
    );
  };

  displayPromoDiscount = () => {
    return (
      <div className="promoDiscountContainer">
        <h6 className="promoDiscountTitle">Promo Discount: </h6>
        <h6>- ${this.state.promoDiscount}</h6>
      </div>
    );
  };

  addDeliveryLocation = () => {
    let address = this.state.addDeliveryLocation;
    if (/[S]([0][1-9]|[1-7][0-9]|[8][0])\d{4}$/.test(address)) {
      let addresses = this.state.addresses;
      addresses.push({ location: address });
      this.setState({
        addresses,
        addressSelected: address,
        errorMessage: "Delivery location has been added!",
      });
    } else {
      this.setState({
        errorMessage: "Please input a valid address for delivery location",
      });
    }
  };

  displayAddDeliveryLocationInput = () => {
    return (
      <div className="container">
        <Row>
          <FormGroup>
            <Col>
              <Form.Label>Delivery Location: </Form.Label>
              <Form.Control
                name="deliveryLocation"
                required={false}
                type="text"
                placeholder="Delivery Location"
                onChange={(value) =>
                  this.setState({ addDeliveryLocation: value.target.value })
                }
              />
            </Col>
          </FormGroup>
          <div>
            <Button
              size="sm"
              onClick={this.addDeliveryLocation}
              className="addButton"
            >
              Add Delivery Location
            </Button>
          </div>
        </Row>
      </div>
    );
  };

  selectDeliveryLocation = (address) => {
    this.setState({
      addressSelected: address,
    });
  };

  displayDeliveryLocation = () => {
    return (
      <DropdownButton
        className="deliveryLocation"
        id="deliveryLocation"
        title={
          this.state.addressSelected !== ""
            ? this.state.addressSelected
            : "Delivery Location"
        }
      >
        {this.state.addresses.map((address, index) => {
          return (
            <div key={index}>
              {index !== 0 && <Dropdown.Divider key={index} />}
              <Dropdown.Item
                key={address.location}
                eventKey={address.location}
                onSelect={this.selectDeliveryLocation}
              >
                {address.location}
              </Dropdown.Item>
            </div>
          );
        })}
      </DropdownButton>
    );
  };

  displayDeliveryFee = () => {
    return (
      <div className="deliveryFeeContainer">
        <h6 className="deliveryFeeTitle">Delivery Fee (5%): </h6>
        <h6>${this.state.deliveryFee}</h6>
      </div>
    );
  };

  displayPaymentCost = () => {
    return (
      <div className="paymentCostContainer">
        <h6 className="paymentCostTitle">Total: </h6>
        <h6>
          {this.state.paymentCost < 0
            ? "- $" + Math.abs(this.state.paymentCost)
            : "$" + this.state.paymentCost}
        </h6>
      </div>
    );
  };

  render() {
    return (
      <div className="page">
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
              <Accordion>
                {this.state.orders.map((order, index) =>
                  this.renderOrder(order, index)
                )}
              </Accordion>
              {this.displayRawCost()}
              {this.displayPromoInput()}
              {this.displayPromoDiscount()}
              {this.displayRewardPoints()}
              {this.displayDeliveryFee()}
              {this.displayPaymentCost()}

              {this.displayAddDeliveryLocationInput()}
              {this.displayDeliveryLocation()}
              {this.displayAddCreditCardInput()}
              {this.displayPaymentOptions()}

              {this.state.errorMessage && (
                <h6 className="errorMessage">{this.state.errorMessage}</h6>
              )}
              {this.state.errorUpdateFoods.length !== 0 &&
                this.displayErrorFoodList()}
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
