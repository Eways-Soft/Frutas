import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import config from "../../config";
import styles from "../Users/Index.css";
import Header from "../includes/Header";
import Footer from "../includes/Footer";

const StatusArr = [
  {
    label: "Active",
    value: "1",
  },
  {
    label: "In-Active",
    value: "0",
  },
];

const Add = () => {
  const { register, handleSubmit, errors } = useForm();
  const [roles, setRoles] = useState([]);
  const [message, setMessage] = useState();
  const [Status, set_Status] = React.useState('1');
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

    var show = checkMenuesSettings('37');
    if (show) {
      setShowSetting(true)
    }
    var add = checkMenuesSettings('38');
    if (add) {
      setAddSetting(true)
    }
    var edit = checkMenuesSettings('39');
    if (edit) {
      setEditSetting(true)
    }
    var deletes = checkMenuesSettings('40');
    if (deletes) {
      setDeleteSetting(true)
    }

    function checkMenuesSettings(id) {
      var returns = settings.includes(id);
      return returns;
    }


  }, [history]);

  const onSubmit = (data, e) => {
    fetch(`${config.baseUrl}/admin/types/addnewtype`, {
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
  };

  function onChangeStatus(e) {
    var status = e.target.value
    set_Status(status);
  }

  return (
    <>
      <Header />

      <form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">

      <span className="blank_space d-flex align-items-center">
        <h2></h2>

        <button type="submit" className="nav-link btn btn-primary ml-auto theme_button top_fixed_buton">Create</button>

          <Link to='/types' className="nav-link btn btn-primary theme_button top_fixed_buton nav-back">Back</Link>


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
                      <div className="form-group">
                        <label htmlFor="inputForCategory">Type Name</label>
                        <span className="mandatory">*</span>
                        <input
                          id="inputForEmail"
                          name="type_name"
                          type="text"
                          className="form-control"
                          aria-describedby="Enter Type Name"
                          placeholder=""
                          ref={register({
                            required: {
                              value: true,
                              message: "Please Enter Type Name",
                            },
                          })}
                        />

                        {errors.type_name && (
                          <span className={`${styles.errorMessage} mandatory`}>
                            {errors.type_name.message}
                          </span>
                        )}
                      </div>

                      <div className="col-md-3">
                        <div className="form-group">
                          <label htmlFor="inputForRole">Status</label>
                          <span className="mandatory">*</span>
                          <select
                            name="type_status"
                            className="form-control"
                            aria-describedby="Enter username"
                            onChange={onChangeStatus}
                            ref={register({
                              required: {
                                value: true,
                                message: "Please select status",
                              },
                            })}
                          >

                            {StatusArr.map((option) => (
                              <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                          </select>

                        </div>
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

export default Add;
