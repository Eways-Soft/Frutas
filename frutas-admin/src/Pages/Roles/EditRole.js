import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

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

export default function EditRole(props) {
  const { register, handleSubmit, errors } = useForm();
  const [message, setMessage] = useState();
  const [roles, setRoles] = useState([]);
  const [rolessettings, setRolesSettings] = useState([]);
  const [Rolename, set_Rolename] = useState();
  const [Rolesettigns, set_Rolesettigns] = useState([]);
  const [Rolemenus, set_Rolemenus] = useState([]);

  const [FirstRoleSetting, setFirstRoleSetting] = useState(1);
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

    var show = checkMenuesSettings('25');
    if (show) {
      setShowSetting(true)
    }
    var add = checkMenuesSettings('26');
    if (add) {
      setAddSetting(true)
    }
    var edit = checkMenuesSettings('27');
    if (edit) {
      setEditSetting(true)
    }
    var deletes = checkMenuesSettings('28');
    if (deletes) {
      setDeleteSetting(true)
    }

    function checkMenuesSettings(id) {
      var returns = settings.includes(id);
      return returns;
    }

    fetch(`${config.baseUrl}/admin/role/getrolebothsettings`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(({ error, roles_menu, role_settings, CODE }) => {
        if (CODE == 200) {
          setRoles(roles_menu)
          setRolesSettings(role_settings)
        } else {
          alert('Fail')
        }
      });

    var roledata = { "id": id }

    fetch(`${config.baseUrl}/admin/role/getroledata`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(roledata),
    })
      .then((res) => res.json())
      .then(({ error, data, CODE }) => {

        if (CODE == 200) {
          var img_url = `${config.baseUrl}/uploads/products/` + data[0].product_image;

          set_Rolename(data[0].role_menu_name)

          var role_menu_ids = data[0].role_menu_ids.split(',');
          set_Rolemenus(role_menu_ids)

          var role_setting_ids = data[0].role_setting_ids.split(',');
          set_Rolesettigns(role_setting_ids)
        } else {
          alert('Fail')
        }
      });

  }, [history]);

  const onSubmit = (data, e) => {
    e.preventDefault();

    var formData = { 'id': id, 'role_name': Rolename, 'roles_menu': data.roles_menu, 'roles_settings': data.roles_settings }

    setMessage({
      data: "In progress...",
      type: "alert-warning",
    });


    fetch(`${config.baseUrl}/admin/role/updaterole`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
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
            data: error || error,
            type: error ? "alert-danger" : "alert-danger",
          });
        }

        setTimeout(function () {
                setMessage('');
              }, 2000)

        
      });

  };

  const inputOnChange = (e) => {
    set_Rolename(e.target.value);
  }

  const checkboxChecked = () => {
    //Rolesettigns.find(o => o === item.role_setting_id)
    return true;
  }

  function update() {
    setFirstRoleSetting(FirstRoleSetting + 1)
  }

  return (
    <>
      <Header />

      <form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">

      <span className="blank_space d-flex align-items-center">
        <h2></h2>

        <button type="submit" className="nav-link btn btn-primary ml-auto theme_button top_fixed_buton">Update</button>

          <Link to='/roles' className="nav-link btn btn-primary theme_button top_fixed_buton nav-back">Back</Link>
        
      </span>

      {EditSetting &&

        <div className="middle_content rolelist col-md-4 mt-2 mb-4">
          <div className="content">

            <div className="container-xl">
              <div className="card roundProduct1">
                {message && (
                  <div
                    className={`alert alertRoles fade show d-flex ${message.type}`}
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
                
                  <Row className="formProduct">
                    <Col>
                      <Tabs defaultActiveKey="tab1"
                        id="controlled-tab-example">

                        <Tab eventKey="tab1" title="Role" className="p-3">
                          <div className="form-label col-12 col-form-label m-0">
                            <label htmlFor="inputForEmail">Role Name</label>
                            <span className="mandatory">*</span>
                            <input type="text" name="id" value={id} style={{ display: 'none' }} />
                            <input
                              className="form-control"
                              id="inputForRoleName"
                              name="role_name"
                              type="text"
                              value={Rolename}
                              onChange={inputOnChange}
                              ref={register({
                                required: {
                                  value: true,
                                  message: "Please enter role name",
                                },
                              })}
                            />
                          </div>
                        </Tab>

                        <Tab eventKey="tab2" title="Role Menu" className="p-3">
                          <ul className="list-unstyled m-0">
                            {roles.map((item) =>
                              <li key={item.role_menu_id} className="d-flex align-items-center">

                                <input
                                  className="mr-2 form-check-input"
                                  type="checkbox"
                                  name="roles_menu"
                                  defaultChecked={Rolemenus.find(o => o == item.role_menu_id)}
                                  value={item.role_menu_id}
                                  ref={register({
                                    required: {
                                      value: false,
                                    },
                                  })}
                                />
                                <label>{item.menu_name}</label>
                              </li>
                            )}
                          </ul>
                        </Tab>

                        <Tab eventKey="tab3" title="Role Settings" className="p-3">
                          <ul className="list-unstyled m-0 role-setting-list">

                            {roles.map((menuitem) =>
                              <li key={menuitem.role_menu_id} className="d-flex align-items-flex-start flex-column"><p className="font-weight-bold m-0 mt-1">{menuitem.menu_name} : </p>

                                <ul className="list-unstyled m-0 pl-3">
                                  {rolessettings.map((item) => {
                                    if (menuitem.role_menu_id == item.menu_id) {
                                      return (
                                        <li key={item.role_setting_id} className="d-flex align-items-start flex-row">
                                          <input
                                            className="mr-2 form-check-input"
                                            type="checkbox"
                                            name="roles_settings"
                                            defaultChecked={Rolesettigns.find(o => o == item.role_setting_id)}
                                            value={item.role_setting_id}
                                            ref={register({
                                              required: {
                                                value: false,
                                                message: "Please enter username",
                                              },
                                            })}
                                          />
                                          <label>{item.role_setting_name}</label>
                                        </li>
                                      )
                                    }
                                  })}
                                </ul>
                              </li>
                            )}
                          </ul>
                        </Tab>

                      </Tabs>
                    </Col>
                  </Row>
                  <div className="d-flex align-items-center p-3 pt-0">

                    

                    {errors.role_name && (
                      <span className={`${styles.errorMessage} mandatory`}>
                        {errors.role_name.message}
                      </span>
                    )}

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
}