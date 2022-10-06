
import React, { useEffect, useState, useRef } from "react";

import { View, Text, Button, ScrollView, Dimensions, Image, TouchableOpacity, TouchableHighlight, RefreshControl, SafeAreaView, TextInput , Pressable} from 'react-native';

import { useNavigation, useIsFocused } from '@react-navigation/native';

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

import styles from '../../../assets/css/AppDesign.js'
import Loader from "../../../components/loader/Loader";

import Constants from '../../../config/Constants';

import RBSheetComponent from '../rbsheet/RbSheet';

var BASE_URL = Constants.BASE_URL;

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

import { useSelector, useDispatch } from 'react-redux'

import { addBasket, deleteBasket, updateBasket, saveSubscriptions } from '../../../actions/cart';
import { saveRecomendedBasketsForHome } from '../../../actions/home';

const colors = ['tomato', 'thistle', 'skyblue', 'teal'];

export default function HomeScreen({ route, navigation }) {
  const dispatch = useDispatch()

  const refRBSheet = useRef();
  const [visible, setVisible] = useState(false);

  const [userTokens, setuserTokens] = React.useState('');

  const [MainSliders, setMainSliders] = useState([]);
  const [OfferSliders, setOfferSliders] = useState([]);
  const [HelthSliders, setHelthSliders] = useState([]);

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
  const [MainSlider, setMainSlider] = useState([]);
  const [OfferSlider, setOfferSlider] = useState([]);
  const [DoctorSlider, setDoctorSlider] = useState([]);

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
  const isFocused = useIsFocused();

  useEffect(() => {
    
    getAllBaskets();

  }, [])

  useEffect(() => {
    refRBSheet.current.close()
  }, [isFocused])

  async function getAllBaskets() {
    //getBasketsCategories();
    const sessionData = JSON.parse(await AsyncStorage.getItem('USER_DATA'));
    const cust_id = sessionData.customer_id
    //if(RecommendedBaskets ==''){
    const netStatus = await (await NetInfo.fetch()).isConnected;
    if (netStatus) {
      setisLoading(true)

      setTimeout(function () {
        setisLoading(false)
      }, 2000)

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
      }).then(async function (result) {

        //console.log(result.offer_slider)
        setisLoading(false)
        if (result.CODE === 200) {
          await setMainSliders(result.main_slider)
          await setOfferSliders(result.offer_slider)
          await setHelthSliders(result.helth_slider)

          await setMaincategories(result.maincategory)
          await setBasketCategory(result.basket_category)
          await setRecommended(result.recommended)
          await setBestSeller(result.best_seller)
          await setDiscountBaskets(result.discount_baskets)
          await setAllBaskets(result.all_baskets)
          await setSubscriptions(result.subscription)
          await setMainSlider(result.subscription)
          await setOfferSlider(result.subscription)
          await setDoctorSlider(result.subscription)

        } else {
          alert('Something went wrong !.')
        }
      }).catch(function (error) {
      });

      return () => {
        setChangeCat(false);
      }
    } else {
      setisLoading(false)
      alert('Internet Connection is Weak');
    }
  }

  function openModal(basketData) {
    refRBSheet.current.open()
  
    setbasketModalQTY(1)
    setBasketItem([])

    //refRBSheet.current.open()

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
        result.data.map((product) => {
          pnames = pnames + product.product_name + ', '
        })
        setBasketProductsPopUp(pnames)
      }
    })
  }

  function getBasketForCategory(id, name) {
    navigation.navigate('CategoryBaskets', {
      catId: id,
      catName: name,
    });
  }

  function getCategoryBasket(id, name) {

    navigation.navigate('CategoryBaskets', {
      catId: id,
      catName: name,
    });
  }

  function getBasketDetail(id, name) {
    navigation.navigate('BasketDetail', {
      basket_id: id,
      basket_name: name,
    });
  }

  function selectSubscription(data) {
    setSelectedSubscription(data)
  }

  const onRefresh = React.useCallback(() => {
    getAllBaskets()
  }, []);


  async function addInToWishList(basket_id) {

    const sessionData = JSON.parse(await AsyncStorage.getItem('USER_DATA'));
    const customer_id = sessionData.customer_id

    var newBaskets = Recommended;

    newBaskets.map((val, ind) => {
      if (val.basket_id === basket_id) {
        var dataold = [...Recommended];
        dataold[ind].wishlist = customer_id;
        setRecommended(dataold)
      }
    })

    var newBaskets1 = BestSeller;

    newBaskets1.map((val, ind) => {
      if (val.basket_id === basket_id) {
        var dataold1 = [...BestSeller];
        dataold1[ind].wishlist = customer_id;
        setBestSeller(dataold1)
      }
    })

    var newBaskets2 = AllBaskets;

    newBaskets2.map((val, ind) => {
      if (val.basket_id === basket_id) {
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

  async function removeFromWishList(basket_id) {
    const sessionData = JSON.parse(await AsyncStorage.getItem('USER_DATA'));
    const customer_id = sessionData.customer_id

    var newBaskets = Recommended;

    newBaskets.map((val, ind) => {
      if (val.basket_id === basket_id) {
        var dataold = [...Recommended];
        dataold[ind].wishlist = null;
        setRecommended(dataold)
      }
    })

    var newBaskets1 = BestSeller;

    newBaskets1.map((val, ind) => {
      if (val.basket_id === basket_id) {
        var dataold1 = [...BestSeller];
        dataold1[ind].wishlist = null;
        setBestSeller(dataold1)
      }
    })

    var newBaskets2 = AllBaskets;

    newBaskets2.map((val, ind) => {
      if (val.basket_id === basket_id) {
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

  async function ViewAllBasket(title_text,api_url){
    navigation.navigate('Viewall',{'title_text':title_text,'url':api_url});
  }

  async function ViewAllRecommendBaskets(title_text, api_url){
    navigation.navigate('AllRecommendBaskets',{'title_text':title_text,'url':api_url});
  }

  async function ViewAllBestSeller(title_text,api_url){
    navigation.navigate('AllBestSeller',{'title_text':title_text,'url':api_url});
  }

  async function ViewAllSingleBoxes(title_text,api_url){
    navigation.navigate('AllSingleBoxes',{'title_text':title_text,'url':api_url});
  }

  async function ViewAllDiscountBasket(id){
    navigation.navigate('Discountbaskets',{'id':id});
  }

  return (
    <ScrollView style={styles.scrollView}
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={onRefresh}
        />
      }
    >

      <View style={styles.container}>

        <View style={styles.topBanner}>
          {MainSliders && (
            <SwiperFlatList
              paginationStyleItemActive={styles.sliderImageDots}
              paginationStyleItemInactive={styles.sliderImageDotsInactive}
            >

              {MainSliders && (
                MainSliders.map((mainitem, ind) =>{    

                  return(
                    <>
                      <View>
                        <Image style={styles.bannerInner} source={{uri:mainitem.slider_image}} />
                        <View style={styles.banner_Text}>
                          <View>
                            <Text style={[styles.bannerHeadinText, styles.font_regular2]}>{mainitem.slider_content}</Text>
                          </View>
                          {mainitem.basket_category != '' && (
                            
                            <TouchableOpacity onPress={() => getCategoryBasket(mainitem.basket_category_id, mainitem.basket_category_name)}>
                              <Text style={[styles.banner_btn, styles.font_semiboldPro]}><Icon name="plus" size={14} color="#ffae34" />EXPLORE MORE</Text>
                            </TouchableOpacity>
                              
                          )}

                        </View>
                      </View>
                    </>
                  )
                })
              )}           

            </SwiperFlatList>       
          )}   
        </View>

        <View style={styles.homeallcat}>

          <TouchableHighlight style={[!MainCatFilterArr.includes(1) ? styles.eachcattouch : styles.selectedeachcat]} onPress={() => getBasketForCategory(1, 'Mens')} underlayColor='#cce1ffc9'>
            <View style={styles.eachcat}>
              <Image style={styles.eachcaticon} source={require('../../../assets/icons/men.png')} />
              <Text style={[styles.eachcattext, styles.font_regular2]}>Mens</Text>
            </View>
          </TouchableHighlight>

          <TouchableHighlight style={[!MainCatFilterArr.includes(2) ? styles.eachcattouch1 : styles.selectedeachcat]} onPress={() => getBasketForCategory(2, 'Womens')} underlayColor='#ffdeded1'>
            <View style={styles.eachcat}>
              <Image style={styles.eachcaticon} source={require('../../../assets/icons/women.png')} />
              <Text style={[styles.eachcattext, styles.font_regular2]}>Womens</Text>
            </View>
          </TouchableHighlight>

          <TouchableHighlight style={[!MainCatFilterArr.includes(3) ? styles.eachcattouch2 : styles.selectedeachcat]} onPress={() => getBasketForCategory(3, 'Kids')} underlayColor='#d0f5b8c7'>
            <View style={styles.eachcat}>
              <Image style={styles.eachcaticon} source={require('../../../assets/icons/kid.png')} />
              <Text style={[styles.eachcattext, styles.font_regular2]}>Kids</Text>
            </View>
          </TouchableHighlight>

  
          <TouchableHighlight style={[!MainCatFilterArr.includes(4) ? styles.eachcattouch3 : styles.selectedeachcat]} onPress={() => getBasketForCategory(4, 'Elders')} underlayColor='#ffe1c7c7'>
            <View style={styles.eachcat}>
              <Image style={styles.eachcaticon} source={require('../../../assets/icons/elder.png')} />
              <Text style={[styles.eachcattext, styles.font_regular2]}>Elders</Text>
            </View>
          </TouchableHighlight>
          </View>

        <View style={styles.homepage}>
          <View style={styles.homepageinnercontent}>

            <View style={styles.categorySection}>
              <View style={styles.categoryHeading}>
                <Text style={[styles.categoryTitle, styles.font_semiboldPro]}>Categories</Text>
              </View>

              <SafeAreaView style={{ flex: 1 }}>

                <FlatList style={styles.productlist}
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.listContainer}
                  data={BasketCategory}
                  horizontal={true}
                  renderItem={({ item }) => {
                    var img = item.basket_category_image
                    return (

                      <View style={styles.categoryInner}>

                        <View style={styles.categoryWrapper}>

                          <View style={styles.categoryContent}>
                            <TouchableOpacity onPress={() => getCategoryBasket(item.basket_category_id, item.basket_category_name)}>
                              <Image style={styles.categoryImage} source={{ uri: img }} />
                            </TouchableOpacity>
                            <Text style={[styles.catoegoryText, styles.font_regular2]}>{item.basket_category_name}</Text>
                          </View>
                        </View>

                      </View>


                    )

                  }}
                />
              </SafeAreaView>

            </View>

            {isLoading && <Loader />}       

            <View style={styles.eachsection}>
              <View style={styles.sectionhead}>
                <Text style={[styles.sectionheadtitle, styles.font_semibold]}>Recommended</Text>
                <Text style={[styles.icon_Seller, styles.font_regular2]} onPress={() => ViewAllRecommendBaskets('Recommended','getallrecommended')}> View All <Icon name="right" style={[styles.seller_ico]} /></Text>

              </View>
              <View>

                <SafeAreaView style={{ flex: 1 }}>
                  <FlatList style={styles.productlist}
                    showsVerticalScrollIndicator={false}
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
                                <Icon name="heart" size={18} color="#eb5757" />
                              </TouchableOpacity>

                              :

                              <TouchableOpacity onPress={() => addInToWishList(item.basket_id)}>
                                <Icon name="hearto" size={18} color="#eb5757" />
                              </TouchableOpacity>
                            }

                          </View>
                          <View style={styles.productlistitem_imgname}>

                            <TouchableOpacity onPress={() => getBasketDetail(item.basket_id, item.basket_name)}>
                              <Image source={{ uri: img }} style={styles.productlistitem_img} />
                            </TouchableOpacity>
                            <Text numberOfLines={2} style={[styles.productlistitem_name, styles.font_regular2]}>{item.basket_name}</Text>

                          </View>
                          <View style={styles.productlistitem_addview}>

                            {item.discount_price > 0 ?
                              <View>
                                <Text style={[styles.productlistitem_price, styles.font_semibold,]}><FIcon name="rupee" size={13} color="#272727"/>{item.actual_price}</Text>
                                <Text style={[styles.price_decoration, styles.font_regular2]}><FIcon name="rupee" size={11} color="#999999" />{item.basket_sale_price}</Text>
                              </View>

                              :
                              <Text style={[styles.productlistitem_price, styles.font_semibold]}><FIcon name="rupee" size={13} color="#272727" />{item.basket_sale_price}</Text>
                            }

                            <TouchableOpacity onPress={() => openModal(item)}>
                              <View style={styles.addbutton}>
                                <Text style={[styles.addbutton_text, styles.font_regular2]}>ADD</Text>
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
            {OfferSliders && (
              <SwiperFlatList
                autoplay
                autoplayDelay={2}
                autoplayLoop
                showPagination
                paginationStyleItemActive={styles.sliderImageDots}
                paginationStyleItemInactive={styles.sliderImageDotsInactive}
              >

                {OfferSliders && (
                  OfferSliders.map((mainitem, ind) =>{                
                    return(
                      <TouchableOpacity onPress={() => getCategoryBasket(mainitem.basket_category_id, mainitem.basket_category_name)} >
                        <Image style={styles.offer_slider_child_image} source={{uri:mainitem.slider_image}} />
                      </TouchableOpacity>
                    )
                  })
                )}
                

              </SwiperFlatList>
            )}
              
            </View>

            <View style={styles.eachsection}>
              <View style={styles.sectionhead}>
                <Text style={[styles.sectionheadtitle, styles.font_semibold]}>Best Seller</Text>
                <Text style={[styles.icon_Seller, styles.font_regular2]} onPress={() => ViewAllBestSeller('Best Seller','getallbestseller')}> View All <Icon name="right" style={[styles.seller_ico]} /></Text>

              </View>

              <View>
                <SafeAreaView style={{ flex: 1 }}>
                  <FlatList style={styles.productlist}
                    showsVerticalScrollIndicator={false}
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
                                <Icon name="heart" size={18} color="#eb5757" />
                              </TouchableOpacity>

                              :

                              <TouchableOpacity onPress={() => addInToWishList(item.basket_id)}>
                                <Icon name="hearto" size={18} color="#eb5757" />
                              </TouchableOpacity>
                            }

                          </View>
                          <View style={styles.productlistitem_imgname}>

                            <TouchableOpacity onPress={() => getBasketDetail(item.basket_id, item.basket_name)}>
                              <Image source={{ uri: img }} style={styles.productlistitem_img} />
                            </TouchableOpacity>

                            <Text numberOfLines={2} style={[styles.productlistitem_name, styles.font_regular2]}>{item.basket_name}</Text>

                          </View>
                          <View style={styles.productlistitem_addview}>

                            {item.discount_price > 0 ?
                              <View>

                                <Text style={[styles.productlistitem_price, styles.font_semibold]}><FIcon name="rupee" size={13} color="#272727" />{item.actual_price}</Text>
                                <Text style={[styles.price_decoration, styles.font_size12, styles.font_regular2]}><FIcon name="rupee" size={11} color="#999999" />{item.basket_sale_price}</Text>

                              </View>

                              :
                              <Text style={[styles.productlistitem_price, styles.font_semibold]}><FIcon name="rupee" size={13} color="#272727" />{item.basket_sale_price}</Text>
                            }

                            <TouchableOpacity onPress={() => openModal(item)}>
                              <View style={styles.addbutton}>
                                <Text style={[styles.addbutton_text, styles.font_regular2]}>ADD</Text>
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
              {HelthSliders && (
                <SwiperFlatList
                  autoplay
                  autoplayDelay={2}
                  autoplayLoop                  
                  showPagination
                  paginationStyleItemActive={styles.sliderImageDots}
                  paginationStyleItemInactive={styles.sliderImageDotsInactive}
                >

                  {HelthSliders.map((mainitem, ind) =>{                
                    return(
                      <View style={[styles.slider_child]}>
                        <Image style={styles.offer_slider_child_image} source={{uri:mainitem.slider_image}} />
                      </View>
                    )
                  })}  

                </SwiperFlatList>
              )}
            </View>

          </View>

          <View style={[styles.homepageinnercontent, styles.secondhalf_homepageinnercontent]}>

            {DiscountBaskets && (
              DiscountBaskets.map((mainitem, ind) =>{
                
                  return(
                    <View style={styles.eachsection}>
                      <View style={styles.sectionhead}>
                        <Text style={[styles.sectionheadtitle, styles.font_semibold]}>Discount</Text>
                        <Text style={[styles.icon_Seller, styles.font_regular2]} onPress={() => ViewAllDiscountBasket(mainitem[0].discount_id)}> View All <Icon name="right" style={[styles.seller_ico]} /></Text>

                      </View>
                      <View style={styles.discountedView_section}>
                        <View style={styles.discountedView}>
                          <View style={styles.discountedView_image}>
                            <Text style={[styles.discounttext, styles.font_semibold]}>Discount</Text>
                            <Text style={[styles.discountpercent, styles.font_semibold]}>{mainitem[0].discount}%</Text>
                            <Text style={[styles.discounttext, styles.font_semibold]}>OFF</Text>
                          </View>
                        </View>
                        <SafeAreaView style={{ flex: 1 }}>
                          <FlatList style={styles.productlist}
                            showsVerticalScrollIndicator={false}
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
                                          <Icon name="heart" size={18} color="#eb5757" />
                                        </TouchableOpacity>

                                        :

                                        <TouchableOpacity onPress={() => addInToWishList(item.basket_id)}>
                                          <Icon name="hearto" size={18} color="#eb5757" />
                                        </TouchableOpacity>
                                      }

                                    </View>
                                    <View style={styles.productlistitem_imgname}>
                                      <TouchableOpacity onPress={() => getBasketDetail(item.basket_id, item.basket_name)}>
                                        <Image source={{ uri: item.basket_image }} style={styles.productlistitem_img} />
                                      </TouchableOpacity>
                                      <Text numberOfLines={2} style={[styles.productlistitem_name, styles.font_regular2]}>{item.basket_name}</Text>

                                    </View>
                                    <View style={styles.productlistitem_addview}>
                                      {item.discount_price > 0 ?
                                        <View>

                                          <Text style={[styles.productlistitem_price, styles.font_semibold]}><FIcon name="rupee" size={13} color="#272727" />{item.actual_price}</Text>
                                          <Text style={[styles.price_decoration, styles.font_size12, styles.font_regular2]}><FIcon name="rupee" size={11} color="#999999" />{item.basket_sale_price}</Text>

                                        </View>

                                        :
                                        <Text style={[styles.productlistitem_price, styles.font_semibold]}><FIcon name="rupee" size={13} color="#272727" />{item.basket_sale_price}</Text>
                                      }

                                      <TouchableOpacity onPress={() => openModal(item)}>
                                        <View style={styles.addbutton}>
                                          <Text style={[styles.addbutton_text, styles.font_regular2]}>ADD</Text>
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

              })

            )}

            <View style={styles.eachsection}>
              <View style={styles.sectionhead}>
                <Text style={[styles.sectionheadtitle, styles.font_semibold]}>Single Boxes</Text>
                <Text style={[styles.icon_Seller, styles.font_regular2]} onPress={() => ViewAllSingleBoxes('Single Boxes','getallsingleboxes')}> View All <Icon name="right" style={[styles.seller_ico]} /></Text>

              </View>
              <View>
                <SafeAreaView style={{ flex: 1 }}>
                  <FlatList style={styles.productlist}
                    showsVerticalScrollIndicator={false}
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
                                <Icon name="heart" size={18} color="#eb5757" />
                              </TouchableOpacity>

                              :

                              <TouchableOpacity onPress={() => addInToWishList(item.basket_id)}>
                                <Icon name="hearto" size={18} color="#eb5757" />
                              </TouchableOpacity>
                            }

                          </View>
                          <View style={styles.productlistitem_imgname}>
                            <TouchableOpacity onPress={() => getBasketDetail(item.basket_id, item.basket_name)}>
                              <Image source={{ uri: img }} style={styles.productlistitem_img} />
                            </TouchableOpacity>
                            <Text numberOfLines={2} style={[styles.productlistitem_name, styles.font_regular2]}>{item.basket_name}</Text>

                          </View>
                          <View style={styles.productlistitem_addview}>
                            {item.discount_price > 0 ?
                              <View>

                                <Text style={[styles.productlistitem_price, styles.font_semibold]}><FIcon name="rupee" size={13} color="#272727" />{item.actual_price}</Text>
                                <Text style={[styles.price_decoration, styles.font_size12, styles.font_regular2]}><FIcon name="rupee" size={11} color="#999999" />{item.basket_sale_price}</Text>

                              </View>

                              :
                              <Text style={[styles.productlistitem_price, styles.font_semibold]}><FIcon name="rupee" size={13} color="#272727" />{item.basket_sale_price}</Text>
                            }
                            <TouchableOpacity onPress={() => openModal(item)}>
                              <View style={styles.addbutton}>
                                <Text style={[styles.addbutton_text, styles.font_regular2]}>ADD</Text>
                              </View>
                            </TouchableOpacity>
                          </View>
                          <Text style={[styles.singlebox_description, styles.font_regular2]} numberOfLines={2}>{item.basket_description}</Text>
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
            
            <RBSheetComponent BasketItem={BasketItem} BasketImagePopUp={BasketImagePopUp}  BasketDiscountPricePopUp={BasketDiscountPricePopUp}  BasketSalePricePopUp={BasketSalePricePopUp}  BasketPricePopUp={BasketPricePopUp}  BasketNamePopUp={BasketNamePopUp}  BasketProductsPopUp={BasketProductsPopUp}  BasketDescriptionPopUp={BasketDescriptionPopUp}/>

          </RBSheet>
        </View>

      </View>
    </ScrollView>
  );
};

