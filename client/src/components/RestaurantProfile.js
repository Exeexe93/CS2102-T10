import React, { Component } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FormGroup from 'react-bootstrap/FormGroup'
import axios from 'axios';
import { MdHome } from "react-icons/md";
import { Navbar, NavbarBrand, Nav, NavLink } from "reactstrap";
import { RiLogoutBoxLine } from "react-icons/ri";

class RestaurantProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rest_id: this.props.location.state.rest_id,
            restaurantName: this.props.location.state.name,
            order_threshold: parseFloat(this.props.location.state.order_threshold.substring(1)).toFixed(2),
            address: this.props.location.state.address,
            isInEditMode: false
        }
    }

    handleHomeNavigation = () => {
        this.props.history.push({
            pathname: '/RestaurantStaffMainPage',
            state: {
              account_id: this.props.location.state.account_id
            }
        });
      };
    
    changeEditMode = () => {
        this.setState({isInEditMode: !this.state.isInEditMode})
    }

    handleUpdate = (event) => {
        let form = event.target;
        event.preventDefault();
        let restaurantName = form.elements.restaurantName.value;
        let order_threshold = parseFloat(form.elements.order_threshold.value).toFixed(2);
        let address = form.elements.address.value;
        this.setState({
            restaurantName: restaurantName,
            order_threshold: order_threshold,
            address: address,
            isInEditMode: false
        })
        let data = {
            rest_id: this.state.rest_id,
            name: restaurantName,
            order_threshold: order_threshold,
            address: address
        };
        axios.post('http://localhost:3001/RestaurantStaff/updateProfile', data)
        .then(() => console.log('Profile Updated'))
        .catch(err => {
            console.error(err);
        });
    }

    renderEditView = () => {
        return <form onSubmit = {this.handleUpdate}>
            <FormGroup>
                <Form.Label>Restaurant Name: </Form.Label>
                <Form.Control name = "restaurantName" required={true} type="text" defaultValue={this.state.restaurantName} placeholder="Restaurant Name"/><h4/>
                <Form.Label>Restaurant Order Threshold: </Form.Label>
                <Form.Control name = "order_threshold" required={true} type="number" min="0.01" step="0.01" 
                    data-number-to-fixed="2" defaultValue={this.state.order_threshold} placeholder="Order Threshold"/>
                <Form.Text className="text-muted">
                    The minimum amount customers are required to spend per order.
                </Form.Text> <h4/>
                <Form.Label>Restaurant Address: </Form.Label>
                <Form.Control name = "address" required={true} type="text" defaultValue={this.state.address} placeholder="Restaurant Address"/>
                <h4/>
                <Button type="submit"> Update </Button> {' '}
                <Button onClick={this.handleCancel}> Cancel </Button>
                </FormGroup>
        </form>
    }

    renderDefaultView = () => {
        return <div>
            <h3>Restaurant Name: {this.state.restaurantName}</h3>
            <h3>Restaurant Order Threshold: ${this.state.order_threshold}</h3>
            <h3>Restaurant Address: {this.state.address}</h3>
            </div>
    }
          
    handleCancel = () => {
        this.setState({isInEditMode: false})
    }

    render() {
        return(
            <div>
                <Navbar className="navbar" color="dark" dark>
                    <NavbarBrand>Restaurant Profile</NavbarBrand>
                    <Nav className="mr-auto">
                        <NavLink href="" onClick={this.handleHomeNavigation}className="link">
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
                <div className="content">
                    <div className="container">
                        <h1 align="center" className="display-4">
                            <span> Restaurant Details </span>
                            {this.state.isInEditMode ? "" : <Button onClick={this.changeEditMode}> Update Profile</Button>}
                        </h1>
                        <h3> {this.state.isInEditMode ? this.renderEditView() : this.renderDefaultView()} </h3>
                    </div>
                </div>
            </div>
        );
    }
}

export default RestaurantProfile;