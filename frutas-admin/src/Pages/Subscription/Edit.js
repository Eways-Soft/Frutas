import React, { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";

//import { CartProvider, useCart } from "react-use-cart";
import { CartProvider, useCart } from "../../components/react-use-cart";
import { Multiselect } from 'multiselect-react-dropdown';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import config from "../../config";
import styles from "../Users/Index.css";
import Header from "../includes/Header";
import Footer from "../includes/Footer";


var TotalPriceAddedProduct = 0;
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

function Page(props) {
  const { register, handleSubmit, errors } = useForm();
  const [BasketPageNo, setBasketPageNo] = useState('1');
  const [pageignationProductsPage, setpageignationProductsPage] = useState('1');
  const [ProductsWeight, setProductsWeight] = useState();
  const [Products, setProducts] = useState([]);
  const [alreadyAdded, setalreadyAdded] = useState();
  const [search, setsearch] = useState();
  const [searchPage, setsearchPage] = useState('1');
  const [Baskets, setBaskets] = React.useState();
  const { addItem, inCart } = useCart();
  const {
    metadata,
    isEmpty,
    cartTotal,
    cartWeight,
    totalUniqueItems,
    items,
    updateItemQuantity,
    removeItem,
    emptyCart
  } = useCart();

  const history = useHistory();
  useEffect(() => {
    var id = window.location.href.split('/').reverse()[0]
    calculateWeight();
    getSubscriptionData();
    fetch(`${config.baseUrl}/admin/baskets/getBasketsIntoSubscription?id=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(({ error, data, CODE, products }) => {
        setProducts(products);
        if (error) {
        } else {
        }
      });

  }, [history]);

  function getSubscriptionData() {
    var id = window.location.href.split('/').reverse()[0]
    var formsdata = { "id": id }
    emptyCart()
    fetch(`${config.baseUrl}/admin/subscription/getSubscriptionData`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formsdata),
    })
      .then((res) => res.json())
      .then(({ error, data, CODE, baskets }) => {

        if (CODE == 200) {
          {
            baskets.map((item) => {
              addItem(item)
            })
          }
        } else {
        }


      });
  }

  function productSelect(data, e) {
    const alreadyAdded = inCart(data.id);
    if (alreadyAdded) {
      removeItem(data.id)
    } else {
      addItem(data)
    }
  }

  function calculateWeight() {
    var Weight = items.reduce(function (total, item) { return total + item.quantity * item.product_weight; }, 0);
    setProductsWeight(Weight)
  }

  function searchProducts(e) {
    var searchProducts = e.target.value;
    setsearch(searchProducts)
  }

  function defaultChecked(basket_id) {
    var returns = false;
    {
      items.map(p => {
        if (p.basket_id === basket_id) {
          returns = true;
        }
      })
    }
    return returns
  }

  return (

    <div className="card p-3">

      <div className="pb-2 ml-auto text-right w-50">
        <span className="d-flex align-items-center font-weight-medium">Baskets : <b className="cart_numeric">{Products.length}</b></span>
      </div>

      <div className="d-flex align-items-center justify-content-between my-3"></div>
      <div className="cart_product_list">
        {Products ?
          <div className="list-group list-group-flush">
            {Products.map(p => {

              const alreadyAdded = inCart(p.basket_id);

              return (
                <div className="list-group-item">

                  <div className="row align-items-center">

                    <div className="col-auto p-0">
                      <a href="#">
                        <span className="avatar"><img src={`${p.basket_image}`} /></span>
                      </a>
                    </div>
                    <div className="col text-truncate">
                      <a href="#" className="text-body d-block">{p.basket_name} </a>
                      <small className="d-block text-muted text-truncate mt-n1">Discount :{p.discount_name}, Basket For : {p.basket_for_name}</small>
                      <small className="d-block text-muted text-truncate mt-n1">Price :{p.price},  Weight :{p.basket_weight}</small>
                    </div>

                    <div className="col-auto"></div>

                  </div>
                </div>
              );
            })}
          </div>

          :
          <div><p>No data found!..</p></div>
        }
      </div>
    </div>

  );
}

function Cart(props) {
  const { register, handleSubmit, errors } = useForm();
  const [message, setMessage] = useState();

  const [subscriptionData, setsubscriptionData] = useState([]);
  const [Types, setTypes] = useState([]);

  const [Image, setImage] = React.useState([]);
  const [ImageShow, setImageShow] = React.useState();
  const [Cties, setCties] = useState([]);

  const [TypeError, setTypeError] = React.useState();

  const [City, setCity] = React.useState();
  const [Validity, setValidity] = React.useState();

  const [Status, setStatus] = React.useState();

  const [Name, setName] = React.useState();
  const [Price, setPrice] = React.useState();
  const [SKU, setSKU] = React.useState();
  const [Descrption, setDescrption] = React.useState();

  const history = useHistory();

  const multiselectRef = useRef(null);

  const { addItem, inCart } = useCart();
  const {
    metadata,
    isEmpty,
    cartTotal,
    cartWeight,
    totalUniqueItems,
    items,
    updateItemQuantity,
    removeItem,
    emptyCart
  } = useCart();

  useEffect(() => {
    //alert(id)
    getSubscriptionData()

    fetch(`${config.baseUrl}/subscriptionActiveCities`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(({ error, data, CODE }) => {

        if (CODE == 200) {
          setCties(data)
        } else {
          //alert('Fail')
        }
      });

  }, [history]);

  function getSubscriptionData() {

    var id = window.location.href.split('/').reverse()[0]

    var formsdata = { "id": id }

    fetch(`${config.baseUrl}/admin/subscription/getSubscriptionData`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formsdata),
    })
      .then((res) => res.json())
      .then(({ error, data, CODE, baskets }) => {
        
        if (CODE == 200) {

          setsubscriptionData(data[0])

          if (data[0] != null) {
            setName(data[0].subscription_name);
            setDescrption(data[0].subscription_description);

            setCity(data[0].subscription_city);

            var validity = data[0].subscription_validity

              var dateFuntion = new Date(validity);
              var year = dateFuntion.getFullYear();
              var month = dateFuntion.getMonth()+1;
              var day = dateFuntion.getDate()+1;

              if(month < 10){
                month = '0'+month;
              }

              if(day < 10){
                day = '0'+day;
              }

              var date = year+'-'+month+'-'+day;


            var dateFun = new Date(date);
            setValidity(dateFun);
            setImageShow(data[0].subscription_image);
            setStatus(data[0].subscription_status);
          }

        } else {
        }
      });
  }

  const onSubmit = (postdata, e) => {
    var id = window.location.href.split('/').reverse()[0]

    var USER_ID = localStorage.getItem("USER_ID");

    setMessage({
      data: "In progress...",
      type: "alert-warning",
    });

    var formData = new FormData();
    formData.append('userid', USER_ID);
    formData.append('id', id);
    formData.append('subscription_name', postdata.subscription_name);
    formData.append('subscription_city', postdata.subscription_city);
    formData.append('subscription_validity', Validity);
    formData.append('subscription_description', postdata.subscription_description);
    formData.append('status', postdata.status);
    formData.append('image', Image);

    fetch(`${config.baseUrl}/admin/subscription/updatesubscription`, {
      method: "POST",
      headers: {
      },
      body: formData,
    })
      .then((res) => res.json())
      .then(({ error, data, CODE }) => {
        
        if (CODE == 200) {
          setMessage({
            data: error || "Updated successfully",
            type: error ? "alert-danger" : "alert-success",
          });

        } else {
          setMessage({
            data: data,
            type: "alert-warning",
          });
        }

        setTimeout(function () {
                setMessage('');
              }, 2000)
              
      });


  };

  function resetValues() {
    multiselectRef.current.resetSelectedValues();
  }

  function onSelecType(selectedList, selectedItem) {
    setTypeError('')
    selectedList.map((item) => {
      setTypes(selectedList)
    })
  }

  function onRemoveType(selectedList, removedItem) {
    selectedList.map((item) => {
      setTypes(selectedList)
    })
  }

  function onChangeCity(e) {
    var status = e.target.value
    setCity(status);
  }

  function onChangeValidity(e) {
    var status = e.target.value
    setValidity(status);
  }

  function onChangeStatus(e) {
    var status = e.target.value
    setStatus(status);
  }

  const fileOnChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      setImageShow(URL.createObjectURL(e.target.files[0]));
    }
  }

  function inputNameChange(event) {
    const value = event.target.value;
    setName(value);
  }

  function inputPriceChange(event) {
    const value = event.target.value;
    setPrice(value);
  }

  function inputSKUcodeChange(event) {
    const value = event.target.value;
    setSKU(value);
  }

  function inputDescriptionChange(event) {
    const value = event.target.value;
    setDescrption(value);
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off" >
        <span className="blank_space d-flex align-items-center">
          <h2></h2>
          
          <button type="submit" className="nav-link btn btn-primary ml-auto theme_button top_fixed_buton">Update</button>

          <Link to='/subscription' className="nav-link btn btn-primary theme_button top_fixed_buton nav-back">Back</Link>

        </span>

        <div className="middle_content rolelist col-md-12 row mt-2 mb-4">
          <div className="col-md-7">
            <div className="col-md-12 m-auto">
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
                                <label htmlFor="inputForRole">Subscription Name</label>
                                <span className="mandatory">*</span>

                                <input
                                  id="inputForEmail"
                                  name="subscription_name"
                                  type="text"
                                  className="form-control"
                                  placeholder=""
                                  value={Name}
                                  onChange={inputNameChange}
                                  ref={register({
                                    required: {
                                      value: true,
                                      message: "Please Enter Subscription Name",
                                    },
                                  })}
                                />

                                {errors.subscription_name && (
                                  <span className={`${styles.errorMessage} mandatory`}>
                                    {errors.subscription_name.message}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="col-md-6">
                              <div className="form-group mb-2">
                                <label htmlFor="inputForRole">Subscription City</label>
                                <span className="mandatory">*</span>

                                <select
                                  name="subscription_city"
                                  className="form-control"
                                  value={City}
                                  onChange={onChangeCity}
                                  ref={register({
                                    required: {
                                      value: true,
                                      message: "Please Select Subscription City",
                                    },
                                  })}
                                >

                                  <option key="0" value="">Select </option>

                                  {Cties.map((item) =>
                                    <option key={item.city_id} value={item.city_id}>{item.city_name}</option>
                                  )}

                                </select>

                                {errors.subscription_city && (
                                  <span className={`${styles.errorMessage} mandatory`}>
                                    {errors.subscription_city.message}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="col-md-6">
                              <div className="form-group mb-2">
                                <label htmlFor="inputForRole">Subscription Validity</label>
                                <span className="mandatory">*</span>

                                <DatePicker
                                  selected={Validity}
                                  onChange={(date) => setValidity(date)}
                                  dateFormat="dd-MM-yyyy"
                                  minDate={new Date()}
                                />

                                {errors.subscription_validity && (
                                  <span className={`${styles.errorMessage} mandatory`}>
                                    {errors.subscription_validity.message}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="col-md-12">
                              <div className="form-group mb-2">
                                <label htmlFor="inputForRole">Subscription Description</label>
                                <span className="mandatory">*</span>

                                <textarea
                                  id="inputForEmail"
                                  name="subscription_description"
                                  type="text"
                                  className="form-control"
                                  aria-describedby="Enter Subscription Description"
                                  placeholder=""
                                  value={Descrption}
                                  onChange={inputDescriptionChange}
                                  ref={register({
                                    required: {
                                      value: true,
                                      message: "Please Enter Subscription Description",
                                    },
                                  })}
                                />

                                {errors.subscription_description && (
                                  <span className={`${styles.errorMessage} mandatory`}>
                                    {errors.subscription_description.message}
                                  </span>
                                )}

                              </div>
                            </div>

                            <div className="col-md-6">
                              <div className="form-group mb-2">
                                <label htmlFor="inputForRole">Subscription Image</label>
                                <span className="mandatory">*</span>

                                <input
                                  id="inputForEmail"
                                  name="image"
                                  type="file"
                                  className="form-control"
                                  placeholder=""
                                  onChange={fileOnChange}
                                  ref={register({
                                    required: {
                                      value: false,
                                      message: "Please Select Subscription Image",
                                    },
                                  })}
                                />

                                {errors.image && (
                                  <span className={`${styles.errorMessage} mandatory`}>
                                    {errors.image.message}
                                  </span>
                                )}

                              </div>
                            </div>

                            <div className="col-md-3">
                              {ImageShow &&

                                <img src={ImageShow} className="form_product_image" alt="new" />

                              }
                            </div>

                            <div className="col-md-3">
                              <div className="form-group">
                                <label htmlFor="inputForRole">Subscription Status</label>
                                <span className="mandatory">*</span>

                                <select
                                  name="status"
                                  className="form-control"
                                  value={Status}
                                  onChange={onChangeStatus}
                                  ref={register({
                                    required: {
                                      value: true,
                                      message: "Please select status",
                                    },
                                  })}
                                >

                                  <option key="0" value="">Select </option>

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

                            <div className="d-flex align-items-center mt-2">
                              
                            </div>
                          </div>

                        </fieldset>
                      </div>
                    </div>

                </div>
              </div>
            </div>
          </div>

          <div className="col-md-5">
            <div className="m-auto">
              <div className="content">

                <Page />

              </div>
            </div>
          </div>

        </div>
      
        </form>              

    </>
  );
}

export default function Edit(props) {

  useEffect(() => {

  });

  return (
    <CartProvider
      id="jamie">

      <Header />
          
      <Cart />

      <Footer />

    </CartProvider>


  );
}




