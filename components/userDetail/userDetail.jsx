import React from "react";
import { Typography, Button } from "@mui/material";
import { HashRouter, Route, Switch, Link } from "react-router-dom";
import "./userDetail.css";
import fetchModel from "../../lib/fetchModelData.js";
import axios from "axios";
import Cookies from "js-cookie";

class UserDetail extends React.Component {
  constructor(props) {
    super(props);

    this.state = { user: {}, selectedImage: {} };
  }

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate() {
    this.fetchData();
  }

  fetchData() {
    let id = this.props.match.params.userId;

    axios
      .get(`/user/${id}`)
      .then((response) => {
        let user = response["data"];
        this.setState({ user: user });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  render() {
    if (!Cookies.get("userName")) {
      return <h1>Please login</h1>;
    } else {
      return (
        <div className="container">
          <div className="subContainer">
            <Typography variant="h2">Name:</Typography>
            <Typography variant="h1">
              {this.state.user.first_name} {this.state.user.last_name}
            </Typography>
          </div>
          <br />
          <div className="subContainer">
            <Typography variant="h2">Location:</Typography>
            <Typography variant="h1">{this.state.user.location}</Typography>
          </div>
          <br />
          <div className="subContainer">
            <Typography variant="h2">Description:</Typography>
            <Typography variant="h1">{this.state.user.description}</Typography>
          </div>
          <br />
          <div className="subContainer">
            <Typography variant="h2">Occupation:</Typography>
            <Typography variant="h1">{this.state.user.occupation}</Typography>
          </div>
          <br />
          <Link to={`/photos/${this.state.user._id}`}>
            <button
              onClick={() => {
                this.props.callback(
                  `${this.state.user.first_name} ${this.state.user.last_name}`
                );
              }}
              className="button"
            >
              Photos
            </button>
          </Link>
        </div>
      );
    }
  }
}

export default UserDetail;
