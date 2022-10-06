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

const List = () => {
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

    var show = checkMenuesSettings('1');
    if (show) {
      setShowSetting(true)
    }
    var add = checkMenuesSettings('2');
    if (add) {
      setAddSetting(true)
    }
    var edit = checkMenuesSettings('3');
    if (edit) {
      setEditSetting(true)
    }
    var deletes = checkMenuesSettings('4');
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
    const res = await axios.get(`${config.baseUrl}/admin/products/getproductcategories`)
    setisLoading(false)
    var data = res.data.data;
    const slice = data.slice(offset, offset + postsPerPage)
    data = data;
    
    // setPageCount(Math.ceil(data.length / postsPerPage))
    
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

      fetch(`${config.baseUrl}/admin/products/deletproductcategory`, {
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

  const CreatedStatus = (status) => {
    if (status == '1') {
      var status = 'Active'
    } else {
      var status = 'In-Active'
    }
    return status
  }

  const customStyles = {
    headCells: {
      style: {
        // fontSize: '19px',
        // fontWeight: 600,
      },
    },
  };
  
 


    
  if (!isLoading) {
   
    return (
      <>

        <Header />

        <span className="blank_space d-flex align-items-center">
          <h2></h2>
          {AddSetting &&
            
            <Link to="addnewproductcategory" className="nav-link btn btn-primary ml-auto theme_button top_fixed_buton">Add New</Link>

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
                        
                        style={{
                          height: '100%',
                          width: '100%',
                        }}
                         pagination={true}
                         paginationPageSize ='10'
                        defaultColDef={{
                          width: 'auto',
                          editable: true,
                          filter: 'agTextColumnFilter',
                          floatingFilter: true,
                          resizable: true,
                        }}
                        defaultColGroupDef={{ marryChildren: true }}
                        columnTypes={{
                          numberColumn: {
                            width: 'auto',
                            filter: 'agNumberColumnFilter',
                          },
                          medalColumn: {
                            width: 'auto',
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
                              <Link className="image-hover-opacity" to={'/editproductcategory/'+ data.data.id } ><i class="icon-pencil"></i></Link>
                            )
                          }}
                        />
                        <AgGridColumn headerName="Sr. No." field="id" width='90px'
                           filter={false}
                          cellRenderer={(data) => {
                            console.log(data.node.rowIndex)
                            return (
                              `<p>${data.node.rowIndex+1}</p>`
                            )
                          }}/>
                        <AgGridColumn headerName="Parent" field="parentcat" cellRendererFramework={
                          (data) => {
                            console.log(data.data.parentcat)
                            return (
                              <>
                            {data.data.parentcat?
                              <p>{data.data.parentcat}</p>
                           :
                              <p style={{color:'red'}}>N/A</p>
                            }
                            </>
                            )
                          }
                        }/>
                        <AgGridColumn headerName="Name" field="product_category_name" sortable={true} />
                        
                        <AgGridColumn headerName="Status" field="product_category_status" sortable={true}
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

export default List;
