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

export default function ProductList(props) {
  const { register, handleSubmit, errors } = useForm();
  const [pageignationProductsPage, setpageignationProductsPage] = useState('1');
  const [ProductsWeight, setProductsWeight] = useState();
  const [Products, setProducts] = useState([]);
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
    setIsLoadning(true)
    calculateWeight();

    emptyCart()

    fetch(`${config.baseUrl}/admin/products/getAllActiveProducts`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(({ error, data, CODE, products }) => {
        setProducts(products)

        if (error) {

        } else {

        }
      });
      calculateWeight()
    getbasketproducts()
  }, [history]);

  async function getbasketproducts() {
    await fetch(`${config.baseUrl}/admin/baskets/getbasketsaveproducts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id })
    })
      .then((res) => res.json())
      .then(({ error, data, CODE }) => {

        if (CODE == 200) {
          {
            data.map((item) => {
              addItem(item, item.quantity, item.quantity, item.quantity)

            })
          }
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

  function onSearch(data, e) {
    e.preventDefault();

    fetch(`${config.baseUrl}/admin/products/getAllSearchProducts?page=${searchPage}&search=${search}`, {
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
              <form onSubmit={handleSubmit(onSearch)} noValidate autoComplete="off">
                <input
                  id="inputForEmail"
                  name="search"
                  type="text"
                  className="form-control cart_search"
                  placeholder="Search"
                  onChange={searchProducts}
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