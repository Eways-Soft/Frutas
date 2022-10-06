import React, { useEffect, useState, useParams } from "react";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import Select from "react-select";
import styles from "./Index.css";
import { Link } from "react-router-dom";
import config from "../../config";
import Header from "../includes/Header";
import Footer from "../includes/Footer";


export default function Edituser(props) {
  const { register, handleSubmit, errors } = useForm();
  const [UserId, setUserId] = useState();
  const [roles, setRoles] = useState([]);
  const [message, setMessage] = useState();
  const [confirm_password_match, setconfirm_password_match] = useState();
  const [userData, setuserData] = useState();
  const [Username, setUsername] = useState('');
  const [Password, setPassword] = useState();
  const [userStatus, setuserStatus] = useState();
  const [UserRole, setUserRole] = useState();
  const history = useHistory();

  const userid = window.location.href.split('/').reverse()[0];

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

    setUserId(userid);

    fetch(`${config.baseUrl}/admin/role/getactiverolemaster`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then(({ error, data, CODE }) => {
        if (CODE == 200) {
          setRoles(data)
          console.log(data)
        } else {
          alert('Fail')
        }
      });

    var userdatapost = { "userid": userid }

    fetch(`${config.baseUrl}/admin/user/getuser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userdatapost)
    })
      .then((res) => res.json())
      .then(({ error, data, CODE }) => {
        if (CODE == 200) {
          setuserData(data)
          if (data) {
            setUsername(data[0].username)
            setPassword(data[0].password)
            setuserStatus(data[0].status)
            setUserRole(data[0].role_id)
          }
        } else {

        }
      });
  }, [history]);

  const onSubmit = (data, e) => {
    e.preventDefault();
    console.log(data);

    var password = data.password
    var confirm_password = data.confirm_password

    if (confirm_password == password) {
      setMessage({
        data: "In progress...",
        type: "alert-warning",
      });

      let formData = new FormData();
      formData.append('name', 'John');

      var formsdata = { "userid": userid, "role_id": data.role_id, "username": data.username, "password": data.password, "status": data.status }

      fetch(`${config.baseUrl}/admin/user/userupdate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formsdata),
      })
        .then((res) => res.json())
        .then(({ error, data, CODE, userexist }) => {
          if (error) {
            setMessage({
              data: error || error,
              type: error ? "alert-danger" : "alert-success",
            });
          } else {
            if (CODE == 200) {
              setMessage({
                data: error || "Updated successfully",
                type: error ? "alert-danger" : "alert-success",
              });
            } else {
              alert('Fail')
            }
          }

          setTimeout(function () {
            setMessage('');
          }, 2000)


        });
    } else {
      setconfirm_password_match('Confirm Password does not match with password');
    }

  };

  const options = [
    {
      label: "Active",
      value: "1",
    },
    {
      label: "In-Active",
      value: "0",
    },
    {
      label: "Block",
      value: "-1",
    },
  ];

  function onChangeRole(e) {
    var role = e.value
    setUserRole(role);
  }

  function onChangeUsername(e) {
    var role = e.value
    setUsername(role);
  }

  function onChangeStatus(e) {
    var status = e.target.value
    setuserStatus(status);
  }

  return (
    <>
      <Header />

      <form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">

      <span className="blank_space d-flex align-items-center">
        <h2></h2>

        <button type="submit" className="nav-link btn btn-primary ml-auto theme_button top_fixed_buton">Update</button>

          <Link to='/users' className="nav-link btn btn-primary theme_button top_fixed_buton nav-back">Back</Link>

      </span>

      {EditSetting &&
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
                  
                    
                    
                      <input type="hidden" name="userid" value={userid} />

                      <div className="form-group mb-2">
                        <label htmlFor="inputForEmail">Username</label>
                        <span className="mandatory">*</span>
                        <input
                          id="inputForEmail"
                          name="username"
                          type="username"
                          value={Username}
                          onChange={onChangeUsername}
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
                        <span className="mandatory"></span>
                        <input
                          type="password"
                          name="password"
                          className="form-control"
                          id="inputForPassword"
                          placeholder=""
                          ref={register({
                            required: {
                              value: false,
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

                      <div className="form-group mb-2">
                        <label htmlFor="inputForConfirmPassword">Confirm Password</label>
                        <span className="mandatory"></span>
                        <input
                          type="password"
                          name="confirm_password"
                          className="form-control"
                          id="inputForConfirmPassword"
                          placeholder=""
                          ref={register({
                            required: {
                              value: false,
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
                          onChange={onChangeRole}
                          value={UserRole}
                          ref={register({
                            required: {
                              value: true,
                              message: "Please select role type",
                            },
                          })}
                        >

                          {roles.map((item) =>
                            <option key={item.role_master_id} value={item.role_master_id}>{item.role_menu_name}</option>
                          )}

                        </select>


                        {errors.role && (
                          <span className={`${styles.errorMessage} mandatory`}>
                            {errors.role.message}
                          </span>
                        )}
                      </div>

                      <div className="col-md-3">
                        <div className="form-group">
                          <label htmlFor="inputForRole">Status</label>
                          <span className="mandatory">*</span>
                          <select
                            name="status"
                            className="form-control"
                            aria-describedby="Enter username"
                            onChange={onChangeStatus}
                            value={userStatus}
                            ref={register({
                              required: {
                                value: true,
                                message: "Please select status",
                              },
                            })}
                          >

                          <option value=''>Select role</option>
                          
                            {options.map((option) => (
                              <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                          </select>

                          {errors.role && (
                            <span className={`${styles.errorMessage} mandatory`}>
                              {errors.role.message}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="d-flex align-items-center pt-3">

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
