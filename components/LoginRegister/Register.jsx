import React, { useState } from "react";
import "./LoginRegister.css";
import axios from "axios";
import { Link, useHistory } from "react-router-dom/cjs/react-router-dom.min";

export default function Register() {
  const history = useHistory();
  const [data, setData] = useState({
    loginName: "",
    password: "",
    fname: "",
    lname: "",
    location: "",
    description: "",
    occupation: "",
  });
  const handleInput = (name, value) => {
    setData((values) => ({ ...values, [name]: value }));
    console.log("data", data);
  };

  const submit = async (e) => {
    e.preventDefault();
    console.log("submit");
    try {
      const response = await axios.post("/admin/register", data);
      console.log("response", response);
      if (response.status === 200) {
        history.push("/login");
        alert("SUCCESSFULLY REGISTERED!!!");
      }
    } catch (e) {
      alert(e.response.data);
    }
  };
  return (
    <div className="login-container">
      <div className="box-container">
        <p className="title">Please register</p>

        <div className="form">
          <form>
            <div className="input-container">
              <label>Login name </label>
              <input
                onChange={(e) => handleInput(e.target.name, e.target.value)}
                type="text"
                name="loginName"
                required
              />
            </div>

            <div className="input-container">
              <label>Password </label>
              <input
                onChange={(e) => handleInput(e.target.name, e.target.value)}
                type="password"
                name="password"
                required
              />
            </div>

            <div className="input-container">
              <label>First name </label>
              <input
                onChange={(e) => handleInput(e.target.name, e.target.value)}
                type="text"
                name="fname"
                required
              />
            </div>
            <div className="input-container">
              <label>Last name </label>
              <input
                onChange={(e) => handleInput(e.target.name, e.target.value)}
                type="text"
                name="lname"
                required
              />
            </div>
            <div className="input-container">
              <label>Location </label>
              <input
                onChange={(e) => handleInput(e.target.name, e.target.value)}
                type="text"
                name="location"
                required
              />
            </div>

            <div className="input-container">
              <label>Description </label>
              <input
                onChange={(e) => handleInput(e.target.name, e.target.value)}
                type="text"
                name="description"
                required
              />
            </div>
            <div className="input-container">
              <label>Occupation </label>
              <input
                onChange={(e) => handleInput(e.target.name, e.target.value)}
                type="text"
                name="occupation"
                required
              />
            </div>

            <div className="button-container">
              <input onClick={(e) => submit(e)} type="submit" />
            </div>
            <Link className="changer" to="/login">
              Have an account? Login
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
