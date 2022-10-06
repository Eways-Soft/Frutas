import React, { useEffect, useState } from "react";
import { useHistory, Link } from "react-router-dom";
import * as Icon from 'react-feather';

import axios from 'axios'
import '../Paginate.css'
import {AgGridColumn, AgGridReact} from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import config from "../../config";
import Header from "../includes/Header";
import Footer from "../includes/Footer";
import Sidebar from "../includes/Sidebar";

export default function BasketList(props) {
  const [postsPerPage] = useState(config.perPageData);
  const [offset, setOffset] = useState(0);
  const [posts, setAllPosts] = useState([]);
  const [PostsData, setPostsData] = useState([]);
  const [pageCount, setPageCount] = useState(0)

  const [Page, setPage] = useState('1');
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

    var show = checkMenuesSettings('13');
    if (show) {
      setShowSetting(true)
    }
    var add = checkMenuesSettings('14');
    if (add) {
      setAddSetting(true)
    }
    var edit = checkMenuesSettings('15');
    if (edit) {
      setEditSetting(true)
    }
    var deletes = checkMenuesSettings('16');
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

      fetch(`${config.baseUrl}/deletbasket`, {
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
    const res = await axios.get(`${config.baseUrl}/admin/baskets/getAllPageignationBaskets`)
    setisLoading(false)
    const data = res.data.products;
    const slice = data.slice(offset, offset + postsPerPage)
    
    setPageCount(Math.ceil(data.length / postsPerPage))
    setPostsData(data)
  }

  const handlePageClick = (e) => {
    const selectedPage = e.selected;
    const offset = selectedPage * postsPerPage;

    setOffset(offset)
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
          {ShowSetting &&
            <Link to='/addnewbasket' className="nav-link btn btn-primary ml-auto theme_button top_fixed_buton">Add New</Link>
          }
        </span>

        <div className="az-content-wrapper">
          <div className="container-fluid d-flex h-100 mb-auto p-0">
            {/* <Sidebar /> */}
            <div className="middle_content userlist w-100">
              <div className="content">
                <div className="container-fluid">
                  <div className="card">
                    {ShowSetting &&                      

                      <div className="ag-theme-alpine" style={{ height: '470px', width: '100%', }}>

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
                          // nonEditableColumn: { editable: false },
                         
                        }}
                        
                        rowData={PostsData}
                      >
                        <AgGridColumn headerName="Edit" field="basket_id" sortable={false}
                          cellClass={'editcolumn'}
                         
                           width="70px"
                          editable={false}
                          filter={false}
                        
                          cellRenderer={(data) => {
                           
                            return (
                            `<a  class='' href='${config.ANCHOR_TAG}editbasket/${data.data.basket_id}' > <i class=" icon-pencil "></i>  </a>`
                          )
                          }}
                        />
                        <AgGridColumn headerName="Sr. No." field="id"
                          filter={false}
                          width="90px"
                          cellRenderer={(data) => {
                           
                            return (
                              `<p>${data.node.rowIndex+1}</p>`
                            )
                          }}/>
                        <AgGridColumn 
                          headerName="image" 
                          filter={false}
                          width="100px" 
                          field="basket_image" 

                          cellRendererFramework={(data) => {
                            return (
                              <img src={data.value} alt="link" class='cellImage'></img>
                            )
                          }}
                            
                        />
                        <AgGridColumn   headerName="sku code" field="basket_sku_code" sortable={true} />
                        <AgGridColumn headerName="name" filter ={true}   field="basket_name" sortable={true}  />
                        <AgGridColumn headerName="BASKET FOR" field="baskt_for" sortable={true} />
                        <AgGridColumn headerName="WEIGHT IN KG" field="basket_weight_in_kg" sortable={true} />
                        <AgGridColumn headerName="WEIGHT IN GM" field="basket_weight_in_gm" sortable={true} />
                        <AgGridColumn headerName="COMPANY COST" field="basket_company_cost" sortable={true} />
                        <AgGridColumn headerName="SALE PRICE" field="basket_sale_price" sortable={true} />
                        <AgGridColumn headerName="ACTUAL PRICE" field="actual_price" sortable={true} />
                        <AgGridColumn headerName="CATEGORY" field={"basket_category_name"} sortable={true} />
                        <AgGridColumn headerName="TYPES" field="type_names" sortable={true} />
                        <AgGridColumn
                          headerName="Create Date"
                          field="created_date"
                          filter={false}
                          sortable={true}
                          type={['dateColumn', 'nonEditableColumn']}
                          width={220}
                          cellRenderer={(data) => {
                            if (data !== undefined) {
                              var dates = data.value;

                              var dateFuntion = new Date(dates);
                              var year = dateFuntion.getFullYear();
                              var month = dateFuntion.getMonth()+1;
                              var day = dateFuntion.getDate()+1;

                              var createddate = day+'-'+month+'-'+year;

                            }
                            return (
                              `<p>${createddate}</p>`
                            )
                          }}
                          />
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


