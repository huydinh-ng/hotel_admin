import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import classes from "./login.module.css";

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: undefined,
    password: undefined,
  });
  const [isErr, setIsErr] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setIsErr(false);
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/login", credentials);
      if (res.data.isAdmin) {
        Cookies.set("access_token", res.data.token, { expires: 1 });
        navigate("/");
      } else {
        setIsErr(true);
      }
    } catch (err) {
      console.log(err);
      setIsErr(true);
    }
  };

  return (
    <div className={classes.login}>
      <h1>Login to Admin App</h1>
      <div className={classes.lContainer}>
        <input
          type="text"
          placeholder="username"
          id="username"
          onChange={handleChange}
          className={classes.lInput}
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          onChange={handleChange}
          className={classes.lInput}
        />
        <button onClick={handleClick} className={classes.lButton}>
          Login
        </button>
        {isErr && (
          <p style={{ color: "red" }}>
            LOGIN_FAILURE! Please check infomation on inputs!
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
