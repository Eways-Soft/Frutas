import React, { useEffect, useState } from "react";
import * as Icon from 'react-feather';
import { useHistory } from "react-router-dom";

import config from "../../config";
import Header from "../includes/Header";
import Footer from "../includes/Footer";
import Sidebar from "../includes/Sidebar";

const TableHeader = ["#", "Username", "Password"];

const List = () => {
  const [dashboard, setDashboard] = useState(null);
  const [Categories, setCategories] = useState(null);

  const history = useHistory();

  useEffect(() => {
    fetch(`${config.baseUrl}/getAllSubscriptionCategories`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then(({ error, data }) => {
        setCategories(data)

      });
  }, [history]);

  const deleteCall = (id) => {
    const confirm = window.confirm("Are you sure to delete ?");
    if (confirm) {
      var formsdata = { "id": id }

      fetch(`${config.baseUrl}/deletediscount`, {
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


  return (
    <>

      <Header />
      <div className="az-content-wrapper">
        <div className="container-fluid d-flex h-100 mb-auto p-0">
          <Sidebar />

          <div className="middle_content userlist w-100">
            <div className="content">

              <a className="nav-link btn btn-primary mb-3 mr-3 ml-auto theme_button top_fixed_buton" href="/addsubscriptioncategory">Add New</a>

              <div className="container-xl">
                <div className="card">
                  <table className="table">
                    <thead className="table-header">
                      <tr>
                        <th>Edit</th>
                        <th>#</th>
                        <th>Name</th>
                        <th>Delete</th>
                      </tr>
                    </thead>
                    {Categories ?
                      <tbody>
                        {Categories.map((item) =>
                          <tr>
                            <td><a href={'/subscriptioncategoryedit/' + item.subscription_category_id}><Icon.Edit className="icon" /></a></td>
                            <td>{item.subscription_category_id}</td>
                            <td>{item.subscription_category_name}</td>
                            <td><a href="javascript:void(0)" onClick={() => deleteCall(item.subscription_category_id)}><Icon.Trash2 className="icon" /></a></td>
                          </tr>
                        )}
                      </tbody>
                      :
                      <tbody><tr><td colSpan="10"><p>No data found!..</p></td></tr></tbody>
                    }
                  </table>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default List;
