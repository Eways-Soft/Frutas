import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";

export default function Footer() {
    const history = useHistory();
    useEffect(() => {

    }, [history]);

    return (
        <>      
        <div className=" bg-white">
        <div className="container-xl d-flex align-items-center justify-content-between">
            <h4 className="m-0 p-1 text-center">Copyright © 2021 All Rights Reserved.</h4>
            <h4 className="m-0 p-1 text-center">Eways Soft Solution</h4>
        </div>
        </div>
        </>
    )
}