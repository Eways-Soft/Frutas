import React, { useEffect, useState, useParams } from "react";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import Select from "react-select";
import styles from "../Users/Index.css";
import { Link } from "react-router-dom";
import config from "../../config";
import Header from "../includes/Header";
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

export default function Edit(props) {
  const { register, handleSubmit, errors } = useForm();
  const [message, setMessage] = useState();
  const [ParentCategories, setParentCategories] = useState([]);
  const [Parent, setParent] = useState();
  const [Name, setName] = useState();
  const [Status, setStatus] = useState();

  const [ImageShow, setImageShow] = React.useState();
  const [Image, setImage] = useState([]);
  const [ImageRequired, setImageRequired] = React.useState(false);

  const history = useHistory();

  const id = window.location.href.split('/').reverse()[0];

  useEffect(() => {

      getParentCats()

      getSubsciptionCatdata()

          
  }, [history]);

  function getParentCats(){
    fetch(`${config.baseUrl}/getparentsubscriptioncategories`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => res.json())
      .then(({ error, data,CODE }) => {  
        if(CODE == 200){
          setParentCategories(data)
        }else{
          
        }      
      });
  }

  function getSubsciptionCatdata(){
    var catData = {"id":id}
    fetch(`${config.baseUrl}/getparentsubscriptioncategory`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(catData),
      })
      .then((res) => res.json())
      .then(({ error, data,CODE }) => {    
        if(CODE == 200){  
          setParent(data[0].parent_id)
          setName(data[0].subscription_category_name)
          setStatus(data[0].subscription_category_status)
        }else{
          
        }      
      });
  }

  const onSubmit = (data, e) => {
    e.preventDefault();

    setMessage({
        data: "In progress...",
        type: "alert-warning",
      });

      var formdata = {'id':id,'parent_category':Parent,'name':Name,'status':Status}

    fetch(`${config.baseUrl}/updatesubscriptioncategory`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formdata)
    })
      .then((res) => res.json())
      .then(({ error, data,CODE,userexist }) => {   
        if (error) {
          setMessage({
            data: error || error,
            type: error ? "alert-danger" : "alert-success",
          });
        }else{
          if(CODE == 200){           

            setMessage({
              data: error || "Updated successfully",
              type: error ? "alert-danger" : "alert-success",
            }); 
          }else{
            alert('Fail')
          }   
        }   

        setTimeout(function () {
                setMessage('');
              }, 2000)
        
      });
  };

  function onChangeCategory(e) {    
    var value = e.target.value
    setParent(value);
  }

  function onChangeName(e) {    
    var name = e.target.value
    setName(name);
  }

  function onChangeStatus(e) {    
    var status = e.target.value
    setStatus(status);
  }

  return (
    <>
      <Header />

      <div className="middle_content rolelist col-md-4">
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
            {/* <legend
              className={`${styles.loginFormLegend} border rounded p-1 text-center`}
            >Add New Discount
            </legend> */}
            <form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">

               <div className="form-group mb-2">
                <label htmlFor="inputForRole">Parent Category</label>
                <span className="mandatory"></span>
                <select 
                  name="parent_category"
                  className="form-control"
                  aria-describedby=""
                  value={Parent}
                  onChange={onChangeCategory}
                  ref={register({
                    required: {
                      value: false,
                      message: "Please select role type",
                    },
                  })}
                >

                <option value="">Select category</option>
                {ParentCategories.map((item) =>
                  <option key={item.subscription_category_id} value={item.subscription_category_id}>{item.subscription_category_name}</option>
                )}
                </select>    
              </div>

              <div className="form-group mb-2">
                <label htmlFor="inputForEmail">Name</label>
                <span className="mandatory">*</span>
                <input
                  id="inputForEmail"
                  name="name"
                  type="text"
                  value={Name}
                  className="form-control"
                  placeholder=""
                  onChange={onChangeName}
                  ref={register({
                    required: {
                      value: true,
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

              <div className="form-group mb-2">
                <label htmlFor="inputForPassword">Status</label>
                <span className="mandatory">*</span>
                <select 
                  name="status"
                  className="form-control"
                  onChange={onChangeStatus}                  
                  value={Status}
                  ref={register({
                    required: {
                      value: true,
                      message: "Please select status",
                    },
                  })}
                >

                  <option value="">Select status</option>

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

             
              <div className="d-flex align-items-center pt-3">

                <button type="submit" className="btn btn-primary theme_button">
                  Update
                </button>

                
              </div>
            </form>
          </fieldset>
        </div>
        
      </div>
      </div>
      </div>
      </div>


    </>
  );
};
