import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "Simple Country Application",
      countries: [],
    };
  }

  componentDidMount() {
    console.log("Component has mounted");
  }

  addCountry(event) {
    event.preventDefault();
    let data = {
      country_name: this.refs.country_name.value,
      continent_name: this.refs.continent_name.value,
      eid: Math.random().toFixed(3),
    };
    var request = new Request("http://localhost:3001/api/new-country", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    });

    // xmlhttprequest()

    fetch(request)
      .then(function (response) {
        return response.json();
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  render() {
    let title = this.state.title;
    return (
      <div className="App">
        <h1>{title}</h1>

        <form ref="countryForm">
          <input type="text" ref="country_name" placeholder="country_name" />
          <input
            type="text"
            ref="continent_name"
            placeholder="continent name"
          />
          <button onClick={this.addCountry.bind(this)}>Add Country</button>
        </form>
        <div className="menu">
          <Link to="/Customer">Customer</Link>
          <br />
          <Link to="/RestaurantStaffMainPage">RestaurantStaffPage</Link>
          <br />
          <Link to="/Login">Login</Link>
          <br />
          <Link to="/FDSManager">FDSManager</Link>
        </div>
      </div>
    );
  }
}

export default App;
