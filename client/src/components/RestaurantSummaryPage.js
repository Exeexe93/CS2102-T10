import React, { Component } from "react";
import "../styles/RestaurantSummaryPage.css";
import axios from "axios";
import { MdHome } from "react-icons/md";
import { Navbar, NavbarBrand, Nav, Jumbotron } from "reactstrap";
import { RiLogoutBoxLine } from "react-icons/ri";
import Form from "react-bootstrap/Form";
import { Link } from "react-router-dom";

class RestaurantSummaryPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numOfOrders: "",
      topItems: [],
      promos: [],
      selectedPromo: "",
    };
  }

  getNumOfOrders() {
    let data = { rest_id: this.props.location.state.rest_id };
    axios
      .post("http://localhost:3001/RestaurantStaff/getNumOfOrders", data)
      .then((res) => this.setState({ numOfOrders: res.data[0].count }));
  }

  getTopItems() {
    let data = { rest_id: this.props.location.state.rest_id };
    axios
      .post("http://localhost:3001/RestaurantStaff/getTopItems", data)
      .then((res) => this.setState({ topItems: res.data }));
  }

  getPromoStats() {
    let data = { rest_id: this.props.location.state.rest_id };
    axios
      .post("http://localhost:3001/RestaurantStaff/getPromoStats", data)
      .then((res) =>
        this.setState({ promos: res.data, selectedPromo: res.data[0] })
      );
  }

  componentDidMount() {
    this.getNumOfOrders();
    this.getTopItems();
    this.getPromoStats();
  }

  renderItem = (listItem, index) => {
    return (
      <li key={index} className="list-group-item list-group-item-secondary">
        {index + 1}. {listItem.name} - {listItem.totalquantity} sold
      </li>
    );
  };

  handleHomeNavigation = () => {
    return {
      pathname: "/RestaurantStaffMainPage",
      state: {
        account_id: this.props.location.state.account_id,
      },
    };
  };

  handleSelect = (event) => {
    this.setState({
      selectedPromo: this.state.promos[event.target.value.slice(10, 11) - 1],
    });
  };

  render() {
    return (
      <div>
        <Navbar className="navbar" color="dark" dark>
          <NavbarBrand> Summary Information </NavbarBrand>
          <Nav className="mr-auto">
            <Link to={this.handleHomeNavigation} className="icon">
              <MdHome />
              <span> Home</span>
            </Link>
          </Nav>
          <Nav>
            <Link to={{ pathname: "/Login" }} className="icon">
              <RiLogoutBoxLine />
              <span> Logout</span>
            </Link>
          </Nav>
        </Navbar>
        <Jumbotron>
          <div className="centered-container">
            <h1 className="display-5">
              <span>
                {" "}
                <b>Total no. of completed orders: </b>
                {this.state.numOfOrders}{" "}
              </span>
            </h1>
          </div>
        </Jumbotron>

        <div className="body-container">
          <h1>
            <u>
              <center>Top food items (up to 5):</center>
            </u>
          </h1>
          <h1 />
          <h4>
            <ul className="list-group">
              {this.state.topItems.map(this.renderItem)}
            </ul>
          </h4>

          <h2>
            <h1>
              <u>
                <center>Promotion Campaign's Statistics</center>
              </u>
            </h1>
            <h1 />
            <h3>
              <Form.Label>Select Promotion: </Form.Label>
              <Form.Control as="select" custom onChange={this.handleSelect}>
                {this.state.promos.map((promo, index) => (
                  <option>Promotion {index + 1}</option>
                ))}
              </Form.Control>
              <h1 />
            </h3>
            <h4>
              <strong>Promotion Info:</strong>
              <br />
              Period: {this.state.selectedPromo.start_time} {" TO "}{" "}
              {this.state.selectedPromo.end_time}
              <br />
              Duration: {this.state.selectedPromo.duration}{" "}
              {this.state.selectedPromo.duration > 1 ? "days" : "day"}
              <br />
              Details: {this.state.selectedPromo.details}
              <br />
              Discount:{" "}
              {this.state.selectedPromo.promo_type === "flat-rate" ? "$" : ""}
              {this.state.selectedPromo.discount_value}
              {this.state.selectedPromo.promo_type === "percent" ? "%" : ""}
              <br />
              Minimum Spending: {this.state.selectedPromo.trigger_value}
              <h1 />
              <strong>Average number of orders received:</strong>
              <br />
              Per day:{" "}
              {parseFloat(
                this.state.selectedPromo.num_of_times_used /
                  this.state.selectedPromo.duration
              ).toFixed(3)}{" "}
              orders <br />
              Per hour:{" "}
              {parseFloat(
                this.state.selectedPromo.num_of_times_used /
                  this.state.selectedPromo.duration /
                  24
              ).toFixed(3)}{" "}
              orders
            </h4>
          </h2>
        </div>
      </div>
    );
  }
}

export default RestaurantSummaryPage;
