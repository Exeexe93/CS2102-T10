import React, { Component } from "react";
import "../styles/Cart.css";
import { Navbar, NavbarBrand, Col, Jumbotron, Row } from "reactstrap";
import { Accordion, Card } from "react-bootstrap";
import { AccountContext } from "./AccountProvider.js";
import axios from "axios";

class Cart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customerName: "",
      cid: "",
    };
  }

  static contextType = AccountContext;

  componentDidMount() {
    let value = this.context;
    this.setState({
      cid: value.state.cid,
      customerName: value.state.name,
    });
  }

  render() {
    return (
      <div className="page">
        <Navbar dark color="dark">
          <NavbarBrand href="/CustomerMainPage">CustomerMainPage</NavbarBrand>
          <div className="icon-container"></div>
        </Navbar>

        <Row>
          <Col>
            <Jumbotron className="header-centered">
              <h1 className="display-3">Hi {this.state.customerName}</h1>
              <p className="lead">Quick! Confirm the orders!</p>
            </Jumbotron>
          </Col>
        </Row>

        <div className="body">
          <Accordion className="orderListing">
            <Card>
              <Accordion.Toggle as={Card.Header} eventKey="0">
                Click me!
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="0">
                <Card.Body>Hello! I'm the body</Card.Body>
              </Accordion.Collapse>
            </Card>
            <Card>
              <Accordion.Toggle as={Card.Header} eventKey="1">
                Click me!
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="1">
                <Card.Body>Hello! I'm another body</Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>
        </div>
      </div>
    );
  }
}

export default Cart;
