import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import config from "../../config";
import styles from "../Users/Index.css";
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
const Add = () => {
  const { register, handleSubmit, errors } = useForm();
  const [ImageShow, setImageShow] = React.useState();
  const [Image, setImage] = useState([]);
  const [ParentCategories, setParentCategories] = useState([]);
  const [message, setMessage] = useState();
  const [status, set_status] = useState();
  const history = useHistory();

  useEffect(() => {

    getParentCats();
    
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

  const onSubmit = (data, e) => {

      setMessage({
        data: "In progress...",
        type: "alert-warning",
      });
      
      fetch(`${config.baseUrl}/addnewsubscriptioncategory`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      .then((res) => res.json())
      .then(({ error, data,CODE }) => {    
        if(CODE == 200){

          setMessage({
            data: error || "Added successfully",
            type: error ? "alert-danger" : "alert-success",
          });

          e.target.reset();
          
          getParentCats();

          
        }else{
          
        }      

        setTimeout(function () {
                setMessage('');
              }, 2000)

        
      });
      
  };



  function onChangeStatus(e) {    
    var status = e.target.value
    set_status(status);
  }

  const fileOnChange = (e) => {
    setImage(e.target.files[0]);
    setImageShow(URL.createObjectURL(e.target.files[0]));
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
                  className="form-control"
                  placeholder=""
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
                  Create
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

export default Add;
