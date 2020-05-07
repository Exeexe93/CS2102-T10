import React from "react";
import { Switch, Route } from "react-router-dom";
import App from "../App";
import Customer from "../components/Customer";
import RestaurantStaffMainPage from "../components/RestaurantStaffMainPage";
import RestaurantProfile from "../components/RestaurantProfile";
import RestaurantPromotions from "../components/RestaurantPromotions";
import RestaurantSummaryPage from "../components/RestaurantSummaryPage";
import Schedule from "../components/Schedule";
import Salary from "../components/Salary";
import Login from "../components/Login";
import FTRiderMainPage from "../components/FTRiderMainPage";
import PTRiderMainPage from "../components/PTRiderMainPage";
import FDSManager from "../components/FDSManager";
import Profile from "../components/Profile";
import FoodItem from "../components/FoodItem";
import Cart from "../components/Cart";
import Signup from "../components/Signup";

class Routes extends React.Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={App} />
        <Route exact path="/Customer" component={Customer} />
        <Route exact path="/Customer/:handle" component={FoodItem} />
        <Route exact path="/Login" component={Login} />
        <Route exact path="/Profile" component={Profile} />
        <Route exact path="/Cart" component={Cart} />
        <Route exact path="/FDSManager" component={FDSManager} />

        <Route exact path="/RestaurantStaffMainPage" component={RestaurantStaffMainPage} />
        <Route exact path="/RestaurantProfile" component={RestaurantProfile} />
        <Route exact path="/RestaurantPromotions" component={RestaurantPromotions} />
        <Route exact path="/RestaurantSummaryPage" component={RestaurantSummaryPage} />

        <Route exact path="/Signup" component={Signup} />

        <Route exact path="/FTRiderMainPage" component={FTRiderMainPage} />
        <Route exact path="/FTRiderMainPage/schedule" component={Schedule} />

        <Route exact path="/PTRiderMainPage" component={PTRiderMainPage} />
        <Route exact path="/PTRiderMainPage/schedule" component={Schedule} />

        <Route exact path="/Salary" component={Salary} />
      </Switch>
    );
  }
}
export default Routes;
