import React, { Component } from "react";
import "../styles/CustomerMainPage.css";
import { GiShoppingCart } from "react-icons/gi";
import { Link } from "react-router-dom";
import { MdPerson } from "react-icons/md";

class CustomerMainPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            restaurantList: [
                "Restaurant 1",
                "Restaurant 2",
                "Restaurant 3"
            ],
            filtered: []
        }

        this.handleChange.bind(this);
    }

    handleChange(e) {
        let newList = [];
        let currentList = this.state.restaurantList;

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
            <div className="content" >
                <div className="container">
                    <div className="searchContainer">
                        <input type="text" className="input" onChange={(e)=> this.handleChange(e)} placeholder="Search..." />
                        <Link to='/' className="shoppingCart">
                            <GiShoppingCart size='3em' color='black'/>
                        </Link>
                        <Link to='/'>
                            <MdPerson size='3em' color='black'/>
                        </Link>
                    </div>
                    <section className="section">
                        <ul>
                            {this.state.filtered.map(item =>(
                                <ul key={item}><Link to="/">{item}</Link></ul>
                            ))}
                        </ul>
                    </section>
                </div>
            </div>
        );
    }
}

export default CustomerMainPage;