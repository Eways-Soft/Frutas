import React, { useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import * as Icon from 'react-feather';

function Sidebar (props){

  const [isActive, setisActive] = useState()
  function handleToggle(){
      setisActive(!isActive)
  }

    return (
      <>
        <div className={`az-content-left az-content-left-components vertical-nav bg-white ${isActive ? "active" : "inactive"}`}>
          <div className="component-item">
            <nav className="nav flex-column">
              <Link to="#/" className="nav-link">link</Link>
              <Link to="#/" className="nav-link">link 1</Link>
            </nav>
          </div>{/* component-item */}
        </div>{/* content-left */}

        <div className="sidebutton">
          <p className="sidebutton_icon" onClick={handleToggle}>
          <Icon.Menu className="icon" />
          </p>
        </div>
      </>
    )

  function isPathActive(path) {
    return props.location.pathname.startsWith(path);
  }

}

export default withRouter(Sidebar)
