import React, { Component } from "react";
import "../styles/Customer.css";
import { GiShoppingCart } from "react-icons/gi";
import { Link } from "react-router-dom";
import { MdPerson } from "react-icons/md";
import { RiLogoutBoxLine } from "react-icons/ri";
import { Navbar, NavbarBrand, Col, Jumbotron, Row } from "reactstrap";
import { AccountContext } from "./AccountProvider.js";

class Customer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      restaurantList: [],
      filtered: [],
      customerName: "Florida",
      cid: "1b39d987-c6b0-4493-bb95-96e51af734b2",
    };

    this.handleChange.bind(this);
  }

  static contextType = AccountContext;

  getRestaurantList = () => {
    fetch("http://localhost:3001/Customer/")
      .then((res) => res.json())
      .then((res) => {
        var restaurantList = res;
        this.setState({
          restaurantList,
          filtered: restaurantList,
        });
      });
  };

  componentDidMount() {
    let state = this.context;
    state.setCidAndName(this.state.cid, this.state.customerName);
    this.getRestaurantList();
  }

  handleProfile = () => {
    this.props.history.push({
      pathname: "/Profile",
      state: { customerName: this.state.customerName, cid: this.state.cid },
    });
  };

  handleCart = () => {
    this.props.history.push({
      pathname: "/Cart",
      cid: this.state.cid,
    });
  };

  handleChange(e) {
    let newList = [];
    let currentList = this.state.restaurantList;

    if (e.target.value !== "") {
      newList = currentList.filter((item) => {
        const lowercaseItem = item.name.toLowerCase();
        const filter = e.target.value.toLowerCase();
        return lowercaseItem.includes(filter);
      });
    } else {
      newList = currentList;
    }
    this.setState({
      filtered: newList,
    });
  }

  render() {
    return (
      <div>
        <Navbar dark color="dark">
          <NavbarBrand href="/Login">
            <RiLogoutBoxLine className="logoutIcon" />
          </NavbarBrand>
          <div className="icon-container">
            <GiShoppingCart
              size="3em"
              color="black"
              onClick={this.handleCart}
            />
            <MdPerson size="3em" color="black" onClick={this.handleProfile} />
          </div>
        </Navbar>

        <Row>
          <Col>
            <Jumbotron className="header-centered">
              <h1 className="display-3">Welcome {this.state.customerName}</h1>
              <p className="lead">Choose a restaurant and start order now!</p>
            </Jumbotron>
          </Col>
        </Row>

        <div className="content">
          <div className="container">
            <div className="searchContainer">
              <input
                type="text"
                className="input"
                onChange={(e) => this.handleChange(e)}
                placeholder="Search..."
              />
            </div>

            <div className="section">
              {this.state.filtered.map((item, index) => (
                <div key={index}>
                  <Link
                    className="restItem"
                    to={{
                      pathname: "/Customer/" + item.name,
                      state: {
                        customerName: this.state.customerName,
                        cid: this.state.cid,
                        rest_id: item.rest_id,
                        restaurantName: item.name,
                      },
                    }}
                  >
                    {item.name}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
Customer.contextType = AccountContext;
export default Customer;
