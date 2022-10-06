import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import config from "../../config";
import Header from "../includes/Header";

const TableHeader = ["#", "Username", "Password" ];

const Dashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [usersdata, setUsersdata] = useState(null);
  const history = useHistory();

  useEffect(() => {
    
    
  }, [history]);

  const setmsg = 'Hi this is tesing props.';

  return (
    <>     
      <Header />

      <div className="middle_content dashboard w-100">
      <div className="content">
        <div className="container-xl"> 
        {usersdata ? 
          <>
          </>
          :
          <p>No data found!..</p>
        }
      </div>
      </div>
      </div> 
    </>
  );
};

export default Dashboard;
