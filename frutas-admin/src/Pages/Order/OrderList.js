import React, { useEffect, useState } from "react";
import * as Icon from 'react-feather';
import { useHistory, Link } from "react-router-dom";
import axios from 'axios'
import { AgGridColumn, AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
// import MedalCellRenderer from './medalCellRenderer.jsx';
// import TotalValueRenderer from './totalValueRenderer.jsx';
import Header from "../includes/Header";
import Footer from "../includes/Footer";
import Sidebar from "../includes/Sidebar";

import config from "../../config";

export default function OrderList(props) {
  const [postsPerPage] = useState(config.perPageData);
  const [pageCount, setPageCount] = useState(0);
  const [offset, setOffset] = useState(1);
  const [PostsData, setPostsData] = useState([]);
  const [Orders, setOrders] = useState([]);
  const [OrderStatus, setOrderStatus] = useState([]);
  const [isLoading, setisLoading] = useState(true)
  const [valSelect, setvalSelect] = useState('')

  const [UserRoleSetting, setUserRoleSetting] = useState([]);
  const [ShowSetting, setShowSetting] = useState(false);
  const [AddSetting, setAddSetting] = useState(false);
  const [EditSetting, setEditSetting] = useState(false);
  const [DeleteSetting, setDeleteSetting] = useState(false);

  const history = useHistory();

  useEffect(() => {

    var role_master = JSON.parse(window.localStorage.getItem('role_master'));
    var settings = role_master.role_setting_ids.split(',');

    setUserRoleSetting(settings);

    var show = checkMenuesSettings('45');
    if(show){
      setShowSetting(true)
    }
    var add = checkMenuesSettings('46');
    if(add){
      setAddSetting(true)
    }
    var edit = checkMenuesSettings('47');
    if(edit){
      setEditSetting(true)
    }
    var deletes = checkMenuesSettings('48');
    if(deletes){
      setDeleteSetting(true)
    }

    function checkMenuesSettings(id) {
      var returns = settings.includes(id);
      return returns;
    }

    /*fetch(`${config.baseUrl}/admin/orders/getallorders`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    })
    .then((res) => res.json())
    .then( async ({ error, data, order_status }) =>{            

    });*/

    async function getAllPosts() {
      const res = await axios.get(`${config.baseUrl}/admin/orders/getallorders`)
      setisLoading(false)
      const data = res.data.data;
      const order_status = res.data.order_status;
      setPostsData(data)
      setOrderStatus(order_status)
    }

    getAllPosts();

  }, [offset])


  async function updateOrderStatus(e, order_id) {
    var userdata = localStorage.getItem("USER_ID");

    //console.log(userdata);return false;

    var postdata = { 'user_no': userdata, 'order_no': order_id, 'status': e.target.value }

    fetch(`${config.baseUrl}/admin/orders/updatestatus`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify(postdata),
    })
      .then((res) => res.json())
      .then(({ error, data, CODE }) => {
        if (CODE == '200') {
          window.location.reload();
        }

      });
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

        </span>

        <div className="az-content-wrapper">
          <div className="container-fluid d-flex h-100 mb-auto p-0">
            {/* <Sidebar /> */}

            <div className="middle_content userlist w-100 mt-2">  
              <div className="content">
                <div className="container-fluid">
                  <div className="card">
                    {OrderStatus &&

                      <div className="ag-theme-alpine" style={{ height: '435px', width: '100%', }}>

                        <AgGridReact
                          masterDetail={true}
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
                        <AgGridColumn headerName="View" field="orderview" sortable={false} editable={false}
                          width='70px'
                          cellClass={'editcolumn'}
                            filter={false}
                            cellRendererFramework={(data) => {
                              return (
                                <Link to={'/orderview/'+ data.data.order_no } ><i class="icon-eye-open"></i></Link>
                              )
                            }}
                          />
                        <AgGridColumn headerName="Sr. No." field="id"
                          width='90px'
                            filter={false}
                            cellRenderer={(data) => {
                              return (
                                `<p>${data.node.rowIndex + 1}</p>`
                              )
                            }} />
                          <AgGridColumn headerName="Payment Method" field="product_name" sortable={false}
                            filter={false} cellRenderer={(data) => {
                              return (
                                `<p>COD<p>`
                              )
                            }} />
                          <AgGridColumn headerName="Total Amount" field="total_amount_paid" sortable={true} />
                          <AgGridColumn headerName="No. Of Baskets" field="total_items" sortable={true} />
                          <AgGridColumn headerName="Delivery Address" field="delivery_address" sortable={true} />
                          <AgGridColumn headerName="Order Date"
                            filter={false}
                            field="create_date" sortable={true} cellRenderer={((data) => {
                              if (data !== undefined) {
                                var cdate = data.value;

                                var dateFuntion = new Date(cdate);
                                var year = dateFuntion.getFullYear();
                                var month = dateFuntion.getMonth()+1;
                                var day = dateFuntion.getDate()+1;

                                if(month < 10){
                                  month = '0'+month;
                                }

                                if(day < 10){
                                  day = '0'+day;
                                }

                                var fDate = day+'-'+month+'-'+year;

                              }
                              return (
                                `<p>${fDate}</p>`
                              )
                            })} />
                          <AgGridColumn headerName="Order Status" field="order_status" sortable={true}
                            cellRendererFramework={(data) => {
                             
                              if (data.value === 'Pending') {
                                return (
                                  <p style={{color:'red'}}>{data.value}</p>
                                )
                              }else if (data.value === 'Completed') {
                                return (
                                  <p style={{color:'green'}}>{data.value}</p>
                                )
                              }else if (data.value === 'Processing') {
                                return (
                                  <p style={{color:'orange'}}>{data.value}</p>
                                )
                              }else if (data.value === 'Delivered') {
                                return (
                                  <p style={{color:'blue'}}>{data.value}</p>
                                )
                              }else if (data.value === 'Shipped') {
                                return (
                                  <p style={{color:'yellowgreen'}}>{data.value}</p>
                                )
                              } else {
                                return (
                                  <p style={{color:'black'}}>{data.value}</p>
                                )
                              }
                            }}
                          />
                          <AgGridColumn
                            headerName="Action"
                            filter={false}
                            field="order_master_status"
                            width={220}
                            cellRendererFramework=
                            {(data) => {
                              return (

                                <select 
                                  value={data.data.order_master_status}
                                  onChange={((e) => {
                                  updateOrderStatus(e,data.data.order_no)

                                })} >
                                  ${OrderStatus.map((data) => {
                                    return (
                                      <option value={data.id} > {data.name} </option>
                                    )
                                  }

                                  )}
                                </select>

                              )
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

}