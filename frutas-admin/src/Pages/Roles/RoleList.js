import React, { useEffect, useState } from "react";
import * as Icon from 'react-feather';
import { useHistory, Link } from "react-router-dom";
import axios from 'axios'
import '../Paginate.css'
import {AgGridColumn, AgGridReact} from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import config from "../../config";
import Header from "../includes/Header";
import Footer from "../includes/Footer";
import Sidebar from "../includes/Sidebar";

export default function RoleList(props) {
  const [postsPerPage] = useState(config.perPageData);
  const [offset, setOffset] = useState(0);
  const [posts, setAllPosts] = useState([]);
  const [PostsData, setPostsData] = useState([]);
  const [pageCount, setPageCount] = useState(4)

  const [dashboard, setDashboard] = useState(null);
  const [rolesdata, setRoledata] = useState(null);
  const history = useHistory();

  const [UserRoleSetting, setUserRoleSetting] = useState([]);
  const [ShowSetting, setShowSetting] = useState(false);
  const [AddSetting, setAddSetting] = useState(false);
  const [EditSetting, setEditSetting] = useState(false);
  const [DeleteSetting, setDeleteSetting] = useState(false);
  const [isLoading, setisLoading] = useState(true)

  useEffect(() => {

  }, [history]);

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

    getAllPosts()
  }, [offset, EditSetting])

  const getPostData = (data) => {
    if (offset == 0) {
      var sr_no = 1
    } else {
      var sr_no = offset + 1
    }

    return (
      data.map((item, index) => {

        return (
          <tr>
            {EditSetting ?
              <td><a href={'/editrole/' + item.role_master_id}><Icon.Edit className="icon" /></a></td>
              :
              <td></td>
            }

            <td>{sr_no + index}</td>
            <td>{item.role_menu_name}</td>

          </tr>
        )
      })
    )
  }

  const getAllPosts = async () => {
    const res = await axios.get(`${config.baseUrl}/admin/role/getrolemaster`)
    setisLoading(false)
    const data = res.data.data;
    const slice = data.slice(offset, offset + postsPerPage)
    const postData = getPostData(slice)
    setAllPosts(postData)
    setPageCount(Math.ceil(data.length / postsPerPage))
    setPostsData(data)
  }

  const handlePageClick = (e) => {
    const selectedPage = e.selected;
    const offset = selectedPage * postsPerPage;
    setOffset(offset)
  };

  const deleteCall = (id) => {
    const confirm = window.confirm("Are you sure to delete ?");
    if (confirm) {
      var formsdata = { "id": id }

      fetch(`${config.baseUrl}/admin/role/deleterole`, {
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

  const customStyles = {
    headCells: {
      style: {
        // fontSize: '19px',
        // fontWeight: 600,
      },
    },
  };

  const columns = [
    {
      name: 'Edit',
      selector: 'role_master_id',
      right: false,
      cell: row => <div><Link to={'/editrole/' + row.role_master_id} ><Icon.Edit className="icon" /></Link></div>,
    },
    {
      name: 'SR NO.',
      selector: 'role_master_id',
      sortable: true,
      right: false,
    },
    {
      name: 'name',
      selector: 'role_menu_name',
      sortable: true,
      right: false,
    },
  ];

  if (!isLoading) {
    return (
      <>

        <Header />

        <span className="blank_space d-flex align-items-center">
          <h2></h2>
          {AddSetting &&
            <Link to="/addnewrole" className="nav-link btn btn-primary ml-auto theme_button top_fixed_buton" >Add New</Link>
          }
        </span>

        <div className="az-content-wrapper">
          <div className="container-fluid d-flex h-100 mb-auto p-0">
            {/* <Sidebar /> */}
            <div className="middle_content userlist w-100 mt-2">
              <div className="content">
                <div className="container-fluid">
                  <div className="card">
                    {ShowSetting &&
                     
                      <div className="ag-theme-alpine" style={{height: '435px',width: '100%',}}>                      

                      <AgGridReact
                         pagination={true}
                        paginationPageSize='10'
                        
                        defaultColDef={{
                          // width: 150,
                          editable: true,
                          filter: 'agTextColumnFilter',
                          floatingFilter: true,
                          resizable: true,
                        }}
                        defaultColGroupDef={{ marryChildren: true }}
                        
                        columnTypes={{
                          numberColumn: {
                            // width: 130,
                            filter: 'agNumberColumnFilter',
                          },
                          medalColumn: {
                            // width: 100,
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
                        rowData={PostsData}
                       
                      >
                        <AgGridColumn headerName="Edit"
                          width='70px'
                          cellClass={'editcolumn'}
                           filter={false}
                          field="role_master_id" sortable={false} editable={false}
                          cellRendererFramework={(data) => {
                            return (
                              <Link to={'/editrole/'+ data.data.role_master_id } ><i class="icon-pencil"></i></Link>
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
                        <AgGridColumn headerName="name" sortable={true} field="role_menu_name" />
                                              
                        <AgGridColumn headerName="Status" field="role_status" sortable={true}
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
                    }
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

