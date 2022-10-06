import React, { useEffect, useState, useParams } from "react";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import Select from "react-select";
import styles from "../Users/Index.css";
import { Link } from "react-router-dom";
import config from "../../config";
import Header from "../includes/Header";
import Footer from "../includes/Footer";

export default function Edit(props) {
  const { register, handleSubmit, errors } = useForm();
  const [message, setMessage] = useState();

  const [Subscriptions, setSubscriptions] = useState([]);
  const [Plans, setPlans] = useState([]);
  const [Deliveries, setDeliveries] = useState([]);
  const [Name, setName] = useState();

  const [SalePrice, setSalePrice] = useState();
  const [ActualSalePrice, setActualSalePrice] = useState();
  const [DiscountPrice, setDiscountPrice] = useState();

  const [Status, setStatus] = useState();

  const [ImageShow, setImageShow] = React.useState();
  const [Image, setImage] = useState([]);
  const [ImageRequired, setImageRequired] = React.useState(false);

  const [SelectedPlans, setSelectedPlans] = useState([]);


  const [Price11, setPrice11] = useState(false);
  const [Price12, setPrice12] = useState(false);
  const [Price13, setPrice13] = useState(false);
  const [WeekErrors_price1, setWeekErrors_price1] = useState(false);
  const [WeekErrors_price2, setWeekErrors_price2] = useState(false);
  const [WeekErrors_price3, setWeekErrors_price3] = useState(false);

  const [Price21, setPrice21] = useState(false);
  const [Price22, setPrice22] = useState(false);
  const [Price23, setPrice23] = useState(false);
  const [TwoWeekErrors_price1, setTwoWeekErrors_price1] = useState(false);
  const [TwoWeekErrors_price2, setTwoWeekErrors_price2] = useState(false);
  const [TwoWeekErrors_price3, setTwoWeekErrors_price3] = useState(false);

  const [Price31, setPrice31] = useState(false);
  const [Price32, setPrice32] = useState(false);
  const [Price33, setPrice33] = useState(false);
  const [MonthErrors_price1, setMonthErrors_price1] = useState(false);
  const [MonthErrors_price2, setMonthErrors_price2] = useState(false);
  const [MonthErrors_price3, setMonthErrors_price3] = useState(false);

  const [AllErrors_price, setAllErrors_price] = useState(true);


  const [SelectedPlansWeek, setSelectedPlansWeek] = useState(false);
  const [SelectedPlans2Week, setSelectedPlans2Week] = useState(false);
  const [SelectedPlansMonth, setSelectedPlansMonth] = useState(false);


  const [UserRoleSetting, setUserRoleSetting] = useState([]);
  const [ShowSetting, setShowSetting] = useState(false);
  const [AddSetting, setAddSetting] = useState(false);
  const [EditSetting, setEditSetting] = useState(false);
  const [DeleteSetting, setDeleteSetting] = useState(false);

  const history = useHistory();

  const id = window.location.href.split('/').reverse()[0];
  const USER_ID = localStorage.getItem("USER_ID");


  useEffect(() => {

    var role_master = JSON.parse(window.localStorage.getItem('role_master'));
    var settings = role_master.role_setting_ids.split(',');

    setUserRoleSetting(settings);

    var show = checkMenuesSettings('21');
    if (show) {
      setShowSetting(true)
    }
    var add = checkMenuesSettings('22');
    if (add) {
      setAddSetting(true)
    }
    var edit = checkMenuesSettings('23');
    if (edit) {
      setEditSetting(true)
    }
    var deletes = checkMenuesSettings('24');
    if (deletes) {
      setDeleteSetting(true)
    }

    function checkMenuesSettings(id) {
      var returns = settings.includes(id);
      return returns;
    }

    //getPlans()
    //getDeliveries()
    getSubscription()

    var discdata = { "id": id }

    fetch(`${config.baseUrl}/admin/baskets/getbasket`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(discdata)
    })
      .then((res) => res.json())
      .then(({ error, data, CODE }) => {
        if (CODE == 200) {
          if (data) {
            setName(data[0].basket_name)
            setSalePrice(data[0].basket_sale_price)
            setActualSalePrice(data[0].actual_price)
            setDiscountPrice(data[0].discount_price)
            setStatus(data[0].status)
            setImageShow(data[0].image)

          }

        }
      });

  }, [history]);

  function getSubscription() {
    fetch(`${config.baseUrl}/admin/baskets/getsubscriptionbaskets`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(({ error, data, CODE, subscription }) => {
        if (CODE == 200) {
          if (subscription) {
            setSubscriptions(subscription)
          }
        } else {

        }
      });
  }

  function getDeliveries() {
    fetch(`${config.baseUrl}/getdeliveries`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(({ error, data, CODE }) => {
        if (CODE == 200) {
          if (data) {
            setDeliveries(data)
          }
        } else {

        }
      });
  }

  async function onSubmit(data, e) {
    e.preventDefault();
    var valid = '0';
    console.log(SelectedPlansWeek + ' ' + SelectedPlans2Week + ' ' + SelectedPlansMonth)
    if (SelectedPlansWeek != '' || SelectedPlans2Week != '' || SelectedPlansMonth != '') {

      if (SelectedPlansWeek) {
        setSelectedPlans([...SelectedPlans, 1])

        setWeekErrors_price1(false)
        setWeekErrors_price2(false)
        setWeekErrors_price3(false)

        if (Price11 == '') {
          setWeekErrors_price1(true)
          valid = '0';
        } else if (Price12 == '') {
          setWeekErrors_price2(true)
          valid = '0';
        } else if (Price13 == '') {
          setWeekErrors_price3(true)
          valid = '0';
        } else {
          setWeekErrors_price1(false)
          setWeekErrors_price2(false)
          setWeekErrors_price3(false)
          valid = '1';
        }
      }

      if (SelectedPlans2Week) {
        setSelectedPlans([...SelectedPlans, 2])

        setTwoWeekErrors_price1(false)
        setTwoWeekErrors_price2(false)
        setTwoWeekErrors_price3(false)

        if (Price21 == '') {
          setTwoWeekErrors_price1(true)
          valid = '0';
        } else if (Price22 == '') {
          setTwoWeekErrors_price1(true)
          valid = '0';
        } else if (Price23 == '') {
          setTwoWeekErrors_price1(true)
          valid = '0';
        } else {
          setWeekErrors_price1(false)
          setWeekErrors_price2(false)
          setWeekErrors_price3(false)
          valid = '1';
        }
      }

      if (SelectedPlansMonth) {
        setSelectedPlans([...SelectedPlans, 3])

        setMonthErrors_price1(false)
        setMonthErrors_price2(false)
        setMonthErrors_price3(false)

        if (Price31 == '') {
          setMonthErrors_price1(true)
          valid = '0';
        } else if (Price32 == '') {
          setMonthErrors_price2(true)
          valid = '0';
        } else if (Price33 == '') {
          setMonthErrors_price3(true)
          valid = '0';
        } else {
          setMonthErrors_price1(false)
          setMonthErrors_price2(false)
          setMonthErrors_price3(false)
          valid = '1';
        }
      }

      console.log(valid)

      if (valid == '0') {
        return false;
      } else {

        //return false;
        setMessage({
          data: "In progress...",
          type: "alert-warning",
        });


        var formdata = { 'user_id': USER_ID, 'basket_id': id, 'subscription': data.subscription, 'plan1': SelectedPlansWeek, 'plan2': SelectedPlans2Week, 'plan3': SelectedPlansMonth, 'price11': data.price11, 'price12': data.price12, 'price13': data.price13, 'price21': data.price21, 'price22': data.price22, 'price23': data.price23, 'price31': data.price31, 'price32': data.price32, 'price33': data.price33 }

        fetch(`${config.baseUrl}/createDeliveryPlan`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formdata),
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
            }

            setTimeout(function () {
              setMessage('');
            }, 2000)


          });
      }
    } else {
      alert('Please select at least one plan')
    }
  };

  function onSelected(id) {
    if (id == '1') {
      if (SelectedPlansWeek) {
        setSelectedPlansWeek(false)
        unCheckPriceError(id)
      } else {
        setSelectedPlansWeek(true)
        checkPriceError(id)
      }
    }

    if (id == '2') {
      if (SelectedPlans2Week) {
        setSelectedPlans2Week(false)
        unCheckPriceError(id)
      } else {
        setSelectedPlans2Week(true)
        checkPriceError(id)
      }
    }

    if (id == '3') {
      if (SelectedPlansMonth) {
        setSelectedPlansMonth(false)
        unCheckPriceError(id)
      } else {
        setSelectedPlansMonth(true)
        checkPriceError(id)
      }
    }
  }

  function checkPriceError(id) {
    if (id == '1') {
      if (Price11 == '') {
        setWeekErrors_price1(true)
      } else {
        setWeekErrors_price1(false)
      }
      if (Price12 == '') {
        setWeekErrors_price2(true)
      } else {
        setWeekErrors_price2(false)
      }
      if (Price13 == '') {
        setWeekErrors_price3(true)
      } else {
        setWeekErrors_price3(false)
      }
    }

    if (id == '2') {
      if (Price21 == '') {
        setTwoWeekErrors_price1(true)
      } else {
        setTwoWeekErrors_price1(false)
      }
      if (Price22 == '') {
        setTwoWeekErrors_price2(true)
      } else {
        setTwoWeekErrors_price2(false)
      }
      if (Price23 == '') {
        setTwoWeekErrors_price3(true)
      } else {
        setTwoWeekErrors_price3(false)
      }
    }

    if (id == '3') {
      if (Price31 == '') {
        setMonthErrors_price1(true)
      } else {
        setMonthErrors_price1(false)
      }
      if (Price32 == '') {
        setMonthErrors_price2(true)
      } else {
        setMonthErrors_price2(false)
      }
      if (Price33 == '') {
        setMonthErrors_price3(true)
      } else {
        setMonthErrors_price3(false)
      }
    }
  }

  function unCheckPriceError(id) {
    if (id == '1') {
      setWeekErrors_price1(false)
      setWeekErrors_price2(false)
      setWeekErrors_price3(false)
    }

    if (id == '2') {
      setTwoWeekErrors_price1(false)
      setTwoWeekErrors_price2(false)
      setTwoWeekErrors_price3(false)
    }

    if (id == '3') {
      setMonthErrors_price1(false)
      setMonthErrors_price2(false)
      setMonthErrors_price3(false)
    }
  }

  const onChangeSubscription = async (e) => {


    var subscription_id = e.target.value

    var formdata = { 'user_id': USER_ID, 'basket_id': id, 'subscription_id': subscription_id }

    await fetch(`${config.baseUrl}/getbasketplanconfiguration`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formdata),
    })
      .then((res) => res.json())
      .then(({ error, data, CODE }) => {
        console.log('data ', data)
        //console.log('api ',SelectedPlans)


        setOldValueForCofiguration(data)

      });

  }

  const setOldValueForCofiguration = async (data) => {

    setSelectedPlansWeek(false)
    setSelectedPlans2Week(false)
    setSelectedPlansMonth(false)

    setPrice11('')
    setPrice12('')
    setPrice13('')
    setPrice21('')
    setPrice22('')
    setPrice23('')
    setPrice31('')
    setPrice32('')
    setPrice33('')

    setWeekErrors_price1(false)
    setWeekErrors_price2(false)
    setWeekErrors_price3(false)
    setTwoWeekErrors_price1(false)
    setTwoWeekErrors_price2(false)
    setTwoWeekErrors_price3(false)
    setMonthErrors_price1(false)
    setMonthErrors_price2(false)
    setMonthErrors_price3(false)

    console.log('start')

    var promises = await data.map((value, index) => {

      var plan_id = value.plan_id;

      if (plan_id == '1') {

        if (value.delivery_id == '1') {
          setPrice11(value.price)
        }
        if (value.delivery_id == '2') {
          setPrice12(value.price)
        }
        if (value.delivery_id == '3') {
          setPrice13(value.price)

          setSelectedPlansWeek(true)
          unCheckPriceError(plan_id)
        }

        //setSelectedPlansWeek(true)  

      }

      if (plan_id == '2') {
        if (value.delivery_id == '1') {
          setPrice21(value.price)
        }
        if (value.delivery_id == '2') {
          setPrice22(value.price)
        }
        if (value.delivery_id == '3') {
          setPrice23(value.price)
          setSelectedPlans2Week(true)
          unCheckPriceError(plan_id)
        }

        //setSelectedPlans2Week(true) 

      }

      if (plan_id == '3') {
        if (value.delivery_id == '1') {
          setPrice31(value.price)
        }
        if (value.delivery_id == '2') {
          setPrice32(value.price)
        }
        if (value.delivery_id == '3') {
          setPrice33(value.price)

          setSelectedPlansMonth(true)
          unCheckPriceError(plan_id)
        }

        //setSelectedPlansMonth(true) 


      }
    })
    console.log('end')

  }
console.log('Subscriptions',Subscriptions)
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
        <Header />

        <span className="blank_space d-flex align-items-center">
          <h2></h2>

          <button type="submit" className="nav-link btn btn-primary create-btn ml-auto theme_button top_fixed_buton">Update</button>

          <Link to="/plancofiguredlist" className="nav-link btn btn-primary theme_button top_fixed_buton" >Back</Link>
        </span>

        {EditSetting ?

          <div className="middle_content rolelist col-md-6 mt-2 mb-4">
            <div className="content">

              <div className="container-xl">
                <div className="card">
                  <div className={styles.loginFormContainer}>
                    {/* {message && (
                      <div className={`alert fade show d-flex ${message.type}`} role="alert">
                        {message.data}
                        <span
                          aria-hidden="true"
                          className="ml-auto cursor-pointer"
                          onClick={() => setMessage(null)}
                        >
                          &times;
                        </span>
                      </div>
                    )} */}

                    <fieldset className="roundProduct rounded">

                      {message && (
                        <div className={`alert alertProduct fade show d-flex ${message.type}`} role="alert">
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

                        <div class="col-md-6">
                          <div className="form-group mb-2">
                            <label htmlFor="inputForEmail">Name</label>
                            <span className="mandatory"></span>
                            <input
                              id="inputForEmail"
                              name="name"
                              value={Name}
                              type="text"
                              readonly="readonly"
                              className="form-control"
                              placeholder=""
                              ref={register({
                                required: {
                                  value: false,
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
                        </div>

                        <div class="col-md-6">
                          <div className="form-group mb-2">
                            <label htmlFor="inputForEmail">Basket Sale Price</label>
                            <span className="mandatory"></span>
                            <input
                              id="inputForEmail"
                              name="name"
                              value={SalePrice}
                              type="text"
                              readonly="readonly"
                              className="form-control"
                              placeholder=""
                              ref={register({
                                required: {
                                  value: false,
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
                        </div>

                        <div class="col-md-6">
                          <div className="form-group mb-2">
                            <label htmlFor="inputForEmail">Discount Price</label>
                            <span className="mandatory"></span>
                            <input
                              id="inputForEmail"
                              name="name"
                              value={DiscountPrice}
                              type="text"
                              readonly="readonly"
                              className="form-control"
                              placeholder=""
                              ref={register({
                                required: {
                                  value: false,
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
                        </div>

                        <div class="col-md-6">
                          <div className="form-group mb-2">
                            <label htmlFor="inputForEmail">Actual Sale Price</label>
                            <span className="mandatory"></span>
                            <input
                              id="inputForEmail"
                              name="name"
                              value={ActualSalePrice}
                              type="text"
                              readonly="readonly"
                              className="form-control"
                              placeholder=""
                              ref={register({
                                required: {
                                  value: false,
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
                        </div>

                        <div className="col-md-6">
                          <div className="form-group mb-2">
                            <label htmlFor="inputForRole">Subscriptions</label>
                            <span className="mandatory">*</span>

                            <select
                              name="subscription"
                              className="form-control"
                              onChange={onChangeSubscription}
                              ref={register({
                                required: {
                                  value: true,
                                  message: "Please Select subscription",
                                },
                              })}
                            >

                              <option key="0" value="">Select </option>

                              {Subscriptions.map((item) =>
                                <option key={item.subscription_id} value={item.subscription_id}>{item.subscription_name}</option>
                              )}

                            </select>

                            {errors.subscription && (
                              <span className={`${styles.errorMessage} mandatory`}>
                                {errors.subscription.message}
                              </span>
                            )}
                          </div>
                        </div>

                        <br />
                        <br />
                        <br />
                        <br />

                        <div className="row">
                          <div class="col-md-12"><span>Plans</span>
                          </div>
                        </div>


                        <br />

                        <div className="row">
                          <div class="col-md-12">
                            <input
                              className="mr-2 form-check-input"
                              type="checkbox"
                              name="plans"
                              value='1'
                              checked={SelectedPlansWeek}
                              onChange={(e) => onSelected(e.target.value)}
                              ref={register({
                                required: {
                                  value: false,
                                  message: "Please enter username",
                                },
                              })}
                            />

                            <span>Weekly</span>
                          </div>

                          <div class="col-md-4">
                            <div className="form-group mb-2">
                              <label htmlFor="inputForEmail">2-Basket/ Week</label>
                              <input
                                id="price"
                                name='price11'
                                type="number"
                                value={Price11}
                                className="form-control"
                                placeholder=""
                                onChange={(e) => setPrice11(e.target.value)}
                                ref={register({
                                  required: {
                                    value: false,
                                    message: "Please enter price",
                                  },
                                })}
                              />
                              {WeekErrors_price1 &&
                                <span className={`${styles.errorMessage} mandatory`}>
                                  Please enter price
                                </span>
                              }

                            </div>
                          </div>

                          <div class="col-md-4">
                            <div className="form-group mb-2">
                              <label htmlFor="inputForEmail">3-Basket/ Week</label>
                              <input
                                id="price"
                                name='price12'
                                type="number"
                                value={Price12}
                                className="form-control"
                                placeholder=""
                                onChange={(e) => setPrice12(e.target.value)}
                                ref={register({
                                  required: {
                                    value: false,
                                    message: "Please enter price",
                                  },
                                })}
                              />

                              {WeekErrors_price2 &&
                                <span className={`${styles.errorMessage} mandatory`}>
                                  Please enter price
                                </span>
                              }

                            </div>
                          </div>
                          <div class="col-md-4">
                            <div className="form-group mb-2">
                              <label htmlFor="inputForEmail">7-Basket/ Week</label>
                              <input
                                id="price"
                                name='price13'
                                type="number"
                                value={Price13}
                                className="form-control"
                                placeholder=""
                                onChange={(e) => setPrice13(e.target.value)}
                                ref={register({
                                  required: {
                                    value: false,
                                    message: "Please enter price",
                                  },
                                })}
                              />

                              {WeekErrors_price3 &&
                                <span className={`${styles.errorMessage} mandatory`}>
                                  Please enter price
                                </span>
                              }

                            </div>
                          </div>
                        </div>

                        <div className="row">
                          <div class="col-md-12">
                            <input
                              className="mr-2 form-check-input"
                              type="checkbox"
                              name="plans"
                              value='2'
                              checked={SelectedPlans2Week}
                              onChange={(e) => onSelected(e.target.value)}
                              ref={register({
                                required: {
                                  value: false,
                                  message: "Please enter username",
                                },
                              })}
                            />

                            <span>2-Week</span>
                          </div>


                          <div class="col-md-4">
                            <div className="form-group mb-2">
                              <label htmlFor="inputForEmail">2-Basket/ Week</label>
                              <input
                                id="price"
                                name='price21'
                                type="number"
                                value={Price21}
                                className="form-control"
                                placeholder=""
                                onChange={(e) => setPrice21(e.target.value)}
                                ref={register({
                                  required: {
                                    value: false,
                                    message: "Please enter price",
                                  },
                                })}
                              />

                              {TwoWeekErrors_price1 &&
                                <span className={`${styles.errorMessage} mandatory`}>
                                  Please enter price
                                </span>
                              }

                            </div>
                          </div>
                          <div class="col-md-4">
                            <div className="form-group mb-2">
                              <label htmlFor="inputForEmail">3-Basket/ Week</label>
                              <input
                                id="price"
                                name='price22'
                                type="number"
                                value={Price22}
                                className="form-control"
                                placeholder=""
                                onChange={(e) => setPrice22(e.target.value)}
                                ref={register({
                                  required: {
                                    value: false,
                                    message: "Please enter price",
                                  },
                                })}
                              />

                              {TwoWeekErrors_price2 &&
                                <span className={`${styles.errorMessage} mandatory`}>
                                  Please enter price
                                </span>
                              }

                            </div>
                          </div>
                          <div class="col-md-4">
                            <div className="form-group mb-2">
                              <label htmlFor="inputForEmail">7-Basket/ Week</label>
                              <input
                                id="price"
                                name='price23'
                                type="number"
                                value={Price23}
                                className="form-control"
                                placeholder=""
                                onChange={(e) => setPrice23(e.target.value)}
                                ref={register({
                                  required: {
                                    value: false,
                                    message: "Please enter price",
                                  },
                                })}
                              />

                              {TwoWeekErrors_price1 &&
                                <span className={`${styles.errorMessage} mandatory`}>
                                  Please enter price
                                </span>
                              }

                            </div>
                          </div>
                        </div>

                        <div className="row">
                          <div class="col-md-12">
                            <input
                              className="mr-2 form-check-input"
                              type="checkbox"
                              name="plans"
                              value='3'
                              checked={SelectedPlansMonth}
                              onChange={(e) => onSelected(e.target.value)}
                              ref={register({
                                required: {
                                  value: false,
                                  message: "Please enter username",
                                },
                              })}
                            />

                            <span>Monthly</span>
                          </div>


                          <div class="col-md-4">
                            <div className="form-group mb-2">
                              <label htmlFor="inputForEmail">2-Basket/ Week</label>
                              <input
                                id="price31"
                                name='price31'
                                type="number"
                                value={Price31}
                                className="form-control"
                                placeholder=""
                                onChange={(e) => setPrice31(e.target.value)}
                                ref={register({
                                  required: {
                                    value: false,
                                    message: "Please enter price",
                                  },
                                })}
                              />

                              {MonthErrors_price1 &&
                                <span className={`${styles.errorMessage} mandatory`}>
                                  Please enter price
                                </span>
                              }

                            </div>
                          </div>
                          <div class="col-md-4">
                            <div className="form-group mb-2">
                              <label htmlFor="inputForEmail">3-Basket/ Week</label>
                              <input
                                id="price32"
                                name='price32'
                                type="number"
                                value={Price32}
                                className="form-control"
                                placeholder=""
                                onChange={(e) => setPrice32(e.target.value)}
                                ref={register({
                                  required: {
                                    value: false,
                                    message: "Please enter price",
                                  },
                                })}
                              />

                              {MonthErrors_price2 &&
                                <span className={`${styles.errorMessage} mandatory`}>
                                  Please enter price
                                </span>
                              }

                            </div>
                          </div>
                          <div class="col-md-4">
                            <div className="form-group mb-2">
                              <label htmlFor="inputForEmail">7-Basket/ Week</label>
                              <input
                                id="price33"
                                name='price33'
                                type="number"
                                value={Price33}
                                className="form-control"
                                placeholder=""
                                onChange={(e) => setPrice33(e.target.value)}
                                ref={register({
                                  required: {
                                    value: false,
                                    message: "Please enter price",
                                  },
                                })}
                              />

                              {MonthErrors_price3 &&
                                <span className={`${styles.errorMessage} mandatory`}>
                                  Please enter price
                                </span>
                              }

                            </div>
                          </div>
                        </div>




                        {/* <div className="d-flex align-items-center pt-3">
                          <button type="submit" className="btn btn-primary theme_button">Update</button>
                        </div> */}
                        
                      </div>
                    </fieldset>
                  </div>

                </div>
              </div>
            </div>
          </div>

          :
          <div>
          </div>
        }
        <Footer />


      </form>


    </>
  );
};
