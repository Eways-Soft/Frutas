import React, { useEffect, useState, useRef } from "react";
import { useHistory, Link } from "react-router-dom";

import { CartProvider, useCart } from "../../components/basket-use-cart";
import { Multiselect } from 'multiselect-react-dropdown';
import MultipleValueTextInput from 'react-multivalue-text-input';

import { useForm } from "react-hook-form";
import config from "../../config";
import styles from "../Users/Index.css";
import Header from "../includes/Header";
import Footer from "../includes/Footer";

var TotalPriceAddedProduct = 0;

const id = window.location.href.split('/').reverse()[0];
//alert(id)
const USER_ID = localStorage.getItem("USER_ID");

//window.localStorage.removeItem("react-use-cart-jamie");

const pattern_exp = /^\d*(\.\d{0,2})?$/;

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

const YesNoArr = [
  {
    label: "No",
    value: "0",
  },
  {
    label: "Yes",
    value: "1",
  },
];

function Page(props) {
  const { register, handleSubmit, errors } = useForm();
  const [pageignationProductsPage, setpageignationProductsPage] = useState('1');
  const [ProductsWeight, setProductsWeight] = useState();
  const [Products, setProducts] = useState([]);
  const [BasProducts, setBasProducts] = useState([]);
  const [alreadyAdded, setalreadyAdded] = useState();
  const [search, setsearch] = useState();
  const [searchPage, setsearchPage] = useState('1');
  const [IsLoadning, setIsLoadning] = useState(false);

  const { addItem, inCart } = useCart();
  const {
    metadata,
    isEmpty,
    cartTotal,
    cartWeight,
    cartWeightgm,
    totalUniqueItems,
    items,
    updateItemQuantity,
    removeItem,
    emptyCart
  } = useCart();

  const history = useHistory();

  useEffect(() => {
    //console.log('localStorage :',localStorage.getItem('basket-use-cart'))
    async function init() {
      await emptyCart();


      await getbasketproducts(); 
      await getAllActiveProducts();       
    }

    init();
  }, [history]);

  useEffect(() => {
    console.log('dd')

    BasProducts.map((item) => {
      addItem(item, item.quantity, item.quantity, item.quantity)
    }) 

  }, [BasProducts]);

  async function getAllActiveProducts(){
    setIsLoadning(true)

    fetch(`${config.baseUrl}/admin/products/getAllActiveProducts`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => res.json())
    .then(({ error, data, CODE, products }) => {
      setIsLoadning(false)
      setProducts(products)
      if (error) {

      } else {

      }
    }); 
  }

  async function getbasketproducts() {
    fetch(`${config.baseUrl}/admin/baskets/getbasketsaveproducts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id })
    })
      .then((res) => res.json())
      .then(async ({ error, data, CODE }) => {
        if (CODE == 200) {       
          setBasProducts(data)   
                     
          setIsLoadning(false)
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

  function defaultChecked(id) {
    var returns = false;
    {
      items.map(p => {
        if (p.id === id) {
          returns = true;
        }
      })
    }
    return returns
  }

  function onSearch(e) {
    
    var text = e.target.value;

    fetch(`${config.baseUrl}/admin/products/getAllSearchProducts?page=${searchPage}&search=${text}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(({ error, data, CODE, products }) => {
        setProducts(products);

      });
  }

  //function updateQTY(data,itemid, quantity,product_weight){

  function updateQTY(pid, quantity, weight_kg, weight_gm, e) {

    var quantity = e.target.value
    updateItemQuantity(pid, quantity, weight_kg, weight_gm)
    //updateItemQuantity(pid, quantity,weight)

  }

  return (
    <>
      {!IsLoadning ?
        <div className="card p-3">

          {cartTotal > TotalPriceAddedProduct ?
            <div className="pb-2 ml-auto text-right w-50">
              <span className="d-flex align-items-center font-weight-medium">Products : <b className="cart_numeric" style={{ color: 'red' }}>{totalUniqueItems}</b></span>
              <span className="d-flex align-items-center font-weight-medium">Total Price : <b className="cart_numeric" style={{ color: 'red' }}>Rs. {cartTotal}</b></span>
              <span className="d-flex align-items-center font-weight-medium">Total Weight : <b className="cart_numeric" style={{ color: 'red' }}>{cartWeight} kg {cartWeightgm} gm</b></span>
            </div>
            :
            <div className="pb-2 ml-auto text-right w-50">
              <span className="d-flex align-items-center font-weight-medium">Products : <b className="cart_numeric">{totalUniqueItems}</b></span>
              <span className="d-flex align-items-center font-weight-medium">Total Price : <b className="cart_numeric">Rs. {cartTotal}</b></span>
              <span className="d-flex align-items-center font-weight-medium">Total Weight : <b className="cart_numeric">{cartWeight} kg {cartWeightgm} gm</b></span>
            </div>
          }

          <div className="d-flex align-items-center justify-content-between my-3">

            <div className="form-group w-50">
              <form >
                <input
                  id="inputForEmail"
                  name="search"
                  type="text"
                  className="form-control cart_search"
                  placeholder="Search"
                  onChange={(e) =>onSearch(e)}
                />
              </form>
            </div>
          </div>
          <div className="cart_product_list">
            {Products ?
              <div className="list-group list-group-flush">
                {Products.map(p => {
                  const alreadyAdded = inCart(p.product_id);

                  return (
                    <div className="list-group-item">

                      <div className="row align-items-center">
                        <div className="col-auto">
                          {alreadyAdded ?
                            <div>
                              {items.map(item => (
                                <div>
                                  {item.product_id === p.product_id && (
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      name="roles_settings"
                                      defaultChecked={defaultChecked(p.product_id)}
                                      onChange={(e) => productSelect(p, e)}
                                    />
                                  )}
                                </div>
                              ))}
                            </div>
                            :
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="roles_settings"
                              defaultChecked={defaultChecked(p.product_id)}
                              onChange={(e) => productSelect(p, e)}
                            />

                          }
                        </div>
                        <div className="col-auto p-0">
                          <a href="#">
                            <span className="avatar"><img src={`${p.product_image}`} /></span>
                          </a>
                        </div>
                        <div className="col text-truncate">
                          <a href="#" className="text-body d-block">{p.product_name} ({p.product_category_name})</a>
                          <small className="d-block text-muted text-truncate mt-n1">Type :{p.type_name}, Price Type:{p.price_type_name}</small>
                          <small className="d-block text-muted text-truncate mt-n1">Price :{p.price},  Weight :{p.weight_in_kg}kg {p.weight_in_gm}gm</small>
                        </div>
                        {alreadyAdded ?
                          <div className="col-auto">
                            {items.map(item => (
                              <div>
                                {item.product_id == p.product_id && (
                                  <div className="num-block skin-2">
                                    <div className="num-in">
                                      <span className="minus dis"
                                        onClick={() => updateItemQuantity(item.product_id, item.quantity - 1, p.weight_in_kg, p.weight_in_gm)}></span>

                                      <input
                                        id="inputForEmail"
                                        name="basket_sku_code"
                                        value={item.quantity}
                                        onChange={(e) => updateQTY(item.product_id, item.quantity, p.weight_in_kg, p.weight_in_gm, e)}
                                        type="text"
                                        className="in-num"
                                      />

                                      <span className="plus"
                                        onClick={() => updateItemQuantity(item.product_id, item.quantity + 1, item.weight_in_kg, item.weight_in_gm)}></span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                          :
                          <div className="col-auto"></div>
                        }
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

        :
        <>
        </>
      }
    </>

  );
}

function Cart(props) {
  const { register, handleSubmit, errors } = useForm();
  const [pageignationProductsPage, setpageignationProductsPage] = useState('1');
  const [Products, setProducts] = useState([]);
  const [roles, setRoles] = useState([]);
  const [message, setMessage] = useState();
  const [BasketCategory, setBasketCategory] = useState([]);
  const [Types, setTypes] = useState([]);
  const [BasketImage, setBasketImage] = React.useState([]);
  const [ImageShow, setImageShow] = React.useState();
  const [Productstatus, set_Productstatus] = React.useState('1');
  const [Validation, setValidation] = React.useState();
  const [Testing, setTesting] = React.useState('5');

  const [BasketFor, setBasketFor] = useState([]);
  const [selsectBasketFor, setselsectBasketFor] = useState([]);

  const [keywordsValue, setkeywordsValue] = React.useState([]);
  const [BasketCat, setBasketCat] = React.useState([]);
  const [BasketType, setBasketType] = React.useState([]);
  const [BasketDiscount, setBasketDiscount] = React.useState([]);
  const [Subscription, setSubscription] = React.useState([]);
  const [SubscriptionPlanMaster, setSubscriptionPlanMaster] = React.useState([]);
  const [SubscriptionPlan, setSubscriptionPlan] = React.useState([]);

  const [BasketCatError, setBasketCatError] = React.useState();
  const [BasketTypeError, setBasketTypeError] = React.useState();

  const [Name, setName] = React.useState();
  const [CompanyCost, setCompanyCost] = React.useState();
  const [SalePrice, setSalePrice] = React.useState();
  const [Weight, setWeight] = React.useState();
  const [SKUcode, setSKUcode] = React.useState();
  const [BasFor, setBasFor] = React.useState();
  const [BasDiscount, setBasDiscount] = React.useState();
  const [Recomend, setRecomend] = React.useState();
  const [BestSeller, setBestSeller] = React.useState();
  const [Description, setDescription] = React.useState();
  const [Status, setStatus] = React.useState();
  const [Image, setImage] = React.useState();
  const [SelectTypes, setSelectTypes] = React.useState([]);
  const [SelectedCat, setSelectedCat] = React.useState([]);
  const [BasketForValue, setBasketForValue] = useState([]);
  const [BasketCompanyCost, setBasketCompanyCost] = React.useState('');
  const [BasketSalePrice, setBasketSalePrice] = React.useState('');
  const [BasketActualSalePrice, setBasketActualSalePrice] = React.useState('');
  const [BasketDiscountPrice, setBasketDiscountPrice] = React.useState('');
  const [BasketDisc, setBasketDisc] = React.useState('');

  const [WeightInKg, setWeightInKg] = useState('');
  const [WeightInGm, setWeightInGm] = useState('');

  const history = useHistory();
  const multiselectRef1 = useRef(null);
  const multiselectRef = useRef(null);
  const multiselectRef2 = useRef(null);

  const { addItem, inCart } = useCart();
  const {
    metadata,
    isEmpty,
    cartTotal,
    cartWeight,
    cartWeightgm,
    totalUniqueItems,
    items,
    updateItemQuantity,
    removeItem,
    emptyCart
  } = useCart();

  useEffect(() => {

    fetch(`${config.baseUrl}/admin/baskets/getbasketdata`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ "id": id }),
    })
      .then((res) => res.json())
      .then(({ error, data, CODE, selected_type, selected_category, basket_products,selected_for }) => {

        if (CODE == 200) {
          setName(data[0].basket_name)
          setBasketCompanyCost(data[0].basket_company_cost)
          setSalePrice(data[0].basket_sale_price)
          setBasketActualSalePrice(data[0].actual_price)
          setWeight(data[0].basket_weight)
          setWeightInKg(data[0].basket_weight_in_kg)
          setWeightInGm(data[0].basket_weight_in_gm)
          setSKUcode(data[0].basket_sku_code)
          setBasFor(data[0].basket_for)
          setBasketDisc(data[0].basket_discount)
          setRecomend(data[0].recommended)
          setBestSeller(data[0].best_seller)
          setDescription(data[0].basket_description)
          setStatus(data[0].baskets_status)
          setImageShow(data[0].basket_image)

          setSelectTypes(selected_type)
          setBasketType(selected_type)

          setBasketCat(selected_category)
          setSelectedCat(selected_category)

          setselsectBasketFor(selected_for)

          if (data[0].keywords === '') {

          } else if (data[0].keywords === ',,') {

          } else {
            var oldKey = data[0].keywords

            var oldKey1 = oldKey.replace(/,\s*$/, "");
            var oldKey2 = oldKey1.replace(/^,/, '');
            //var keywrd = oldKey2.split(',');
            
            setkeywordsValue(oldKey2)
          }
          

        } else {
          //alert('Fail')
        }
      });
     
    fetch(`${config.baseUrl}/admin/baskets/getallactivebasketcategories`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(({ error, data, CODE }) => {

        if (CODE == 200) {
          setBasketCategory(data)
         
        } else {
          //alert('Fail')
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
          setTypes(data)
        } else {
          //alert('Fail')
        }
      });

    fetch(`${config.baseUrl}/getallbasketfor`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(({ error, data, CODE }) => {
        if (CODE == 200) {
          setBasketFor(data)
        } else {
          //alert('Fail')
        }
      });

    fetch(`${config.baseUrl}/admin/discounts/getAllBasketActiveDiscount`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(({ error, data, CODE }) => {
        if (CODE == 200) {
          setBasketDiscount(data)
        } else {
          //alert('Fail')
        }
      });

  }, [history]);

  const onSubmit = (postdata, e) => {

    //return false;
    if (BasketCat.length <= 0) {
      //setBasketCatError('Select basket category')
      return false;
    } else if (BasketType.length <= 0) {
      //setBasketTypeError('Select basket type')
      return false;
    } else {
      if (items.length > 0) {

        const categries = BasketCat.map(item => item.basket_category_id).join(',');
        const typs = BasketType.map(item => item.type_id).join(',');
        const basketFor = selsectBasketFor.map(item => item.basket_for_id).join(',');

        var keywds = ',' + keywordsValue + ',';

        setMessage({
          data: "In progress...",
          type: "alert-warning",
        });

        var basket_name = postdata.basket_name;

        var formData = new FormData();

        formData.append('user_id', USER_ID);
        formData.append('basket_id', id);
        formData.append('basket_name', postdata.basket_name);
        formData.append('basket_categoty', categries);
        formData.append('basket_company_cost', postdata.basket_company_cost);
        formData.append('basket_weight', postdata.basket_weight);
        formData.append('basket_weight_in_kg', postdata.weight_in_kg);
        formData.append('basket_weight_in_gm', postdata.weight_in_gm);
        formData.append('basket_sku_code', postdata.basket_sku_code);
        formData.append('basket_for', basketFor);
        formData.append('basket_type', typs);
        formData.append('recommended', postdata.recommended);
        formData.append('best_seller', postdata.best_seller);
        formData.append('basket_description', postdata.basket_description);
        formData.append('status', postdata.status);
        formData.append('basket_image', BasketImage);

        formData.append('total_products', totalUniqueItems);
        formData.append('total_price', cartTotal);
        //formData.append('total_weight', cartWeight);
        formData.append('total_weight_in_kg', cartWeight);
        formData.append('total_weight_in_gm', cartWeightgm);
        formData.append('products', JSON.stringify(items));
        formData.append('keywords', keywds);

        if (postdata.basket_discount != '') {
          var actual_price = BasketActualSalePrice
        } else {
          var actual_price = postdata.basket_sale_price
        }
        formData.append('basket_discount', postdata.basket_discount);
        formData.append('basket_sale_price', postdata.basket_sale_price);
        formData.append('actual_price', actual_price);
        formData.append('discount_price', BasketDiscountPrice);

        fetch(`${config.baseUrl}/admin/baskets/updatebasket`, {
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
      } else {
        alert('Please select at least one product')
      }
    }
  };

  function resetValues() {
    multiselectRef.current.resetSelectedValues();
    multiselectRef2.current.resetSelectedValues();
    multiselectRef1.current.resetSelectedValues();
  }

  const fileOnChange = (e) => {
    if (e.target.files[0]) {
      setBasketImage(e.target.files[0]);
      setImageShow(URL.createObjectURL(e.target.files[0]));
    }
  }

  function onChangeStatus(e) {
    var status = e.target.value
    set_Productstatus(status);
  }

  function changeSalePrice(e) {
    var value = e.target.value
    if (value == '') {
      setSalePrice(value)
    } else {
      if (pattern_exp.test(value)) {
        setSalePrice(value)
      }
    }

  }

  function onChangeDiscount(e) {
    var discount_val = e.target.value;
    var actual_discount = BasketDiscount.map((item, ind) => {
      if (discount_val == item.discount_id) {
        if (SalePrice != '') {
          var new_discount_val = SalePrice * item.discount / 100
          var new_sale_price = SalePrice - new_discount_val
          setBasketDisc(discount_val)
          setBasketActualSalePrice(Math.round(new_sale_price))
          setBasketDiscountPrice(Math.round(new_discount_val))
          //return item.discount
        } else {
          alert('Please enter sale price')
          setBasketDisc('')
        }
      } else if (discount_val == '') {
        setBasketDisc(discount_val)
        setBasketActualSalePrice('')
        setBasketDiscountPrice('')
      }

    })
  }

  async function onSelect(selectedList, selectedItem) {
    setBasketCatError('')
    await setBasketCat(selectedList)
  }

  async function onRemove(selectedList, removedItem) {
    await setBasketCat(selectedList)
  }

  async function onSelecType(selectedList, selectedItem) {
    setBasketTypeError('')
    await setBasketType(selectedList)
  }

  async function onRemoveType(selectedList, removedItem) {
    await setBasketType(selectedList)
  }

  async function onSelectFor(selectedList, selectedItem) {
    setBasketCatError('')
    await setselsectBasketFor(selectedList)
  }

  async function onRemoveFor(selectedList, removedItem) {
    await setselsectBasketFor(selectedList)
  }

  function changeName(e) {
    var val = e.target.value
    setName(val);
  }

  function change_C_cost(e) {
    var val = e.target.value
    setName(val);
  }

  function companyCost(e) {
    var companyCost = e.target.value
    TotalPriceAddedProduct = companyCost

    if (companyCost == '') {
      setBasketCompanyCost(companyCost)
    } else {
      if (pattern_exp.test(companyCost)) {
        setBasketCompanyCost(companyCost)
      }
    }
  }

  function changeWeightInKg(e) {
    var value = e.target.value;
    if (value == '') {
      setWeightInKg(value)
    } else {
      if (/^[0-9\b]+$/.test(value)) {
        setWeightInKg(value)
      }
    }
  }

  function changeWeightInGm(e) {
    var value = e.target.value;
    if (value == '') {
      setWeightInGm(value)
    } else {
      if (/^[0-9\b]+$/.test(value)) {
        setWeightInGm(value)
      }
    }
  }
  async function onSelectBasketFor(selectedList, selectedItem) {
    setBasketCatError('')
    await setBasketType(selectedList)
    setselsectBasketFor(selectedList)
    
   
  }

  async function onRemoveBasketFor(selectedList, removedItem) {
    await setBasketType(selectedList)
    setselsectBasketFor(selectedList)
  }


  return (
    <>

      <form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
        <span className="blank_space d-flex align-items-center">
          <h2></h2>

          <button type="submit" className="nav-link btn btn-primary ml-auto theme_button top_fixed_buton">Update</button>

          <Link to='/baskets' className="nav-link btn btn-primary theme_button top_fixed_buton nav-back">Back</Link>

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
                        <div className="row formProduct">

                          <div className="col-md-6">
                            <div className="form-group mb-2">
                              <label htmlFor="inputForRole">Basket Name</label>
                              <span className="mandatory">*</span>

                              <input
                                id="inputForEmail"
                                name="basket_name"
                                type="text"
                                value={Name}
                                onChange={(e) => { setName(e.target.value) }}
                                className="form-control"
                                aria-describedby="Enter Basket Name"
                                placeholder=""
                                ref={register({
                                  required: {
                                    value: true,
                                    message: "Enter Basket Name",
                                  },
                                })}
                              />

                              {errors.basket_name && (
                                <span className={`${styles.errorMessage} mandatory`}>
                                  {errors.basket_name.message}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="col-md-6">
                            <div className="form-group mb-2">
                              <label htmlFor="inputForRole">Basket Category</label>
                              <span className="mandatory">*</span>
                              <Multiselect
                                options={BasketCategory}
                                onSelect={onSelect}
                                onRemove={onRemove}
                                closeIcon="close"
                                selectedValues={SelectedCat}
                                ref={multiselectRef}
                                displayValue="basket_category_name"
                                showCheckbox={true}
                              />

                              {BasketCatError && (
                                <span className={`${styles.errorMessage} mandatory`}>
                                  {BasketCatError}
                                </span>
                              )}

                              <input
                                name="basket_categoty"
                                type="hidden"
                                value={BasketCat}
                                ref={register({
                                  required: {
                                    value: true,
                                    message: "Select Basket Category",
                                  },
                                })}
                              />

                              {errors.basket_categoty && (
                                <span className={`${styles.errorMessage} mandatory`}>
                                  {errors.basket_categoty.message}
                                </span>
                              )}

                            </div>
                          </div>

                          <div className="col-md-6">
                            <div className="form-group mb-2">
                              <label htmlFor="inputForRole">Basket Company Cost</label>
                              <span className="mandatory">*</span>

                              <input
                                id="inputForEmail"
                                name="basket_company_cost"

                                type="text"
                                className="form-control"
                                aria-describedby="Enter Basket Company Cost"
                                placeholder=""
                                value={BasketCompanyCost}
                                onChange={companyCost}

                                ref={register({
                                  required: {
                                    value: true,
                                    message: "Enter Basket Company Cost",
                                  },
                                  pattern: {
                                    value: /^[+-]?\d*(?:[.,]\d*)?$/,
                                    message: 'Please Enter decimal number.',
                                  },
                                })}
                              />

                              {errors.basket_company_cost && (
                                <span className={`${styles.errorMessage} mandatory`}>
                                  {errors.basket_company_cost.message}
                                </span>
                              )}

                            </div>
                          </div>

                          <div className="col-md-6">
                            <div className="form-group mb-2">
                              <label htmlFor="inputForRole">Basket Sale Price</label>
                              <span className="mandatory">*</span>

                              <input
                                id="inputForEmail"
                                name="basket_sale_price"

                                type="text"
                                value={SalePrice}
                                onChange={changeSalePrice}

                                className="form-control"
                                aria-describedby="Enter Basket Sale Price"
                                placeholder=""
                                ref={register({
                                  required: {
                                    value: true,
                                    message: "Enter Basket Sale Price",
                                  },
                                  pattern: {
                                    value: /^[+-]?\d*(?:[.,]\d*)?$/,
                                    message: 'Please Enter decimal number.',
                                  },
                                })}
                              />

                              {errors.basket_sale_price && (
                                <span className={`${styles.errorMessage} mandatory`}>
                                  {errors.basket_sale_price.message}
                                </span>
                              )}

                            </div>
                          </div>

                          <div className="col-md-3">
                            <div className="form-group mb-2">
                              <label htmlFor="inputForRole">Basket Weight In Kg</label>
                              <span className="mandatory">*</span>

                              <input
                                id="inputForEmail"

                                name="weight_in_kg"
                                type="text"
                                className="form-control"
                                placeholder=""
                                value={WeightInKg}
                                onChange={changeWeightInKg}
                                ref={register({
                                  required: {
                                    value: true,
                                    message: "Enter Basket Weight",
                                  },
                                  pattern: {
                                    value: /^[+-]?\d*(?:[.,]\d*)?$/,
                                    message: 'Basket Weight should be number.',
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
                              <label htmlFor="inputForRole">Basket Weight In Gm</label>
                              <span className="mandatory">*</span>

                              <input
                                id="inputForEmail"
                                name="weight_in_gm"
                                type="text"

                                className="form-control"
                                placeholder=""
                                value={WeightInGm}
                                onChange={changeWeightInGm}
                                ref={register({
                                  required: {
                                    value: true,
                                    message: "Enter Basket Weight",
                                  },
                                  pattern: {
                                    value: /^[+-]?\d*(?:[.,]\d*)?$/,
                                    message: 'Weight should be number.',
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
                              <label htmlFor="inputForRole">Basket SKU Code</label>
                              <span className="mandatory">*</span>

                              <input
                                id="inputForEmail"
                                name="basket_sku_code"
                                type="text"
                                value={SKUcode}
                                className="form-control"
                                aria-describedby="Enter Basket SKU Code"
                                placeholder=""
                                ref={register({
                                  required: {
                                    value: true,
                                    message: "Enter Basket SKU Code",
                                  },
                                })}
                              />

                              {errors.basket_sku_code && (
                                <span className={`${styles.errorMessage} mandatory`}>
                                  {errors.basket_sku_code.message}
                                </span>
                              )}

                            </div>
                          </div>

                          <div className="col-md-6">
                            <div className="form-group mb-2">
                              <label htmlFor="inputForRole">Basket For</label>
                              <span className="mandatory">*</span>

                              <Multiselect
                                options={BasketFor}
                                onSelect={onSelectFor}
                                onRemove={onRemoveFor}
                                closeIcon="close"
                                selectedValues={selsectBasketFor}
                                ref={multiselectRef}
                                displayValue="basket_for_name"
                                showCheckbox={true}
                              />

                              {BasketCatError && (
                                <span className={`${styles.errorMessage} mandatory`}>
                                  {BasketCatError}
                                </span>
                              )}

                              <input
                                name="basket_for"
                                type="hidden"
                                value={selsectBasketFor}
                                ref={register({
                                  required: {
                                    value: true,
                                    message: "Select Basket For",
                                  },
                                })}
                              />

                              {errors.basket_for && (
                                <span className={`${styles.errorMessage} mandatory`}>
                                  {errors.basket_for.message}
                                </span>
                              )}

                              

                              
                            </div>
                          </div>

                          <div className="col-md-6">
                            <div className="form-group mb-2">
                              <label htmlFor="inputForRole">Basket Type</label>
                              <span className="mandatory">*</span>
                              <Multiselect
                                options={Types}
                                onSelect={onSelecType}
                                onRemove={onRemoveType}
                                closeIcon="close"
                                selectedValues={SelectTypes}
                                ref={multiselectRef2}
                                displayValue="type_name"
                                showCheckbox={true}
                              />

                              {BasketTypeError && (
                                <span className={`${styles.errorMessage} mandatory`}>
                                  {BasketTypeError}
                                </span>
                              )}

                              <input
                                name="basket_typs"
                                type="hidden"
                                value={BasketType}
                                ref={register({
                                  required: {
                                    value: true,
                                    message: "Select Basket Types",
                                  },
                                })}
                              />

                              {errors.basket_typs && (
                                <span className={`${styles.errorMessage} mandatory`}>
                                  {errors.basket_typs.message}
                                </span>
                              )}


                            </div>
                          </div>

                          <div className="col-md-12">
                            <div className="form-group mb-2">
                              <label htmlFor="inputForRole">Basket Actual Sale Price</label>
                              <span className="mandatory"></span>

                              <input
                                id="inputForEmail"
                                name="actual_price"
                                type="text"
                                className="form-control"
                                onChange={changeSalePrice}
                                readOnly={true}
                                value={BasketActualSalePrice}
                                ref={register({
                                  required: {
                                    value: false,
                                    message: "Enter",
                                  },
                                })}
                              />

                            </div>
                          </div>

                          <div className="col-md-4">
                            <div className="form-group">
                              <label htmlFor="inputForRole">Basket Discount</label>
                              <span className="mandatory"></span>

                              <select
                                name="basket_discount"
                                value={BasDiscount}
                                className="form-control"
                                value={BasketDisc}
                                onChange={onChangeDiscount}
                                ref={register({
                                  required: {
                                    value: false,
                                    message: "select discount",
                                  },
                                })}
                              >
                                <option key="0" value="">Select </option>

                                {BasketDiscount.map((item) =>
                                  <option key={item.discount_id} value={item.discount_id}>{item.discount_name}</option>
                                )}


                              </select>

                            </div>
                          </div>

                          <div className="col-md-4">
                            <div className="form-group mb-2">
                              <label htmlFor="inputForRole">Recommended</label>
                              <span className="mandatory"></span>

                              <select
                                name="recommended"
                                value={Recomend}
                                onChange={(e) => { setRecomend(e.target.value) }}
                                className="form-control"
                                ref={register({
                                  required: {
                                    value: false,
                                    message: "Select Basket For Recommended",
                                  },
                                })}
                              >

                                {YesNoArr.map((option) =>
                                  <option key={option.value} value={option.value}>{option.label}</option>
                                )}

                              </select>

                            </div>
                          </div>

                          <div className="col-md-4">
                            <div className="form-group mb-2">
                              <label htmlFor="inputForRole">Best Seller</label>
                              <span className="mandatory"></span>

                              <select
                                name="best_seller"
                                value={BestSeller}
                                onChange={(e) => { setBestSeller(e.target.value) }}
                                className="form-control"
                                ref={register({
                                  required: {
                                    value: false,
                                    message: "Select Basket For Best Seller",
                                  },
                                })}
                              >

                                {YesNoArr.map((option) =>
                                  <option key={option.value} value={option.value}>{option.label}</option>
                                )}

                              </select>


                            </div>
                          </div>

                          <div className="col-md-12">
                            <div className="form-group mb-2">
                              <label htmlFor="inputForRole">Basket Keywords</label>
                              <span className="mandatory">*</span>

                              <textarea
                                id="inputForEmail"
                                name="basket_keywords"
                                type="text"
                                value={keywordsValue}
                                onChange={(e) => { setkeywordsValue(e.target.value) }}
                                className="form-control"
                                placeholder=""
                                ref={register({
                                  required: {
                                    value: true,
                                    message: "Enter Basket Keywords",
                                  },
                                })}
                              />

                              {errors.basket_keywords && (
                                <span className={`${styles.errorMessage} mandatory`}>
                                  {errors.basket_keywords.message}
                                </span>
                              )}

                            </div>
                          </div>

                          <div className="col-md-12">
                            <div className="form-group mb-2">
                              <label htmlFor="inputForRole">Basket Description</label>
                              <span className="mandatory">*</span>

                              <textarea
                                id="inputForEmail"
                                name="basket_description"
                                type="text"
                                value={Description}
                                onChange={(e) => { setDescription(e.target.value) }}
                                className="form-control"
                                aria-describedby="Enter Basket Description"
                                placeholder=""
                                ref={register({
                                  required: {
                                    value: true,
                                    message: "Enter Basket Description",
                                  },
                                })}
                              />

                              {errors.basket_description && (
                                <span className={`${styles.errorMessage} mandatory`}>
                                  {errors.basket_description.message}
                                </span>
                              )}

                            </div>
                          </div>

                          <div className="col-md-6">
                            <div className="form-group mb-2">
                              <label htmlFor="inputForRole">Basket Image</label>
                              <span className="mandatory">*</span>

                              <input
                                id="inputForEmail"
                                name="product_image"
                                type="file"
                                className="form-control"
                                aria-describedby="Enter Basket Image"
                                placeholder=""
                                onChange={fileOnChange}
                                ref={register({
                                  required: {
                                    value: false,
                                    message: "Select Basket Image",
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

                          <div className="col-md-3">
                            {ImageShow &&

                              <img src={ImageShow} className="form_product_image" alt="new" />

                            }
                          </div>

                          <div className="col-md-3">
                            <div className="form-group">
                              <label htmlFor="inputForRole">Basket Status</label>
                              <span className="mandatory">*</span>

                              <select
                                name="status"
                                value={Status}
                                className="form-control"
                                aria-describedby="Enter username"
                                onChange={(e) => { setStatus(e.target.value) }}
                                ref={register({
                                  required: {
                                    value: true,
                                    message: "select status",
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

                          {/* <div className="d-flex align-items-center mt-2">
                            <button type="submit" className="btn btn-primary theme_button">
                              Update
                            </button>
                          </div> */}


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

export default function Productslist(props) {
  return (

    <>
      <CartProvider>
        <Header />

        <Cart />

        <Footer />
      </CartProvider>
    </>


  );
}




