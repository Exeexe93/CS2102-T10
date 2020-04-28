import React, { Component } from "react";
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavLink,
  Form,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import "../styles/Signup.css";
import { MdHome } from "react-icons/md";

class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      accountId: "",
      password: "",
      confirmPassword: "",
      accountType: null,
      dropdownOpen: false,
      dropDownValue: "Select Account Type ",
      isSamePassword: true,
    };
  }

  handleHomeNavigation = () => {
    this.props.history.push({
      pathname: "/",
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;
    this.setState({
      isSamePassword: password === confirmPassword,
    });
    console.log(e.target.accountId.value);
    console.log(e.target.password.value);
    console.log(e.target.confirmPassword.value);
  };

  handleSelectAccountType = (e) => {
    const type = e.currentTarget.textContent;
    this.setState({
      dropDownValue: "Account Type: " + type,
      accountType: type,
    });
  };

  handleChangeAccountId = (e) => {
    this.setState({ accountId: e.target.value });
  };

  handleChangePassword = (e) => {
    this.setState({ password: e.target.value });
  };

  handleChangeConfirmPassword = (e) => {
    this.setState({ confirmPassword: e.target.value });
  };

  toggle = () => {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
    });
  };

  render() {
    return (
      <div className="signup-container">
        <Navbar className="navbar" color="dark" dark>
          <NavbarBrand href="/">Signup</NavbarBrand>
          <Nav className="mr-auto">
            <NavLink
              href=""
              onClick={this.handleHomeNavigation}
              className="link"
            >
              <MdHome />
              <span> Home</span>
            </NavLink>
          </Nav>
        </Navbar>

        <h2 className="signup-title">Create an account</h2>

        <div className="signup-form-container" onSubmit={this.handleSubmit}>
          <Form className="signup-form">
            <div>
              <Dropdown
                direction="right"
                isOpen={this.state.dropdownOpen}
                toggle={this.toggle}
              >
                <DropdownToggle caret>
                  {this.state.dropDownValue}
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem onClick={this.handleSelectAccountType}>
                    Customer
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem onClick={this.handleSelectAccountType}>
                    Full Time Rider
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem onClick={this.handleSelectAccountType}>
                    Part Time Rider
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem onClick={this.handleSelectAccountType}>
                    Manager
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem onClick={this.handleSelectAccountType}>
                    Restaurant Staff
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>

            <div>
              <label>Account ID</label>
              <input
                type="text"
                name="accountId"
                value={this.state.accountId}
                onChange={this.handleChangeAccountId}
                required
              ></input>
            </div>

            <div>
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={this.state.password}
                onChange={this.handleChangePassword}
                required
              ></input>
            </div>

            <div>
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={this.state.confirmPassword}
                onChange={this.handleChangeConfirmPassword}
                required
              ></input>
            </div>
            {!this.state.isSamePassword && (
              <p>Your password and confirmation password do not match.</p>
            )}
            <button>Submit</button>
          </Form>
        </div>
      </div>
    );
  }
}

export default Signup;
