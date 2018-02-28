import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Main } from "./Main";
import { Login } from "./Login";
import { Register } from "./Register";
import { Profile } from "./Profile";
import { NotFound } from "./NotFound";

export const Routes = () => {
    return (
        <Switch>
            <Route exact path="/" component={Main}/>
            <Route exact path="/login" component={Login}/>
            <Route exact path="/register" component={Register}/>
            <Route exact path="/profile" component={Profile}/>
            <Route component={NotFound}/>
        </Switch>
    );
};
