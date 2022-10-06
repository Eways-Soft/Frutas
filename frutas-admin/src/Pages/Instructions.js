import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useHistory, Link } from "react-router-dom";
import Header from "./includes/Header";
import config from "./../config";
import styles from "./Users/Index.css";

export default function Instructions(props) { 
  const [alreadyAdded, setalreadyAdded] = useState();
  const history = useHistory();

  useEffect(() => {  

  }, [history]);


  return (
    <>
      <Header />

      <div></div>
    </>
  );
}

