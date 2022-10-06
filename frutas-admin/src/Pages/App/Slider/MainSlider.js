import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import config from "../../../config";
import Header from "../../includes/Header";
import Footer from "../../includes/Footer";
import styles from "../../Users/Index.css";

const MainSlider = () => {
  const { register, handleSubmit, errors } = useForm();
  const [message, setMessage] = useState();

  const [ImageShow, setImageShow] = React.useState();
  const [Image, setImage] = useState([]);
  const [Status, set_Status] = React.useState('1');
  const [SliderContent, setSliderContent] = React.useState('');
  const [BasketCategories, setBasketCategories] = useState([]);
  const [BasketCat, setBasketCat] = useState('');

  const history = useHistory();

  const [UserRoleSetting, setUserRoleSetting] = useState([]);
  const [ShowSetting, setShowSetting] = useState(false);
  const [AddSetting, setAddSetting] = useState(false);
  const [EditSetting, setEditSetting] = useState(false);
  const [DeleteSetting, setDeleteSetting] = useState(false);

  const [isLoading, setisLoading] = useState(false)

  useEffect(() => {

    var role_master = JSON.parse(window.localStorage.getItem('role_master'));
    var settings = role_master.role_setting_ids.split(',');

    setUserRoleSetting(settings);

    var show = checkMenuesSettings('49');
    if (show) {
      setShowSetting(true)
    }
    var add = checkMenuesSettings('50');
    if (add) {
      setAddSetting(true)
    }
    var edit = checkMenuesSettings('51');
    if (edit) {
      setEditSetting(true)
    }
    var deletes = checkMenuesSettings('52');
    if (deletes) {
      setDeleteSetting(true)
    }

    function checkMenuesSettings(id) {
      var returns = settings.includes(id);
      return returns;
    }

    var configurl = "http://localhost:9000";

    fetch(`${config.baseUrl}/admin/app/offerslider/getactivebasketcategories`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => res.json())
    .then(({ error, data, CODE }) => {
      if (CODE == 200) {
        setBasketCategories(data)
      } else {

      }
    });

    getMainSlider();

  }, [history]);


  async function getMainSlider(){
    var configurl = "http://localhost:9000";

    fetch(`${config.baseUrl}/admin/app/mainslider/getmainsliderdata`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => res.json())
    .then(({ error, data, CODE }) => {
      if (CODE == 200) {
        if(data != ''){
          setBasketCat(data[0].basket_category)
          setSliderContent(data[0].slider_content)
          setImageShow(data[0].slider_image)
        }
      } else {

      }
    });
  }

  async function onSubmit(data, e){
    
    if(ImageShow == ''){
      alert('Slider image is required.');
      return false;
    }

    var formData = new FormData();

    formData.append('basket_category', data.basket_category);
    formData.append('slider_content', data.slider_content);
    formData.append('image', Image);

    setMessage({
      data: "In progress...",
      type: "alert-warning",
    });

    fetch(`${config.baseUrl}/admin/app/mainslider/addappmainslider`, {
      method: "POST",
      headers: {
      },
      body: formData
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
  }

  const fileOnChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      setImageShow(URL.createObjectURL(e.target.files[0]));
      
    }
  }

  if (!isLoading) {
    return (
      <>

        <Header />

        {ShowSetting &&
          <form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">

            <span className="blank_space d-flex align-items-center">
              <h2></h2>        

              {EditSetting &&
                <button type="submit" className="nav-link btn btn-primary ml-auto theme_button top_fixed_buton">Update</button>
              }

              <Link to='/basketcategories' className="nav-link btn btn-primary theme_button top_fixed_buton nav-back">Back</Link>

            </span>

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
                            <label htmlFor="inputForRole">Basket Category</label>
                            <span className="mandatory"></span>
                            <select
                              name="basket_category"
                              value={BasketCat}
                              className="form-control"
                              onChange={(e)=>setBasketCat(e.target.value)}
                              aria-describedby=""
                              ref={register({
                                required: {
                                  value: false,
                                  message: "Select Basket Category ",
                                },
                              })}
                            >

                              <option value="">Select category</option>

                              {BasketCategories.map((item) =>
                                <option key={item.basket_category_id} value={item.basket_category_id}>{item.basket_category_name}</option>
                              )}

                            </select>
                          </div>

                          <div className="form-group mb-2">
                            <label htmlFor="inputForEmail">Slider Content</label>
                            <span className="mandatory"></span>
                            <input
                              id="inputForEmail"
                              name="slider_content"
                              type="text"
                              value={SliderContent}
                              onChange={(e)=> setSliderContent(e.target.value)}
                              className="form-control"
                              placeholder=""
                              ref={register({
                                required: {
                                  value: false,
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

                          <div className="d-flex align-items-center pt-3">

                          </div>
                        </div>

                        <div className="form-group mb-2">
                          <label htmlFor="inputForPassword">Slider Image</label>
                          <span className="mandatory">*</span>
                          <input
                            type="file"
                            name="image"
                            className="form-control"
                            onChange={fileOnChange}
                            ref={register({
                              required: {
                                value: false,
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

                        <div className="form-group mb-2">
                          <label htmlFor="inputForEmail"><span className="mandatory">Note : </span>Image Dimentions 375*375</label>
                        </div>

                        
                      </fieldset>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </form>

        }

        <Footer />
      </>
    );
  } else {
    return (
      <>
        <span className="loading_view align-items-center justify-content-center d-flex w-100 h-100 min-vh-100">
          <img
            src={require("../../../loader/loader.gif")}
            alt=""
          />
        </span>
      </>
    )
  }
};

export default MainSlider;
