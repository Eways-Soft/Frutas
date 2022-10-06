import React from "react";

import {
  Route,
  BrowserRouter as Router,
  Switch,
  Redirect,
} from "react-router-dom";

import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import Dashboard from "./Pages/Dashboard/Dashboard";

import UsersList from "./Pages/Users/UsersList";
import Adduser from "./Pages/Users/Addnewuser";
import Edituser from "./Pages/Users/EditUser";

import RoleList from "./Pages/Roles/RoleList";
import AddNewRole from "./Pages/Roles/AddNewRole";
import EditRole from "./Pages/Roles/EditRole";

import ListProductCategory from "./Pages/ProductCategory/List";
import EditProductCategory from "./Pages/ProductCategory/Edit";
import AddNewProductCategory from "./Pages/ProductCategory/AddNew";

import Products from "./Pages/Products/List";
import AddNewProduct from "./Pages/Products/AddNew";
import EditProduct from "./Pages/Products/EditProduct";

import BasketList from "./Pages/Basket/BasketList";
import AddBasket from "./Pages/Basket/AddBasket";
import EditBasket from "./Pages/Basket/EditBasket";

import BasketCategoryList from "./Pages/BasketCategory/List";
import AddBasketCategory from "./Pages/BasketCategory/AddNew";
import EditBasketCategory from "./Pages/BasketCategory/Edit";

import BasketDiscountList from "./Pages/Discount/List";
import BasketDiscountAdd from "./Pages/Discount/Add";
import BasketDiscountEdit from "./Pages/Discount/Edit";

import SubscriptionCategoryList from "./Pages/SubscriptionCategory/List";
import SubscriptionCategoryAdd from "./Pages/SubscriptionCategory/Add";
import SubscriptionCategoryEdit from "./Pages/SubscriptionCategory/Edit";

import SubscriptionList from "./Pages/Subscription/List";
import SubscriptionAdd from "./Pages/Subscription/Add";
import SubscriptionEdit from "./Pages/Subscription/Edit";

import CitiesList from "./Pages/Cities/List";
import CitiesAdd from "./Pages/Cities/Add";
import CitiesEdit from "./Pages/Cities/Edit";

import TypesList from "./Pages/Types/List";
import AddType from "./Pages/Types/AddNew";
import EditType from "./Pages/Types/Edit";

import PlanConfigurationList from "./Pages/PlanConfiguration/List";
import PlanConfigurationEdit from "./Pages/PlanConfiguration/Edit";

import OrderList from "./Pages/Order/OrderList";
import OrderView from "./Pages/Order/OrderView";


import AppMainSlider from "./Pages/App/Slider/MainSlider";

import AppOfferSliderList from "./Pages/App/OfferSlider/List";
import AppOfferSliderAdd from "./Pages/App/OfferSlider/Add";
import AppOfferSliderEdit from "./Pages/App/OfferSlider/Edit";

import AppHelthSliderList from "./Pages/App/HelthSlider/List";
import AppHelthSliderAdd from "./Pages/App/HelthSlider/Add";
import AppHelthSliderEdit from "./Pages/App/HelthSlider/Edit";

import Instructions from "./Pages/Instructions";

import NotFound from "./Pages/NotFound/NotFound";

const authGuard = (Component) => () => {
  return localStorage.getItem("token") ? (
    <Component />
  ) : (
    <Redirect to="/login" />
  );
};
const Routes = (props) => (
  <Router {...props} basename={'/FruitsBasket/admin/'} >
    <Switch>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/register">
        <Register />
      </Route>

      <Route path="/dashboard" render={authGuard(Dashboard)}></Route>
      <Route exact path="/">
        <Redirect to="/dashboard" />
      </Route>
      
      <Route path="/appmainslider" render={authGuard(AppMainSlider)}></Route>
      <Route exact path="/">
        <Redirect to="/appmainslider" />
      </Route>

      <Route path="/appoffersliderlist" render={authGuard(AppOfferSliderList)}></Route>
      <Route exact path="/">
        <Redirect to="/appoffersliderlist" />
      </Route>

      <Route path="/appofferslideradd" render={authGuard(AppOfferSliderAdd)}></Route>
      <Route exact path="/">
        <Redirect to="/appofferslideradd" />
      </Route>

      <Route path="/appofferslideredit/:id" render={authGuard(AppOfferSliderEdit)}></Route>
      <Route exact path="/">
        <Redirect to="/appofferslideredit" />
      </Route>

      <Route path="/apphelthliderlist" render={authGuard(AppHelthSliderList)}></Route>
      <Route exact path="/">
        <Redirect to="/apphelthliderlist" />
      </Route>

      <Route path="/apphelthslideradd" render={authGuard(AppHelthSliderAdd)}></Route>
      <Route exact path="/">
        <Redirect to="/apphelthslideradd" />
      </Route>

      <Route path="/apphelthslideredit/:id" render={authGuard(AppHelthSliderEdit)}></Route>
      <Route exact path="/">
        <Redirect to="/apphelthslideredit" />
      </Route>


      <Route path="/users" render={authGuard(UsersList)}></Route>
      <Route exact path="/">
        <Redirect to="/users" />
      </Route>

      <Route path="/adduser" render={authGuard(Adduser)}></Route>
      <Route exact path="/">
        <Redirect to="/adduser" />
      </Route>

      <Route path="/edituser/:id" render={authGuard(Edituser)}></Route>
      <Route exact path="/">
        <Redirect to="/edituser" />
      </Route>

      <Route path="/roles" render={authGuard(RoleList)}></Route>
      <Route exact path="/">
        <Redirect to="/roles" />
      </Route>

      <Route path="/addnewrole" render={authGuard(AddNewRole)}></Route>
      <Route exact path="/">
        <Redirect to="/addnewrole" />
      </Route>

      <Route path="/editrole/:roleid" render={authGuard(EditRole)}></Route>
      <Route exact path="/">
        <Redirect to="/editrole" />
      </Route>

      <Route path="/listproductcategory" render={authGuard(ListProductCategory)}></Route>
      <Route exact path="/">
        <Redirect to="/listproductcategory" />
      </Route>

      <Route path="/addnewproductcategory" render={authGuard(AddNewProductCategory)}></Route>
      <Route exact path="/">
        <Redirect to="/addnewproductcategory" />
      </Route>

      <Route path="/editproductcategory/:id" render={authGuard(EditProductCategory)}></Route>
      <Route exact path="/">
        <Redirect to="/editproductcategory" />
      </Route>

      <Route path="/products" render={authGuard(Products)}></Route>
      <Route exact path="/">
        <Redirect to="/products" />
      </Route>

      <Route path="/addnewproduct" render={authGuard(AddNewProduct)}></Route>
      <Route exact path="/">
        <Redirect to="/addnewproduct" />
      </Route>

      <Route path="/editproduct/:id" render={authGuard(EditProduct)}></Route>
      <Route exact path="/">
        <Redirect to="/editproduct" />
      </Route>

      <Route path="/basketcategories" render={authGuard(BasketCategoryList)}></Route>
      <Route exact path="/">
        <Redirect to="/basketcategories" />
      </Route>

      <Route path="/addbasketcategory" render={authGuard(AddBasketCategory)}></Route>
      <Route exact path="/">
        <Redirect to="/addbasketcategory" />
      </Route>

      <Route path="/editbasketcategory/:roleid" render={authGuard(EditBasketCategory)}></Route>
      <Route exact path="/">
        <Redirect to="/editbasketcategory" />
      </Route>

      <Route path="/baskets" render={authGuard(BasketList)}></Route>
      <Route exact path="/">
        <Redirect to="/baskets" />
      </Route>
    

      <Route path="/addnewbasket" render={authGuard(AddBasket)}></Route>
      <Route exact path="/">
        <Redirect to="/addnewbasket" />
      </Route>

      <Route path="/editbasket/:id" render={authGuard(EditBasket)}></Route>
      <Route exact path="/">
        <Redirect to="/editbasket" />
      </Route>

      <Route path="/discounts" render={authGuard(BasketDiscountList)}></Route>
      <Route exact path="/">
        <Redirect to="/baskets" />
      </Route>

      <Route path="/discountadd" render={authGuard(BasketDiscountAdd)}></Route>
      <Route exact path="/">
        <Redirect to="/baskets" />
      </Route>

      <Route path="/discountedit/:id" render={authGuard(BasketDiscountEdit)}></Route>
      <Route exact path="/">
        <Redirect to="/discountedit/:id" />
      </Route>

      <Route path="/subscriptioncategories" render={authGuard(SubscriptionCategoryList)}></Route>
      <Route exact path="/">
        <Redirect to="/subscriptioncategories" />
      </Route>

      <Route path="/addsubscriptioncategory" render={authGuard(SubscriptionCategoryAdd)}></Route>
      <Route exact path="/">
        <Redirect to="/addsubscriptioncategory" />
      </Route>

      <Route path="/subscriptioncategoryedit/:id" render={authGuard(SubscriptionCategoryEdit)}></Route>
      <Route exact path="/">
        <Redirect to="/subscriptioncategoryedit/:id" />
      </Route>

      <Route path="/subscription" render={authGuard(SubscriptionList)}></Route>
      

      <Route path="/addsubscription" render={authGuard(SubscriptionAdd)}></Route>
      <Route exact path="/">
        <Redirect to="/addsubscription" />
      </Route>

      <Route path="/subscriptionedit/:id" render={authGuard(SubscriptionEdit)}></Route>
      

      <Route path="/cities" render={authGuard(CitiesList)}></Route>
      <Route exact path="/">
        <Redirect to="/cities" />
      </Route>

      <Route path="/addcity" render={authGuard(CitiesAdd)}></Route>
      <Route exact path="/">
        <Redirect to="/addcity" />
      </Route>

      <Route path="/editcity/:id" render={authGuard(CitiesEdit)}></Route>
      <Route exact path="/">
        <Redirect to="/editcity" />
      </Route>

      <Route path="/types" render={authGuard(TypesList)}></Route>
      <Route exact path="/">
        <Redirect to="/types" />
      </Route>

      <Route path="/addnewtype" render={authGuard(AddType)}></Route>
      <Route exact path="/">
        <Redirect to="/addnewtype" />
      </Route>

      <Route path="/edittype/:id" render={authGuard(EditType)}></Route>
      <Route exact path="/">
        <Redirect to="/edittype" />
      </Route>

      <Route path="/plancofiguredlist" render={authGuard(PlanConfigurationList)}></Route>
      <Route exact path="/">
        <Redirect to="/types" />
      </Route>

      <Route path="/editcofigurationplan/:id" render={authGuard(PlanConfigurationEdit)}></Route>
      <Route exact path="/">
        <Redirect to="/edittype" />
      </Route>

      <Route path="/orderlist" render={authGuard(OrderList)}></Route>
      <Route exact path="/">
        <Redirect to="/orderlist" />
      </Route>

      <Route path="/orderview" render={authGuard(OrderView)}></Route>
      <Route exact path="/">
        <Redirect to="/orderview" />
      </Route>    

      <Route path="/instructions" render={authGuard(Instructions)}></Route>
      <Route exact path="/">
        <Redirect to="/instructions" />
      </Route>     




      <Route path="*">
        <NotFound />
      </Route>

    </Switch>
  </Router>
);

export default Routes;
