import React, { Component } from "react";
//import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "../styles/login.css";

class CustomerMainPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            restuarantList: [
                "Restuarant 1",
                "Restuarant 2",
                "Restuarant 3"
            ],
            filtered: []
        }

        this.handleChange.bind(this);
    }

    handleChange(e) {
        let newList = [];
        let currentList = this.state.restuarantList;
        
        if (e.target.value !== "") {
            

            newList = currentList.filter(item => {
                const lowercaseItem = item.toLowerCase();
                const filter = e.target.value.toLowerCase();
                return lowercaseItem.includes(filter);
            });
        } else {
            newList = currentList;
        }
        this.setState({
            filtered: newList
        });
    }

    render() {
        return(
            <div className="content">
                <div className="container">
                <input type="text" className="input"  style={{ width: "500px", textAlign: "middle" }} onChange={(e)=> this.handleChange(e)} placeholder="Search..." />
                    <section className="section">
                        <ul>
                            {this.state.filtered.map(item =>(
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                    </section>
                </div>
            </div>
        );
    }
}

export default CustomerMainPage;