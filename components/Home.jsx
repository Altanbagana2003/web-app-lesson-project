import React, { Component } from "react";
import { Grid, Typography, Paper } from "@mui/material";
import { HashRouter, Route, Switch } from "react-router-dom";
import TopBar from "./topBar/TopBar";
import UserDetail from "./userDetail/userDetail";
import UserList from "./userList/userList";
import UserPhotos from "./userPhotos/userPhotos";
import FavoritesScreen from "./userDetail/favorites";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "",
    };
  }
  callBack = (e) => {
    this.setState({ title: e });
  };

  render() {
    return (
      <div>
        <Grid container spacing={8}>
          <Grid item xs={12}>
            <TopBar title={this.state.title} />
          </Grid>
          <div className="cs142-main-topbar-buffer" />
          <Grid item sm={3}>
            <Paper className="cs142-main-grid-item">
              <UserList callback={this.callBack} />
            </Paper>
          </Grid>
          <Grid item sm={9}>
            <Paper className="cs142-main-grid-item">
              <Switch>
                <Route
                  exact
                  path="/"
                  render={() => (
                    <Typography variant="body1">
                      Welcome to your photosharing app! This{" "}
                      <a href="https://mui.com/components/paper/">Paper</a>{" "}
                      component displays the main content of the application.
                      The {"sm={9}"} prop in the{" "}
                      <a href="https://mui.com/components/grid/">Grid</a> item
                      component makes it responsively display 9/12 of the
                      window. The Switch component enables us to conditionally
                      render different components to this part of the screen.
                      You don&apos;t need to display anything here on the
                      homepage, so you should delete this Route component
                      oncegdsfs you get started. !!!
                    </Typography>
                  )}
                />
                <Route
                  path="/users/:userId"
                  render={(props) => (
                    <UserDetail {...props} callback={this.callBack} />
                  )}
                />
                <Route
                  path="/favorites"
                  render={(props) => <FavoritesScreen {...props} />}
                />
                <Route
                  path="/photos/:userId"
                  render={(props) => <UserPhotos {...props} />}
                />
              </Switch>
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}
