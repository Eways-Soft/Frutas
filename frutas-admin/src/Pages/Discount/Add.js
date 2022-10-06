import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import config from "../../config";
import styles from "../Users/Index.css";
import Header from "../includes/Header";
import Footer from "../includes/Footer";

const Add = () => {
  const { register, handleSubmit, errors } = useForm();
  const [ImageShow, setImageShow] = React.useState();
  const [Image, setImage] = useState([]);
  const [message, setMessage] = useState();
  const [status, set_status] = useState();
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

    var show = checkMenuesSettings('41');
    if (show) {
      setShowSetting(true)
    }
    var add = checkMenuesSettings('42');
    if (add) {
      setAddSetting(true)
    }
    var edit = checkMenuesSettings('43');
    if (edit) {
      setEditSetting(true)
    }
    var deletes = checkMenuesSettings('44');
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

    var formData = new FormData();

    formData.append('name', data.name);
    formData.append('discount', data.discount);
    formData.append('status', data.status);
    formData.append('image', Image);

    setImageShow('')

    fetch(`${config.baseUrl}/admin/discounts/addnewdiscount`, {
      method: "POST",
      headers: {
      },
      body: formData,
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
    set_status(status);
  }

  const fileOnChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      setImageShow(URL.createObjectURL(e.target.files[0]));
    }
  }

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

  return (
    <>
      <Header />

      <form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">

      <span className="blank_space d-flex align-items-center">
        <h2></h2>        

        <button type="submit" className="nav-link btn btn-primary ml-auto theme_button top_fixed_buton">Create</button>

        <Link to='/discounts' className="nav-link btn btn-primary theme_button top_fixed_buton nav-back">Back</Link>

      </span>

      {AddSetting &&
        <div className="middle_content rolelist col-md-4 mt-2 mb-4">
          <div className="content">

            <div className="container-xl">
              <div className="card">
                <div className={styles.loginFormContainer}>
                  {message && (
                    <div
                      className={`alert alertRoles fade show d-flex ${message.type}`}
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
                  
                  <fieldset className="roundProduct rounded">
                    
                    <div className="formProduct">
                      <div className="form-group mb-2">
                        <label htmlFor="inputForEmail">Name</label>
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
                              message: "Please enter name",
                            },
                          })}
                        />
                        {errors.name && (
                          <span className={`${styles.errorMessage} mandatory`}>
                            {errors.name.message}
                          </span>
                        )}
                      </div>

                      <div className="form-group mb-2">
                        <label htmlFor="inputForPassword">Discount</label>
                        <span className="mandatory">*</span>
                        <input
                          type="text"
                          name="discount"
                          className="form-control"
                          id="discount"
                          placeholder=""
                          ref={register({
                            required: {
                              value: true,
                              message: "Please enter discount",
                            },
                          })}
                        />
                        {errors.discount && (
                          <span className={`${styles.errorMessage} mandatory`}>
                            {errors.discount.message}
                          </span>
                        )}
                      </div>

                      <div className="form-group mb-2">
                        <label htmlFor="inputForPassword">Image</label>
                        <span className="mandatory">*</span>
                        <input
                          type="file"
                          name="image"
                          className="form-control"
                          onChange={fileOnChange}
                          ref={register({
                            required: {
                              value: true,
                              message: "Please select image",
                            },
                          })}
                        />
                        {errors.image && (
                          <span className={`${styles.errorMessage} mandatory`}>
                            {errors.image.message}
                          </span>
                        )}
                      </div>

                      {ImageShow &&
                        <div className="col-md-6">
                          <img src={ImageShow} className="form_product_image" alt="new" />
                        </div>
                      }

                      <div className="col-md-3">
                        <div className="form-group mb-2">
                          <label htmlFor="inputForPassword">Status</label>
                          <span className="mandatory">*</span>
                          <select
                            name="status"
                            className="form-control"
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

                          {errors.status && (
                            <span className={`${styles.errorMessage} mandatory`}>
                              {errors.status.message}
                            </span>
                          )}
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
