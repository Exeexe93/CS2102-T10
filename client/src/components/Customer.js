import React, { Component } from "react";
import "../styles/Customer.css";
import { GiShoppingCart } from "react-icons/gi";
import { Link } from "react-router-dom";
import { MdPerson } from "react-icons/md";
import { Navbar, NavbarBrand, Col, Jumbotron, Row } from "reactstrap";
import { AccountContext } from "./AccountProvider.js";

class Customer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      updateState: true,
      restaurantList: [],
      filtered: [],
      customerName: "Florida",
      cid: "1b39d987-c6b0-4493-bb95-96e51af734b2",
    };

    this.handleChange.bind(this);
  }

  getRestaurantList = () => {
    fetch("http://localhost:3001/Customer/")
      .then((res) => res.json())
      .then((res) => {
        var restaurantList = res.map((r) => r.name);
        this.setState({
          restaurantList,
          filtered: restaurantList,
        });
      });
  };

  componentDidMount() {
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
        const lowercaseItem = item.toLowerCase();
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

  initialiseState = (updateState) => {
    this.setState({
      updateState,
    });
    console.log("updateState: " + this.state.updateState);
  };

  render() {
    return (
      <div>
        <AccountContext.Consumer>
          {(context) => {
            if (this.state.updateState) {
              this.updatedState(false);
              context.setCidAndName(this.state.cid, this.state.customerName);
            }
          }}
        </AccountContext.Consumer>
        <Navbar dark color="dark">
          <NavbarBrand href="/Customer">Main Page</NavbarBrand>
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
              <p className="lead">What foods to order today? Yum! Yum!</p>
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
                      pathname: "/Customer/" + item,
                      state: {
                        customerName: this.state.customerName,
                        cid: this.state.cid,
                        restaurantName: item,
                      },
                    }}
                  >
                    {item}
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

export default Customer;
