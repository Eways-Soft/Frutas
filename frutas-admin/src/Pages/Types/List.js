import React, { useEffect, useState } from "react";
import * as Icon from 'react-feather';
import { useHistory, Link } from "react-router-dom";

import axios from 'axios'
import '../Paginate.css'
import { AgGridColumn, AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import config from "../../config";
import Header from "../includes/Header";
import Footer from "../includes/Footer";
import Sidebar from "../includes/Sidebar";

const List = () => {
  const [postsPerPage] = useState(config.perPageData);
  const [offset, setOffset] = useState(0);
  const [posts, setAllPosts] = useState([]);
  const [PostsData, setPostsData] = useState([]);
  const [pageCount, setPageCount] = useState(0)

  const [dashboard, setDashboard] = useState(null);
  const [Types, setTypes] = useState(null);
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

    var show = checkMenuesSettings('37');
    if (show) {
      setShowSetting(true)
    }
    var add = checkMenuesSettings('38');
    if (add) {
      setAddSetting(true)
    }
    var edit = checkMenuesSettings('39');
    if (edit) {
      setEditSetting(true)
    }
    var deletes = checkMenuesSettings('40');
    if (deletes) {
      setDeleteSetting(true)
    }

    function checkMenuesSettings(id) {
      var returns = settings.includes(id);
      return returns;
    }

    getAllPosts()
  }, [offset, EditSetting])

  const getAllPosts = async () => {
    const res = await axios.get(`${config.baseUrl}/admin/types/gettypes`)
    setisLoading(false)
    const data = res.data.data;

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
    }
  };

  const CreatedStatus = (status) => {
    if (status == '1') {
      var status = 'Active'
    } else {
      var status = 'In-Active'
    }
    return status
  }
  

  if (!isLoading) {

    return (
      <>

        <Header />

        <span className="blank_space d-flex align-items-center">
          <h2></h2>
          {AddSetting &&
            <Link to="/addnewtype" className="nav-link btn btn-primary ml-auto theme_button top_fixed_buton" >Add New</Link>
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
                      
                      <div className="ag-theme-alpine" style={{ height: '435px', width: '100%', }}>

                      {PostsData && 
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
                        rowData={PostsData}
                      >
                        <AgGridColumn headerName="Edit" field="type_id" sortable={false} editable={false}
                          filter={false}
                          cellClass={'editcolumn'}
                          width='70px'
                          cellRendererFramework={(data) => {
                            return (
                              <Link to={'/edittype/'+ data.data.type_id } ><i class="icon-pencil"></i></Link>
                            )
                          }}
                        />
                        <AgGridColumn headerName="Sr. No." field="type_id"
                          filter={false}
                          width="90px"
                          cellRenderer={(data) => {
                           
                            return (
                              `<p>${data.node.rowIndex+1}</p>`
                            )
                          }}/>

                        <AgGridColumn headerName="name" field="type_name" />
                        
                        <AgGridColumn headerName="Status" field="type_status" sortable={true}
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

                      }
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

export default List;
