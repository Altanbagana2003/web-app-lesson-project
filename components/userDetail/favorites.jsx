import React from "react";
import { Typography, Button } from "@mui/material";
import { HashRouter, Route, Switch, Link } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData.js";
import axios from "axios";
import Cookies from "js-cookie";

class FavoritesScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = { user: {}, favorites: [] };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    let id = Cookies.get("userId");

    axios
      .get(`/user/${id}`)
      .then((response) => {
        let user = response["data"];
        this.setState({ user: user });
        console.log("favorites ", user.favorites);
        this.setState({ favorites: user.favorites });
        this.getPhotoData(user.favorites[0]);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  getPhotoData(id) {
    axios
      .get(`/photosOfUser/${id}`)
      .then((response) => {
        let userPhotos = response["data"];
        console.log("USER PHOTOS: ", userPhotos);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  render() {
    return (
      <div>
        {this.state.favorites.map((val, index) => (
          <div key={index}>
            {val}
            <img src={`${val}`} alt="logo" />
          </div>
        ))}
      </div>
    );
  }
}

export default FavoritesScreen;
