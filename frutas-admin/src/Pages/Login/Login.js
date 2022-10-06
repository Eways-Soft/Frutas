import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import styles from "./Login.module.css";

import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import config from "../../config";

const Login = () => {
  const { register, handleSubmit, errors } = useForm();
  const [message, setMessage] = useState();
  const history = useHistory();

  const onSubmit = (data, e) => {
    setMessage({
      data: "Login is in progress...",
      type: "alert-warning",
    });
    fetch(`${config.baseUrl}/admin/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then(({ error, data,role_master,role_settings,roles_menu }) => {
        
        if (data) {
          if (error) {
            setMessage({
              data: error || error,
              type: error ? "alert-danger" : "alert-success",
            });
          }else{
            setMessage({
              data: error || "Logged in successfully, redirecting...",
              type: error ? "alert-danger" : "alert-success",
            });

            localStorage.setItem("token", data[0].id);
            localStorage.setItem("USER_ID", data[0].id);
            
            localStorage.setItem("role_master", JSON.stringify(role_master[0]));
            localStorage.setItem("role_settings", JSON.stringify(role_settings));
            localStorage.setItem("roles_menu", JSON.stringify(roles_menu));
            history.push("/dashboard");
          }
            
        }else{
          setMessage({
            data: error || "Login fail.",
            type: error ? "alert-danger" : "alert-danger",
          });
        }
        

        /*!error &&
          setTimeout(() => {
            localStorage.setItem("token", data.token);
            history.push("/dashboard");
          }, 3000);

        !error && e.target.reset();*/
      });
  };

  return (
    <div
      className={`${styles.container} container-fluid d-flex align-items-center justify-content-center p-0`}
    >
      <div className={styles.loginFormContainer}>
        {message && (
          <div
            className={`alert fade show d-flex w-25 m-auto mb-1 ${message.type}`}
            role="alert"
          >
            {message.data}
            <span
              aria-hidden="true"
              className="ml-auto cursor-pointer"
              onClick={() => setMessage(null)}
            >
              &times;
            </span>
          </div>
        )}
        <fieldset className="d-flex justify-content-center">
        <div className="col-md-3 p-0">
        <div className="card m-0">
          <div className="card-header">
          <h3 className="card-title">
            Login
          </h3>
          </div>
          <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
            <div className="form-group mb-2">
              <label className="form-label col-form-label m-0 d-inline-block w-auto" htmlFor="inputForEmail">Username</label>
              <span className="mandatory">*</span>
              <input
                id="inputForEmail"
                name="username"
                type="email"
                className="form-control"
                aria-describedby="Enter email address"
                placeholder=""
                ref={register({
                  required: {
                    value: true,
                    message: "Please enter your username",
                  },
                })}
              />
              {/**
               * we provide validation configuration for username field above
               * error message are displayed with code below
               */}
              {errors.username && (
                <span className={`${styles.errorMessage} mandatory`}>
                  {errors.username.message}
                </span>
              )}
            </div>
            <div className="form-group">
              <label className="form-label col-form-label m-0 d-inline-block w-auto" htmlFor="inputForPassword">Password</label>
              <span className="mandatory">*</span>
              <input
                type="password"
                name="password"
                className="form-control"
                id="inputForPassword"
                placeholder=""
                ref={register({
                  required: {
                    value: true,
                    message: "Please enter password",
                  },
                })}
              />
              {errors.password && (
                <span className={`${styles.errorMessage} mandatory`}>
                  {errors.password.message}
                </span>
              )}
            </div>
            <div className="form-footer text-center mt-3">
              <button type="submit" className="btn btn-primary theme_button">
                Login
              </button>

              
            </div>
          </form>
          </div>
          </div>
          </div>
        </fieldset>
      </div>
    </div>
  );
};

export default Login;
