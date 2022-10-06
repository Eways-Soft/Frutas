import React, { useEffect, useState, useParams } from "react";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import styles from "./Index.css";
import { Link } from "react-router-dom";
import config from "../../config";
import Header from "../includes/Header";
import Footer from "../includes/Footer";


export default function Edit(props) {
  const { register, handleSubmit, errors } = useForm();
  const [message, setMessage] = useState();
  const [ParentCategories, setParentCategories] = useState([]);

  const [ImageShow, setImageShow] = React.useState();
  const [Image, setImage] = useState([]);

  const [Parentcat, set_Parentcat] = React.useState();
  const [Name, set_Name] = React.useState();
  const [Status, set_Status] = React.useState();
  const history = useHistory();

  const id = window.location.href.split('/').reverse()[0];

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
          alert('Fail')
        }
      });

    var postdata = { "id": id }

    fetch(`${config.baseUrl}/admin/baskets/getbasketcategorydata`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postdata),
    })
      .then((res) => res.json())
      .then(({ error, data, CODE }) => {
        if (CODE == 200) {
          set_Parentcat(data[0].parent_id)
          set_Name(data[0].basket_category_name)
          setImageShow(data[0].basket_category_image)
          set_Status(data[0].basket_category_status)
        } else {
          alert('Fail')
        }
      });

  }, [history]);

  const onSubmit = (data, e) => {
    e.preventDefault();
    console.log(data);
    setMessage({
      data: "In progress...",
      type: "alert-warning",
    });

    /*var formsdata = { "id": id, "parent_category": data.parent_category, "basket_category_name": data.basket_category_name, "basket_category_status": data.basket_category_status,image:Image }*/

    var formData = new FormData();

    formData.append('id', id);
    formData.append('parent_category', data.parent_category);
    formData.append('basket_category_name', data.basket_category_name);
    formData.append('basket_category_status', data.basket_category_status);
    formData.append('image', Image);

    fetch(`${config.baseUrl}/admin/baskets/updatebasketcategory`, {
      method: "POST",
      headers: {
      },
      body: formData,
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

          setTimeout(function () {
            setMessage('');
          }, 2000)
        }
      });

  };

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

  function onChangeParentCategory(e) {
    var value = e.target.value
    set_Parentcat(value);
  }

  function onChangeStatus(e) {
    var status = e.target.value
    set_Status(status);
  }

  const inputOnChange = (e) => {
    set_Name(e.target.value);
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

        <button type="submit" className="nav-link btn btn-primary ml-auto theme_button top_fixed_buton">Update</button>

        <Link to='/basketcategories' className="nav-link btn btn-primary theme_button top_fixed_buton nav-back">Back</Link>

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
                      <div className="form-group mb-2">
                        <label htmlFor="inputForRole">Basket Parent Category</label>
                        <span className="mandatory"></span>
                        <select
                          name="parent_category"
                          className="form-control"
                          aria-describedby=""
                          value={Parentcat}
                          onChange={onChangeParentCategory}
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
                          value={Name}
                          onChange={inputOnChange}
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

                      <div className="col-md-3">
                        <div className="form-group">
                          <label htmlFor="inputForRole">Status</label>
                          <span className="mandatory">*</span>
                          <select
                            name="basket_category_status"
                            className="form-control"
                            aria-describedby="Enter username"
                            onChange={onChangeStatus}
                            value={Status}
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
