import React from 'react';
import { Switch, Route } from 'react-router-dom';
import App from '../App';
import Login from '../components/Login';
import CustomerMainPage from '../components/CustomerMainPage';

class Routes extends React.Component {
    render() {
        return (
            <Switch>
                <Route exact path="/" component={App}/>
                <Route exact path="/CustomerMainPage" component={CustomerMainPage}/>
                <Route exact path="/Login" component={Login}/>
            </Switch>
        )
    }
}
 export default Routes;