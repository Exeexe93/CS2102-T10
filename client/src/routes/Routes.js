import React from "react";
import App from "../App";
import CustomerMainPage from "../components/CustomerMainPage";
import Schedule from "../components/Schedule";
import Login from "../components/Login";
import { Switch, Route } from "react-router-dom";
import FTRiderMainPage from "../components/FTRiderMainPage";
import PTRiderMainPage from "../components/PTRiderMainPage";

class Routes extends React.Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={App} />
        <Route exact path="/CustomerMainPage" component={CustomerMainPage} />
        <Route exact path="/Login" component={Login} />

        <Route exact path="/FTRiderMainPage" component={FTRiderMainPage} />
        {/* <Route exact path="/FTriderMainPage/salary" component={Salary} /> */}
        <Route exact path="/FTRiderMainPage/schedule" component={Schedule} />

        <Route exact path="/PTRiderMainPage" component={PTRiderMainPage} />
        {/* <Route exact path="/PTriderMainPage/salary" component={Salary} /> */}
        <Route exact path="/PTRiderMainPage/schedule" component={Schedule} />
      </Switch>
    );
  }
}
export default Routes;
