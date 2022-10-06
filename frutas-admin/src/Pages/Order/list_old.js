import React, { useEffect, useState } from "react";
import * as Icon from 'react-feather';
import { useHistory } from "react-router-dom";
import ReactPaginate from 'react-paginate';
import axios from 'axios'

import Header from "../includes/Header";
import Footer from "../includes/Footer";
import Sidebar from "../includes/Sidebar";

import config from "../../config";

export default function OrderList(props) {
    const [postsPerPage] = useState(config.perPageData);
    const [pageCount, setPageCount] = useState(0);
    const [offset, setOffset] = useState(1);
    const [Orders, setOrders] = useState([]);
    const [OrderStatus, setOrderStatus] = useState([]);
    const [isLoading, setisLoading] = useState(true)

    const history = useHistory();

    useEffect(() => {

        /*var role_master = JSON.parse(window.localStorage.getItem('role_master'));
        var settings = role_master.role_setting_ids.split(',');

        setUserRoleSetting(settings);

        var show = checkMenuesSettings('33');
        if(show){
          setShowSetting(true)
        }
        var add = checkMenuesSettings('34');
        if(add){
          setAddSetting(true)
        }
        var edit = checkMenuesSettings('35');
        if(edit){
          setEditSetting(true)
        }
        var deletes = checkMenuesSettings('36');
        if(deletes){
          setDeleteSetting(true)
        }

        function checkMenuesSettings(id) {
          var returns = settings.includes(id);
          return returns;
        }*/

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

            const slice = data.slice(offset, offset + postsPerPage)


            const postData = getPostData(slice, order_status)

            await setOrders(postData)

            setPageCount(Math.ceil(data.length / postsPerPage))
        }

        getAllPosts();

    }, [offset])


    async function updateOrderStatus(e, order_id) {
        var postdata = { 'order_no': order_id, 'status': e.target.value }

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

    const getPostData = (data, order_status) => {

        if (offset == 0) {
            var sr_no = 1
        } else {
            var sr_no = offset + 1
        }


        return (
            data.map((item, ind) => {

                if (item.order_master_status == '1') {
                    var cls = 'pending';
                } else if (item.order_master_status == '2') {
                    var cls = 'completed';
                } else if (item.order_master_status == '3') {
                    var cls = 'processing';
                } else if (item.order_master_status == '4') {
                    var cls = 'delivered';
                } else if (item.order_master_status == '5') {
                    var cls = 'shipped';
                } else if (item.order_master_status == '6') {
                    var cls = 'on-hold';
                } else {
                    var cls = '';
                }

                var dateFuntion = new Date(item.create_date);
                var year = dateFuntion.getFullYear();
                var month = dateFuntion.getMonth() + 1;
                var day = dateFuntion.getDate();
                if (day < 10) {
                    day = '0' + day;
                }
                if (month < 10) {
                    month = '0' + month;
                }
                var ndate = day + '-' + month + '-' + year;
                return (
                    <tr key={item.order_no}>

                        <td><a href={'/orderview/' + item.order_no}><Icon.Eye className="icon" /></a></td>
                        <td>{sr_no + ind}</td>

                        <td>COD</td>
                        <td>{item.total_amount_paid}</td>
                        <td>{item.total_items}</td>
                        <td className="w-25">{item.delivery_address}</td>
                        <td className="text-nowrap">{ndate}</td>
                        <td>
                            <span className={cls}>{item.name}</span>
                        </td>
                        <td>
                            <select
                                name="status"
                                class="form-control1" aria-describedby="Enter username"
                                value={item.order_master_status}
                                onChange={(e) => updateOrderStatus(e, item.order_no)}
                            >
                                {order_status &&
                                    <>
                                        {order_status.map((stat, sind) =>
                                            <option key={sind} value={stat.id}>{stat.name} </option>
                                        )}
                                    </>
                                }


                            </select>
                        </td>
                    </tr>
                )
            })
        )
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

                <span className="blank_space d-flex align-items-center"></span>

                <div className="az-content-wrapper">
                    <div className="container-fluid d-flex h-100 mb-auto p-0">
                        <Sidebar />

                        <div className="middle_content prodctlist w-100">
                            <div className="content">
                                {/* <a className="nav-link btn btn-primary mb-3 mr-3 ml-auto theme_button top_fixed_buton" href="/addnewbasket">Add New</a> */}
                                <div className="container-xl">

                                    <div className="card">
                                        <table className="table">
                                            <thead className="table-header">
                                                <tr>
                                                    <th>View</th>
                                                    <th>Sr No</th>
                                                    <th>Payment Method</th>
                                                    <th>Total Amount</th>
                                                    <th>No Of Baskets</th>
                                                    <th>Delivery Address</th>
                                                    <th>Order Date</th>
                                                    <th>Order Status</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {OrderStatus &&
                                                    <>
                                                        {Orders &&
                                                            <>
                                                                {Orders}
                                                            </>
                                                        }
                                                    </>
                                                }

                                            </tbody>

                                        </table>
                                    </div>
                                </div>
                            </div>

                            <ReactPaginate
                                previousLabel={"Previous"}
                                nextLabel={"Next"}
                                breakLabel={"..."}
                                breakClassName={"break-me"}
                                pageCount={pageCount}
                                onPageChange={handlePageClick}
                                containerClassName={"pagination"}
                                subContainerClassName={"pages pagination"}
                                activeClassName={"active"}
                            />

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