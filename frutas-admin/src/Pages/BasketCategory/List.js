import React, { useEffect, useState } from "react";
import { useHistory, Link } from "react-router-dom";
import * as Icon from 'react-feather';

import axios from 'axios'
import '../Paginate.css'
import { AgGridColumn, AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import config from "../../config";
import Header from "../includes/Header";
import Footer from "../includes/Footer";
import Sidebar from "../includes/Sidebar";

export default function List(props) {
  const [postsPerPage] = useState(config.perPageData);
  const [offset, setOffset] = useState(0);
  const [posts, setAllPosts] = useState([]);
  const [PostsData, setPostsData] = useState([]);
  const [pageCount, setPageCount] = useState(0)

  const [dashboard, setDashboard] = useState(null);
  const [productCategories, setProductCategories] = useState(null);
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

    var show = checkMenuesSettings('9');
    if (show) {
      setShowSetting(true)
    }
    var add = checkMenuesSettings('10');
    if (add) {
      setAddSetting(true)
    }
    var edit = checkMenuesSettings('11');
    if (edit) {
      setEditSetting(true)
    }
    var deletes = checkMenuesSettings('12');
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
    const res = await axios.get(`${config.baseUrl}/admin/baskets/getallbasketcategories`)
    setisLoading(false)
    const data = res.data.data.reverse();
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

      fetch(`${config.baseUrl}/admin/baskets/deletebasketcategory`, {
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

  function activeInactive(status) {
    if (status == '1') {
      return (
        <>Active</>
      )
    }
    return (
      <>In-Active</>
    )
  }


  if (!isLoading) {
    return (
      <>
        <Header />

        <span className="blank_space d-flex align-items-center">
          <h2></h2>
          {AddSetting &&
            <Link to="/addbasketcategory" className="nav-link btn btn-primary ml-auto theme_button top_fixed_buton" >Add New</Link>
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


                        <AgGridReact
                          pagination={true}
                          paginationPageSize='10'
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
                              // filter: 'agNumberColumnFilter',
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
                        <AgGridColumn headerName="Edit" field="basket_category_id" sortable={false} editable={false}
                            cellClass={'editcolumn'}
                           width="70px"
                           filter={false}
                            cellRendererFramework={(data) => {
                              return (
                                <Link to={'/editbasketcategory/'+ data.data.basket_category_id } ><i class="icon-pencil"></i></Link>
                              )
                            }}
                          />
                        <AgGridColumn headerName="Sr. No." field="id"
                          filter={false}
                          width="90px"
                            cellRenderer={(data) => {
                              return (
                                `<p>${data.node.rowIndex + 1}</p>`
                              )
                          }} />

                        <AgGridColumn 
                          headerName="image" 
                          field="basket_category_image"
                          filter={false}
                          width="100%"
                          cellRendererFramework={(data) => {     
                            return (
                              <img src={data.value} alt="link" className='cellImage' />
                            )                           
                          }}
                        />
                        
                        <AgGridColumn headerName="Parent" field="parent_cat" cellRendererFramework={
                          (data) => {
                            
                            return (
                              <>
                            {data.data.parent_cat?
                              <p>{data.data.parent_cat}</p>
                           :
                              <p style={{color:'red'}}>N/A</p>
                            }
                            </>
                            )
                          }
                        }/>
                          <AgGridColumn headerName="Name" field="basket_category_name" sortable={true} />

                          <AgGridColumn headerName="Status" field="basket_category_status" sortable={true}
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
