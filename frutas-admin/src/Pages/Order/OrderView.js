import React, { useEffect, useState } from "react";
import { useHistory, Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Header from "../includes/Header";
import config from "../../config";

export default function OrderView(props) {
    const order_no = window.location.href.split('/').reverse()[0];

    const [OrderData, setOrderData] = useState([]);
    const [Order, setOrder] = useState([]);
    const [SubTotal, setSubTotal] = useState('0');
    const [DeliverChages, setDeliverChages] = useState('0');
    const [TotalAmount, setTotalAmount] = useState('0');
    const [isLoading, setisLoading] = useState(true)

    const [OrderStatus, setOrderStatus] = useState([])
    const [OrderNotesData, setOrderNotesData] = useState([])

    const [Status, setStatus] = useState('')
    const [NoteMessage, setNoteMessage] = useState('')
    const [NoteType, setNoteType] = useState('Private Note')

    const [PickupDate, setPickupDate] = useState(new Date());
    const [TrackingCode, setTrackingCode] = useState('');
    const [CarrierName, setCarrierName] = useState('');

    const [IsInvoiced, setIsInvoiced] = useState('0');

    const [invoiceLoad, setinvoiceLoad] = useState(false)

    const history = useHistory();

    useEffect(() => {

        getOrderStatus()
        GetOrderdetails()
        GetOrderNotes()

    }, [history]);

    async function getOrderStatus() {
        fetch(`${config.baseUrl}/admin/orders/getorderstatus`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem("token"),
            },
        })
            .then((res) => res.json())
            .then(({ error, data, CODE }) => {

                if (CODE == '200') {
                    setOrderStatus(data)
                }

            });
    }

    function GetOrderdetails() {
        var postdata = { 'order_no': order_no }
        fetch(`${config.baseUrl}/admin/orders/getorderdetails`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem("token"),
            },
            body: JSON.stringify(postdata),
        })
            .then((res) => res.json())
            .then(({ error, data, CODE, order }) => {
                console.log('data :', data)
                setisLoading(false)
                if (CODE == '200') {
                    if (data != '') {
                        setOrderData(data[0])
                        if (data[0].pickup_date != null || data[0].pickup_date != '') {
                            // setPickupDate(new Date(data[0].pickup_date))
                        }

                        setTrackingCode(data[0].tracking_code)
                        setCarrierName(data[0].carrier_name)
                        setStatus(data[0].order_master_status)
                        setIsInvoiced(data[0].invoiced)

                        setOrder(data)
                        setSubTotal(order[0].sub_total)
                        setDeliverChages(order[0].delivery_chages)
                        setTotalAmount(order[0].total_amount_paid)
                    }

                }

            });
    }

    function GetOrderNotes() {
        var postdata = { 'order_no': order_no }
        fetch(`${config.baseUrl}/admin/orders/getordernote`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem("token"),
            },
            body: JSON.stringify(postdata),
        })
            .then((res) => res.json())
            .then(({ error, data, CODE, order }) => {
                console.log('data ssdsd', data)
                setisLoading(false)
                if (CODE == '200') {
                    setOrderNotesData(data)
                }

            });
    }

    function deleteOrderNote(note_id) {
        var postdata = { 'note_id': note_id }
        fetch(`${config.baseUrl}/admin/orders/deleteordernote`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem("token"),
            },
            body: JSON.stringify(postdata),
        })
            .then((res) => res.json())
            .then(({ error, data, CODE, order }) => {
                if (CODE == '200') {

                    var newItems = OrderNotesData.filter(function (i) { return i.note_id !== note_id })
                    setOrderNotesData(newItems)
                }

            });
    }

    async function updateOrderStatus(e, order_id) {
        var userdata = localStorage.getItem("USER_ID");
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

    async function addNote() {
        if (NoteMessage === '') {
            alert('Please enter note');
            return false;
        } else {
            var postdata = { 'order_no': OrderData.order_no, 'message': NoteMessage, 'type': NoteType }

            fetch(`${config.baseUrl}/admin/orders/addordernote`, {
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
    }

    async function updateOrder() {
        var userdata = localStorage.getItem("USER_ID");

        var postdata = { 'user_no': userdata, 'order_no': order_no, 'tracking_code': TrackingCode, 'carrier_name': CarrierName, 'pickup_date': PickupDate, 'status': Status }

        fetch(`${config.baseUrl}/admin/orders/updateorder`, {
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

    function createDate(db_date) {
        var dateFuntion = new Date(db_date);
        var year = dateFuntion.getFullYear();
        var month = dateFuntion.getMonth() + 1;
        var day = dateFuntion.getDate()+1;

        if (day < 10) {
            day = '0' + day
        }
        if (month < 10) {
            month = '0' + month
        }
        var date = day + '-' + month + '-' + year;


        return date;
    }

    async function createInvoice() {
        var postdata = { 'order_no': order_no }
        setinvoiceLoad(true)
        fetch(`${config.baseUrl}/admin/orders/createinvoice`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem("token"),
            },
            body: JSON.stringify(postdata),
        })
            .then((res) => res.json())
            .then(({ error, data, CODE }) => {
                
                setinvoiceLoad(false)
                
                if (CODE == '200') {
                    window.location.reload();
                }

            });
    }

    async function deleteInvoice() {
        var postdata = { 'order_no': order_no }

        fetch(`${config.baseUrl}/admin/orders/deleteinvoice`, {
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

    if (!isLoading) {
        return (
            <>
                <Header />

                <span className="blank_space d-flex align-items-center">
                    <h2></h2>

                    <button type="button" className="nav-link btn btn-primary ml-auto theme_button top_fixed_buton" onClick={() => updateOrder()}>Update</button>

                    <Link to='/orderlist' className="nav-link btn btn-primary theme_button top_fixed_buton nav-back">Back</Link>
                </span>

                <div className="middle_content prodctlist w-100">
                    <div className="content change-mg">

                        <div className="container-fluid">
                            <div className="row">

                                <div className="col-md-9">


                                    <div className=" bg-white2">

                                        <div className="invoice-header">
                                            <div className="billed-from mb-0">
                                                <h4> Order Details </h4>
                                            </div>
                                        </div>
                                        <div className="row mg-t-10 order-mg">
                                            <div className="col-md p-1">
                                                <div className="border p-2 h-100">
                                                    <h6 className="tx-gray-800">General</h6>
                                                    <p className="invoice-info-row">
                                                        <span className="invoice-date">Created Date: </span>
                                                        <span className="invoice-DateText"> {createDate(OrderData.create_date)}</span>
                                                    </p>
                                                    <div className="status mg-t-10">
                                                        <h6 className="tx-gray-800">Status</h6>

                                                        <select
                                                            value={Status}
                                                            className="form-control"
                                                            onChange={((e) => {
                                                                setStatus(e.target.value)

                                                            })} >
                                                            ${OrderStatus.map((dataopt) => {
                                                                return (
                                                                    <option value={dataopt.id} > {dataopt.name} </option>
                                                                )
                                                            }

                                                            )}
                                                        </select>

                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-md p-1">
                                                <div className="border p-2 h-100">
                                                    <h6 className="tx-gray-800">Billed To</h6>
                                                    <div className="billed-to">
                                                        <h6 className="tx-gray-800">{OrderData.delivery_name}</h6>
                                                        <p>{OrderData.delivery_address}, {OrderData.delivery_city}, {OrderData.delivery_pincode}, {OrderData.delivery_mobile_no}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-md p-1">
                                                <div className="border p-2 h-100">
                                                    <h6 className="tx-gray-800">Shipped To</h6>
                                                    <div className="shipped-to">
                                                        <h6 className="tx-gray-800">{OrderData.delivery_name}</h6>
                                                        <p>{OrderData.delivery_address}, {OrderData.delivery_city}, {OrderData.delivery_pincode}, {OrderData.delivery_mobile_no}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="card card-chng">
                                        <table className="table table-transparent table-responsive">
                                            <thead>
                                                <tr>
                                                    <th>Sr No</th>
                                                    <th>Image</th>
                                                    <th>Item Name</th>
                                                    <th className="text-center">Sale Price</th>
                                                    <th className="text-center">Actual Sale Price</th>
                                                    <th className="text-center">Qnt</th>
                                                    <th className="text-end">Total Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Order &&
                                                    <>
                                                        {Order.map((item, ind) => {
                                                            return (
                                                                <>
                                                                    <tr>
                                                                        <td>{ind + 1}</td>
                                                                        <td className="text-left">
                                                                            <img src={item.basket_image} height="30" />
                                                                        </td>
                                                                        <td>
                                                                            <p className="strong mb-1">{item.basket_name}</p>
                                                                            <div className="text-muted">{item.basket_description}</div>
                                                                        </td>
                                                                        <td className="text-center">
                                                                            {item.basket_sale_price}
                                                                        </td>
                                                                        <td className="text-center">{item.actual_price}</td>
                                                                        <td className="text-center">{item.quantity}</td>
                                                                        <td className="text-end">{item.actual_price * item.quantity}</td>
                                                                    </tr>
                                                                </>
                                                            )
                                                        })}
                                                    </>
                                                }


                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="card  card-left">
                                        <table className="table table-transparent table-responsive">
                                            <tbody>
                                                <tr>
                                                    <td colspan="4" className="strong ">Subtotal</td>
                                                    <td className="text-end">Rs {SubTotal}</td>
                                                </tr>
                                                <tr>
                                                    <td colspan="4" className="strong ">Delivery Charges</td>
                                                    <td className="text-end">Rs {DeliverChages}</td>
                                                </tr>
                                                <tr>
                                                    <td colspan="4" className="font-weight-bold text-uppercase">Total Amount</td>
                                                    <td className="font-weight-bold text-end">Rs {TotalAmount}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>


                                </div>

                                <div className="col-md-3 order-track">

                                    <div className="bg-white2 mb-3">
                                        <div className="card-header tx-medium bd-0 tx-gray-800 bg-gray-100 d-flex justify-content-between align-items-center" data-toggle="collapse" href="#multiCollapseExample1" aria-expanded="true" aria-controls="multiCollapseExample1" role="button">
                                            <div>Order Tracking </div>
                                            <div><i className="icon-sort-down"></i></div>
                                        </div>
                                        <div>
                                            <form action="#/" validate="true" autocomplete="off" className="pt-2 collapse multi-collapse show" id="multiCollapseExample1">
                                                <div className="form-group mb-2"><label className="m-0">Tracking code</label>
                                                    <input
                                                        name="trackingcode"
                                                        type="text"
                                                        className="form-control"
                                                        value={TrackingCode}
                                                        onChange={(e) => setTrackingCode(e.target.value)}
                                                    />
                                                </div>
                                                <div className="form-group mb-2">
                                                    <label className="m-0">Carrier name</label>
                                                    <input
                                                        name="trackingcode"
                                                        type="text"
                                                        className="form-control"
                                                        value={CarrierName}
                                                        onChange={(e) => setCarrierName(e.target.value)}
                                                    />
                                                </div>

                                                <div className="datepick form-group mb-2">
                                                    <label className="m-0">Pickup date</label>
                                                    <DatePicker
                                                        selected={PickupDate}
                                                        minDate={new Date()}
                                                        onChange={(date) => setPickupDate(date)}
                                                        className="form-control"
                                                        dateFormat="dd-MM-yyyy"
                                                        showTimeSelect={false}
                                                        showDisabledMonthNavigation
                                                    />
                                                </div>

                                            </form>
                                        </div>
                                    </div>



                                    <div className="bg-white2 p-2 mg-t-20 max-height-50 overflow-auto mb-3">
                                        <div className="card-header tx-medium bd-0 tx-gray-800 bg-gray-100 d-flex justify-content-between align-items-center" data-toggle="collapse" href="#multiCollapseExample3" aria-expanded="true" aria-controls="multiCollapseExample2" role="button">
                                            <div>Invoice</div>
                                            <div><i className="icon-sort-down"></i></div>
                                        </div>
                                        <div>
                                            <div className="multi-collapse pt-2 collapse show" id="multiCollapseExample3">
                                                <div className="abc">

                                                    {IsInvoiced < 1 ?

                                                        <div class="Invoice_second1">
                                                            <div class="d-flex justify-content-between align-items-center"><span>  Invoice number  : </span><span> </span></div>



                                                            <div className="Invoice">
                                                                <div className=" add_invoice_div">

                                                                    {invoiceLoad ?
                                                                    <div className="gif-loading">
                                                                         <img
                                                                            src={require("../../loader/loader.gif")} className="gif-load"
                                                                            alt=""
                                                                        />
                                                                    </div>

                                                                        :

                                                                        <a className="add-invoice form-control w-50 invoice-chng" onClick={() => createInvoice()}> Create Invoice</a>
                                                                    }
                                                                       
                                                                </div>
                                                            </div>
                                                        </div>

                                                        :

                                                        <div className="Invoice_second">
                                                            <div className="add_invoice_div w-100">

                                                            </div>

                                                            <div class="d-flex justify-content-between align-items-center"><span>  Invoice number  : {OrderData.invoice_no}</span><span> </span></div>

                                                            
                                                            
                                                            <div className="Invoice">
                                                                <div className=" add_invoice_div1">

                                                                    <a href={`${config.baseUrl}/order_invoice/` + order_no + '.pdf'} target="_blank" className="add-invoice form-control invoice-chng">
                                                                        View</a>
                                                                </div>
                                                                

                                                                <div className=" add_invoice_div1">
                                                                    <a className="add-invoice form-control invoice-chng" onClick={() => deleteInvoice()}> Delete Invoice</a>
                                                                </div>
                                                            </div>
                                                            
                                                        </div>

                                                    }

                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white3 p-2 mg-t-20 max-height-50 overflow-auto mb-3">
                                        <div className="card-header tx-medium bd-0 tx-gray-800 bg-gray-100 d-flex justify-content-between align-items-center collapsed" data-toggle="collapse" href="#multiCollapseExample5" aria-expanded="false" aria-controls="multiCollapseExample2" role="button">
                                            <div>Order Notes</div>
                                            <div><i className="icon-sort-down"></i></div>
                                        </div>
                                        <div>
                                            <div className="multi-collapse collapse" id="multiCollapseExample5">
                                                <div className="add_note mt-2">
                                                    <p className="d-flex flex-column"><label for="add_order_note" className="m-0">Add note <span className="woocommerce-help-tip"></span></label>

                                                        <textarea
                                                            type="text" name="order_note"
                                                            id="add_order_note"
                                                            className="input-text" cols="20"
                                                            rows="3"
                                                            required=""
                                                            onChange={(e) => setNoteMessage(e.target.value)}
                                                        ></textarea></p>
                                                    <p className="d-flex flex-column">
                                                        <label for="order_note_type" className="screen-reader-text m-0">Note type</label>
                                                        <select
                                                            className="form-control"
                                                            value={NoteType}
                                                            onChange={(e) => setNoteType(e.target.value)}
                                                        >
                                                            <option value="Private Note">Private Note</option>
                                                            <option value="Note to Customer">Note to Customer</option>
                                                        </select>
                                                        <button type="button" className="add_note1 btn btn-az-primary mt-2" onClick={() => addNote()}>Add</button>
                                                    </p>
                                                </div>

                                                {OrderNotesData &&
                                                    <>
                                                        {OrderNotesData.map((val, ind) => {
                                                            return (
                                                                <div className="order_notes mt-2">
                                                                    <div className="note mt-2">

                                                                        <div className="note_content bg-gray-200 p-2 tx-12">
                                                                            <h5>{val.type}</h5>
                                                                            <span>{val.message}</span>
                                                                        </div>
                                                                        <p className="meta tx-11 pt-2 m-0">
                                                                            <span className="exact-date pr-3" title="">{createDate(val.created_date)}</span><span className="delete_note tx-indigo delete_clr" role="button" onClick={() => deleteOrderNote(val.note_id)}>Delete note</span></p>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })}

                                                    </>
                                                }


                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>
                </div>
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