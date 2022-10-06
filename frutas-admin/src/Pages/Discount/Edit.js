import React, { useEffect, useState, useParams } from "react";
import { useHistory,Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import Select from "react-select";
import styles from "../Users/Index.css";
import config from "../../config";
import Header from "../includes/Header";
import Footer from "../includes/Footer";

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
  const [DiscountData, setDiscountData] = useState();
  const [Name, setName] = useState();
  const [Discount, setDiscount] = useState();
  const [Status, setStatus] = useState();

  const [ImageShow, setImageShow] = React.useState();
  const [Image, setImage] = useState([]);
  const [ImageRequired, setImageRequired] = React.useState(false);

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

    var show = checkMenuesSettings('41');
    if(show){
      setShowSetting(true)
    }
    var add = checkMenuesSettings('42');
    if(add){
      setAddSetting(true)
    }
    var edit = checkMenuesSettings('43');
    if(edit){
      setEditSetting(true)
    }
    var deletes = checkMenuesSettings('44');
    if(deletes){
      setDeleteSetting(true)
    }

    function checkMenuesSettings(id) {
      var returns = settings.includes(id);
      return returns;
    }

    var discdata = {"id":id}

    fetch(`${config.baseUrl}/admin/discounts/getdiscount`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(discdata)
    })
    .then((res) => res.json())
    .then(({ error, data,CODE }) => {    
      if(CODE == 200){
        setDiscountData(data)
        if (data) {
          setName(data[0].discount_name)
          setDiscount(data[0].discount)
          setStatus(data[0].status)
          setImageShow(data[0].image)
        }

        


      }else{
        
      }      
    });

          
  }, [history]);

  const onSubmit = (data, e) => {
    e.preventDefault();

    setMessage({
        data: "In progress...",
        type: "alert-warning",
      });

    var formData = new FormData();

      formData.append('id', id);
      formData.append('name', Name);
      formData.append('discount', Discount);
      formData.append('status', Status);
      formData.append('image', Image);
      

    fetch(`${config.baseUrl}/admin/discounts/updatediscount`, {
      method: "POST",
      headers: {
      },
      body: formData,
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

  function onChangeName(e) {    
    var name = e.target.value
    setName(name);
  }

  function onChangeDiscount(e) {    
    var value = e.target.value
    setDiscount(value);
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

  return (
    <>
      <Header />

      <form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">


      <span className="blank_space d-flex align-items-center">
        <h2></h2>
        
        <button type="submit" className="nav-link btn btn-primary ml-auto theme_button top_fixed_buton">Update</button>

        <Link to='/discounts' className="nav-link btn btn-primary theme_button top_fixed_buton nav-back">Back</Link>

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
                    
                    <div className="formProduct">
                      <div className="form-group mb-2">
                        <label htmlFor="inputForEmail">Name</label>
                        <span className="mandatory">*</span>
                        <input
                          id="inputForEmail"
                          name="name"
                          value={Name}
                          type="text"
                          onChange={onChangeName}
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
                        <label htmlFor="inputForPassword">Discount</label>
                        <span className="mandatory">*</span>
                        <input
                          type="text"
                          name="discount"
                          value={Discount}
                          className="form-control"
                          onChange={onChangeDiscount}
                          placeholder=""
                          ref={register({
                            required: {
                              value: true,
                              message: "Please enter discount",
                            },
                          })}
                        />
                        {errors.discount && (
                          <span className={`${styles.errorMessage} mandatory`}>
                            {errors.discount.message}
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
                          onChange= {fileOnChange}
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

      
      <Footer/>
    </>
  );
};
