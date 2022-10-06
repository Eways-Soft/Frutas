import React, { useEffect, useState } from "react";
import * as Icon from 'react-feather';
import { useHistory, Link } from "react-router-dom";

import axios from 'axios'
import {AgGridColumn, AgGridReact} from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import '../Paginate.css'

import config from "../../config";
import Header from "../includes/Header";
import Sidebar from "../includes/Sidebar";
import Footer from "../includes/Footer";

export default function List(props) {

  const [postsPerPage] = useState(config.perPageData);
  //const [postsPerPage] = useState(2);
  const [offset, setOffset] = useState(0);
  const [posts, setAllPosts] = useState([]);
  const [PostsData, setPostsData] = useState([]);
  const [pageCount, setPageCount] = useState(0)

  const [TotalPage, setTotalPage] = useState('1');
  const [CurrentPage, setCurrentPage] = useState('1');
  const [pageignationProductsPage, setpageignationProductsPage] = useState('1');
  const [dashboard, setDashboard] = useState(null);
  const [products, setProducts] = useState(null);
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

    var show = checkMenuesSettings('5');
    if (show) {
      setShowSetting(true)
    }
    var add = checkMenuesSettings('6');
    if (add) {
      setAddSetting(true)
    }
    var edit = checkMenuesSettings('7');
    if (edit) {
      setEditSetting(true)
    }
    var deletes = checkMenuesSettings('8');
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

      fetch(`${config.baseUrl}/admin/products/deletproduct`, {
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

  const getAllPosts = async () => {
    const res = await axios.get(`${config.baseUrl}/admin/products/getallproducts`)
    setisLoading(false)
   var data = res.data.products.reverse();
    
    setPostsData(data)
  }

  if (!isLoading) {
    return (
      <>
        <Header />

        <span className="blank_space d-flex align-items-center">
          {/* <h2>Products</h2> */}
          {AddSetting &&
            <Link to="/addnewproduct" className="nav-link btn btn-primary ml-auto theme_button top_fixed_buton" >Add New</Link>
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
                      <div className="ag-theme-alpine " style={{height: '435px',width: '100%',}}>                      

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
                        <AgGridColumn headerName="Edit" field="product_id" sortable={false} editable={false}
                          width='70px'
                          filter={false}
                          cellClass={'editcolumn'}
                          cellRendererFramework={(data) => {
                            return (
                              <Link to={'/editproduct/'+ data.data.product_id } ><i class="icon-pencil"></i></Link>
                            )
                          }}
                        />
                        <AgGridColumn headerName="Sr. No." field="id"
                          width='90px'
                           filter={false}
                          cellRenderer={(data) => {
                            return (
                              `<p>${data.node.rowIndex+1}</p>`
                            )
                          }}/>
                        <AgGridColumn 
                          editable={false} 
                          headerName="image" 
                          field="product_image"  
                          filter={false} 
                          cellRendererFramework={(data) => {     
                            return (
                              <img src={data.value} alt="link" className='cellImage' />
                            )                           
                          }}
                        />

                          <AgGridColumn headerName="Product Name" field="product_name" sortable={true} />
                          <AgGridColumn headerName="Parent Category" field="parent_cat" sortable={true} />
                          <AgGridColumn headerName="Category" field="product_category_name" sortable={true} />
                          <AgGridColumn headerName="Type" field="types_names" sortable={true} />
                          <AgGridColumn headerName="Price Type" field="price_type_name" sortable={true} />
                          <AgGridColumn headerName="Price" field="product_price" sortable={true}/>
                          <AgGridColumn headerName="Weight In KG" field="weight_in_kg" sortable={true} />
                          <AgGridColumn headerName="Weight IN GM" field="weight_in_gm" sortable={true} />
                          <AgGridColumn
                            headerName="Create Date"
                            field="created_date"
                          width={220}
                          cellRenderer={(data) => {
                            if (data !== undefined) {
                              var date = data.value;
                              date = date.split('T')
                             var fDate=date[0].split('-').reverse().join('-')
                            }
                            return (
                              `<p>${fDate}</p>`
                            )
                          }}
                          />
                          <AgGridColumn headerName="Status" field="product_status" sortable={true}
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


