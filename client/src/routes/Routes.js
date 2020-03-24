import React from 'react';
import { Switch, Route } from 'react-router-dom';
import App from '../App';
import Login from '../components/Login';
import CustomerMainPage from '../components/CustomerMainPage';
import FDSManager from '../components/FDSManager';
import { Switch, Route } from 'react-router-dom';


class Routes extends React.Component {
    render() {
        return (
            <Switch>
                <Route exact path="/" component={App}/>
                <Route exact path="/CustomerMainPage" component={CustomerMainPage}/>
                <Route exact path="/Login" component={Login}/>
                <Route exact path="/FDSManager" component={FDSManager}/>
            </Switch>
        )
    }
}
 export default Routes;