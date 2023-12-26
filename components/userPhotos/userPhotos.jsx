import React, { Children } from "react";

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
      isLikedUsers: [],
      likedCount: [],
    };
  }

  componentDidMount() {
    let id = this.props.match.params.userId;
    axios
      .get(`/photosOfUser/${id}`)
      .then((response) => {
        let userPhotos = response["data"];
        console.log("USER PHOTOS: ", userPhotos);
        this.setState({ userPhotos: userPhotos });
        this.isLikedUser(userPhotos);
        this.setLikedCount(userPhotos);
      })

      .catch((e) => {
        console.log(e);
      });
  }

  tapLike(photo_id, index) {
    console.log(photo_id);
    axios
      .post(`/likePhoto`, { photo_id: photo_id })
      .then((response) => {
        console.log(response.data.result.likedUsers);
        alert("SUCCESSFULLY LIKED!");
        let temp = this.state.isLikedUsers;
        temp[index] = true;
        this.setState({ isLikedUsers: temp });

        let tempLike = this.state.likedCount;
        tempLike[index]++;
        this.setState({ likedCount: tempLike });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  tapUnlike(photo_id, index) {
    console.log(photo_id);
    axios
      .post(`/unlikePhoto`, { photo_id: photo_id })
      .then((response) => {
        console.log(response.data);
        alert("SUCCESSFULLY UNLIKED!");
        let temp = this.state.isLikedUsers;
        temp[index] = false;
        this.setState({ isLikedUsers: temp });

        let tempLike = this.state.likedCount;
        tempLike[index]--;
        this.setState({ likedCount: tempLike });
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

  setLikedCount(userPhotos) {
    let temp = [];
    for (let i = 0; i < userPhotos.length; i++) {
      if (userPhotos[i].likedUsers) {
        let counter = 0;
        for (let j = 0; j < userPhotos[i].likedUsers.length; j++) {
          counter++;
        }
        temp.push(counter);
      }
    }

    this.setState({ likedCount: temp });
  }

  isLikedUser(userPhotos) {
    let temp = [];
    for (let i = 0; i < userPhotos.length; i++) {
      let isLiked = false;
      if (userPhotos[i].likedUsers) {
        for (let j = 0; j < userPhotos[i].likedUsers.length; j++) {
          if (Cookies.get("userId") === userPhotos[i].likedUsers[j]) {
            isLiked = true;
          }
        }
      }

      if (isLiked) {
        temp.push(true);
      } else {
        temp.push(false);
      }
    }

    console.log("LIKED USERS: ", temp);
    this.setState({ isLikedUsers: temp });
  }

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

                {this.state.isLikedUsers[index] ? (
                  <button
                    className="likeButton"
                    onClick={(e) => this.tapUnlike(val._id, index)}
                  >
                    Unlike
                  </button>
                ) : (
                  <button
                    className="likeButton"
                    onClick={(e) => this.tapLike(val._id, index)}
                  >
                    Like
                  </button>
                )}

                <p className="likeCount">
                  Like count: {this.state.likedCount[index]}
                </p>
              </div>
            </div>
          ))}
        </div>
      );
    }
  }
}
export default UserPhotos;
