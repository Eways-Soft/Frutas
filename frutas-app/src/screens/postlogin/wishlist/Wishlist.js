import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  Dimensions,
  ScrollView,
  TextInput
} from 'react-native';

import { FlatList } from 'react-native-gesture-handler';
import Icon from "react-native-vector-icons/AntDesign";
import FIcon from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import RBSheet from "react-native-raw-bottom-sheet";
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';
import NumericInput from 'react-native-numeric-input';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from "../../../components/loader/Loader";
import styles from '../../../assets/css/AppDesign.js'
import { useSelector, useDispatch } from 'react-redux'
import Constants from '../../../config/Constants';
import { addBasket, deleteBasket, updateBasket } from '../../../actions/cart';
import RBSheetComponent from '../rbsheet/RbSheet';

import NoData from '../not_found/NoData';

var BASE_URL = Constants.BASE_URL;
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


function Wishlist({ navigation }) {
  const route = useRoute()
  const dispatch = useDispatch()
  const refRBSheet = useRef()

  const Subscriptions = useSelector(state => state.cartReducer.SubscriptionList)

  const [catId, setcatId] = React.useState('');
  const [isLoading, setisLoading] = React.useState(false);

  const [Types, setTypes] = React.useState([]);
  const [Baskets, setBaskets] = React.useState([]);
  const [TypeFilterArr, setTypeFilterArr] = useState([]);
  const [ChangeType, setChangeType] = useState(false);

  const [BasketDiscountPricePopUp, setBasketDiscountPricePopUp] = React.useState('0');
  const [BasketSalePricePopUp, setBasketSalePricePopUp] = React.useState('0');
  const [BasketPricePopUp, setBasketPricePopUp] = React.useState('');

  const [BasketImagePopUp, setBasketImagePopUp] = React.useState('');
  const [BasketNamePopUp, setBasketNamePopUp] = React.useState('');
  const [BasketProductsPopUp, setBasketProductsPopUp] = React.useState('');
  const [BasketDescriptionPopUp, setBasketDescriptionPopUp] = React.useState('');

  const [BasketItem, setBasketItem] = useState([]);

  const [Quantity, setQuantity] = useState(1);
  const [basketModalQTY, setbasketModalQTY] = useState(1);

  const addBasketInCart = (BasketItem) => dispatch(addBasket(BasketItem))

  const deleteBasketInCart = (BasketItem) => dispatch(deleteBasket(BasketItem))
  const updateBasketInCart = (BasketItem) => dispatch(updateBasket(BasketItem))
  const cbaskets = useSelector(state => state.cartReducer.CartBasketList)
  const CartTotalItem = useSelector(state => state.cartReducer.TotalItems)

  const isFocused = useIsFocused();

  useEffect(() => {

    getWishlistBaskets()

  }, [isFocused])

  async function getWishlistBaskets() {
    const sessionData = JSON.parse(await AsyncStorage.getItem('USER_DATA'));
    const cust_id = sessionData.customer_id

    // Get Bakskets
    const bodyArray1 = {
      app: 1,
      customer_id: cust_id,
    };

    fetch(`${BASE_URL}getwishlistbaskets`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bodyArray1)
    }).then(function (response) {
      return response.json();
    }).then(function (result) {

      setisLoading(false)
      if (result.CODE === 200) {
        setBaskets(result.data)
      } else {
        //alert('Something went wrong !.')
      }
    }).catch(function (error) {
    });
  }

  function getBasketDetail(id, name) {
    navigation.navigate('BasketDetail', {
      basket_id: id,
      basket_name: name,
    });
  }

  function openModal(basketData) {
    setbasketModalQTY(1)
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

    basketData.quantity = Quantity
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


  function addToCart() {

    var basketData = BasketItem
    let existed_item = cbaskets.find(item => BasketItem.basket_id === item.basket_id);
    if (existed_item) {
      //console.log('Old :',existed_item.quantity)
      basketData.quantity = basketModalQTY + existed_item.quantity
    } else {
      basketData.quantity = basketModalQTY
    }

    addBasketInCart(basketData)

    //setBasketItem([])
  }

  function updateQuantity(qty) {
    setQuantity(qty)
    setbasketModalQTY(qty)

    var BasketItemNew = BasketItem

    BasketItemNew.quantity = qty
    setBasketItem(BasketItemNew)

    if (qty === 0) {
      updateBasketInCart(BasketItem)

    } else {
      //console.log('No 0')
    }
  }

  async function addInToWishList(basket_id) {
    var newBaskets = Recommended;

    newBaskets.map((val, ind) => {
      if (val.basket_id === basket_id) {
        var dataold = [...Recommended];
        dataold[ind].wishlist = customer_id;
        setRecommended(dataold)
      }
    })

    const sessionData = JSON.parse(await AsyncStorage.getItem('USER_DATA'));
    const cust_id = sessionData.customer_id

    const bodyArray1 = {
      app: 1,
      customer_id: cust_id,
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

    var items = Baskets.filter(function (i) { return i.basket_id !== basket_id });

    setBaskets(items);

    const sessionData = JSON.parse(await AsyncStorage.getItem('USER_DATA'));
    const cust_id = sessionData.customer_id

    const bodyArray1 = {
      app: 1,
      customer_id: cust_id,
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
    <View style={styles.container}>

      

        <View style={styles.secondpage}>

          {isLoading && <Loader />}

          {Baskets.length > 0 ? 
            <>       

              <View style={styles.secondpageinnercontent}>


                <FlatList style={styles.productlist}
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.listContainer}
                  horizontal={false}
                  numColumns={2}
                  data={Baskets}
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
                      <View style={styles.productlistitem_addspacing}>
                        <View style={styles.productlistitem_second}>
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
                            <View style={styles.productlistitem_likeview_wish}>

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

                                <Text style={[styles.productlistitem_price, styles.font_semiboldPro]}><FIcon name="rupee" size={13} color="#272727" />{item.actual_price}</Text>
                                <Text style={[styles.price_decoration, styles.font_size12, styles.font_regular2]}><FIcon name="rupee" size={11} color="999999" />{item.basket_sale_price}</Text>

                              </View>

                              :
                              <Text style={[styles.productlistitem_price, styles.font_semiboldPro]}><FIcon name="rupee" size={13} color="#272727" />{item.basket_sale_price}</Text>
                            }

                            <TouchableOpacity onPress={() => openModal(item)}>
                              <View style={styles.addbutton}>
                                <Text style={[styles.addbutton_text, styles.font_regular2]}>ADD</Text>
                              </View>
                            </TouchableOpacity>

                          </View>
                        </View>
                      </View>
                    )
                  }} />
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
            </>
          :
            <>
              <NoData />
            </>
          }
            
           

        </View>

      

     
    </View>
  )
};


export default Wishlist