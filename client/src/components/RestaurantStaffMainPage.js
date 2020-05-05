import React, { Component } from "react";
import "../styles/RestaurantStaffMainPage.css";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FormGroup from 'react-bootstrap/FormGroup'
import { Col } from 'reactstrap';
import { Table } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import axios from 'axios';
import { Navbar, NavbarBrand, Nav, NavLink, Jumbotron } from "reactstrap";
import { MdPerson, MdDataUsage, MdRestaurant, MdRestaurantMenu } from "react-icons/md";
import { RiLogoutBoxLine } from "react-icons/ri";
import { FaBullhorn } from "react-icons/fa";

class RestaurantStaffMainPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            foodItems: [],
            restaurantDetails: [],
            editMode: false,
            currentFoodItem: ""
        }
        this.handleSubmit.bind(this);
        this.handleDelete.bind(this);
        this.handleEdit.bind(this);
    }
    
    getRestaurantStaffDetails() {
        let data = { staff_id: this.props.location.state.account_id };
        axios.post('http://localhost:3001/RestaurantStaff/getRestaurantStaffDetails', data)
        .then(res => this.setState({ restaurantDetails: res.data[0] }, () => {
            this.getFoodItems();
        }));
    }
    
    getFoodItems() {
        let data = { rest_id: this.state.restaurantDetails.rest_id };
        axios.post('http://localhost:3001/RestaurantStaff/getFoodItems', data)
        .then(res => this.setState({ foodItems: res.data }));
      };

    componentDidMount() {
        this.getRestaurantStaffDetails();
    }
    
    handleSubmit = (event) => {
        let form = event.target;
        event.preventDefault();
        let newFood = {
            rest_id: this.state.restaurantDetails.rest_id,
            name: form.elements.foodName.value,
            price: '$' + parseFloat(form.elements.foodPrice.value).toFixed(2),
            quantity: Math.round(form.elements.foodLimit.value),
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
        form.reset();
    }

    handleEdit = (food) => {
        this.setState({ currentFoodItem: food, editMode: true });
    }

    handleCancel = () => {
        this.setState({ editMode: false });
    }

    handleUpdate = (event) => {
        let form = event.target;
        event.preventDefault();
        let updatedFood = {
            food_id: this.state.currentFoodItem.fid,
            rest_id: this.state.restaurantDetails.rest_id,
            name: form.elements.foodName.value,
            price: '$' + parseFloat(form.elements.foodPrice.value).toFixed(2),
            quantity: Math.round(form.elements.foodLimit.value),
            category: form.elements.foodCategory.value,
            food_limit: Math.round(form.elements.foodLimit.value)
        }
        axios.post('http://localhost:3001/RestaurantStaff/updateFood', updatedFood)
        .then(() => console.log('Food Updated'))
        .catch(err => {
            console.error(err);
        });
        let index = this.state.foodItems.indexOf(this.state.currentFoodItem);
        this.state.foodItems[index] = updatedFood;
        this.setState({ editMode: false });
        form.reset();
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

    renderItem = (food, index) => {
        return(
            <tr key={food.fid}>
                <td>{index + 1}</td>
                <td>{food.name}</td>
                <td><span></span>{food.price}</td>
                <td>{food.quantity}</td>
                <td>{food.category}</td>
                <td>{food.food_limit}</td>
                <td>
                    <Button onClick={() => this.handleEdit(food)}>Edit</Button> {' '}
                    <Button variant="danger" onClick={() => this.handleDelete(food)}>Delete</Button>
                </td>
            </tr>
        )
    }

    renderDefaultForm = () => {
        return <div>
            <form onSubmit = {this.handleSubmit}>
                <FormGroup>
                    <Row>
                        <Col>
                            <Form.Label>Food: </Form.Label>
                            <Form.Control name = "foodName" required={true} type="text" placeholder="Food name" defaultValue=""/>
                        </Col>
                        <Col>
                            <Form.Label>Price: </Form.Label>
                            <Form.Control name = "foodPrice" required={true} type="number" min="0.01" step="0.01" data-number-to-fixed="2" placeholder="Food price" defaultValue=""/>
                        </Col>
                        <Col>
                            <Form.Label>Category: </Form.Label>
                            <Form.Control name = "foodCategory" required={true} type="text" placeholder="Food category" defaultValue=""/>
                        </Col>
                        <Col>
                            <Form.Label>Limit: </Form.Label>
                            <Form.Control name = "foodLimit" required={true} type="number" min="1" placeholder="Daily Food limit" defaultValue=""/>
                        </Col>
                        <div>
                        <Button className="submit-button" type="submit" size="sm"> Add Item </Button>
                        </div>
                    </Row>
                </FormGroup>
            </form>
        </div>
    }

    renderEditForm = () => {
        return <div>
            <form onSubmit = {this.handleUpdate}>
                <FormGroup>
                    <Row>
                        <Col>
                            <Form.Label>Food: </Form.Label>
                            <Form.Control name = "foodName" required={true} type="text" placeholder="Food name" defaultValue={this.state.currentFoodItem.name}/>
                        </Col>
                        <Col>
                            <Form.Label>Price: </Form.Label>
                            <Form.Control name = "foodPrice" required={true} type="number" min="0.01" step="0.01" data-number-to-fixed="2" placeholder="Food price" defaultValue={parseFloat(this.state.currentFoodItem.price.substring(1))}/>
                        </Col>
                        <Col>
                            <Form.Label>Category: </Form.Label>
                            <Form.Control name = "foodCategory" required={true} type="text" placeholder="Food category" defaultValue={this.state.currentFoodItem.category}/>
                        </Col>
                        <Col>
                            <Form.Label>Limit: </Form.Label>
                            <Form.Control name = "foodLimit" required={true} type="number" min="1" placeholder="Food limit" defaultValue={this.state.currentFoodItem.food_limit}/>
                        </Col>
                        <div>
                            <Button className="update-button" type="submit" size="sm"> Update Item </Button> {' '}
                            <Button className="cancel-button" onClick={this.handleCancel} size="sm"> Cancel </Button>
                        </div>
                    </Row>
                </FormGroup>
            </form>
        </div>
    }

    handleProfileNavigation = () => {
        this.props.history.push({
            pathname: '/RestaurantProfile',
            state: {
                account_id: this.props.location.state.account_id,
                rest_id: this.state.restaurantDetails.rest_id,
                name: this.state.restaurantDetails.name,
                order_threshold: this.state.restaurantDetails.order_threshold,
                address: this.state.restaurantDetails.address
          }
        });
    };
      
    handlePromotionNavigation = () => {
        this.props.history.push({
            pathname: '/RestaurantPromotions',
            state: {
                account_id: this.props.location.state.account_id,
                rest_id: this.state.restaurantDetails.rest_id
            }
        });
    };
    
    handleSummaryNavigation = () => {
        this.props.history.push({
            pathname: '/RestaurantSummaryPage',
            state: {
                account_id: this.props.location.state.account_id,
                rest_id: this.state.restaurantDetails.rest_id
            }
        });
    };

    render() {
        return (
            <div>
                <Navbar className="navbar" color="dark" dark>
                    <NavbarBrand className="link">Home Page</NavbarBrand>

                    <Nav className="mr-auto">
                        <NavLink href="" onClick={this.handleProfileNavigation} className="link">
                            <MdPerson />
                            <span> Restaurant Profile </span>
                        </NavLink>

                        <NavLink href="" onClick={this.handlePromotionNavigation} className="link">
                         <FaBullhorn />
                            <span> Promotional Campaigns </span>
                        </NavLink>

                        <NavLink href="" onClick={this.handleSummaryNavigation} className="link">
                         <MdDataUsage />
                            <span> Summary Info </span>
                        </NavLink>
                    </Nav>
    
                    <Nav>
                        <NavLink href="/Login" className="link">
                            <RiLogoutBoxLine />
                            <span> Logout </span>
                        </NavLink>
                    </Nav>
                </Navbar>
            
                <Jumbotron>
                    <div className="centered-container">
                        <h1 className="display-3">
                            <MdRestaurant />
                            <span>{this.state.restaurantDetails.name}</span>
                            <MdRestaurant />
                        </h1>
                    </div>
                </Jumbotron>

                <div className="content">
                    <div>
                        <h1 align="center" className="display-4">
                            <MdRestaurantMenu />
                            <span> Main Menu </span>
                            <MdRestaurantMenu />
                        </h1>
                        {this.state.editMode ? this.renderEditForm() : this.renderDefaultForm()}
                        <br/>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Food Name</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Category</th>
                                    <th>Daily Food Limit</th>
                                    <th>Update/Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.foodItems.map(this.renderItem)}
                            </tbody>
                        </Table>
                    </div>
                </div>
            </div>
        );
    }
}

export default RestaurantStaffMainPage;