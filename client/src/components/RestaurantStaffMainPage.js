import React, { Component } from "react";
import "../styles/RestaurantStaffMainPage.css";
import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FormGroup from 'react-bootstrap/FormGroup'
import { Col } from 'reactstrap';
import { Table } from "react-bootstrap";
import Row from "react-bootstrap/Row";

class RestaurantStaffMainPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            foodItems: [],
            apiResponse: "",
            restaurantName: "Mr. Eng Pte Ltd"
        }
        this.handleSubmit.bind(this);
    }
    
    getFoodItems() {
        fetch("http://localhost:3001/RestaurantStaff")
        .then(res => res.json())
        .then(res => this.setState({ foodItems: res }));
      };
    
    componentWillMount() {
        this.getFoodItems();
        this.setState({
            foodItems: this.state.foodItems,
          });
    }
    
    handleSubmit = (event) => {
        let form = event.target;
        event.preventDefault();
        let newFood = {
            name: form.elements.foodName.value,
            price:  parseFloat(form.elements.foodPrice.value).toFixed(2),
            quantity:  Math.round(form.elements.foodQuantity.value),
            category:  form.elements.foodCategory.value,
            food_limit:  Math.round(form.elements.foodLimit.value)
        }
        // const requestOptions = {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(newFood)
        // };
        // fetch('localhost:3001/api/new-food', requestOptions)
        //     .then(response => response.json())
        //     .then(data => this.setState({ postId: data.id }));
        this.setState ({ 
            foodItems: [...this.state.foodItems, newFood]
        });
        this.foodForm.reset()
    }

    renderItem = (food, index) => {
        return(
            <tr key={index}>
                <td>{index + 1}</td>
                <td>{food.name}</td>
                <td><span>$</span>{food.price}</td>
                <td>{food.quantity}</td>
                <td>{food.category}</td>
                <td>{food.food_limit}</td>
            </tr>
        )
    }

    render() {
        return (
            <div className="content">
                <div className="container">
                    <div className="header">
                    <p className="App-intro">;{this.state.apiResponse}</p>
                        <h1> {this.state.restaurantName} {' '}
                            <Link to='/RestaurantSummaryPage'>
                                <Button variant={"primary"}>Summary Info</Button>
                            </Link>
                        </h1>
                        <br/>
                    </div>
                    <div className="AddItem">
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