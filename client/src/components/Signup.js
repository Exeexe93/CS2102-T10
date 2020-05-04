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
      name: "",
      password: "",
      confirmPassword: "",
      accountType: null,
      dropdownOpen: false,
      dropDownValue: "Select Account Type ",
      dropdownRestaurantListOpen: false,
      dropdownRestaurantListValue: "Select Restaurant ",
      isSamePassword: true,
      restaurantList: [],
      chosenRestaurantId: null,
      isValidAccountId: true,
      promptChooseRestaurant: false,
    };
  }

  getRestaurants = () => {
    fetch("http://localhost:3001/Signup/getRestaurants")
      .then((res) => {
        return res
          ? res.json()
          : [{ rname: "No restaurants are currently hiring", rest_id: null }];
      })
      .then((res) => {
        this.setState({
          restaurantList: res,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  checkAccountId = () => {
    return fetch("http://localhost:3001/Signup/checkAvailableAccountId", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ account_id: this.state.accountId }),
    })
      .then((res) => {
        return res ? res.json() : [{ is_account_id_available: false }];
      })
      .catch((err) => {
        console.log(err);
      });
  };

  createAccount = (
    account_id,
    name,
    account_password,
    account_type,
    selected_restaurant_id = null
  ) => {
    fetch("http://localhost:3001/Signup/createAccount", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        account_id: account_id,
        name: name,
        account_password: account_password,
        account_type: account_type,
        selected_restaurant_id: selected_restaurant_id,
      }),
    });
  };

  navigateToLoginPage = () => {
    this.props.history.push({
      pathname: "/Login",
    });
  };

  handleHomeNavigation = () => {
    this.props.history.push({
      pathname: "/",
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;
    const isSamePassword = password === confirmPassword;
    this.checkAccountId().then((res) => {
      const isValidAccountId = res[0].is_account_id_available;
      // Check for valid account id (available for creation)
      if (isValidAccountId) {
        const hasAccountType = this.state.accountType !== null;
        if (isSamePassword && hasAccountType) {
          this.createAccountType();
          // Redirect to login page
          this.navigateToLoginPage();
        } else {
          this.setState({
            isValidAccountId: isValidAccountId,
            isSamePassword: isSamePassword,
          });
        }
      } else {
        this.setState({ isValidAccountId: false });
      }
    });
  };

  createAccountType = () => {
    const hasSelectedRestaurant = this.state.chosenRestaurantId !== null;
    switch (this.state.accountType) {
      case "RestaurantStaff":
        if (hasSelectedRestaurant) {
          this.createAccount(
            this.state.accountId,
            this.state.name,
            this.state.password,
            this.state.accountType,
            this.state.chosenRestaurantId
          );
        } else {
          this.setState({ promptChooseRestaurant: true });
        }
        break;
      case "Customer":
      case "FTRider":
      case "PTRider":
      case "FDSManager":
        this.createAccount(
          this.state.accountId,
          this.state.name,
          this.state.password,
          this.state.accountType
        );
        break;
      default:
        break;
    }
  };

  handleSelectAccountType = (e) => {
    let type = e.currentTarget.textContent;
    switch (type) {
      case "Customer":
        type = "Customer";
        break;
      case "Restaurant Staff":
        type = "RestaurantStaff";
        break;
      case "Full Time Rider":
        type = "FTRider";
        break;
      case "Part Time Rider":
        type = "PTRider";
        break;
      case "Manager":
        type = "FDSManager";
        break;
      default:
        break;
    }
    this.setState({
      dropDownValue: "Account Type: " + type + " ",
      accountType: type,
    });
  };

  handleSelectRestaurant = (e) => {
    const restaurant = e.currentTarget.textContent;
    const restaurantId = e.target.value;

    this.setState({
      chosenRestaurantId: restaurantId,
      dropdownRestaurantListValue: "Working at Restaurant: " + restaurant + " ",
    });
  };

  handleChangeName = (e) => {
    this.setState({ name: e.target.value });
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

  toggleRestaurantDropdown = () => {
    this.setState({
      dropdownRestaurantListOpen: !this.state.dropdownRestaurantListOpen,
    });
  };

  componentDidMount() {
    this.getRestaurants();
  }

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

            <div className="signup-field">
              <label>Account ID</label>
              <input
                type="text"
                name="accountId"
                value={this.state.accountId}
                onChange={this.handleChangeAccountId}
                required
              ></input>
            </div>

            <div className="signup-field">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={this.state.name}
                onChange={this.handleChangeName}
                required
              ></input>
            </div>

            <div className="signup-field">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={this.state.password}
                onChange={this.handleChangePassword}
                required
              ></input>
            </div>

            <div className="signup-field">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={this.state.confirmPassword}
                onChange={this.handleChangeConfirmPassword}
                required
              ></input>
            </div>

            <div>
              {this.state.accountType === "RestaurantStaff" && (
                <div>
                  <Dropdown
                    direction="right"
                    isOpen={this.state.dropdownRestaurantListOpen}
                    toggle={this.toggleRestaurantDropdown}
                  >
                    <DropdownToggle caret>
                      {this.state.dropdownRestaurantListValue}>
                    </DropdownToggle>
                    <DropdownMenu>
                      {this.state.restaurantList.map((restaurant, index) => {
                        return (
                          <DropdownItem
                            key={index}
                            value={restaurant.rest_id}
                            onClick={this.handleSelectRestaurant}
                          >
                            {restaurant.rname}
                          </DropdownItem>
                        );
                      })}
                    </DropdownMenu>
                  </Dropdown>
                </div>
              )}
            </div>

            {this.state.promptChooseRestaurant &&
              this.state.accountType === "RestaurantStaff" && (
                <p className="invalid-field">
                  Please choose a restaurant to work at!
                </p>
              )}

            {!this.state.isSamePassword && (
              <p className="invalid-field">
                Your password and confirmation password do not match.
              </p>
            )}

            {!this.state.isValidAccountId && (
              <p className="invalid-field">Your account id is not available.</p>
            )}
            <button>Submit</button>
          </Form>
        </div>
      </div>
    );
  }
}

export default Signup;
