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

export default function List(props) {
  const [postsPerPage] = useState(config.perPageData);
  const [offset, setOffset] = useState(0);
  const [posts, setAllPosts] = useState([]);
  const [PostsData, setPostsData] = useState([]);
  const [pageCount, setPageCount] = useState(0)

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

  const handlePageClick = (e) => {
    const selectedPage = e.selected;
    const offset = selectedPage * postsPerPage;
    setOffset(offset)
  };

  const deleteCall = (id) => {
    const confirm = window.confirm("Are you sure to delete ?");
    if (confirm) {
      var formsdata = { "id": id }
      fetch(`${config.baseUrl}/deletesubscription`, {
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
          }
        });
    }
  };

  const getAllPosts = async () => {
    const res = await axios.get(`${config.baseUrl}/admin/subscription/getAllPageignationSubscription`)
    setisLoading(false)
    
    const data = res.data.products.reverse();
    setPostsData(data)
    console.log(data)
  }


  function datePaternSet(value) {
    var dateFuntion = new Date(value);
    return dateFuntion
  }


  if (!isLoading) {
    return (
      <>
        <Header />

        <span className="blank_space d-flex align-items-center">
          <h2></h2>
          {AddSetting &&
            <Link to="/addsubscription" className="nav-link btn btn-primary ml-auto theme_button top_fixed_buton" >Add New</Link>
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
                        <AgGridColumn headerName="Edit" filter={false} field="subscription_id" sortable={false} editable={false}
                          width='70px'
                          cellClass={'editcolumn'}
                            cellRendererFramework={(data) => {
                              return (
                                <Link to={'/subscriptionedit/'+ data.data.subscription_id } ><i class="icon-pencil"></i></Link>
                              )
                            }}
                          />
                        <AgGridColumn headerName="Sr. No." field="id" filter={false}
                          width='90px'
                            cellRenderer={(data) => {
                              console.log(data.node.rowIndex)
                              return (
                                `<p>${data.node.rowIndex+1}</p>`
                              )
                            }}/>

                          <AgGridColumn 
                            headerName="image" 
                            field="subscription_image"  
                            filter={false} 
                            cellRendererFramework={(data) => {     
                              return (
                                <img src={data.value} alt="link" className='cellImage' />
                              )                           
                            }}
                          /> 

                        <AgGridColumn headerName="Name" field="subscription_name" sortable={true} />
                        <AgGridColumn headerName="City" field="city_name" sortable={true} />

                        <AgGridColumn
                          headerName="Validity"
                          field="subscription_validity"
                          filter={false}
                          type={['dateColumn', 'nonEditableColumn']}
                          width={220}
                          cellRenderer={(data) => {
                            if (data !== undefined) {
                              var datedata = data.value;

                              var dateFuntion = new Date(datedata);
                              var year = dateFuntion.getFullYear();
                              var month = dateFuntion.getMonth()+1;
                              var day = dateFuntion.getDate()+1;

                              if(month < 10){
                                month = '0'+month;
                              }

                              if(day < 10){
                                day = '0'+day;
                              }

                              var date = year+'-'+month+'-'+day;
                              
                              /*date = date.split('T')
                              var fDate = date[0].split('-').reverse()
                              console.log('fDate',fDate)
                              var day = (parseInt(fDate[0])+1)
                              var month = fDate[1];
                              var year = fDate[2]*/
                            }
                            return (
                              `<p>${day}-${month}-${year}</p>`
                            )
                          }}
                        />

                        <AgGridColumn
                          headerName="Create Date"
                          field="created_date"
                          filter={false}
                          type={['dateColumn', 'nonEditableColumn']}
                          width={220}
                          cellRenderer={(data) => {
                            if (data !== undefined) {
                              var datedata = data.value;

                              var dateFuntion = new Date(datedata);
                              var year = dateFuntion.getFullYear();
                              var month = dateFuntion.getMonth()+1;
                              var day = dateFuntion.getDate()+1;

                              if(month < 10){
                                month = '0'+month;
                              }

                              if(day < 10){
                                day = '0'+day;
                              }

                              var date = year+'-'+month+'-'+day;
                              
                              /*date = date.split('T')
                              var fDate = date[0].split('-').reverse()
                              var day = (parseInt(fDate[0])+1)
                              var month = fDate[1];
                              var year = fDate[2]*/
                            }
                            return (
                              `<p>${day}-${month}-${year}</p>`
                            )
                          }}
                        />

                          <AgGridColumn headerName="Status" field="subscription_status" sortable={true}
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


