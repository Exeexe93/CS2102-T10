import React, { Component } from "react";
import { Redirect } from "react-router";
import "../styles/Login.css";
import axios from "axios";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      redirect: false,
      redirectLocation: "/Login",
      errorMessage: "",
    };
    this.handleLogin = this.handleLogin.bind(this);
    this.handleChangeUserName = this.handleChangeUserName.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
  }

  handleLogin(event) {
    event.preventDefault();
    let data = {
      account_id: this.state.username,
      account_pass: this.state.password,
    };
    axios.post("http://localhost:3001/Login", data).then((res) => {
      if (res.data[0] != null) {
        let toRedirect;
        console.log(res.data[0].account_type);
        switch (res.data[0].account_type) {
          case "Customer":
            toRedirect = "/Customer";
            break;
          case "RestaurantStaff":
            toRedirect = "/RestaurantStaffMainPage";
            break;
          case "FTRider":
            toRedirect = "/FTRiderMainPage";
            break;
          case "PTRider":
            toRedirect = "/PTRiderMainPage";
            break;
          case "FDSManager":
            toRedirect = "/FDSManager";
            break;
          default:
            toRedirect = "/Login";
            break;
        }
        this.setState({ redirect: true, redirectLocation: toRedirect });
      } else {
        this.setState({ errorMessage: "Invalid username or password." });
      }
    });
  }

  handleChangeUserName(event) {
    this.setState({ username: event.target.value });
  }

  handleChangePassword(event) {
    this.setState({ password: event.target.value });
  }

  handleSignUp() {
    this.setState({ redirect: true, redirectLocation: "/Signup" });
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={{
        pathname: this.state.redirectLocation,
        state: {accountid : this.state.username}
      }} />;
    }
    return (
      <div className="login-form">
        <h1>Login</h1>
        <form onSubmit={this.handleLogin}>
          <input
            type="text"
            name="username"
            value={this.state.username}
            onChange={this.handleChangeUserName}
            placeholder="Username"
            required
          />
          <input
            type="password"
            name="password"
            value={this.state.password}
            onChange={this.handleChangePassword}
            placeholder="Password"
            required
          />
          {this.state.errorMessage && (
            <h5 className="text-danger"> {this.state.errorMessage} </h5>
          )}
          <input type="submit" value="Submit" />
          <span>
            Don't have an account? Sign up{" "}
            <button onClick={this.handleSignUp}>here</button>
          </span>
        </form>
      </div>
    );
  }
}

export default Login;
