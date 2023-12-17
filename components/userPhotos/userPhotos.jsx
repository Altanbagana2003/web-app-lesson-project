import React from "react";

import "./userPhotos.css";
import fetchModel from "../../lib/fetchModelData.js";
import axios from "axios";
import Photo from "../../schema/photo.js";
import Cookies from "js-cookie";

class UserPhotos extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userPhotos: [],
      userName: "",
      comment: "",
      newComment: [],
    };
  }

  componentDidMount() {
    let id = this.props.match.params.userId;
    axios
      .get(`/photosOfUser/${id}`)
      .then((response) => {
        let userPhotos = response["data"];
        this.setState({ userPhotos: userPhotos });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  getComment = (index) => {
    let data = this.state.userPhotos;
    const arr = [];

    if (data[index].comments) {
      for (let i in data[index].comments) {
        arr.push(
          <p className="comment" key={i}>
            {`${data[index].comments[i]["user"]["first_name"]} ${data[index].comments[i]["user"]["last_name"]}`}
            :{" "}
            <span style={{ fontWeight: "normal" }}>
              {data[index].comments[i].comment}
            </span>
            <span style={{ marginLeft: 20, color: "green" }}>
              {data[index].comments[i].date_time}
            </span>
          </p>
        );
      }
    }

    return arr;
  };

  handleInput = (name, value) => {
    console.log("NAME: ", name);
    console.log("VALUE: ", value);
    this.setState({ comment: value });
  };

  submit = async (e, val) => {
    console.log("submit");

    console.log("COMMENT: ", this.state.comment);

    console.log("USERID: ", val.user_id);
    console.log("PHOTO ID: ", val._id);
    console.log("MY Name: ", Cookies.get("userName"));
    console.log("MY ID: ", Cookies.get("userId"));

    try {
      const response = await axios.post(`/commentsOfPhoto/${val._id}`, {
        comment: this.state.comment,
      });

      console.log(response);
    } catch (e) {
      alert(e.response.data);
    }
  };

  render() {
    if (!Cookies.get("userName")) {
      return <h1>Please login</h1>;
    } else {
      return (
        <div>
          {this.state.userPhotos.map((val, index) => (
            <div className="container" key={val._id}>
              <img src={`${val.file_name}`} alt="logo" />
              <div className="comments">{this.getComment(index)}</div>
              <div className="commentContainer">
                <form>
                  <label>
                    Write a comment:
                    <input
                      id="commentInput"
                      type="text"
                      name="comment"
                      onChange={(e) =>
                        this.handleInput(e.target.name + index, e.target.value)
                      }
                    />
                  </label>
                  <input
                    id="commentButton"
                    type="submit"
                    value="Send"
                    onClick={(e) => this.submit(e, val)}
                  />
                </form>
              </div>
            </div>
          ))}
        </div>
      );
    }
  }
}
export default UserPhotos;
