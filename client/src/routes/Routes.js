import React from 'react';
import App from '../App';
import CustomerMainPage from '../components/CustomerMainPage';
import Login from '../components/Login';
import { Switch, Route } from 'react-router-dom';

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