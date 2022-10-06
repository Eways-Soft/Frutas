import React, { useEffect, useState } from "react";
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { useHistory,Link } from "react-router-dom";
import config from "../../config";
import {
  Tabs,
  Tab,
  Modal,
  Row,
  Button,
  Col,
  Form,
  Card,
  Container,
  Dropdown
} from "react-bootstrap";

export default function Header(props) {
  const history = useHistory();
  const [user_role_menus, setUser_role_menus] = useState([]);
  const [message, setMessage] = useState();

  const [DashboardMenu, setDashboard] = useState(false);
  const [ProductCategoryMenu, setProductCategoryMenu] = useState(false);
  const [ProductsMenu, setProductsMenu] = useState(false);
  const [BasketCategoryMenu, setBasketCategoryMenu] = useState(false);
  const [BasketsMenu, setBasketsMenu] = useState(false);

  const [SubscriptionMenu, setSubscriptionMenu] = useState(false);
  const [PlanConfigMenu, setPlanConfigMenu] = useState(false);
  const [OrderMenu, setOrderMenu] = useState(false);
  const [OrderList, setOrderList] = useState(false);
  const [OrderView, setOrderView] = useState(false);

  const [ToolMenu, setToolMenu] = useState(false);
  const [RoleMenu, setRoleMenu] = useState(false);
  const [UsersMenu, setUsersMenu] = useState(false);
  const [CitiesMenu, setCitiesMenu] = useState(false);
  const [TypesMenu, setTypesMenu] = useState(false);
  const [DiscountMenu, setDiscountMenu] = useState(false);
  const [AppMenu, setAppMenu] = useState(false);
  const [AppMainSliderMenu, setAppMainSliderMenu] = useState(false);
  const [AppOfferSlidersMenu, setAppOfferSlidersMenu] = useState(false);
  const [AppHealthSlidersMenu, setAppHealthSlidersMenu] = useState(false);

  useEffect(() => {    
    var role_master = JSON.parse(window.localStorage.getItem('role_master'));
    var user_role_menus = role_master.role_menu_ids.split(',');

    setUser_role_menus(user_role_menus);
    var user_role_setting = role_master.role_setting_ids.split(',');

    var role_setting = JSON.parse(window.localStorage.getItem('role_settings'));
    //var role_settings = role_master.split(',');

    var roles_menu = JSON.parse(window.localStorage.getItem('roles_menu'));
    //var roles_menus = role_master.role_menu_ids.split(',');     

    var dashbordmenu = checkMenues('1');
    if (dashbordmenu) {
      setDashboard(true)
    }

    var p_c_Menu = checkMenues('2');
    if (p_c_Menu) {
      setProductCategoryMenu(true)
    }

    var productsMenu = checkMenues('3');
    if (productsMenu) {
      setProductsMenu(true)
    }

    var b_c_Menu = checkMenues('4');
    if (b_c_Menu) {
      setBasketCategoryMenu(true)
    }

    var basketsMenu = checkMenues('5');
    if (basketsMenu) {
      setBasketsMenu(true)
    }

    var subscriptionMenu = checkMenues('6');
    if (subscriptionMenu) {
      setSubscriptionMenu(true)
    }

    var planConfigMenu = checkMenues('7');
    if (planConfigMenu) {
      setPlanConfigMenu(true)
    }

    var roleMenu = checkMenues('8');
    if (roleMenu) {
      setRoleMenu(true)
      setToolMenu(true)
    }

    var userMenu = checkMenues('9');
    if (userMenu) {
      setUsersMenu(true)
      setToolMenu(true)
    }

    var citiesMenu = checkMenues('10');
    if (citiesMenu) {
      setCitiesMenu(true)
      setToolMenu(true)
    }

    var typesMenu = checkMenues('11');
    if (typesMenu) {
      setTypesMenu(true)
      setToolMenu(true)
    }

    var discountMenu = checkMenues('12');
    if (discountMenu) {
      setDiscountMenu(true)
      setToolMenu(true)
    }

    var ordrMenu = checkMenues('13');
    if (ordrMenu) {
      setOrderMenu(true)
    }

    var AppMenu = checkMenues('14');
    if (AppMenu) {
      setAppMenu(true)
    }

    var AppMainSliderMenu = checkMenues('15');
    if (AppMainSliderMenu) {
      setAppMainSliderMenu(true)
    }

    var AppOfferSlidersMenu = checkMenues('16');
    if (AppOfferSlidersMenu) {
      setAppOfferSlidersMenu(true)
    }

    var HealthSlidersMenu = checkMenues('17');
    if (HealthSlidersMenu) {
      setAppHealthSlidersMenu(true)
    }

    function checkMenues(id) {
      var returns = user_role_menus.includes(id);
      return returns;
    }
  }, [history]);

  const logout = () => {
    const toLogout = window.confirm("Are you sure to logout ?");
    if (toLogout) {
      localStorage.clear();
      history.push("/login");
    }
  };

  return (
    <>
      <div className="navbar-expand-md sticky-top">
        <div className="collapse navbar-collapse" id="navbar-menu">
          <div className="navbar navbar-light">
            <div className="container-xl">

              <Link className="navbar-brand" to="/">
                <img src={process.env.PUBLIC_URL + '/assets/images/logo.jpg'} alt="logo" className="logo_img" />
              </Link>
              
              <ul className="navbar-nav">
                {DashboardMenu && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/dashboard" >
                      <span className="nav-link-icon d-md-none d-lg-inline-block">
                        {/* <Icon.Home className="icon" /> */}
                      </span>
                      <span className="nav-link-title">Dashboard</span>
                    </Link>
                  </li>
                )}

                {ProductsMenu &&                
                  <li className="nav-item dropdown">
                    <Link className="nav-link dropdown-toggle" to="/products" data-toggle="dropdown" role="button" aria-expanded="false" >
                      <span className="nav-link-icon d-md-none d-lg-inline-block">
                        
                      </span>
                      <span className="nav-link-title">Products</span>
                    </Link>
                    <ul className="dropdown-menu dropdown-menu-arrow">
                      {ProductCategoryMenu && (
                        <li><Link to="/listproductcategory" className="dropdown-item" >Product Category</Link></li>
                      )}
                      {ProductsMenu && (
                        <li><Link to="/products" className="dropdown-item" >Products</Link></li>
                      )}
                    </ul>
                  </li>
                }                

                {BasketCategoryMenu &&
                  <li className="nav-item dropdown">
                    <Link className="nav-link dropdown-toggle" to="/baskets" data-toggle="dropdown" role="button" aria-expanded="false" >
                      <span className="nav-link-icon d-md-none d-lg-inline-block">
                        
                      </span>
                      <span className="nav-link-title">Baskets</span>
                    </Link>
                    <ul className="dropdown-menu dropdown-menu-arrow">
                      {BasketCategoryMenu && (
                        <li><Link to="/basketcategories" className="dropdown-item" >Basket Categories</Link></li>
                      )}
                      {BasketsMenu && (
                        <li><Link to="/baskets" className="dropdown-item" >Baskets</Link></li>
                      )}
                    </ul>
                  </li>
                }  

                {PlanConfigMenu && (
                  <li className="nav-item">
                    <Link to="/subscription" className="nav-link">
                      <span className="nav-link-icon d-md-none d-lg-inline-block">
                        </span>
                        <span className="nav-link-title">Subscription</span>
                    </Link>
                    

                  </li>
                )}

                {PlanConfigMenu && (
                  <li className="nav-item">
                    <Link to="/plancofiguredlist" className="nav-link">
                      <span className="nav-link-icon d-md-none d-lg-inline-block">

                          
                        </span>
                        <span className="nav-link-title">Plan Cofiguration</span>
                    </Link>
                    

                  </li>
                )}

                {OrderMenu && (
                  <li className="nav-item">
                    <Link to="/orderlist" className="nav-link">
                      <span className="nav-link-icon d-md-none d-lg-inline-block">

                          
                        </span>
                        <span className="nav-link-title">Orders</span>
                    </Link>
                    

                  </li>
                )}

                {ToolMenu &&
                  <li className="nav-item dropdown">
                    <Link className="nav-link dropdown-toggle" to="#navbar-base" data-toggle="dropdown" role="button" aria-expanded="false" >
                      <span className="nav-link-icon d-md-none d-lg-inline-block">
                        
                      </span>
                      <span className="nav-link-title">Tools</span>
                    </Link>
                    <ul className="dropdown-menu dropdown-menu-arrow">
                      {RoleMenu && (
                        <li><Link to="/roles" className="dropdown-item" >Roles</Link></li>
                      )}
                      {UsersMenu && (
                        <li><Link to="/users" className="dropdown-item" >Users</Link></li>
                      )}
                      {CitiesMenu && (
                        <li><Link to="/cities" className="dropdown-item" >Cities</Link></li>
                      )}
                      {TypesMenu && (
                        <li><Link to="/types" className="dropdown-item" >Types</Link></li>
                      )}
                      {DiscountMenu && (
                        <li><Link to="/discounts" className="dropdown-item" >Discounts</Link></li>
                      )}
                    </ul>
                  </li>
                }

                {AppMenu &&                
                  <li className="nav-item dropdown">
                    <Link className="nav-link dropdown-toggle" to="#navbar-base" data-toggle="dropdown" role="button" aria-expanded="false" >
                      <span className="nav-link-icon d-md-none d-lg-inline-block">
                        
                      </span>
                      <span className="nav-link-title">App</span>
                    </Link>
                    <ul className="dropdown-menu dropdown-menu-arrow">
                      {AppMainSliderMenu && (
                        <li><Link to="/appmainslider" className="dropdown-item" >Main Slider</Link></li>
                      )}
                      {AppOfferSlidersMenu && (
                        <li><Link to="/appoffersliderlist" className="dropdown-item" >Offer Sliders</Link></li>
                      )}
                      {AppHealthSlidersMenu && (
                        <li><Link to="/apphelthliderlist" className="dropdown-item" >Health Sliders</Link></li>
                      )}
                    </ul>
                  </li>  
                }      

                <li className="nav-item">
                  <Link to="/instructions"  className="nav-link">
                    <span className="nav-link-icon d-md-none d-lg-inline-block">
                    </span>
                    <span className="nav-link-title">instructions</span>
                  </Link>
                </li>        

                <li className="nav-item">
                  <Link to="/"  className="nav-link">
                    <span className="nav-link-icon d-md-none d-lg-inline-block">
                    </span>
                    <span className="nav-link-title" onClick={() => logout()}>Logout</span>
                  </Link>
                </li>

              </ul>
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

