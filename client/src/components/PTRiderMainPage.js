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

  handleViewSalary = () => {
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
          //TODO
          // Place Order into Accepted Job List
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

  componentDidMount() {
    this.getName();
    this.getAvgRating();
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

        <h1>Ongoing Delivery</h1>
        <OngoingOrder></OngoingOrder>

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
