import React, { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import { Multiselect } from 'multiselect-react-dropdown';

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

const rx_live = /^[+-]?\d*(?:[.,]\d*)?$/;

const pattern_exp = /^\d*(\.\d{0,2})?$/;

const USER_ID = localStorage.getItem("USER_ID");

const ProductStatus = [
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
  const [roles, setRoles] = useState([]);
  const [message, setMessage] = useState();
  const [ProductCategory, setProductCategory] = useState([]);
  const [ProductTypes, setProductTypes] = useState([]);
  const [ProductPriceTypes, setProductPriceTypes] = useState([]);
  const [ProductImage, setProductImage] = React.useState([]);
  const [ProductImageShow, setProductImageShow] = React.useState();
  const [Productstatus, set_Productstatus] = React.useState('1');
  const [Validation, setValidation] = React.useState();
  const history = useHistory();

  const [UserRoleSetting, setUserRoleSetting] = useState([]);
  const [ShowSetting, setShowSetting] = useState(false);
  const [AddSetting, setAddSetting] = useState(false);
  const [EditSetting, setEditSetting] = useState(false);
  const [DeleteSetting, setDeleteSetting] = useState(false);

  const [SelectProductTypes, setSelectProductTypes] = useState([]);
  const [ProductTypeError, setProductTypeError] = useState('');

  const [ProductWeightInKg, setProductWeightInKg] = useState('');
  const [ProductWeightInGm, setProductWeightInGm] = useState('');
  const [ProductPrice, setProductPrice] = useState('');

  const multiselectRef = useRef(null);

  useEffect(() => {

    var role_master = JSON.parse(window.localStorage.getItem('role_master'));
    var settings = role_master.role_setting_ids.split(',');

    setUserRoleSetting(settings);

    var show = checkMenuesSettings('5');
    if (show) {
      setShowSetting(true)
    }
    var add = checkMenuesSettings('6');
    if (add) {
      setAddSetting(true)
    }
    var edit = checkMenuesSettings('7');
    if (edit) {
      setEditSetting(true)
    }
    var deletes = checkMenuesSettings('8');
    if (deletes) {
      setDeleteSetting(true)
    }

    function checkMenuesSettings(id) {
      var returns = settings.includes(id);
      return returns;
    }


    fetch(`${config.baseUrl}/admin/products/getactiveproductcategydata`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(({ error, data, CODE }) => {
        if (CODE == 200) {
          setProductCategory(data)
        } else {
          alert('Fail')
        }
      });

    fetch(`${config.baseUrl}/admin/types/getactivetypes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(({ error, data, CODE }) => {
        if (CODE == 200) {
          setProductTypes(data)
        } else {
          alert('Fail')
        }
      });

    fetch(`${config.baseUrl}/getpricetypes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(({ error, data, CODE }) => {
        if (CODE == 200) {
          setProductPriceTypes(data)
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

    var product_weight = data.product_weight;
    var product_price = data.product_price;

    var formData = new FormData();
    /*console.log(data)
    return false;*/

    const typs = SelectProductTypes.map(item => item.type_id).join(',');

    formData.append('user_id', USER_ID);
    formData.append('product_categoty', data.product_categoty);
    formData.append('product_type', typs);
    formData.append('product_name', data.product_name);
    formData.append('product_price_type', data.product_price_type);
    formData.append('product_weight', data.product_weight);
    formData.append('weight_in_kg', data.weight_in_kg);
    formData.append('weight_in_gm', data.weight_in_gm);
    formData.append('product_price', data.product_price);
    formData.append('product_description', data.product_description);
    formData.append('product_image', ProductImage);
    formData.append('product_status', Productstatus);

    fetch(`${config.baseUrl}/admin/products/addnewproduct`, {
      method: "POST",
      headers: {
      },
      body: formData,
    })
      .then((res) => res.json())
      .then(({ error, data, CODE }) => {

        if (CODE == 200) {
          /*if(data.warningCount >= '1'){
            setMessage({
              data: "Something went wrong",
              type: "alert-danger",
            });
          }else{*/
          setMessage({
            data: error || "Added successfully",
            type: error ? "alert-danger" : "alert-success",
          });
          e.target.reset();
          //}
        } else {
          alert('Fail')
        }

        setTimeout(function () {
          setMessage('');
        }, 2000)


      });
  };

  const fileOnChange = (e) => {
    console.log(e.target);
    //return false;
    if (e.target.files[0]) {
      setProductImage(e.target.files[0]);
      setProductImageShow(URL.createObjectURL(e.target.files[0]));
    }

  }

  function onChangeStatus(e) {
    var status = e.target.value
    set_Productstatus(status);
  }

  function onSelecType(selectedList, selectedItem) {
    setProductTypeError('')
    selectedList.map((item) => {
      setSelectProductTypes(selectedList)
    })
  }

  function onRemoveType(selectedList, removedItem) {
    selectedList.map((item) => {
      setSelectProductTypes(selectedList)
    })
  }

  function changeWeightInKg(e) {
    var value = e.target.value;
    if (value == '') {
      setProductWeightInKg(value)
    } else {
      if (/^[0-9\b]+$/.test(value)) {
        setProductWeightInKg(value)
      }
    }
  }

  function changeWeightInGm(e) {
    var value = e.target.value;
    if (value == '') {
      setProductWeightInGm(value)
    } else {
      if (/^[0-9\b]+$/.test(value)) {
        setProductWeightInGm(value)
      }
    }
  }

  function changeProductPrice(e) {
    var value = e.target.value;
    if (value == '') {
      setProductPrice(value)
    } else {
      if (pattern_exp.test(value)) {
        setProductPrice(value)
      }
    }
  }


  return (
    <>


      <Header />

      <form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
        <span className="blank_space d-flex align-items-center">
          <h2></h2>

          <button type="submit" className="nav-link btn btn-primary ml-auto theme_button top_fixed_buton">Create</button>

          <Link to='/products' className="nav-link btn btn-primary theme_button top_fixed_buton nav-back">Back</Link>

        </span>

        {AddSetting &&
          <div className="middle_content rolelist col-md-7 mt-2 mb-4">
            <div className="content">

              <div className="container-xl">
                <div className="card">
                  <div className={styles.loginFormContainer}>
                    {message && (
                      <div
                        className={`alert fade show d-flex ${message.type}`}
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
                    <fieldset className="p-3 rounded">
                      
                      
                      <div className="row">

                        <div className="col-md-6">
                          <div className="form-group mb-2">
                            <label htmlFor="inputForCategory">Product Name</label>
                            <span className="mandatory">*</span>
                            <input
                              id="inputForEmail"
                              name="product_name"
                              type="text"
                              className="form-control"
                              placeholder=""
                              ref={register({
                                required: {
                                  value: true,
                                  message: "Please Enter Product Name",
                                },
                              })}
                            />
                            {errors.product_name && (
                              <span className={`${styles.errorMessage} mandatory`}>
                                {errors.product_name.message}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-group mb-2">
                            <label htmlFor="inputForRole">Product Category</label>
                            <span className="mandatory">*</span>
                            <select
                              name="product_categoty"
                              className="form-control"
                              aria-describedby="Product Category"
                              ref={register({
                                required: {
                                  value: true,
                                  message: "Please Select Product Category",
                                },
                              })}
                            >
                              <option value="">Select category</option>
                              {ProductCategory.map((item) =>
                                <option value={item.id}>{item.parentcat}, {item.product_category_name} {item.basket_category_id}</option>
                              )}
                            </select>
                            {errors.product_categoty && (
                              <span className={`${styles.errorMessage} mandatory`}>
                                {errors.product_categoty.message}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-group mb-2">
                            <label htmlFor="inputForRole">Product Type</label>
                            <span className="mandatory">*</span>
                            <Multiselect
                              options={ProductTypes}
                              onSelect={onSelecType}
                              onRemove={onRemoveType}
                              closeIcon="close"
                              ref={multiselectRef}
                              displayValue="type_name"
                              showCheckbox={true}
                            />

                            {ProductTypeError && (
                              <span className={`${styles.errorMessage} mandatory`}>
                                {ProductTypeError}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-group mb-2">
                            <label htmlFor="inputForRole">Product Price Type</label>
                            <span className="mandatory">*</span>
                            <select
                              name="product_price_type"
                              className="form-control"
                              aria-describedby="Product Product Price Type"
                              ref={register({
                                required: {
                                  value: true,
                                  message: "Please Select Product Price Type",
                                },
                              })}
                            >
                              <option value="">Select </option>
                              {ProductPriceTypes.map((item) =>
                                <option value={item.price_type_id}>{item.price_type_name}</option>
                              )}
                            </select>
                            {errors.product_price_type && (
                              <span className={`${styles.errorMessage} mandatory`}>
                                {errors.product_price_type.message}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="col-md-3">
                          <div className="form-group mb-2">
                            <label htmlFor="inputForCategory">Product Weight in kg</label>
                            <span className="mandatory">*</span>
                            <input
                              id="inputForEmail"
                              name="weight_in_kg"
                              type="text"
                              className="form-control"
                              aria-describedby="Enter Product Weight"
                              placeholder=""
                              value={ProductWeightInKg}
                              onChange={changeWeightInKg}
                              ref={register({
                                required: {
                                  value: true,
                                  message: "Enter Product Weight in kg",
                                },
                                pattern: {
                                  value: /^[+-]?\d*(?:[.,]\d*)?$/,
                                  message: 'Product Weight should be number.',
                                },
                              })}
                            />
                            {errors.weight_in_kg && (
                              <span className={`${styles.errorMessage} mandatory`}>
                                {errors.weight_in_kg.message}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="col-md-3">
                          <div className="form-group mb-2">
                            <label htmlFor="inputForCategory">Product Weight in gm</label>
                            <span className="mandatory">*</span>
                            <input
                              id="inputForEmail"
                              name="weight_in_gm"
                              type="text"
                              className="form-control"
                              placeholder=""
                              value={ProductWeightInGm}
                              onChange={changeWeightInGm}
                              ref={register({
                                required: {
                                  value: true,
                                  message: "Enter Product Weight In gm",
                                },
                                pattern: {
                                  value: /^[+-]?\d*(?:[.,]\d*)?$/,
                                  message: 'Product Weight should be number.',
                                },
                              })}
                            />
                            {errors.weight_in_gm && (
                              <span className={`${styles.errorMessage} mandatory`}>
                                {errors.weight_in_gm.message}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-group mb-2">
                            <label htmlFor="inputForCategory">Product Price</label>
                            <span className="mandatory">*</span>
                            <input
                              id="inputForEmail"
                              name="product_price"
                              type="text"
                              className="form-control"
                              aria-describedby="Enter Product Price"
                              placeholder=""
                              value={ProductPrice}
                              onChange={changeProductPrice}
                              ref={register({
                                required: {
                                  value: true,
                                  message: "Please Enter Product Price",
                                },
                                pattern: {
                                  value: /^[+-]?\d*(?:[.,]\d*)?$/,
                                  message: 'Product Price should be number.',
                                },
                              })}
                            />
                            {errors.product_price && (
                              <span className={`${styles.errorMessage} mandatory`}>
                                {errors.product_price.message}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="col-md-12">
                          <div className="form-group mb-2">
                            <label htmlFor="inputForCategory">Product Description</label>
                            <span className="mandatory">*</span>
                            <textarea
                              id="inputForEmail"
                              name="product_description"
                              type="text"
                              className="form-control"
                              aria-describedby="Enter Product Description"
                              placeholder=""
                              ref={register({
                                required: {
                                  value: true,
                                  message: "Please Enter Product Description",
                                },
                              })}
                            />
                            {errors.product_description && (
                              <span className={`${styles.errorMessage} mandatory`}>
                                {errors.product_description.message}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="col-md-5">
                          <div className="form-group mb-2">
                            <label htmlFor="inputForCategory">Product Image</label>
                            <span className="mandatory">*</span>
                            <input
                              id="inputForEmail"
                              name="product_image"
                              type="file"
                              className="form-control"
                              aria-describedby="Enter Product Image"
                              placeholder=""
                              onChange={fileOnChange}
                              ref={register({
                                required: {
                                  value: true,
                                  message: "Please Select Product Image",
                                },
                              })}
                            />
                            {errors.product_image && (
                              <span className={`${styles.errorMessage} mandatory`}>
                                {errors.product_image.message}
                              </span>
                            )}
                          </div>
                        </div>


                        <div className="col-md-5">
                          {ProductImageShow &&
                            <img src={ProductImageShow} className="form_product_image" alt="new" />
                          }
                        </div>


                        <div className="col-md-2">
                          <div className="form-group">
                            <label htmlFor="inputForRole">Status</label>
                            <span className="mandatory">*</span>
                            <select
                              name="status"
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
                              {ProductStatus.map((option) => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="d-flex align-items-center mt-2">
                          
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