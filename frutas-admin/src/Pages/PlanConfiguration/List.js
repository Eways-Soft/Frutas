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

const TableHeader = ["#", "Username", "Password"];

const List = () => {
  const [postsPerPage] = useState(config.perPageData);
  const [offset, setOffset] = useState(1);
  const [posts, setAllPosts] = useState([]);
  const [PostsData, setPostsData] = useState([]);
  const [pageCount, setPageCount] = useState(0)

  const history = useHistory();
  const [dashboard, setDashboard] = useState(null);

  const [UserRoleSetting, setUserRoleSetting] = useState([]);
  const [ShowSetting, setShowSetting] = useState(false);
  const [AddSetting, setAddSetting] = useState(false);
  const [EditSetting, setEditSetting] = useState(false);
  const [DeleteSetting, setDeleteSetting] = useState(false);

  const [isLoading, setisLoading] = useState(true)

  const [Data, setData] = useState(null);
  const [Page, setPage] = useState('1');

  useEffect(() => {


  }, [history]);

  useEffect(() => {

    var role_master = JSON.parse(window.localStorage.getItem('role_master'));
    var settings = role_master.role_setting_ids.split(',');

    setUserRoleSetting(settings);

    var show = checkMenuesSettings('21');
    if (show) {
      setShowSetting(true)
    }
    var add = checkMenuesSettings('22');
    if (add) {
      setAddSetting(true)
    }
    var edit = checkMenuesSettings('23');
    if (edit) {
      setEditSetting(true)
    }
    var deletes = checkMenuesSettings('24');
    if (deletes) {
      setDeleteSetting(true)
    }

    function checkMenuesSettings(id){
      var returns = settings.includes(id);
      return returns;
    }

    getAllPosts()
  }, [offset, EditSetting])

  const getPostData = (data) => {
    return (
      data.map((item) => {
        if (item.configured) {
          var configured = 'Configured'
        } else {
          var configured = 'Pending'
        }

        return (
          <tr key={item.basketid}>
            {EditSetting ?
              <td><a href={'/editcofigurationplan/' + item.basketid}><Icon.Edit className="icon" /></a></td>
              :
              <td></td>
            }
            <td><img src={`${item.basket_image}`} height="30" /></td>
            <td>{item.basket_sku_code}</td>
            <td>{item.basket_name}</td>
            <td>{configured}</td>
            <td>{item.basket_for_name}</td>
            <td>{item.basket_company_cost}</td>
            <td>{item.basket_sale_price}</td>
            <td>{item.discount_price}</td>
            <td>{item.actual_price}</td>
            <td>{item.basket_weight_in_kg} kg, {item.basket_weight_in_gm} gm</td>
          </tr>
        )
      })
    )
  }

  const getAllPosts = async () => {
    const res = await axios.get(`${config.baseUrl}/admin/baskets/getAllActiveBasketsForCongigure`)
    setisLoading(false)
    const data = res.data.products;
    console.log('config data:',data)
    const slice = data.slice(offset - 1, offset - 1 + postsPerPage)
    const postData = getPostData(slice)
    setAllPosts(postData)
    setPageCount(Math.ceil(data.length / postsPerPage))
    setPostsData(data)
  }

  const handlePageClick = (e) => {
    const selectedPage = e.selected;
    setOffset(selectedPage + 1)
  };

  const CreatedConfig = (configured) => {
    if (configured) {
      var configured = 'Configured'
    } else {
      var configured = 'Pending'
    }
    return configured
  }

  if (!isLoading) {
    return (
      <>

        <Header />

        <span className="blank_space blank_space d-flex align-items-center"></span>

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
                          // 
                        }}
                        rowData={PostsData}
                      >
                        <AgGridColumn headerName="Edit" field="basketid" sortable={false} editable={false} filter={false}
                            cellClass={'editcolumn'}
                          width='70px'
                          cellRendererFramework={(data) => {
                            console.log(data)
                            return (

                              <Link to={'/editcofigurationplan/'+ data.data.basketid } ><i class="icon-pencil"></i></Link>

                            )
                          }}
                        />
                        <AgGridColumn headerName="Sr. No." field="id"  filter={false} width='90px'
                          cellRenderer={(data) => {
                            console.log(data.node.rowIndex)
                            return (
                              `<p>${data.node.rowIndex+1}</p>`
                            )
                          }}/>

                        <AgGridColumn 
                          headerName="image" 
                          field="basket_image"  
                          filter={false} 
                          cellRendererFramework={(data) => {     
                            return (
                              <img src={data.value} alt="link" className='cellImage' />
                            )                           
                          }} 
                        />
                        <AgGridColumn headerName="sku code" field="basket_sku_code" sortable={true} />
                        <AgGridColumn headerName="name" field="basket_name" sortable={true} />
                        <AgGridColumn headerName="BASKET FOR" field="baskt_for" sortable={true} />
                        <AgGridColumn headerName="WEIGHT IN KG" field="basket_weight_in_kg" sortable={true} />
                        <AgGridColumn headerName="WEIGHT IN GM" field="basket_weight_in_gm" sortable={true} />
                        <AgGridColumn headerName="COMPANY COST" field="basket_company_cost" sortable={true} />
                        <AgGridColumn headerName="SALE PRICE" field="basket_sale_price" sortable={true} />
                        <AgGridColumn headerName="ACTUAL PRICE" field="actual_price" sortable={true} />
                        
                        <AgGridColumn headerName="configured status" field="configured" sortable={true} />

                        <AgGridColumn
                            headerName="Create Date"
                          field="created_date"
                          filter={false}
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