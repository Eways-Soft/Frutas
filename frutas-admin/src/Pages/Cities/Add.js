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
  const [ImageShow, setImageShow] = React.useState();
  const [message, setMessage] = useState();
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

    var show = checkMenuesSettings('33');
    if (show) {
      setShowSetting(true)
    }
    var add = checkMenuesSettings('34');
    if (add) {
      setAddSetting(true)
    }
    var edit = checkMenuesSettings('35');
    if (edit) {
      setEditSetting(true)
    }
    var deletes = checkMenuesSettings('36');
    if (deletes) {
      setDeleteSetting(true)
    }

    function checkMenuesSettings(id) {
      var returns = settings.includes(id);
      return returns;
    }


  }, [history]);

  const onSubmit = (data, e) => {
    setMessage({
      data: "In progress...",
      type: "alert-warning",
    });

    fetch(`${config.baseUrl}/admin/addsubscriptioncity`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
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
          setMessage({
            data: error || error,
            type: error ? "alert-danger" : "alert-danger",
          });
        }

        setTimeout(function () {
                setMessage('');
              }, 2000)
        
      });

  };

  return (
    <>
      <Header />

      <form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">

      <span className="blank_space d-flex align-items-center">
        <h2></h2>

        <button type="submit" className="nav-link btn btn-primary ml-auto theme_button top_fixed_buton">Create</button>

          <Link to='/cities' className="nav-link btn btn-primary theme_button top_fixed_buton nav-back">Back</Link>

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
                        <label htmlFor="inputForEmail">City Name</label>
                        <span className="mandatory">*</span>
                        <input
                          id="inputForEmail"
                          name="name"
                          type="text"
                          className="form-control"
                          placeholder=""
                          ref={register({
                            required: {
                              value: true,
                              message: "Please enter city name",
                            },
                          })}
                        />
                        {errors.name && (
                          <span className={`${styles.errorMessage} mandatory`}>
                            {errors.name.message}
                          </span>
                        )}
                      </div>

                      {ImageShow &&
                        <div className="col-md-6">
                          <img src={ImageShow} className="form_product_image" alt="new" />
                        </div>
                      }


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
