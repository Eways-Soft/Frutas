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

export default function EditProduct(props) {
  const { register, handleSubmit, errors } = useForm();
  const [Product_image_err, setProduct_image_err] = useState();
  const [roles, setRoles] = useState([]);
  const [message, setMessage] = useState();
  const [ProductCategory, setProductCategory] = useState([]);
  const [ProductTypes, setProductTypes] = useState([]);
  const [ProductPriceTypes, setProductPriceTypes] = useState([]);
  const [ProductImage, setProductImage] = React.useState();

  const [P_category, setP_category] = React.useState(3);
  const [P_type, setP_type] = React.useState([]);
  const [P_name, setP_name] = React.useState();
  const [P_price_type, setP_price_type] = React.useState();
  const [P_weight, setP_weight] = React.useState();
  const [P_price, setP_price] = React.useState();
  const [P_description, setP_description] = React.useState();
  const [P_image, setP_image] = React.useState();
  const [P_image_name, setP_image_name] = React.useState();
  const [P_status, setP_status] = React.useState();

  const history = useHistory();

  const [SelectProductTypes, setSelectProductTypes] = useState([]);
  const [ProductTypeError, setProductTypeError] = useState('');
  const multiselectRef = useRef(null);

  const productid = window.location.href.split('/').reverse()[0];

  const [UserRoleSetting, setUserRoleSetting] = useState([]);
  const [ShowSetting, setShowSetting] = useState(false);
  const [AddSetting, setAddSetting] = useState(false);
  const [EditSetting, setEditSetting] = useState(false);
  const [DeleteSetting, setDeleteSetting] = useState(false);

  const [isLoading, setisLoading] = useState(true)

  const [ProductWeightInKg, setProductWeightInKg] = useState('');
  const [ProductWeightInGm, setProductWeightInGm] = useState('');
  const [ProductPrice, setProductPrice] = useState('');

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

    var pid = { "product_id": productid }
    fetch(`${config.baseUrl}/admin/products/getproductdata`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pid),
    })
      .then((res) => res.json())
      .then(({ error, data, CODE, selected }) => {
        setisLoading(false)
        if (CODE == 200) {
          var img_url = `${config.baseUrl}/uploads/products/` + data[0].product_image;

          setP_category(data[0].product_category)

          setP_name(data[0].product_name)
          setP_price_type(data[0].product_price_type)
          setP_weight(data[0].product_weight)
          setProductWeightInKg(data[0].weight_in_kg)
          setProductWeightInGm(data[0].weight_in_gm)
          setP_price(data[0].product_price)
          setP_description(data[0].product_description)
          setP_image(img_url)
          setP_image_name(data[0].product_image)
          setP_status(data[0].product_status)
          /*var product_type = data[0].product_type;
          var resptype = product_type.split(",");
          */
          setP_type(selected)
          setSelectProductTypes(selected)

        } else {
          alert('Fail')
        }
      });
  }, [history]);

  const onSubmit = (data, e) => {

    if (SelectProductTypes.length > 0) {
      setMessage({
        data: "In progress...",
        type: "alert-warning",
      });

      var product_categoty = data.product_categoty;

      var formData = new FormData();

      const typs = SelectProductTypes.map(item => item.type_id).join(',');

      formData.append('user_id', USER_ID);
      formData.append('product_id', productid);
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
      formData.append('product_status', P_status);

      fetch(`${config.baseUrl}/admin/products/updateproduct`, {
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
              data: error || "Updated successfully",
              type: error ? "alert-danger" : "alert-success",
            });
            // }
          } else {
            alert('Fail')
          }

          setTimeout(function () {
            setMessage('');
          }, 2000)


        });
    } else {
      setProductTypeError('Select product type')
    }
  };

  const fileOnChange = (e) => {
    if (e.target.files[0]) {
      setP_image_name(URL.createObjectURL(e.target.files[0]));
      setProductImage(e.target.files[0]);
    }
  }

  const inputOnChange = (e) => {
    var name = e.target.name;
    var value = e.target.value;
    if (name === 'product_name') {
      setP_name(value);
    } else if (name === 'product_weight') {
      setP_weight(value);
    } else if (name === 'product_price') {
      setP_price(value);
    } else if (name === 'product_description') {
      setP_description(value);
    }
  }

  const onChangeCategory = (e) => {
    setP_category(e.target.value);
  }

  const onChangeProductType = (e) => {
    setP_type(e.target.value);
  }

  const onChangeProductPriceType = (e) => {
    setP_price_type(e.target.value);

  }

  function onChangeStatus(e) {
    var status = e.target.value
    setP_status(status);
  }

  const deleteProductImage = () => {
    var formsdata = { "product_id": productid, "image": P_image_name }

    fetch(`${config.baseUrl}/deleteproductimage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formsdata),
    })
      .then((res) => res.json())
      .then(({ error, data, CODE }) => {
        if (CODE == 200) {
          setProduct_image_err('Select a image')
        } else {
          alert('Fail')
        }
      });
  }

  async function onSelecType(selectedList, selectedItem) {
    setProductTypeError('')
    await setSelectProductTypes(selectedList)
  }

  async function onRemoveType(selectedList, removedItem) {
    await setSelectProductTypes(selectedList)
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
      setP_price(value)
    } else {
      if (pattern_exp.test(value)) {
        setP_price(value)
      }
    }
  }


  if (!isLoading) {
    return (
      <>
        <Header />


        <form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">

          <span className="blank_space d-flex align-items-center">
            <h2></h2>

            <button type="submit" className="nav-link btn btn-primary ml-auto theme_button top_fixed_buton">Update</button>

            <Link to='/products' className="nav-link btn btn-primary theme_button top_fixed_buton nav-back">Back</Link>

          </span>

          {EditSetting &&

            <div className="middle_content rolelist col-md-7 mt-2 mb-4">
              <div className="content">

                <div className="container-xl">
                  <div className="card">
                    <div className={styles.loginFormContainer}>

                      <fieldset className="roundProduct rounded">
                        {message && (
                          <div
                            className={`alert alertProduct fade show d-flex ${message.type}`}
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
                        <div className="row formProduct">
                          <div className="col-md-6">
                            <div className="form-group mb-2">
                              <label htmlFor="inputForCategory">Product Name</label>
                              <span className="mandatory">*</span>
                              <input
                                id="inputForEmail"
                                name="product_name"
                                type="text"
                                value={P_name}
                                onChange={inputOnChange}
                                className="form-control"
                                aria-describedby="Enter Product Name"
                                ref={register({
                                  required: {
                                    value: true,
                                    message: "Enter Product Name",
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
                              <label htmlFor="inputForRole">Product Categoty</label>
                              <span className="mandatory">*</span>
                              <select
                                name="product_categoty"
                                onChange={onChangeCategory}
                                value={P_category}
                                className="form-control"
                                aria-describedby="Product Categoty"
                                ref={register({
                                  required: {
                                    value: true,
                                    message: "Select Product Categoty",
                                  },
                                })}
                              >
                                <option value="">Select category</option>

                                {ProductCategory.map((item) =>
                                  <option key={item.id} value={item.id}>{item.parentcat}, {item.product_category_name}</option>
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
                                selectedValues={P_type}
                                ref={multiselectRef}
                                displayValue="type_name"
                                showCheckbox={true}
                              />

                              {ProductTypeError && (
                                <span className={`${styles.errorMessage} mandatory`}>
                                  {ProductTypeError}
                                </span>
                              )}

                              <input
                                name="product_type"
                                type="hidden"
                                value={SelectProductTypes}
                                ref={register({
                                  required: {
                                    value: true,
                                    message: "Select Product Type",
                                  },
                                })}
                              />

                              {errors.product_type && (
                                <span className={`${styles.errorMessage} mandatory`}>
                                  {errors.product_type.message}
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
                                onChange={onChangeProductPriceType}
                                value={P_price_type}
                                aria-describedby="Product Product Price Type"
                                ref={register({
                                  required: {
                                    value: true,
                                    message: "Select Product Price Type",
                                  },
                                })}
                              >

                                <option value="">Select </option>

                                {ProductPriceTypes.map((item) =>
                                  <option key={item.price_type_id} value={item.price_type_id}>{item.price_type_name}</option>
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
                                value={ProductWeightInKg}
                                onChange={changeWeightInKg}
                                ref={register({
                                  required: {
                                    value: true,
                                    message: "Enter Product Weight",
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
                                value={ProductWeightInGm}
                                onChange={changeWeightInGm}
                                ref={register({
                                  required: {
                                    value: true,
                                    message: "Enter Product Weight",
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
                                value={P_price}
                                onChange={changeProductPrice}
                                className="form-control"
                                aria-describedby="Enter Product Price"
                                ref={register({
                                  required: {
                                    value: true,
                                    message: "Enter Product Price",
                                  },
                                  pattern: {
                                    value: /^[+-]?\d*(?:[.,]\d*)?$/,
                                    message: 'Enter Product Weight decimal number.',
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
                                value={P_description}
                                onChange={inputOnChange}
                                className="form-control"
                                aria-describedby="Enter Product Description"
                                ref={register({
                                  required: {
                                    value: true,
                                    message: "Enter Product Description",
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
                              <span className="mandatory"></span>
                              <input
                                id="inputForEmail"
                                name="product_image"
                                type="file"
                                className="form-control"
                                aria-describedby="Enter Product Image"
                                onChange={fileOnChange}

                              />

                              {Product_image_err && (
                                <span className={`${styles.errorMessage} mandatory`}>
                                  Select product image
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="col-md-5">
                            <img className="form_product_image" src={P_image_name} alt="new" />
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
                                value={P_status}
                                ref={register({
                                  required: {
                                    value: true,
                                    message: "select status",
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
  } else {
    return (
      <>
        <span className="loading_view align-items-center justify-content-center d-flex w-100 h-100 min-vh-100">
          <img
            src={require("../../loader/loader.gif")}
            alt=""
          />
        </span>
      </>
    )
  }
}