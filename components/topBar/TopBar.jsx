import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import "./TopBar.css";
import { withRouter } from "react-router-dom/cjs/react-router-dom.min.js";
import axios from "axios";
import { Link } from "react-router-dom/cjs/react-router-dom";
import Cookies from "js-cookie";

class TopBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      appBarTitle: "",
      version: "",
    };
  }

  componentDidMount() {
    axios
      .get(`/test/info`)
      .then((response) => {
        let data = response["data"].version;
        console.log(data);
        this.setState({ version: data });
      })
      .catch((e) => {
        console.log(e);
      });
  }
  logout() {
    Cookies.remove("userId");
    Cookies.remove("userName");
    Cookies.remove("userCookie");

    window.alert("SUCCESSFULLY LOGGED OUT!!!");
  }

  render() {
    let hash = window.location.hash;

    if (hash === "#/") {
      this.state.appBarTitle = Cookies.get("userName")
        ? "Hi" + " " + Cookies.get("userName")
        : "Please login";
    } else if (hash.includes("users")) {
      this.state.appBarTitle = Cookies.get("userName")
        ? this.props.title
        : "Please login";
    } else if (hash.includes("photos")) {
      this.state.appBarTitle = Cookies.get("userName")
        ? `Photos of ${this.props.title}`
        : "Please Login";
    }

    return (
      <AppBar className="cs142-topbar-appBar" position="absolute">
        <Toolbar className="topBar">
          <Typography variant="h5" color="inherit">
            {`Version: ${this.state.version}`}
          </Typography>
          <Typography variant="h5" color="inherit">
            {this.state.appBarTitle}
          </Typography>
          <Typography variant="h5" color="ix`herit">
            {Cookies.get("userName") ? (
              <Link
                to="/login"
                onClick={() => this.logout()}
                className="loginButton"
              >
                Logout
              </Link>
            ) : (
              <Link to="/login" className="loginButton">
                Login
              </Link>
            )}
          </Typography>
        </Toolbar>
      </AppBar>
    );
  }
}

export default withRouter(TopBar);
