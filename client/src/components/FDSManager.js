import React, { Component } from 'react';
import { Link } from "react-router-dom";
import '../styles/FDSManager.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import {
    Navbar,
    NavbarBrand,
    Col, 
    Jumbotron,
    Row
} from 'reactstrap';

class FDSManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // Change to the FDSManager name here
            FDSManagerName: "Mr Eng"
        }


    }
    render() {
        console.log("hi from fdsmanager");
        return (
            <Tabs className='centered'>
                <Navbar dark color="dark">
                    <NavbarBrand href="/FDSManager">FDSManager</NavbarBrand>
                </Navbar>
                <Row>
                    <Col>
                        <Jumbotron>
                            <h1 className="display-3">Welcome { this.state.FDSManagerName }</h1>
                            <p className="lead">You can view all the stats below, Have fun working!</p>
                        </Jumbotron>
                    </Col>
                </Row>
                <TabList id="tabs" defaultIndex={1} onSelect={index => console.log(index)}>
                    <Tab eventKey="customers">Customers</Tab>
                    <Tab eventKey="riders" title="Riders">Riders</Tab>
                </TabList>
                <TabPanel>Text for Customers</TabPanel>
                <TabPanel>Text for Riders</TabPanel>
            </Tabs>

        );
    }

}

export default FDSManager;