import React, { useState } from "react";
import "./LoginRegister.css";
import axios from "axios";
import { Link, useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Cookies from "js-cookie";

export default function Login() {
  const history = useHistory();

  const [data, setData] = useState({
    username: "",
    password: "",
  });
  const handleInput = (name, value) => {
    setData((values) => ({ ...values, [name]: value }));
    console.log("data", data);
  };

  const submit = async (e) => {
    e.preventDefault();
    console.log("submit");

    try {
      const response = await axios.post("/admin/login", data);
      console.log("response", response);
      if (response.status === 200) {
        Cookies.set("userName", response.data.userName);
        Cookies.set("userId", response.data.userId);
        history.push("/");
        alert("SUCCESSFULLY LOGGED IN!!!");
      }
    } catch (e) {
      alert(e.response.data);
    }
  };

  return (
    <div className="login-container">
      <div className="box-container">
        <p className="title">Please login</p>

        <div className="form">
          <form>
            <div className="input-container">
              <label>Username </label>
              <input
                onChange={(e) => handleInput(e.target.name, e.target.value)}
                type="text"
                name="username"
                required
              />
              {/* {renderErrorMessage("uname")} */}
            </div>
            <div className="input-container">
              <label>Password </label>
              <input
                onChange={(e) => handleInput(e.target.name, e.target.value)}
                type="password"
                name="password"
                required
              />
              {/* {renderErrorMessage("pass")} */}
            </div>
            <div className="button-container">
              <input onClick={(e) => submit(e)} type="submit" />
            </div>
            <Link className="changer" to="/register">
              Don't have an account? Register
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
