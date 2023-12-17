import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route, Switch } from "react-router-dom";
import "./styles/main.css";
import Login from "./components/LoginRegister/Login";
import Register from "./components/LoginRegister/Register";
import Home from "./components/Home";

class PhotoShare extends React.Component {
  render() {
    return (
      <HashRouter>
        <Switch>
          <Route
            exact={true}
            path="/login"
            component={(props) => <Login {...props} />}
          />
          <Route
            path="/register"
            component={(props) => <Register {...props} />}
          />
          <Route path="/" component={(props) => <Home {...props} />} />
        </Switch>
      </HashRouter>
    );
  }
}

ReactDOM.render(<PhotoShare />, document.getElementById("photoshareapp"));
