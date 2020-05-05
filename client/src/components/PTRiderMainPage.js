import React, { Component } from "react";

import { Navbar, NavbarBrand, Nav, NavLink, Jumbotron } from "reactstrap";

import "../styles/PTRiderMainPage.css";

import { GiFoodTruck } from "react-icons/gi";
import { MdHome } from "react-icons/md";
import { RiLogoutBoxLine } from "react-icons/ri";
import { FaRegCalendarAlt, FaMoneyBillAlt } from "react-icons/fa";
import OrderList from "./OrderList";
import CompletedOrderList from "./CompletedOrderList";
import swal from "sweetalert";
import OngoingOrder from "./OngoingOrder";

class PTRiderMainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFTRider: false,
      id: this.props.location.id,
      name: "",
      orders: [],
      completed_orders: [],
      avg_rating: 0,
      ongoing_order: null,
    };
  }

  getName = () => {
    fetch("http://localhost:3001/PTRider/getName", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rid: this.state.id }),
    })
      .then((res) => res.json())
      .then((res) => {
        this.setState({
          name: res[0].name,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  getAvgRating = () => {
    fetch("http://localhost:3001/PTRider", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rid: this.state.id }),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        // Query returns null value if not found
        if (res[0].avg_rating === null) {
          this.setState({
            avg_rating: "Not Available",
          });
        } else {
          this.setState({
            avg_rating: res[0].avg_rating,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  getOngoingOrder = () => {
    fetch("http://localhost:3001/Rider/getOngoingOrder", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rid: this.state.id }),
    })
      .then((res) => {
        return res ? res.json() : [null];
      })
      .then((res) => {
        this.setState({
          ongoing_order: res[0],
        });
      });
  };

  getPendingOrders = () => {
    fetch("http://localhost:3001/PTRider/getPendingOrders")
      .then((res) => {
        return res
          ? res.json()
          : [
              {
                order_number: "",
                cname: "",
                delivery_location: "",
                restaurant_name: "",
                restaurant_location: "",
              },
            ];
      })
      .then((res) => {
        this.setState({
          orders: res,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  getCompletedOrders = () => {
    fetch("http://localhost:3001/PTRider/getCompletedOrders", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rid: this.state.id }),
    })
      .then((res) => {
        return res
          ? res.json()
          : [
              {
                order_number: "",
                cname: "",
                delivery_location: "",
                restaurant_name: "",
                restaurant_location: "",
              },
            ];
      })
      .then((res) => {
        this.setState({
          completed_orders: res,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Update ongoing order status for arrival at restaurant in DB
  updateStatusArriveAtRestaurant = (order_number) => {
    fetch("http://localhost:3001/Rider/updateStatusArriveAtRestaurant", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        oid: order_number,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          this.displayErrorStatus();
        } else {
          this.displaySuccessStatus();
        }
      });
  };

  handleViewSalary = () => {
    // TODO
    // this.props.history.push("/PTriderMainPage/salary");
  };

  handleViewSchedule = () => {
    this.props.history.push({
      pathname: "PTRiderMainPage/schedule",
      state: {
        isFTRider: this.state.isFTRider,
        id: this.state.id,
      },
    });
  };

  handleHomeNavigation = () => {
    this.props.history.push({
      pathname: "/",
    });
  };

  handleAcceptPendingOrder = (orderInfo) => {
    // Only 1 Job can be accepted at any given time
    if (this.state.ongoing_order !== null) {
      swal(
        "Unable to accept order " + order_number + "!",
        "Please complete your ongoing order!",
        "error"
      );
      return;
    }
    const order_number = orderInfo.order_number;
    // Add timestamp to order_placed in Orders table
    fetch("http://localhost:3001/Rider/acceptOrder", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        oid: order_number,
        rid: this.state.id,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          swal(
            "Unable to accept order " + order_number + "!",
            "Please try again!",
            "error"
          );
        } else {
          swal("Added Order " + order_number + "!", "", "success");
          // Place Order into Accepted Job List
          this.setState({
            ongoing_order: {
              order_number: orderInfo.order_number,
              cname: orderInfo.cname,
              delivery_location: orderInfo.delivery_location,
              restaurant_name: orderInfo.restaurant_name,
              restaurant_location: orderInfo.restaurant_location,
            },
          });
        }
      })
      .catch((err) => {
        console.log(err);
        swal(
          "Unable to accept order " + order_number + "!",
          "Please try again!",
          "error"
        );
      });
  };

  // Ongoing order depart to restaurant button is clicked
  handleDepartToRestaurant = (order_number) => {
    //TODO
  };

  // Ongoing order arrive at restaurant button is clicked
  handleArriveAtRestaurant = (order_number) => {
    // Check depart for restaurant status
    fetch("http://localhost:3001/Rider/getStatusDepartForRestaurant", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        oid: order_number,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          this.displayErrorStatus();
        } else {
          const depart_for_restaurant = res[0].depart_for_rest;
          if (depart_for_restaurant === null) {
            this.displayErrorStatus();
          } else {
            // Update arrival at restaurant status in DB
            this.updateStatusArriveAtRestaurant(order_number);
          }
        }
      });
  };

  // Ongoing order depart to customer location button is clicked
  handleDepartToDeliveryLocation = (order_number) => {
    //TODO
  };

  // Ongoing order delivered to customer button is clicked
  handleOrderDelivered = (order_number) => {
    //TODO
  };

  displayErrorStatus = () => {
    return swal("Unable to update status", "Please Try Again!", "error");
  };

  displaySuccessStatus = () => {
    return swal("Successfully updated status", "", "success");
  };

  renderOngoingDelivery = () => {
    if (this.state.ongoing_order !== null) {
      return (
        <OngoingOrder
          orderInfo={this.state.ongoing_order}
          handleDepartToRestaurant={this.handleDepartToRestaurant}
          handleArriveAtRestaurant={this.handleArriveAtRestaurant}
          handleDepartToDeliveryLocation={this.handleDepartToDeliveryLocation}
          handleOrderDelivered={this.handleOrderDelivered}
        ></OngoingOrder>
      );
    }
  };

  componentDidMount() {
    this.getName();
    this.getAvgRating();
    this.getOngoingOrder();
    this.getPendingOrders();
    this.getCompletedOrders();
  }

  render() {
    return (
      <div>
        <Navbar className="navbar" color="dark" dark>
          <NavbarBrand href="/">Part Time Rider</NavbarBrand>

          <Nav className="mr-auto">
            <NavLink
              href=""
              onClick={this.handleHomeNavigation}
              className="link"
            >
              <MdHome />
              <span> Home</span>
            </NavLink>
          </Nav>

          <Nav>
            <NavLink href="/Login" className="link">
              <RiLogoutBoxLine />
              <span> Logout</span>
            </NavLink>
          </Nav>
        </Navbar>

        <Jumbotron>
          <div className="centered">
            <h1 className="display-2">
              <GiFoodTruck />
              <span> Welcome back {this.state.name}! </span>
              <GiFoodTruck />
            </h1>
          </div>

          <p className="lead">Summary of your activities</p>

          {/* Stats panel for PT Rider */}
          <div className="stats-panel">
            <button onClick={this.handleViewSalary}>
              <FaMoneyBillAlt />
              <span> Salary this week/month</span>
            </button>

            <p className="centered">
              Your Average Rating: {this.state.avg_rating}
            </p>

            <button onClick={this.handleViewSchedule}>
              <FaRegCalendarAlt />
              <span> Schedule</span>
            </button>
          </div>
        </Jumbotron>

        <h1 className="centered-text">Ongoing Delivery</h1>
        {this.renderOngoingDelivery()}

        <OrderList
          key={"pending-orders-" + this.state.orders.length}
          orders={this.state.orders}
          title={"Pending Orders"}
          handleAcceptOrder={this.handleAcceptPendingOrder}
        />

        <CompletedOrderList
          key={"completed-orders-" + this.state.completed_orders.length}
          orders={this.state.completed_orders}
          title={"Completed Orders"}
        />
      </div>
    );
  }
}

export default PTRiderMainPage;
