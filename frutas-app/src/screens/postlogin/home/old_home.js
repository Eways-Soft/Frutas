
import React, { useEffect, useState, useRef } from "react";

import {View, Text, Button, ScrollView, Dimensions, Image, TouchableOpacity,TouchableHighlight,RefreshControl,SafeAreaView,TextInput} from 'react-native';

import { FlatList } from 'react-native-gesture-handler';
import Icon from "react-native-vector-icons/AntDesign";
import FIcon from "react-native-vector-icons/FontAwesome";
import FeatherIcon from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import RBSheet from "react-native-raw-bottom-sheet";
import NumericInput from 'react-native-numeric-input';
import NetInfo from "@react-native-community/netinfo"; 
import { SliderBox } from "react-native-image-slider-box";
import { SwiperFlatList } from 'react-native-swiper-flatlist';

import AsyncStorage from '@react-native-async-storage/async-storage';

import Geolocation from '@react-native-community/geolocation';

import styles from '../../../assets/css/AppDesign.js'
import Loader from "../../../components/loader/Loader";

import Constants from '../../../config/Constants';
var BASE_URL = Constants.BASE_URL;

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
 
import { useSelector, useDispatch } from 'react-redux'

import { addBasket, deleteBasket, updateBasket, saveSubscriptions } from '../../../actions/cart';  
import { saveRecomendedBasketsForHome } from '../../../actions/home';  

const sliderData = [{ id: 1},{ id: 2},{ id: 3},{ id: 4}]

const sliderImages = [
        require('../../../assets/images/banner.png'),
        require('../../../assets/images/banner.png'),
        require('../../../assets/images/banner.png'),
        require('../../../assets/images/banner.png'),
      ]

const colors = ['tomato', 'thistle', 'skyblue', 'teal'];

export default function HomeScreen({ route, navigation }) {
  const dispatch = useDispatch()

  const refRBSheet = useRef();

  const [userTokens, setuserTokens] = React.useState('');

  const [BasketImagePopUp, setBasketImagePopUp] = React.useState('');
  const [BasketDiscountPricePopUp, setBasketDiscountPricePopUp] = React.useState('0');
  const [BasketSalePricePopUp, setBasketSalePricePopUp] = React.useState('0');
  const [BasketPricePopUp, setBasketPricePopUp] = React.useState('');
  const [BasketNamePopUp, setBasketNamePopUp] = React.useState('');
  const [BasketProductsPopUp, setBasketProductsPopUp] = React.useState('');
  const [BasketDescriptionPopUp, setBasketDescriptionPopUp] = React.useState('');

  const [isLoading, setisLoading] = React.useState(false);
  const [Maincategories, setMaincategories] = useState([]);
  const [BasketCategory, setBasketCategory] = useState([]);
  const [Recommended, setRecommended] = useState([]);
  const [BestSeller, setBestSeller] = useState([]);
  const [DiscountBaskets, setDiscountBaskets] = useState([]);
  const [AllBaskets, setAllBaskets] = useState([]);

  const [Subscriptions, setSubscriptions] = useState([]);
  const [SelectedSubscription, setSelectedSubscription] = useState([]);

  const [MainCatFilterArr, setMainCatFilterArr] = useState([]);

  const [SelectedMenCat, setSelectedMenCat] = useState(false);
  const [ChangeCat, setChangeCat] = useState(false);

  const [BasketItem, setBasketItem] = useState([]);
  //const [Quantity, setQuantity] = useState(1);
  const [basketModalQTY, setbasketModalQTY] = useState(1);

  const saveRecommendedBasketForHome = (data) => dispatch(saveRecomendedBasketsForHome(data));
  const RecommendedBaskets = useSelector(state => state.homeReducer.RecomendedBasketList)
  const BestSellerBaskets = useSelector(state => state.homeReducer.BestSellerBasketList)
  const SingleBoxesBaskets = useSelector(state => state.homeReducer.SingleBoxesBasketList)
  const DiscountsBaskets = useSelector(state => state.homeReducer.DiscountBasketList)

  const addBasketInCart = (BasketItem) => dispatch(addBasket(BasketItem))
  const saveSubscriptionsIntoRedux = (data) => dispatch(saveSubscriptions(data))

  const deleteBasketInCart = (BasketItem) => dispatch(deleteBasket(BasketItem))
  const updateBasketInCart = (BasketItem) => dispatch(updateBasket(BasketItem))

  const cbaskets = useSelector(state => state.cartReducer.CartBasketList)
  const CartTotalItem = useSelector(state => state.cartReducer.TotalItems)

  useEffect(() => { 
    getAllBaskets();

  }, [])

  async function getAllBaskets(){
    //getBasketsCategories();
    const sessionData = JSON.parse(await AsyncStorage.getItem('USER_DATA'));
    const cust_id = sessionData.customer_id
    //if(RecommendedBaskets ==''){
      const netStatus = await (await NetInfo.fetch()).isConnected;
      if (netStatus) {
        setisLoading(true)

        setTimeout(function(){
          setisLoading(false)
        },2000) 

        const bodyArray = {
          app: 1,
          customer_id: cust_id,
        };


        fetch(`${BASE_URL}getallbasketshome`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(bodyArray)
        }).then(function (response) {
          return response.json();
        }).then(async  function (result) {
          setisLoading(false)
          if (result.CODE === 200) {
            await setMaincategories(result.maincategory)
            await setBasketCategory(result.basket_category)
            await setRecommended(result.recommended)
            await setBestSeller(result.best_seller)
            await setDiscountBaskets(result.discount_baskets)
            await setAllBaskets(result.all_baskets)
            await setSubscriptions(result.subscription)

          }else{  
            alert('Something went wrong !.')
          }
        }).catch(function (error) {
        });

        return () => {
          setChangeCat(false);
        }
      }else{
        setisLoading(false)
        alert('Internet Connection is Weak');
      }
  } 

  function openModal(basketData){    
    setbasketModalQTY(1)
    setBasketItem([])
    
    refRBSheet.current.open() 

    var basketImg = basketData.basket_image
    var basketDiscountPrice = basketData.discount_price
    var basketSalePrice = basketData.actual_price
    var basketPrice = basketData.basket_sale_price
    var basketName = basketData.basket_name
    var basketProducts = basketData.basket_description
    var basketDescpn = basketData.basket_description

    setBasketImagePopUp(basketImg)
    setBasketDiscountPricePopUp(basketDiscountPrice)
    setBasketSalePricePopUp(basketSalePrice)
    setBasketPricePopUp(basketPrice)
    setBasketNamePopUp(basketName)
    //setBasketProductsPopUp(basketProducts)
    setBasketDescriptionPopUp(basketDescpn)
    
    setBasketItem(basketData)

    var userTokens = AsyncStorage.getItem('userToken');

    const bodyArray = {
      app: 1,
      token: userTokens,
      id: basketData.basket_id,
    };

    fetch(`${BASE_URL}getbasketproducts`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bodyArray)
    }).then(function (response) {
      return response.json();
    }).then(function (result) {
      var pnames = ''
      if (result.CODE === 200) {
        result.data.map((product)=>{
          pnames=pnames+product.product_name+', '
        })
        setBasketProductsPopUp(pnames)
      }
    })
  }

  function getBasketForCategory(id,name){
    navigation.navigate('Category',{
      catId: id,
      catName: name,
    });
  }

  function getCategoryBasket(id,name){
    
    navigation.navigate('CategoryBaskets',{
      catId: id,
      catName: name,
    });
  }

  function getBasketDetail(id,name){ 
    navigation.navigate('BasketDetail',{
      basket_id: id,
      basket_name: name,
    });
  }

  function addToCart(){
      var basketData = BasketItem
      let existed_item = cbaskets.find(item=> BasketItem.basket_id === item.basket_id);
      if(existed_item){
        basketData.quantity = basketModalQTY+existed_item.quantity
      }else{
        basketData.quantity = basketModalQTY
      }
      addBasketInCart(basketData)
  } 

  function updateQuantity(qty){
    setbasketModalQTY(qty)

    var BasketItemNew = BasketItem
    
    BasketItemNew.quantity = qty
    setBasketItem(BasketItemNew)

    if(qty === 0){
      updateBasketInCart(BasketItem)
    }else{
      
    }
  }

  function selectSubscription(data){
    setSelectedSubscription(data)
  }

  const onRefresh = React.useCallback(() => {
    getAllBaskets()
  }, []);


  async function addInToWishList(basket_id){

    const sessionData = JSON.parse(await AsyncStorage.getItem('USER_DATA'));
    const customer_id = sessionData.customer_id

    var newBaskets = Recommended;

    newBaskets.map((val,ind)=>{
      if(val.basket_id === basket_id){
        var dataold = [...Recommended];
        dataold[ind].wishlist = customer_id;
        setRecommended(dataold)
      }      
    })

    var newBaskets1 = BestSeller;

    newBaskets1.map((val,ind)=>{
      if(val.basket_id === basket_id){
        var dataold1 = [...BestSeller];
        dataold1[ind].wishlist = customer_id;
        setBestSeller(dataold1)
      }      
    })

    var newBaskets2 = AllBaskets;

    newBaskets2.map((val,ind)=>{
      if(val.basket_id === basket_id){
        var dataold2 = [...AllBaskets];
        dataold2[ind].wishlist = customer_id;
        setAllBaskets(dataold2)
      }      
    })

    const bodyArray1 = {
      app: 1,
      customer_id: customer_id,
      basket_id: basket_id,
    };

    fetch(`${BASE_URL}addintowishlist`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bodyArray1)
    }).then(function (response) {
      return response.json();
    }).then(function (result) {     
     
    }).catch(function (error) {
    });
  }

  async function removeFromWishList(basket_id){
    const sessionData = JSON.parse(await AsyncStorage.getItem('USER_DATA'));
    const customer_id = sessionData.customer_id

    var newBaskets = Recommended;

    newBaskets.map((val,ind)=>{
      if(val.basket_id === basket_id){
        var dataold = [...Recommended];
        dataold[ind].wishlist = null;
        setRecommended(dataold)
      }      
    })

    var newBaskets1 = BestSeller;

    newBaskets1.map((val,ind)=>{
      if(val.basket_id === basket_id){
        var dataold1 = [...BestSeller];
        dataold1[ind].wishlist = null;
        setBestSeller(dataold1)
      }      
    })

    var newBaskets2 = AllBaskets;

    newBaskets2.map((val,ind)=>{
      if(val.basket_id === basket_id){
        var dataold2 = [...AllBaskets];
        dataold2[ind].wishlist = null;
        setAllBaskets(dataold2)
      }      
    })
    
    const bodyArray1 = {
      app: 1,
      customer_id: customer_id,
      basket_id: basket_id,
    };

    fetch(`${BASE_URL}removefromwishlist`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bodyArray1)
    }).then(function (response) {
      return response.json();
    }).then(function (result) { 
      
     
    }).catch(function (error) {
    });
    
  }

  return (
    <ScrollView style={styles.scrollView} 
      contentContainerStyle={{ flexGrow: 1 }} 
      showsVerticalScrollIndicator ={false}
      showsHorizontalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={onRefresh}
        />
      }
    >

      <View style={styles.container}>

        <View style={styles.homepage}>
          <View style={styles.homepageinnercontent}>

          <View style={styles.topBanner}>
           <Image style={styles.bannerInner} source={require('../../../assets/images/banner-top.png')} />
          </View>

            <View style={styles.homeallcat}>

              <TouchableHighlight style={[!MainCatFilterArr.includes(1) ? styles.eachcattouch : styles.selectedeachcat]} onPress={()=> getBasketForCategory(1,'Men')} underlayColor='#fff'> 
                <View style={styles.eachcat}>
                  <Image style={styles.eachcaticon} source={require('../../../assets/icons/men.png')} />
                  <Text style={[styles.eachcattext, styles.font_medium]}>Mens</Text>
                </View>
              </TouchableHighlight>

              <TouchableHighlight style={[!MainCatFilterArr.includes(2) ? styles.eachcattouch1 : styles.selectedeachcat]} onPress={()=> getBasketForCategory(2,'Women')} underlayColor='#fff'> 
                <View style={styles.eachcat}>
                  <Image style={styles.eachcaticon} source={require('../../../assets/icons/women.png')} />
                  <Text style={[styles.eachcattext, styles.font_medium]}>Womens</Text>
                </View>
              </TouchableHighlight>

              <TouchableHighlight style={[!MainCatFilterArr.includes(3) ? styles.eachcattouch2 : styles.selectedeachcat]} onPress={()=> getBasketForCategory(3,'Kid')} underlayColor='#fff'> 
                <View style={styles.eachcat}>
                  <Image style={styles.eachcaticon} source={require('../../../assets/icons/kid.png')} />
                  <Text style={[styles.eachcattext, styles.font_medium]}>Kids</Text>
                </View>
              </TouchableHighlight>

              <TouchableHighlight style={[!MainCatFilterArr.includes(4) ? styles.eachcattouch3 : styles.selectedeachcat]} onPress={()=> getBasketForCategory(4,'Elder')} underlayColor='#fff'> 
                <View style={styles.eachcat}>
                  <Image style={styles.eachcaticon} source={require('../../../assets/icons/elder.png')} />
                  <Text style={[styles.eachcattext, styles.font_medium]}>Elders</Text>
                </View>
              </TouchableHighlight>             

            </View>

            <View style={styles.categorySection}>
              <View style={styles.categoryHeading}>
                <Text style={[styles.categoryTitle, styles.font_medium]}>shop by category</Text>
              </View>

              <SafeAreaView style={{flex: 1, width:windowWidth}}>

                <FlatList style={styles.productlist}
                  showsVerticalScrollIndicator ={false}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.listContainer}
                  data={BasketCategory}
                  numColumns={3}
                  horizontal={false}
                  renderItem={({ item }) => {
                    var img = item.basket_category_image
                    return (                   
            
                        <View style={styles.categoryInner}>
                             
                          <View  style={styles.categoryWrapper}>

                            <View style={styles.categoryContent}>
                              <TouchableOpacity onPress={()=> getCategoryBasket(item.basket_category_id,item.basket_category_name)}>
                                <Image style={styles.categoryImage} source={{uri:img}} />
                              </TouchableOpacity>
                              <Text style={[styles.catoegoryText, styles.font_medium]}>{item.basket_category_name}</Text>
                            </View>
                          </View>                       
            
                        </View>
                      

                        )

                      }} 
                />
              </SafeAreaView>

            </View>

            {isLoading && <Loader /> }

            <View style={styles.eachsection}>
              <View style={styles.sectionhead}>
                <Text style={[styles.sectionheadtitle, styles.font_medium]}>Recommended</Text>

              </View>
              <View>

                <SafeAreaView style={{flex: 1}}>
                  <FlatList style={styles.productlist}
                    showsVerticalScrollIndicator ={false}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.listContainer}
                    horizontal={true}
                    data={Recommended}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => {
                      return item.basket_id;
                    }}
                    renderItem={({ item }) => {
                      var img = item.basket_image

                      var basketfor = item.basket_for
                      var hasMen = basketfor.indexOf('1') != -1;
                      var hasWomen = basketfor.indexOf('2') != -1;
                      var hasKid = basketfor.indexOf('3') != -1;
                      var hasElder = basketfor.indexOf('4') != -1;

                      return (
                        <View style={styles.productlistitem}>
                          <View style={styles.productlistitem_likeview}>
                            <View style={styles.productlistitem_shortcaticonview}>
                              {hasMen && 

                                <Image style={styles.productlistitem_shortcaticon} source={require('../../../assets/icons/men.png')} />
                              }

                              {hasWomen && 

                                <Image style={styles.productlistitem_shortcaticon} source={require('../../../assets/icons/women.png')} />
                              }

                              {hasKid && 

                                <Image style={styles.productlistitem_shortcaticon} source={require('../../../assets/icons/kid.png')} />
                              }

                              {hasElder && 

                                <Image style={styles.productlistitem_shortcaticon} source={require('../../../assets/icons/elder.png')} />
                              }
                                
                            </View>
                            
                            {item.wishlist !== null ?
                              <TouchableOpacity onPress={() => removeFromWishList(item.basket_id)}>
                                <Icon name="heart" size={18} color="#ed872b" />
                              </TouchableOpacity>

                                :

                              <TouchableOpacity onPress={() => addInToWishList(item.basket_id)}>
                                <Icon name="hearto" size={18} color="#ed872b" />
                              </TouchableOpacity>
                            }

                          </View>
                          <View style={styles.productlistitem_imgname}>

                            <TouchableOpacity onPress={() => getBasketDetail(item.basket_id,item.basket_name)}>
                              <Image source={{uri:img}} style={styles.productlistitem_img}  />
                            </TouchableOpacity>
                            <Text numberOfLines={2} style={[styles.productlistitem_name, styles.font_medium]}>{item.basket_name}</Text>

                          </View>
                          <View style={styles.productlistitem_addview}>

                            {item.discount_price > 0 ? 
                              <View>
                                <Text style={[styles.productlistitem_price, styles.font_semibold,  ]}><FIcon name="rupee" size={14} color="#000" />{item.actual_price}</Text>
                                <Text style={[styles.price_decoration,styles.font_size12, styles.font_medium]}><FIcon name="rupee" size={12} color="gray" />{item.basket_sale_price}</Text>
                              </View>

                            :
                              <Text style={[styles.productlistitem_price, styles.font_semibold]}><FIcon name="rupee" size={14} color="#000" />{item.basket_sale_price}</Text>
                            }

                            <TouchableOpacity onPress={() => openModal(item)}>
                              <View style={styles.addbutton}>
                                <Text style={[styles.addbutton_text, styles.font_medium]}>ADD</Text>
                              </View>
                            </TouchableOpacity>
                          </View>
                        </View>
                      )
                    }} 
                  />
                </SafeAreaView>

              </View>
            </View>

            <View style={styles.eachsection}>
              <SwiperFlatList 
                autoplay 
                autoplayDelay={2} 
                autoplayLoop 
                index={2} 
                showPagination              
                paginationStyleItemActive={styles.sliderImageDots}
                paginationStyleItemInactive={styles.sliderImageDots}
                >
                <View style={[styles.child, { backgroundColor: 'tomato' }]}>
                  <Image style={styles.sliderImageView} source={require('../../../assets/images/banner.png')} />
                </View>
                <View style={[styles.child, { backgroundColor: 'thistle' }]}>
                  <Image style={styles.sliderImageView} source={require('../../../assets/images/banner2.png')} />
                </View>
                <View style={[styles.child, { backgroundColor: 'skyblue' }]}>
                  <Image style={styles.sliderImageView} source={require('../../../assets/images/banner3.png')} />
                </View>
              </SwiperFlatList>
            </View>

            <View style={styles.eachsection}>
              <View style={styles.sectionhead}>
                <Text style={[styles.sectionheadtitle, styles.font_medium]}>Best Seller</Text>
                
              </View>

              <View>
                <SafeAreaView style={{flex: 1}}>
                  <FlatList style={styles.productlist}
                    showsVerticalScrollIndicator ={false}
                    showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.listContainer}
                      horizontal={true}
                      data={BestSeller}
                      showsHorizontalScrollIndicator={false}
                      keyExtractor={(item) => {
                        return item.basket_id;
                      }}
                      renderItem={({ item }) => {                    
                        var img = item.basket_image

                        var basketfor = item.basket_for
                        var hasMen = basketfor.indexOf('1') != -1;
                        var hasWomen = basketfor.indexOf('2') != -1;
                        var hasKid = basketfor.indexOf('3') != -1;
                        var hasElder = basketfor.indexOf('4') != -1;

                        return (
                          <View style={styles.productlistitem}>
                            <View style={styles.productlistitem_likeview}>
                              <View style={styles.productlistitem_shortcaticonview}>
                                {hasMen && 
                                     
                                  <Image style={styles.productlistitem_shortcaticon} source={require('../../../assets/icons/men.png')} />
                                }

                                {hasWomen && 

                                  <Image style={styles.productlistitem_shortcaticon} source={require('../../../assets/icons/women.png')} />
                                }

                                {hasKid && 

                                  <Image style={styles.productlistitem_shortcaticon} source={require('../../../assets/icons/kid.png')} />
                                }

                                {hasElder && 

                                  <Image style={styles.productlistitem_shortcaticon} source={require('../../../assets/icons/elder.png')} />
                                }
                              </View>
                              

                              {item.wishlist !== null ?
                                <TouchableOpacity onPress={() => removeFromWishList(item.basket_id)}>
                                  <Icon name="heart" size={18} color="#ed872b" />
                                </TouchableOpacity>

                                  :

                                <TouchableOpacity onPress={() => addInToWishList(item.basket_id)}>
                                  <Icon name="hearto" size={18} color="#ed872b" />
                                </TouchableOpacity>
                              }

                            </View>
                            <View style={styles.productlistitem_imgname}>

                            <TouchableOpacity onPress={() => getBasketDetail(item.basket_id,item.basket_name)}>
                              <Image source={{uri:img}} style={styles.productlistitem_img} />
                            </TouchableOpacity>

                              <Text numberOfLines={2} style={[styles.productlistitem_name, styles.font_medium]}>{item.basket_name}</Text>

                            </View>
                            <View style={styles.productlistitem_addview}>

                              {item.discount_price > 0 ? 
                                <View>

                                  <Text style={[styles.productlistitem_price, styles.font_semibold]}><FIcon name="rupee" size={14} color="#000" />{item.actual_price}</Text>
                                  <Text style={[styles.price_decoration,styles.font_size12, styles.font_medium]}><FIcon name="rupee" size={12} color="gray" />{item.basket_sale_price}</Text>
                                  
                                </View>

                              :
                                <Text style={[styles.productlistitem_price, styles.font_semibold]}><FIcon name="rupee" size={14} color="#000" />{item.basket_sale_price}</Text>
                              }

                              <TouchableOpacity onPress={() => openModal(item)}>
                                <View style={styles.addbutton}>
                                  <Text style={[styles.addbutton_text, styles.font_regular]}>ADD</Text>
                                </View>
                              </TouchableOpacity>
                            </View>
                          </View>
                        )
                      }} 
                  />
                </SafeAreaView>
              </View>
            </View>

            <View style={styles.eachsection}>
              <SwiperFlatList 
                autoplay 
                autoplayDelay={2} 
                autoplayLoop 
                index={2} 
                showPagination              
                paginationStyleItemActive={styles.sliderImageDots}
                paginationStyleItemInactive={styles.sliderImageDots}
                >
                <View style={[styles.child, { backgroundColor: 'tomato' }]}>
                  <Image style={styles.sliderImageView} source={require('../../../assets/images/health1.jpg')} />
                </View>
                <View style={[styles.child, { backgroundColor: 'tomato' }]}>
                  <Image style={styles.sliderImageView} source={require('../../../assets/images/health2.jpg')} />
                </View>
                <View style={[styles.child, { backgroundColor: 'tomato' }]}>
                  <Image style={styles.sliderImageView} source={require('../../../assets/images/health3.jpg')} />
                </View>
                <View style={[styles.child, { backgroundColor: 'tomato' }]}>
                  <Image style={styles.sliderImageView} source={require('../../../assets/images/health4.jpg')} />
                </View>
              </SwiperFlatList>
            </View>

          </View>

          <View style={[styles.homepageinnercontent, styles.secondhalf_homepageinnercontent]}>

            {DiscountBaskets && ( 
              DiscountBaskets.map((mainitem,ind) => 
                <View style={styles.eachsection}>
                  <View style={styles.sectionhead}>
                    <Text style={[styles.sectionheadtitle, styles.font_medium]}>Discount</Text>
                    
                  </View>
                  <View style={styles.discountedView_section}>
                    <View style={styles.discountedView}>
                      <View style={styles.discountedView_image}>
                        <Text style={[styles.discounttext, styles.font_medium]}>Discount</Text>
                        <Text style={[styles.discountpercent, styles.font_semibold]}>{mainitem[0].discount}%</Text>
                        <Text style={[styles.discounttext, styles.font_medium]}>OFF</Text>
                      </View>
                    </View>
                    <SafeAreaView style={{flex: 1}}>
                      <FlatList style={styles.productlist}
                        showsVerticalScrollIndicator ={false}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.listContainer}
                        horizontal={true}
                        data={mainitem}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => {
                          return item.basket_id;
                        }}
                        renderItem={({ item }) => {
                          
                          var basketfor = item.basket_for
                          var hasMen = basketfor.indexOf('1') != -1;
                          var hasWomen = basketfor.indexOf('2') != -1;
                          var hasKid = basketfor.indexOf('3') != -1;
                          var hasElder = basketfor.indexOf('4') != -1;

                          return (
                            <>
                              <View style={styles.productlistitem}>
                                <View style={styles.productlistitem_likeview}>
                                  <View style={styles.productlistitem_shortcaticonview}>
                                    {hasMen && 

                                      <Image style={styles.productlistitem_shortcaticon} source={require('../../../assets/icons/men.png')} />
                                    }

                                    {hasWomen && 

                                      <Image style={styles.productlistitem_shortcaticon} source={require('../../../assets/icons/women.png')} />
                                    }

                                    {hasKid && 

                                      <Image style={styles.productlistitem_shortcaticon} source={require('../../../assets/icons/kid.png')} />
                                    }

                                    {hasElder && 

                                      <Image style={styles.productlistitem_shortcaticon} source={require('../../../assets/icons/elder.png')} />
                                    }
                                  </View>
                                  
                                  {item.wishlist !== null ?
                                    <TouchableOpacity onPress={() => removeFromWishList(item.basket_id)}>
                                      <Icon name="heart" size={18} color="#ed872b" />
                                    </TouchableOpacity>

                                      :

                                    <TouchableOpacity onPress={() => addInToWishList(item.basket_id)}>
                                      <Icon name="hearto" size={18} color="#ed872b" />
                                    </TouchableOpacity>
                                  }

                                </View>
                                <View style={styles.productlistitem_imgname}>
                              <TouchableOpacity onPress={() => getBasketDetail(item.basket_id,item.basket_name)}>
                                  <Image source={{uri:item.basket_image}} style={styles.productlistitem_img} />
                                  </TouchableOpacity>
                                  <Text numberOfLines={2} style={[styles.productlistitem_name, styles.font_medium]}>{item.basket_name}</Text>

                                </View>
                                <View style={styles.productlistitem_addview}>
                                  {item.discount_price > 0 ? 
                                    <View>

                                      <Text style={[styles.productlistitem_price, styles.font_semibold]}><FIcon name="rupee" size={14} color="#000" />{item.actual_price}</Text>
                                      <Text style={[styles.price_decoration,styles.font_size12, styles.font_medium]}><FIcon name="rupee" size={12} color="gray" />{item.basket_sale_price}</Text>
                                      
                                    </View>

                                  :
                                    <Text style={[styles.productlistitem_price, styles.font_semibold]}><FIcon name="rupee" size={14} color="#000" />{item.basket_sale_price}</Text>
                                  }

                                  <TouchableOpacity onPress={() => openModal(item)}>
                                    <View style={styles.addbutton}>
                                      <Text style={[styles.addbutton_text, styles.font_regular]}>ADD</Text>
                                    </View>
                                  </TouchableOpacity>
                                </View>
                              </View>
                            </>
                          )
                        }} 
                      />
                    </SafeAreaView>
                  </View>
                </View>            
                
              )

            )}

            <View style={styles.eachsection}>
              <View style={styles.sectionhead}>
                <Text style={[styles.sectionheadtitle, styles.font_medium]}>Single Boxes</Text>
                
              </View>
              <View>
                <SafeAreaView style={{flex: 1}}>
                  <FlatList style={styles.productlist}
                  showsVerticalScrollIndicator ={false}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.listContainer}
                  horizontal={true}
                  data={AllBaskets}
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item) => {
                    return item.basket_id;
                  }}
                  renderItem={({ item }) => {
                    var img = item.basket_image

                    var basketfor = item.basket_for
                    var hasMen = basketfor.indexOf('1') != -1;
                    var hasWomen = basketfor.indexOf('2') != -1;
                    var hasKid = basketfor.indexOf('3') != -1;
                    var hasElder = basketfor.indexOf('4') != -1;

                    return (
                      <View style={styles.productlistitem}>
                        <View style={styles.productlistitem_likeview}>
                          <View style={styles.productlistitem_shortcaticonview}>
                            {hasMen && 

                              <Image style={styles.productlistitem_shortcaticon} source={require('../../../assets/icons/men.png')} />
                            }

                            {hasWomen && 

                              <Image style={styles.productlistitem_shortcaticon} source={require('../../../assets/icons/women.png')} />
                            }

                            {hasKid && 

                              <Image style={styles.productlistitem_shortcaticon} source={require('../../../assets/icons/kid.png')} />
                            }

                            {hasElder && 

                              <Image style={styles.productlistitem_shortcaticon} source={require('../../../assets/icons/elder.png')} />
                            }
                          </View>
                          
                          {item.wishlist !== null ?
                              <TouchableOpacity onPress={() => removeFromWishList(item.basket_id)}>
                                <Icon name="heart" size={18} color="#ed872b" />
                              </TouchableOpacity>

                                :

                              <TouchableOpacity onPress={() => addInToWishList(item.basket_id)}>
                                <Icon name="hearto" size={18} color="#ed872b" />
                              </TouchableOpacity>
                            }

                        </View>
                        <View style={styles.productlistitem_imgname}>
                        <TouchableOpacity onPress={() => getBasketDetail(item.basket_id,item.basket_name)}>
                          <Image source={{uri:img}} style={styles.productlistitem_img} />
                          </TouchableOpacity>
                          <Text numberOfLines={2} style={[styles.productlistitem_name, styles.font_medium]}>{item.basket_name}</Text>

                        </View>
                        <View style={styles.productlistitem_addview}>
                          {item.discount_price > 0 ? 
                            <View>
                              
                              <Text style={[styles.productlistitem_price, styles.font_semibold]}><FIcon name="rupee" size={14} color="#000" />{item.actual_price}</Text>
                              <Text style={[styles.price_decoration,styles.font_size12, styles.font_medium]}><FIcon name="rupee" size={12} color="gray" />{item.basket_sale_price}</Text>
                              
                            </View>

                          :
                            <Text style={[styles.productlistitem_price, styles.font_semibold]}><FIcon name="rupee" size={14} color="#000" />{item.basket_sale_price}</Text>
                          }
                          <TouchableOpacity onPress={() => openModal(item)}>
                            <View style={styles.addbutton}>
                              <Text style={[styles.addbutton_text, styles.font_regular]}>ADD</Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                        <Text style={[styles.singlebox_description, styles.font_regular]} numberOfLines={2}>{item.basket_description}</Text>
                      </View>
                    )
                  }} />
                </SafeAreaView>
              </View>
            </View>

          </View>

          <View style={styles.footersection}>
            <View>
              <View style={styles.footericon_view}>
                <Icon style={styles.footericon} name="shoppingcart" size={30} color={"#fff"} />
              </View>
              <View style={styles.footertext_view}>
                <Text style={[styles.footertext, styles.font_semibold]}>1500+</Text>
                <Text style={[styles.footertext, styles.font_semibold]}>BASKET</Text>
              </View>
            </View>
            <View> 
              <View style={styles.footericon_view}>
                <FeatherIcon style={styles.footericon} name="truck" size={30} color={"#fff"} />
              </View>
              <View style={styles.footertext_view}>
                <Text style={[styles.footertext, styles.font_semibold]}>FREE</Text>
                <Text style={[styles.footertext, styles.font_semibold]}>SHIPPING</Text>
              </View>
            </View>
            <View>
              <View style={styles.footericon_view}>
                <Icon style={styles.footericon} name="shoppingcart" size={30} color={"#fff"} />
              </View>
              <View style={styles.footertext_view}>
                <Text style={[styles.footertext, styles.font_semibold]}>GENUINE</Text>
                <Text style={[styles.footertext, styles.font_semibold]}>PRODUCT</Text>
              </View>
            </View>
          </View>

         
          <RBSheet
            ref={refRBSheet}
            closeOnDragDown={true}
            dragFromTopOnly={true}
            keyboardAvoidingViewEnabled={true}
            customStyles={{
              wrapper: {
                backgroundColor: "#0009",
              },
              draggableIcon: {
                backgroundColor: "#ed872b"
              },
              container: {
                backgroundColor: '#fff',
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30,
                paddingHorizontal: 20,
                height: windowHeight / 2 + 50
              }
            }}
          >
            <ScrollView 
            showsVerticalScrollIndicator ={false}
            showsHorizontalScrollIndicator={false}>
              <View style={styles.addproduct_view}>
                <View style={styles.addproduct_imageprice}>
                  <Image style={styles.addproduct_image} source={{uri:BasketImagePopUp}} />
                  
                    {BasketDiscountPricePopUp > 0 ?
                      <View>

                        <Text style={[styles.addproduct_price, styles.font_semibold]}><FIcon name="rupee" size={18} color="#000" /> {BasketSalePricePopUp}</Text>
                        <Text style={[styles.addproduct_price2, styles.font_semibold]}><FIcon name="rupee" size={14} color="gray" /> {BasketPricePopUp}</Text>
                        
                      </View>
                    :
                      <Text style={[styles.addproduct_price, styles.font_semibold]}><FIcon name="rupee" size={18} color="#000" /> {BasketSalePricePopUp}</Text>
                    }
                  
                </View>
                <View style={styles.addproduct_name}>
                  <Text style={[styles.addproduct_nametitle, styles.font_medium]}>{BasketNamePopUp}</Text>
                  <Text style={[styles.addproduct_namedesc, styles.font_light]}>{BasketProductsPopUp}</Text>
                </View>
                <View style={styles.addproduct_quantityview}>
                  <View style={styles.addproduct_quantitytext}>
                    <Text style={[styles.addproduct_quantitytitle, styles.font_medium]}>Quantity</Text>
                    <Text style={[styles.addproduct_quantityshort, styles.font_light]}>Please Add Quantity</Text>
                  </View>
                  <View style={styles.addproduct_quantityadd}>
                    <NumericInput
                      totalWidth={80}
                      totalHeight={30}
                      iconSize={50}
                      initValue={basketModalQTY}
                      onChange={(val)=> updateQuantity(val)}
                      rounded
                      minValue={0}
                      maxValue={100}
                      textColor='#000'
                      borderColor='#f4f7fc'
                      iconStyle={[ styles.numericicon, styles.font_medium ]}
                      inputStyle={[styles.numericinput, styles.font_medium]}
                      rightButtonBackgroundColor='#f4f7fc'
                      leftButtonBackgroundColor='#f4f7fc' />
                  </View>
                </View>  

                <View style={styles.addproduct_subscriptionview}>
                  <Text style={[styles.addproduct_subscriptiontitle, styles.font_medium]}>Subscription</Text>
                  <SafeAreaView style={{flex: 1}}>
                    <FlatList style={styles.productlist}
                    showsVerticalScrollIndicator ={false}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.listContainer}
                    horizontal={true}
                    data={Subscriptions}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => {
                      return item.subscription_id;
                    }}
                    renderItem={({ item,ind }) => {
                      return (
                        <View>
                          <TouchableOpacity style={styles.eachsubscription} onPress={() => selectSubscription(item)}>

                            <Text style={[styles.eachsubscription_count, styles.font_semibold]}>{item.subscription_id}</Text>
                            <Text style={[styles.eachsubscription_text, styles.font_light]}>{item.validity_name}</Text>

                          </TouchableOpacity> 
                        </View>
                      )
                    }} />
                  </SafeAreaView>
                </View>

                <View style={styles.addproduct_descriptionview}>
                  <Text style={[styles.addproduct_descriptiontitle, styles.font_medium]}>Description</Text>
                  <Text style={[styles.addproduct_description, styles.font_light]}>
                    {BasketDescriptionPopUp}
                  </Text>
                </View>

              </View>
               
            </ScrollView>

            <View style={[styles.btnFixed]}>
                  <TouchableOpacity style={[styles.sheet_theme_button]} onPress={() => addToCart()}>
                    <Text style={[styles.theme_button_text, styles.font_medium]}>Add to Cart</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.carticon1]} onPress={() => navigation.navigate('Cart')}>
                    <Text>
                      <Ionicons name="basket-outline" style={[styles.carticon]} />
                    </Text>

                     <View style ={styles.circle}>
                      <Text style={styles.count}>{CartTotalItem}</Text>
                     </View>
                    
                  </TouchableOpacity>
            </View>
          </RBSheet>
        </View>

      </View>
    </ScrollView>
  );
};

