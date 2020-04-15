import React, { Component } from "react";
import "../styles/RestaurantStaffMainPage.css";
import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FormGroup from 'react-bootstrap/FormGroup'
import { Col } from 'reactstrap';
import { Table } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import axios from 'axios';

class RestaurantStaffMainPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            foodItems: [],
            restaurantName: "Mr. Eng Pte Ltd"
        }
        this.handleSubmit.bind(this);
        this.handleDelete.bind(this);
    }
    
    getFoodItems() {
        fetch("http://localhost:3001/RestaurantStaff")
        .then(res => res.json())
        .then(res => this.setState({ foodItems: res }));
      };
    
    componentWillMount() {
        this.getFoodItems();
    }
    
    handleSubmit = (event) => {
        let form = event.target;
        event.preventDefault();
        let newFood = {
            name: form.elements.foodName.value,
            price: '$' + parseFloat(form.elements.foodPrice.value).toFixed(2),
            quantity: Math.round(form.elements.foodQuantity.value),
            category: form.elements.foodCategory.value,
            food_limit: Math.round(form.elements.foodLimit.value)
        }
        axios.post('http://localhost:3001/RestaurantStaff/addFood', newFood)
        .then(() => console.log('Food Created'))
        .catch(err => {
            console.error(err);
        });
        this.setState ({ 
            foodItems: [...this.state.foodItems, newFood]
        });
        this.foodForm.reset();
    }

    renderItem = (food, index) => {
        return(
            <tr key={food.fid}>
                <td>{index + 1}</td>
                <td>{food.name}</td>
                <td><span></span>{food.price}</td>
                <td>{food.quantity}</td>
                <td>{food.category}</td>
                <td>{food.food_limit}</td>
                <td><Button onClick={() => this.handleDelete(food)}>Delete</Button></td>
            </tr>
        )
    }

    handleDelete = (food) => {
        axios.post('http://localhost:3001/RestaurantStaff/deleteFood', food)
        .then(() => console.log('Food Deleted'))
        .catch(err => {
            console.error(err);
        });
        let index = this.state.foodItems.indexOf(food)
        this.state.foodItems.splice(index, 1);
        this.setState ({ 
            foodItems: this.state.foodItems
        });
    }

    render() {
        return (
            <div className="content">
                <div className="container">
                    <div className="header">
                        <h1> {this.state.restaurantName} {' '}
                            <Link to='/RestaurantSummaryPage'>
                                <Button variant={"primary"}>Summary Info</Button>
                            </Link>
                        </h1>
                        <br/>
                    </div>
                    <div>
                        <form ref={ form => this.foodForm = form} onSubmit = {this.handleSubmit}>
                            <FormGroup>
                                <Row>
                                    <Col>
                                        <Form.Label>Food: </Form.Label>
                                        <Form.Control name = "foodName" required="true" type="text" placeholder="Food name"/>
                                    </Col>
                                    <Col>
                                        <Form.Label>Price: </Form.Label>
                                        <Form.Control name = "foodPrice" required="true" type="number" min="0.01" step="0.01" data-number-to-fixed="2" placeholder="Food price"/>
                                    </Col>
                                    <Col>
                                        <Form.Label>Quantity: </Form.Label>
                                        <Form.Control name = "foodQuantity" required="true" type="number" min="1" placeholder="Food quantity"/>
                                    </Col>
                                    <Col>
                                        <Form.Label>Category: </Form.Label>
                                        <Form.Control name = "foodCategory" required="true" type="text" placeholder="Food category"/>
                                    </Col>
                                    <Col>
                                        <Form.Label>Limit: </Form.Label>
                                        <Form.Control name = "foodLimit" required="true" type="number" min="1" placeholder="Food limit"/>
                                    </Col>
                                    <div>
                                    <Button className="submit-button" type="submit" size="sm"> Add Item </Button>
                                    </div>
                                </Row>
                            </FormGroup>
                        </form>
                    </div>
                    <br/>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Food Name</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Category</th>
                                <th>Food Limit</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.foodItems.map(this.renderItem)}
                        </tbody>
                    </Table>
                </div>
            </div>
        );
    }
}

export default RestaurantStaffMainPage;