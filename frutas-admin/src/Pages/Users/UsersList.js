import React, { useEffect, useState } from "react";
import * as Icon from 'react-feather';
import { useHistory, Link } from "react-router-dom";

import axios from 'axios'

import {AgGridColumn, AgGridReact} from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import config from "../../config";
import Header from "../includes/Header";
import Footer from "../includes/Footer";
import Sidebar from "../includes/Sidebar";
import '../Paginate.css'

const UserList = () => {
  const [postsPerPage] = useState(config.perPageData);
  const [offset, setOffset] = useState(0);
  const [PostsData, setPostsData] = useState([]);

  const [Rolesdata, setRolesdata] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [usersdata, setUsersdata] = useState(null);

  const history = useHistory();

  const [UserRoleSetting, setUserRoleSetting] = useState([]);
  const [ShowSetting, setShowSetting] = useState(false);
  const [AddSetting, setAddSetting] = useState(false);
  const [EditSetting, setEditSetting] = useState(false);
  const [DeleteSetting, setDeleteSetting] = useState(false);
  const [isLoading, setisLoading] = useState(true)

  useEffect(() => {

    fetch(`${config.baseUrl}/admin/role/getrolemaster`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then(({ error, data }) => {

        setRolesdata(data)

      });
  }, [history]);

  useEffect(() => {
    var role_master = JSON.parse(window.localStorage.getItem('role_master'));
    var settings = role_master.role_setting_ids.split(',');

    setUserRoleSetting(settings);

    var show = checkMenuesSettings('29');
    if (show) {
      setShowSetting(true)
    }
    var add = checkMenuesSettings('30');
    if (add) {
      setAddSetting(true)
    }
    var edit = checkMenuesSettings('31');
    if (edit) {
      setEditSetting(true)
    }
    var deletes = checkMenuesSettings('32');
    if (deletes) {
      setDeleteSetting(true)
    }

    function checkMenuesSettings(id) {
      var returns = settings.includes(id);
      return returns;
    }

    getAllPosts()
  }, [offset, EditSetting])

  const deleteCall = (id) => {
    const confirm = window.confirm("Are you sure to delete ?");
    if (confirm) {
      var formsdata = { "id": id }

      fetch(`${config.baseUrl}/admin/user/deletuser`, {
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


  const getPostData = (data) => {
    if (offset == 0) {
      var sr_no = 1
    } else {
      var sr_no = offset + 1
    }


    return (
      data.map((item, index) => {
        if (item.status == '1') {
          var status = 'Active'
        }
        if (item.status == '0') {
          var status = 'In-Active'
        }
        if (item.status == '-1') {
          var status = 'Block'
        }

        return (
          <tr>
            {EditSetting ?
              <td><Link to={'/edituser/' + item.id}><Icon.Edit className="icon" /></Link></td>
              :
              <td></td>
            }

            <td>{sr_no + index}</td>
            <td>{item.username}</td>
            <td>{item.role_menu_name}</td>
            <td>{status}</td>

          </tr>
        )
      })

    )

  }

  const getAllPosts = async () => {
    
    const res = await axios.get(`${config.baseUrl}/admin/user/getusers`)
    setisLoading(false)
    const data = res.data.data;
    const slice = data.slice(offset, offset + postsPerPage)
    const postData = getPostData(slice)
    
    setPostsData(data)
  }

  const handlePageClick = (e) => {
    const selectedPage = e.selected;
    const offset = selectedPage * postsPerPage;
    setOffset(offset)
  };

  if (!isLoading) {
    return (
      <>

        <Header /> 

        <span className="blank_space d-flex align-items-center">
          <h2></h2>
          {AddSetting &&
            <Link to='/adduser' className="nav-link btn btn-primary ml-auto theme_button top_fixed_buton">Add New</Link>
          }
        </span>

        <div className="az-content-wrapper">
          <div className="container-fluid d-flex h-100 mb-auto p-0">
            {/* <Sidebar /> */}
            <div className="middle_content userlist w-100 mt-2">
              <div className="content">
                <div className="container-fluid">
                  <div className="card">
                   
                   <div className="ag-theme-alpine" style={{height: '435px',width: '100%',}}>
                      

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
                         
                        }}
                        rowData={PostsData}
                      >
                        <AgGridColumn headerName="Edit" field="id" sortable={false} editable={false}
                          width='70px'
                          cellClass={'editcolumn'}
                           filter={false}
                          cellRendererFramework={(data) => {
                            return (
                              <Link to={'/edituser/'+ data.data.id } ><i class="icon-pencil"></i></Link>
                            )
                          }}
                        />
                        <AgGridColumn headerName="Sr. No." field="id"
                          width='90px'
                           filter={false}
                          cellRenderer={(data) => {
                            console.log(data.node.rowIndex)
                            return (
                              `<p>${data.node.rowIndex+1}</p>`
                            )
                          }}/>
                        <AgGridColumn headerName="Username" field="username" sortable={true} />
                        <AgGridColumn headerName="Role Name" field="role_menu_name" type="numberColumn" sortable={true} />
                        
                        <AgGridColumn headerName="Status" field="status" sortable={true}
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

export default UserList;
