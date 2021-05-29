import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";

import home from "./pages/home";
import signin from "./pages/signin";
import register from "./pages/register";
import profile from "./pages/profile";
import newpost from "./pages/newpost";
import { Auth } from "./context";

export default class App extends Component {

  static contextType = Auth;

  render() {

    let {isLoggedIn, uid} = this.context;

    return(
        <Router>
          <Switch>
            <Route exact path="/" component={home} />
            <Route exact path="/home" component={home} />
            <Route path="/signin" component={signin}/>
            <Route path="/register" component={register}/>
            <Route exact path="/profile" component={profile}/>
            <Route exact path="/profile/:uid" component={profile}/>
            <Route exact path="/profile/undefined" >
              <Redirect to="/signin" />
            </Route>
            <Route path="/newpost" component={newpost}/>
          </Switch>
        </Router>
    );
  }
}
