import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { CartProvider, useCart } from "react-use-cart";
import Header from "../includes/Header";
import { useHistory } from "react-router-dom";

import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import config from "../../config";
import styles from "../Users/Index.css";

function Page(props) {
  const [pageignationProductsPage, setpageignationProductsPage] = useState('1');
  const [ProductsWeight, setProductsWeight] = useState();
  const [Products, setProducts] = useState([]);
  const [alreadyAdded, setalreadyAdded] = useState();
  const history = useHistory();
  useEffect(() => {  

    calculateWeight();

    fetch(`${config.baseUrl}/getAllPageignationProducts?page=${pageignationProductsPage}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => res.json())
    .then(({ error, data,CODE,products }) => {    
      setProducts(products);
      if(error){
        
      }else{
       
      }      
    });
    
  }, [history]);

  const { addItem, inCart } = useCart();
  const {
    isEmpty,
    cartTotal,
    cartWeight,
    totalUniqueItems,
    items,
    updateItemQuantity,
    removeItem,
    emptyCart
  } = useCart();

  function productSelect(data,e){
    
    const alreadyAdded = inCart(data.id);
    if(alreadyAdded){
      removeItem(data.id)
    }else{
      addItem(data)
    }
  }

  function calculateWeight(){
    var Weight = items.reduce(function (total, item) { return total + item.quantity * item.product_weight; }, 0);

    setProductsWeight(Weight)
  }


  function searchProducts(e){
    var searchProducts = e.target.value;
  }

  function defaultChecked(id){
    var returns = false;
    {items.map(p =>{
      if(p.id === id){
        returns = true;
      }
    })}
    return returns
    
    
  }

  return (
    
        <div className="card">
          Products : {totalUniqueItems}, Total Price : {cartTotal}, Total Weight : {cartWeight}
          <button onClick={emptyCart}>Un select all</button>

          <div>
              
              {Products ?
                <div className="list-group list-group-flush">
                  {Products.map(p => {
                    const alreadyAdded = inCart(p.id);

                    return (
                        <div className="list-group-item">
                        
                          <div className="row align-items-center">
                            <div className="col-auto">
                              <input 
                                  className="form-check-input"
                                  type="checkbox" 
                                  name="roles_settings"
                                  defaultChecked={defaultChecked(p.id)}
                                  onChange={(e) => productSelect(p,e)}
                                />
                            </div>
                            <div className="col-auto p-0">
                              <a href="#">
                                <span className="avatar"><img src={`${config.baseUrl}/${p.product_image}`} /></span>
                              </a>
                            </div>
                            <div className="col text-truncate">
                              <a href="#" className="text-body d-block">{p.product_name}</a>
                              <small className="d-block text-muted text-truncate mt-n1">({p.price}) ({p.price})</small>
                              <small className="d-block text-muted text-truncate mt-n1">{p.price}</small>
                            </div>
                            {alreadyAdded ?
                              <div className="col-auto">
                                {items.map(item => (
                                  <div>
                                    {item.id == p.id && (
                                      <div className="num-block skin-2">
                                        <div className="num-in">
                                          <span className="minus dis" 
                                              onClick={() => updateItemQuantity(item.id, item.quantity - 1,p.product_weight)}></span>
                                          <input type="text" className="in-num" value={item.quantity} />
                                          <span className="plus" 
                                              onClick={() => updateItemQuantity(item.id, item.quantity + 1,item.product_weight)}></span>
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
        
  );
}

export default function Index() {
  
  return (
    <>
      <div>
        
        <Page />
      </div>
      
    </>
  );
}

