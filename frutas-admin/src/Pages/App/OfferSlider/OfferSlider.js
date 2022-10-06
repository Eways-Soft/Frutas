import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { FileUploader } from "react-drag-drop-files";

import config from "../../../config";
import Header from "../../includes/Header";
import Footer from "../../includes/Footer";
import styles from "../../Users/Index.css";

const fileTypes = ["JPG", "JPeG", "PNG", "GIF","jpg","jpeg","png"];

const OfferSlider = () => {
  const { register, handleSubmit, errors } = useForm();
  const [message, setMessage] = useState();

  
  const [Image, setImage] = useState([]);
  const [Status, set_Status] = React.useState('1');

  const history = useHistory();

  const [UserRoleSetting, setUserRoleSetting] = useState([]);
  const [ShowSetting, setShowSetting] = useState(false);
  const [AddSetting, setAddSetting] = useState(false);
  const [EditSetting, setEditSetting] = useState(false);
  const [DeleteSetting, setDeleteSetting] = useState(false);

  const [isLoading, setisLoading] = useState(false)

  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [file3, setFile3] = useState(null);
  const [file4, setFile4] = useState(null);
  const [file5, setFile5] = useState(null);
  const [file6, setFile6] = useState(null);
  const [ImageShow1, setImageShow1] = React.useState();
  const [ImageShow2, setImageShow2] = React.useState();
  const [ImageShow3, setImageShow3] = React.useState();
  const [ImageShow4, setImageShow4] = React.useState();
  const [ImageShow5, setImageShow5] = React.useState();
  const [ImageShow6, setImageShow6] = React.useState();

  useEffect(() => {

    var role_master = JSON.parse(window.localStorage.getItem('role_master'));
    var settings = role_master.role_setting_ids.split(',');

    setUserRoleSetting(settings);

    var show = checkMenuesSettings('33');
    if (show) {
      setShowSetting(true)
    }
    var add = checkMenuesSettings('34');
    if (add) {
      setAddSetting(true)
    }
    var edit = checkMenuesSettings('35');
    if (edit) {
      setEditSetting(true)
    }
    var deletes = checkMenuesSettings('36');
    if (deletes) {
      setDeleteSetting(true)
    }

    function checkMenuesSettings(id) {
      var returns = settings.includes(id);
      return returns;
    }

  }, [history]);

  async function onSubmit(data, e){
    console.log(data.slider_content)

    var formData = new FormData();

    formData.append('slider_content', data.slider_content);
    formData.append('image', Image);

    setMessage({
      data: "In progress...",
      type: "alert-warning",
    });

    var configurl = "http://localhost:9000";

    fetch(`${configurl}/admin/app/mainslider/addappmainslider`, {
      method: "POST",
      headers: {
      },
      body: formData
    })
      .then((res) => res.json())
      .then(({ error, data, CODE }) => {
        if (CODE == 200) {
          setMessage({
            data: error || "Added successfully",
            type: error ? "alert-danger" : "alert-success",
          });

          e.target.reset();
        } else {
          setMessage({
            data: error || error,
            type: error ? "alert-danger" : "alert-danger",
          });
        }

        setTimeout(function () {
                setMessage('');
              }, 2000)
        
      });
  }

  const handleChange1 = file => {
    
    setFile1(file);
    setImageShow1(URL.createObjectURL(file));
  };

  const handleChange2 = file => {
    setFile2(file);
    setImageShow2(URL.createObjectURL(file));
  };

  const handleChange3 = file => {
    setFile3(file);
    setImageShow3(URL.createObjectURL(file));
  };

  const handleChange4 = file => {
    setFile4(file);
    setImageShow4(URL.createObjectURL(file));
  };

  const handleChange5 = file => {
    setFile5(file);
    setImageShow5(URL.createObjectURL(file));
  };

  const handleChange6 = file => {
    setFile6(file);
    setImageShow6(URL.createObjectURL(file));
  };


  if (!isLoading) {
    return (
      <>

        <Header />

        <form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">

          <span className="blank_space d-flex align-items-center">
            <h2></h2>        

            <button type="submit" className="nav-link btn btn-primary ml-auto theme_button top_fixed_buton">Update</button>

            <Link to='/basketcategories' className="nav-link btn btn-primary theme_button top_fixed_buton nav-back">Back</Link>

          </span>


          <div className="row">
            <div className="col-md-4">
              <FileUploader 
                handleChange={handleChange1} 
                name="file" 
                types={fileTypes} 
              />

              <img src={ImageShow1} className="" alt="new" />

            </div>

            <div className="col-md-4">
              <FileUploader 
                handleChange={handleChange2} 
                name="file" 
                types={fileTypes} 
              />

              <img src={ImageShow2} className="form_product_image" alt="new" />

            </div>

            <div className="col-md-4">
              <FileUploader 
                handleChange={handleChange3} 
                name="file" 
                types={fileTypes} 
              />

              <img src={ImageShow3} className="form_product_image" alt="new" />

            </div>
          </div>

          <div className="row">
            <div className="col-md-4">
              <FileUploader 
                handleChange={handleChange4} 
                name="file" 
                types={fileTypes} 
              />

              <img src={ImageShow4} className="form_product_image" alt="new" />

            </div>

            <div className="col-md-4">
              <FileUploader 
                handleChange={handleChange5} 
                name="file" 
                types={fileTypes} 
              />

              <img src={ImageShow5} className="form_product_image" alt="new" />

            </div>

            <div className="col-md-4">
              <FileUploader 
                handleChange={handleChange6} 
                name="file" 
                types={fileTypes} 
              />

              <img src={ImageShow6} className="form_product_image" alt="new" />


            </div>
          </div>


        </form>

        <Footer />
      </>
    );
  } else {
    return (
      <>
        <span className="loading_view align-items-center justify-content-center d-flex w-100 h-100 min-vh-100">
          <img
            src={require("../../../loader/loader.gif")}
            alt=""
          />
        </span>
      </>
    )
  }
};

export default OfferSlider;
