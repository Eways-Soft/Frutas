import React, { useEffect, useState } from "react";
import * as Icon from 'react-feather';
import { useHistory, Link } from "react-router-dom";
import { AgGridColumn, AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import config from "../../config";
import Header from "../includes/Header";
import Footer from "../includes/Footer";
import Sidebar from "../includes/Sidebar";

const TableHeader = ["#", "Username", "Password"];

const List = () => {
  const [dashboard, setDashboard] = useState(null);
  const [Cities, setCities] = useState(null);

  const history = useHistory();

  const [UserRoleSetting, setUserRoleSetting] = useState([]);
  const [ShowSetting, setShowSetting] = useState(false);
  const [AddSetting, setAddSetting] = useState(false);
  const [EditSetting, setEditSetting] = useState(false);
  const [DeleteSetting, setDeleteSetting] = useState(false);

  const [isLoading, setisLoading] = useState(true)

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

    fetch(`${config.baseUrl}/admin/getAllSubscriptionCities`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then(({ error, data }) => {
        setisLoading(false)
        data = data.reverse()
        setCities(data)

      });
  }, [history]);

  const deleteCall = (id) => {
    const confirm = window.confirm("Are you sure to delete ?");
    if (confirm) {
      var formsdata = { "id": id }

      fetch(`${config.baseUrl}/admin/deletediscount`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formsdata),
      })
        .then((res) => res.json())
        .then(({ error, data, CODE }) => {
          if (CODE == 200) {
            window.location.reload(false)
          } else {
            alert('Fail')
          }
        });
    }
  };

  if (!isLoading) {
    return (
      <>

        <Header />

        <span className="blank_space d-flex align-items-center">
          <h2></h2>
          {AddSetting &&
            <Link to="/addcity" className="nav-link btn btn-primary ml-auto theme_button top_fixed_buton" >Add New</Link>
          }
        </span>

        <div className="az-content-wrapper">
          <div className="container-fluid d-flex h-100 mb-auto p-0">
            {/* <Sidebar /> */}

            {ShowSetting &&

              <div className="middle_content userlist w-100 mt-2">
                <div className="content">

                  <div className="container-fluid">
                    <div className="card">
                   

                      <div className="ag-theme-alpine" style={{ height: '435px', width: '100%', }}>
                       
                      <AgGridReact
                         pagination={true}
                         paginationPageSize ='10'
                          defaultColDef={{
                            width: 150,
                            editable: true,
                            filter: 'agTextColumnFilter',
                            floatingFilter: true,
                            resizable: true,
                          }}
                          defaultColGroupDef={{ marryChildren: true }}
                          columnTypes={{
                            numberColumn: {
                              width: 130,
                              filter: 'agNumberColumnFilter',
                            },
                            medalColumn: {
                              width: 100,
                              columnGroupShow: 'open',
                              filter: false,
                            },
                            nonEditableColumn: { editable: false },
                            dateColumn: {
                              filter: 'agDateColumnFilter',
                              filterParams: {
                                comparator: function (filterLocalDateAtMidnight, cellValue) {
                                  var dateParts = cellValue.split('/');
                                  var day = Number(dateParts[0]);
                                  var month = Number(dateParts[1]) - 1;
                                  var year = Number(dateParts[2]);
                                  var cellDate = new Date(year, month, day);
                                  if (cellDate < filterLocalDateAtMidnight) {
                                    return -1;
                                  } else if (cellDate > filterLocalDateAtMidnight) {
                                    return 1;
                                  } else {
                                    return 0;
                                  }
                                },
                              },
                            },
                          }}
                          rowData={Cities}
                        >
                        <AgGridColumn headerName="Edit" field="city_id" sortable={false} editable={false}
                          filter={false}
                          cellClass={'editcolumn'}
                          width="70px"
                          cellRendererFramework={(data) => {
                            return (
                              <Link to={'/editcity/'+ data.data.city_id } ><i class="icon-pencil"></i></Link>
                            )
                          }}
                        />
                        <AgGridColumn headerName="Sr. No." field="id"
                           width="90px"
                           filter={false}
                          cellRenderer={(data) => {
                            console.log(data.node.rowIndex)
                            return (
                              `<p>${data.node.rowIndex+1}</p>`
                            )
                          }}/>
                          <AgGridColumn headerName="name" field="city_name" />
                          <AgGridColumn headerName="Status" field="city_status" sortable={true}
                            cellRendererFramework={(data) => {
                             
                              if (!data.value) {
                                return (
                                  <p style={{ color: 'red' }}>{data.value}</p>
                                )
                              } else {
                                return (
                                 
                                  <p style={{color:'green'}}>{data.value}</p>
                                )
                              }
                             
                          }}
                          
                          />


                        </AgGridReact>


                      </div>
                    </div>
                  </div>


                </div>
              </div>
            }
          </div>
        </div>
        <Footer />
      </>
    );
  } else {
    return (
      <>
        <span className="loading_view align-items-center justify-content-center d-flex w-100 h-100 min-vh-100">
          <img
            src={require("../../loader/loader.gif")}
            alt=""
          />
        </span>
      </>
    )
  }
};

export default List;
