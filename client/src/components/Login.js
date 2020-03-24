import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "../styles/Login.css";

class Login extends Component {
  render() {
    return (
      <div class="login-form">
        <h1>Login</h1>
        <form action="auth" method="POST">
          <input type="text" name="username" placeholder="Username" required />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
          />
          <input type="submit" value="LOGIN" />
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
