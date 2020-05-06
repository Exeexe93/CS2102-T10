import React, { Component } from "react";

import { Navbar, NavbarBrand, Nav, NavLink, Jumbotron } from "reactstrap";
import "../styles/FTRiderMainPage.css";

import { GiFoodTruck } from "react-icons/gi";
import { MdHome } from "react-icons/md";
import { RiLogoutBoxLine } from "react-icons/ri";
import { FaRegCalendarAlt, FaMoneyBillAlt } from "react-icons/fa";
import OrderList from "./OrderList";
import CompletedOrderList from "./CompletedOrderList";
import swal from "sweetalert";
import OngoingOrder from "./OngoingOrder";

class FTRiderMainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFTRider: true,
      id: this.props.location.id,
      name: "",
      orders: [],
      completed_orders: [],
      avg_rating: 0,
      ongoing_order: null,
      ongoing_order_status_text: "Arrive At Restaurant",
    };
  }

  getName = () => {
    fetch("http://localhost:3001/FTRider/getName", {
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
    fetch("http://localhost:3001/FTRider", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rid: this.state.id }),
    })
      .then((res) => res.json())
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
    fetch("http://localhost:3001/FTRider/getPendingOrders")
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
    fetch("http://localhost:3001/FTRider/getCompletedOrders", {
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

  // Update ongoing order status for depart for restaurant
  updateStatusDepartForRestaurant = (order_number) => {
    fetch("http://localhost:3001/Rider/updateStatusDepartForRestaurant", {
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
        }
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

  updateStatusDepartForDelivery = (order_number) => {
    fetch("http://localhost:3001/Rider/updateStatusDepartForDelivery", {
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

  updateStatusDeliverToCustomer = (order_number) => {
    fetch("http://localhost:3001/Rider/updateStatusDeliverToCustomer", {
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
    // if (this.state.isFTRider) {
    //   this.props.history.push("/FTriderMainPage/salary");
    // } else {
    //   this.props.history.push("/PTriderMainPage/salary");
    // }
  };

  handleViewSchedule = () => {
    this.props.history.push({
      pathname: "/FTRiderMainPage/schedule",
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
          // TODO
          // Update DB depart_for_rest
          this.updateStatusDepartForRestaurant(order_number);
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

  handleStatusUpdate = (order_number) => {
    const status_text = this.state.ongoing_order_status_text;
    if (status_text === "Arrive At Restaurant") {
      // Update text to "Depart from restaurant to delivery location"
      this.setState({
        ongoing_order_status_text:
          "Depart from restaurant to delivery location",
      });
      // Update DB Order arrive_at_rest
      this.updateStatusArriveAtRestaurant(order_number);
    } else if (status_text === "Depart from restaurant to delivery location") {
      // Update text to "Order Delivered"
      this.setState({
        ongoing_order_status_text: "Order Delivered",
      });
      // Update DB Order depart_for_delivery
      this.updateStatusDepartForDelivery(order_number);
    } else if (status_text === "Order Delivered") {
      // Update DB Order deliver_to_cust
      this.updateStatusDeliverToCustomer(order_number);
      // Update Ongoing order to Completed Order
      let new_completed_orders = this.state.completed_orders.slice();
      new_completed_orders.push(this.state.ongoing_order);
      this.setState({
        completed_orders: new_completed_orders,
        ongoing_order: null,
      });
    }
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
          orderStatusText={this.state.ongoing_order_status_text}
          handleStatusUpdate={this.handleStatusUpdate}
        ></OngoingOrder>
      );
    }
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
          <NavbarBrand href="/">Full Time Rider</NavbarBrand>

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
          <div className="centered-container">
            <h1 className="display-2">
              <GiFoodTruck />
              <span> Welcome back {this.state.name}! </span>
              <GiFoodTruck />
            </h1>
          </div>

          <p className="lead">Summary of your activities</p>

          {/* Stats panel for FT Rider */}
          <div className="stats-panel">
            <button onClick={this.handleViewSalary}>
              <FaMoneyBillAlt />
              <span> Salary this week/month</span>
            </button>

            <p className="centered-text">
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

export default FTRiderMainPage;
