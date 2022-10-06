import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import styles from "./Index.css";
import { Link } from "react-router-dom";
import config from "../../config";
import Header from "../includes/Header";
import Footer from "../includes/Footer";

const Addnewuser = () => {
  const { register, handleSubmit, errors } = useForm();
  const [roles, setRoles] = useState([]);
  const [message, setMessage] = useState();
  const [confirm_password_match, setconfirm_password_match] = useState();
  const history = useHistory();

  const [UserRoleSetting, setUserRoleSetting] = useState([]);
  const [ShowSetting, setShowSetting] = useState(false);
  const [AddSetting, setAddSetting] = useState(false);
  const [EditSetting, setEditSetting] = useState(false);
  const [DeleteSetting, setDeleteSetting] = useState(false);

  useEffect(() => {

    var role_master = JSON.parse(window.localStorage.getItem('role_master'));
    var settings = role_master.role_setting_ids.split(',');

    setUserRoleSetting(settings);

    var show = checkMenuesSettings('29');
    if (show) {
      setShowSetting(true)
    }
    var add = checkMenuesSettings('30');
    if (add) {
      setAddSetting(true)
    }
    var edit = checkMenuesSettings('31');
    if (edit) {
      setEditSetting(true)
    }
    var deletes = checkMenuesSettings('32');
    if (deletes) {
      setDeleteSetting(true)
    }

    function checkMenuesSettings(id) {
      var returns = settings.includes(id);
      return returns;
    }

    fetch(`${config.baseUrl}/admin/role/getactiverolemaster`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(({ error, data, CODE }) => {
        if (CODE == 200) {
          setRoles(data)
        } else {
          alert('Fail')
        }
      });

  }, [history]);

  const onSubmit = (data, e) => {
    var password = data.password
    var confirm_password = data.confirm_password

    if (confirm_password == password) {
      setconfirm_password_match('');
      setMessage({
        data: "In progress...",
        type: "alert-warning",
      });
      fetch(`${config.baseUrl}/admin/user/adduser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then(({ error, data, CODE }) => {
          if (CODE == 200) {
            setMessage({
              data: error || "Added successfully",
              type: error ? "alert-danger" : "alert-success",
            });

            e.target.reset();
          } else {
            alert('Fail')
          }

          setTimeout(function () {
            setMessage('');
          }, 2000)


        });
    } else {
      setconfirm_password_match('Confirm Password does not match with password');
    }

  };

  return (
    <>
      <Header />

      <form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">

      <span className="blank_space d-flex align-items-center">
        <h2></h2>

        <button type="submit" className="nav-link btn btn-primary ml-auto theme_button top_fixed_buton">Create</button>

        <Link to='/users' className="nav-link btn btn-primary theme_button top_fixed_buton nav-back">Back</Link>

      </span>

      {AddSetting &&

        <div className="middle_content rolelist col-md-4 mt-2 mb-4">
          <div className="content">

            <div className="container-xl">
              <div className="card">
                <div className={styles.loginFormContainer}>
                  
                  <fieldset className="roundProduct rounded">
                    {message && (
                      <div
                        className={`alert alertUsers fade show d-flex ${message.type}`}
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
                    

                    <div className="formProduct">
                      <div className="form-group mb-2">
                        <label htmlFor="inputForEmail">Username</label>
                        <span className="mandatory">*</span>
                        <input
                          id="inputForEmail"
                          name="username"
                          type="username"
                          className="form-control"
                          aria-describedby="Enter username"
                          placeholder=""
                          ref={register({
                            required: {
                              value: true,
                              message: "Please enter username",
                            },
                          })}
                        />
                        
                        {errors.username && (
                          <span className={`${styles.errorMessage} mandatory`}>
                            {errors.username.message}
                          </span>
                        )}
                      </div>
                      <div className="form-group mb-2">
                        <label htmlFor="inputForPassword">Password</label>
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

                      <div className="form-group">
                        <label htmlFor="inputForConfirmPassword">Confirm Password</label>
                        <span className="mandatory">*</span>
                        <input
                          type="password"
                          name="confirm_password"
                          className="form-control"
                          id="inputForConfirmPassword"
                          placeholder=""
                          ref={register({
                            required: {
                              value: true,
                              message: "Please enter confirm password",
                            },
                          })}
                        />
                        {errors.confirm_password && (
                          <span className={`${styles.errorMessage} mandatory`}>
                            {errors.confirm_password.message}
                          </span>
                        )}

                        {confirm_password_match && (
                          <span className={`${styles.errorMessage} mandatory`}>
                            {confirm_password_match}
                          </span>
                        )}
                      </div>

                      <div className="form-group mb-2">
                        <label htmlFor="inputForRole">Role</label>
                        <span className="mandatory">*</span>
                        <select
                          name="role_id"
                          className="form-control"
                          aria-describedby="Enter username"
                          ref={register({
                            required: {
                              value: true,
                              message: "Please select role type",
                            },
                          })}
                        >

                          <option value=''>Select role</option>

                          {roles.map((item) =>
                            <option value={item.role_master_id}>{item.role_menu_name}</option>
                          )}

                        </select>

                        {errors.role && (
                          <span className={`${styles.errorMessage} mandatory`}>
                            {errors.role.message}
                          </span>
                        )}
                      </div>

                      <div className="d-flex align-items-center pt-3">

                      </div>
                    </div>
                    
                  </fieldset>
                </div>

              </div>
            </div>
          </div>
        </div>
      }

      </form>


      <Footer />
    </>
  );
};

export default Addnewuser;
