import React from "react";
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import axios from "axios";
import { Link } from "react-router-dom";
import "./userList.css";
import Cookies from "js-cookie";
class UserList extends React.Component {
  constructor(props) {
    super(props);

    this.state = { users: [] };
  }

  componentDidMount() {
    axios
      .get("/user/list")
      .then((response) => {
        console.log("response", response);
        let users = response["data"];
        this.setState({ users: users });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      this.setState({ selectedImage: e.target.files[0] });
      console.log("img", this.state.selectedImage);
    }
  };

  submit = async (e) => {
    console.log("yes", this.state.selectedImage);
    const formData = new FormData();
    formData.append("image", this.state.selectedImage);

    axios
      .post(`/photos/new`, formData)
      .then((response) => {
        console.log("response", response);
        alert("SUCCESSFULLY UPLOADED IMAGE!!!");
      })
      .catch((e) => {
        console.log(e);
        alert(e.message);
      });
  };

  render() {
    if (!Cookies.get("userName")) {
      return <h1>EMPTY</h1>;
    } else {
      return (
        <div>
          <List component="nav" aria-label="mailbox folders">
            {this.state.users.map((e) => (
              <Link className="link" to={`/users/${e._id}`} key={e._id}>
                <ListItem
                  button
                  onClick={() => {
                    this.props.callback(`${e.first_name} ${e.last_name}`);
                  }}
                >
                  <ListItemText primary={`${e.first_name} ${e.last_name}`} />
                </ListItem>
              </Link>
            ))}
            <Divider />
          </List>

          <div className="uploadContainer">
            <label>Upload image</label>
            <input
              accept="image/*"
              type="file"
              className="form-control"
              id="uploadInput"
              placeholder="Ads"
              name="image"
              onChange={(e) => this.handleChange(e)}
            />
          </div>
          <button
            id="uploadButton"
            onClick={(e) => this.submit(e)}
            type="button"
            className="btn btn-success"
          >
            Upload
          </button>
        </div>
      );
    }
  }
}

export default UserList;
