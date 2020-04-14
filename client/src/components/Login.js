import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "../styles/Login.css";

class Login extends Component {
  handleLogin = () => {
    let data = {
      account_id: this.refs.id.value,
      account_pass: this.refs.password.value
    };
    var request = new Request("http://localhost:3001/api/Login", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(data)
    });

    fetch(request)
      .then(function(response) {
        console.log(response.json());
      })
      .catch(function(err) {
        console.log(err);
      });
  };

  render() {
    return (
      <div class="login-form">
        <h1>Login</h1>
        <form action="auth" method="POST">
          <input
            type="text"
            name="username"
            ref="id"
            placeholder="Username"
            required
          />
          <input
            type="password"
            name="password"
            ref="password"
            placeholder="Password"
            required
          />
          <input
            type="submit"
            value="LOGIN"
            onClick={this.handleLogin.bind(this)}
          />
          <span>
            Don't have an account?
            <Link to="/"> Sign up here</Link>
          </span>
        </form>
      </div>
    );
  }
}

export default Login;
