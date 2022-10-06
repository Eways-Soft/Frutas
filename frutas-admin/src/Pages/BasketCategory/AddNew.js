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


export default function AddNew(props) {
  const { register, handleSubmit, errors } = useForm();
  const [message, setMessage] = useState();
  const [ParentCategories, setParentCategories] = useState([]);

  const [ImageShow, setImageShow] = React.useState();
  const [Image, setImage] = useState([]);
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

    var show = checkMenuesSettings('9');
    if (show) {
      setShowSetting(true)
    }
    var add = checkMenuesSettings('10');
    if (add) {
      setAddSetting(true)
    }
    var edit = checkMenuesSettings('11');
    if (edit) {
      setEditSetting(true)
    }
    var deletes = checkMenuesSettings('12');
    if (deletes) {
      setDeleteSetting(true)
    }

    function checkMenuesSettings(id) {
      var returns = settings.includes(id);
      return returns;
    }


    fetch(`${config.baseUrl}/admin/baskets/getparentbasketcategories`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(({ error, data, CODE }) => {
        if (CODE == 200) {
          setParentCategories(data)
        } else {

        }
      });

  }, [history]);

  const onSubmit = (data, e) => {

    setMessage({
      data: "In progress...",
      type: "alert-warning",
    });

    var formData = new FormData();

    formData.append('parent_category', data.parent_category);
    formData.append('basket_category_name', data.basket_category_name);
    formData.append('basket_category_status', data.basket_category_status);
    formData.append('image', Image);

    fetch(`${config.baseUrl}/admin/baskets/addnewbasketcategory`, {
      method: "POST",
      headers: {
      },
      body: formData,
    })
      .then((res) => res.json())
      .then(({ error, data, CODE }) => {
        setImageShow('')
           
        if (CODE == 200) {
          setMessage({
            data: error || "Added successfully",
            type: error ? "alert-danger" : "alert-success",
          });

          fetch(`${config.baseUrl}/admin/baskets/getparentbasketcategories`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then((res) => res.json())
            .then(({ error, data, CODE }) => {
              if (CODE == 200) {               
                setParentCategories(data)
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
  };

  function onChangeStatus(e) {
    var status = e.target.value
    set_Status(status);
  }

  const fileOnChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      setImageShow(URL.createObjectURL(e.target.files[0]));
      
    }
  }

  return (
    <>
      <Header />

      <form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off" >

      <span className="blank_space d-flex align-items-center">
        <h2></h2>

        <button type="submit" className="nav-link btn btn-primary ml-auto theme_button top_fixed_buton">Create</button>

          <Link to='/basketcategories' className="nav-link btn btn-primary theme_button top_fixed_buton nav-back">Back</Link>


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
                        className={`alert alertBsktCatEdit fade show d-flex ${message.type}`}
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
                        <label htmlFor="inputForRole">Basket Parent Category</label>
                        <span className="mandatory"></span>
                        <select
                          name="parent_category"
                          className="form-control"
                          aria-describedby=""
                          ref={register({
                            required: {
                              value: false,
                              message: "Please select Basket Parent Category ",
                            },
                          })}
                        >

                          <option value="">Select category</option>

                          {ParentCategories.map((item) =>
                            <option key={item.basket_category_id} value={item.basket_category_id}>{item.basket_category_name}</option>
                          )}

                        </select>
                      </div>

                      <div className="form-group mb-2">
                        <label htmlFor="inputForCategory">Basket Category Name</label>
                        <span className="mandatory">*</span>
                        <input
                          id="inputForEmail"
                          name="basket_category_name"
                          type="text"
                          className="form-control"
                          aria-describedby="Enter Basket Category Name"
                          placeholder=""
                          ref={register({
                            required: {
                              value: true,
                              message: "Please Enter Product Category Name",
                            },
                          })}
                        />

                        {errors.basket_category_name && (
                          <span className={`${styles.errorMessage} mandatory`}>
                            {errors.basket_category_name.message}
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
                        <div className="form-group">
                          <label htmlFor="inputForRole">Status</label>
                          <span className="mandatory">*</span>
                          <select
                            name="basket_category_status"
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
}