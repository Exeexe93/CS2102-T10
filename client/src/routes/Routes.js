import React from 'react';
import App from '../App';
import CustomerMainPage from '../components/CustomerMainPage';
import RestaurantStaffMainPage from "../components/RestaurantStaffMainPage";
import Login from '../components/Login';
import { Switch, Route } from 'react-router-dom';
import RestaurantSummaryPage from "../components/RestaurantSummaryPage";

class Routes extends React.Component {
    render() {
        return (
            <Switch>
                <Route exact path="/" component={App}/>
                <Route exact path="/CustomerMainPage" component={CustomerMainPage}/>
                <Route exact path="/RestaurantStaffMainPage" component={RestaurantStaffMainPage}/>
                <Route exact path="/RestaurantSummaryPage" component={RestaurantSummaryPage}/>
                <Route exact path="/Login" component={Login}/>
            </Switch>
        )
    }
}
 export default Routes;