import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import config from "../../../config";
import styles from "../../Users/Index.css";
import Header from "../../includes/Header";
import Footer from "../../includes/Footer";


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
  const [message, setMessage] = useState();
  const [BasketCategories, setBasketCategories] = useState([]);

  const [ImageShow, setImageShow] = React.useState();
  const [Image, setImage] = useState([]);
  const [Status, set_Status] = React.useState('1');

  const [BasketCat, setBasketCat] = React.useState('');

  const history = useHistory();

  const [UserRoleSetting, setUserRoleSetting] = useState([]);
  const [ShowSetting, setShowSetting] = useState(false);
  const [AddSetting, setAddSetting] = useState(false);
  const [EditSetting, setEditSetting] = useState(false);
  const [DeleteSetting, setDeleteSetting] = useState(false);

  const sid = window.location.href.split('/').reverse()[0];

  useEffect(() => {

    var role_master = JSON.parse(window.localStorage.getItem('role_master'));
    var settings = role_master.role_setting_ids.split(',');

    setUserRoleSetting(settings);

    var show = checkMenuesSettings('53');
    if (show) {
      setShowSetting(true)
    }
    var add = checkMenuesSettings('54');
    if (add) {
      setAddSetting(true)
    }
    var edit = checkMenuesSettings('55');
    if (edit) {
      setEditSetting(true)
    }
    var deletes = checkMenuesSettings('56');
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

    var postdata = { "id": sid }

    fetch(`${config.baseUrl}/admin/app/offerslider/getoffersliderdata`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postdata),
    })
    .then((res) => res.json())
    .then(({ error, data, CODE }) => {
      if (CODE == 200) {
        setBasketCat(data[0].basket_category)
        setImageShow(data[0].slider_image)
        set_Status(data[0].status)
        /*set_Parentcat(data[0].parent_id)
        set_Name(data[0].basket_category_name)
        
        */
      } else {
        alert('Fail')
      }
    });


  }, [history]);

  const onSubmit = (data, e) => {
    setMessage({
      data: "In progress...",
      type: "alert-warning",
    });

    var formData = new FormData();

    formData.append('id', sid);
    formData.append('basket_category', data.basket_category);
    formData.append('status', data.status);
    formData.append('image', Image);

    var configurl = "http://localhost:9000";

    fetch(`${config.baseUrl}/admin/app/offerslider/updateofferslider`, {
      method: "POST",
      headers: {
      },
      body: formData
    })
      .then((res) => res.json())
      .then(({ error, data, CODE }) => {
        if (CODE == 200) {
          setMessage({
            data: error || "Updated successfully",
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

  function onChangeBasCateg(e) {
    var valu = e.target.value
    setBasketCat(valu);
  }

  return (
    <>
      <Header />

      <form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off" >

      <span className="blank_space d-flex align-items-center">
        <h2></h2>

        {AddSetting &&
          <button type="submit" className="nav-link btn btn-primary ml-auto theme_button top_fixed_buton">Update</button>
        }

          <Link to='/appoffersliderlist' className="nav-link btn btn-primary theme_button top_fixed_buton nav-back">Back</Link>


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
                        <label htmlFor="inputForRole">Basket Category</label>
                        <span className="mandatory">*</span>
                        <select
                          name="basket_category"
                          value={BasketCat}
                          className="form-control"
                          aria-describedby=""
                          onChange={onChangeBasCateg}
                          ref={register({
                            required: {
                              value: true,
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
                        <label htmlFor="inputForPassword">Slider Image</label>
                        <span className="mandatory"></span>
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
                        <label htmlFor="inputForEmail"><span className="mandatory">Note : </span>Image Dimentions 570*240</label>
                      </div>                

                      <div className="col-md-3">
                        <div className="form-group">
                          <label htmlFor="inputForRole">Status</label>
                          <span className="mandatory">*</span>
                          <select
                            name="status"
                            value={Status}
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
};

export default Add;
