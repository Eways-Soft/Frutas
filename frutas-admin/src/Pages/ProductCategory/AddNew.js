import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

// import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Tabs,
  Tab,
  Modal,
  Row,
  Button,
  Col,
  Form,
  Card,
  Container
} from "react-bootstrap";

import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import config from "../../config";
import styles from "../Users/Index.css";
import Header from "../includes/Header";
import Footer from "../includes/Footer";

export default function AddNew(props) {
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

    var show = checkMenuesSettings('1');
    if (show) {
      setShowSetting(true)
    }
    var add = checkMenuesSettings('2');
    if (add) {
      setAddSetting(true)
    }
    var edit = checkMenuesSettings('3');
    if (edit) {
      setEditSetting(true)
    }
    var deletes = checkMenuesSettings('4');
    if (deletes) {
      setDeleteSetting(true)
    }

    function checkMenuesSettings(id) {
      var returns = settings.includes(id);
      return returns;
    }
    fetch(`${config.baseUrl}/admin/products/getparentproductcategories`, {
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
      fetch(`${config.baseUrl}/admin/products/addnewproductcategory`, {
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

            fetch(`${config.baseUrl}/admin/products/getparentproductcategories`, {
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

                }

                setTimeout(function () {
                  setMessage('');
                }, 2000)


              });

            e.target.reset();
          } else {
            alert('Fail')
          }
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

          <Link to='/listproductcategory' className="nav-link btn btn-primary theme_button top_fixed_buton nav-back">Back</Link>

        </span>

        {ShowSetting &&

          <div className="middle_content rolelist col-md-4 mt-2 mb-4">
            <div className="content">

              <div className="container-xl">
                <div className="card">
                  <div className={styles.loginFormContainer}>
                    

                    <fieldset className="roundProduct rounded">

                      {message && (
                        <div
                          className={`alert alertProCat fade show d-flex ${message.type}`}
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

                      <div  className="formProduct">
                        <div className="form-group mb-2">
                          <label htmlFor="inputForRole">Parent Category</label>
                          <span className="mandatory"></span>
                          <select
                            name="parent_category"
                            className="form-control"
                            aria-describedby=""
                            ref={register({
                              required: {
                                value: false,
                                message: "Please select role type",
                              },
                            })}
                          >

                            <option value="">Select category</option>

                            {roles.map((item) =>
                              <option value={item.id}>{item.product_category_name}</option>
                            )}

                          </select>
                        </div>

                        <div className="form-group">
                          <label htmlFor="inputForCategory">Category Name</label>
                          <span className="mandatory">*</span>
                          <input
                            id="inputForEmail"
                            name="product_category_name"
                            type="text"
                            className="form-control"
                            aria-describedby="Enter Product Category"
                            placeholder=""
                            ref={register({
                              required: {
                                value: true,
                                message: "Please Enter Product Category Name",
                              },
                            })}
                          />

                          {errors.product_category_name && (
                            <span className={`${styles.errorMessage} mandatory`}>
                              {errors.product_category_name.message}
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
}