import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  Dimensions,
  ScrollView,
  Pressable,
  TextInput
} from 'react-native';

import FIcon from "react-native-vector-icons/FontAwesome";
import { FlatList } from 'react-native-gesture-handler';
import Icon from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";
import RBSheet from "react-native-raw-bottom-sheet";
import styles from '../../../assets/css/AppDesign.js'
import { useNavigation, useRoute } from '@react-navigation/native';
import NumericInput from 'react-native-numeric-input';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from "../../../components/loader/Loader";

import RBSheetComponent from '../rbsheet/RbSheet';

import Constants from '../../../config/Constants';
const BASE_URL = Constants.BASE_URL

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

import { useSelector, useDispatch } from 'react-redux'

import { addBasket, deleteBasket, updateBasket } from '../../../actions/cart';

export default function BasketDetail() {
  const navigation = useNavigation()
  const route = useRoute()

  const dispatch = useDispatch()
  const refRBSheet = useRef()

  const Subscriptions = useSelector(state => state.cartReducer.SubscriptionList)

  const [BasketID, setBasketID] = React.useState(route.params.basket_id);
  const [BasketName, setBasketName] = React.useState(route.params.basket_name);
  const [catId, setcatId] = React.useState('');
  const [isLoading, setisLoading] = React.useState(false);

  const [BasketItem, setBasketItem] = useState([]);

  const [BasketData, setBasketData] = useState([]);
  const [BasketProducts, setBasketProducts] = useState([]);

  const [Quantity, setQuantity] = useState(1);
  const [basketModalQTY, setbasketModalQTY] = useState(1);

  const [BasketImagePopUp, setBasketImagePopUp] = React.useState('');
  const [BasketDiscountPricePopUp, setBasketDiscountPricePopUp] = React.useState('0');
  const [BasketSalePricePopUp, setBasketSalePricePopUp] = React.useState('0');
  const [BasketPricePopUp, setBasketPricePopUp] = React.useState('');
  const [BasketNamePopUp, setBasketNamePopUp] = React.useState('');
  const [BasketProductsPopUp, setBasketProductsPopUp] = React.useState('');
  const [BasketDescriptionPopUp, setBasketDescriptionPopUp] = React.useState('');


  const addBasketInCart = (BasketItem) => dispatch(addBasket(BasketItem))

  const deleteBasketInCart = (BasketItem) => dispatch(deleteBasket(BasketItem))
  const updateBasketInCart = (BasketItem) => dispatch(updateBasket(BasketItem))
  const cbaskets = useSelector(state => state.cartReducer.CartBasketList)
  const CartTotalItem = useSelector(state => state.cartReducer.TotalItems)

  const [HasMen, setHasMen] = React.useState(false);
  const [HasWomen, setHasWomen] = React.useState(false);
  const [HasKid, setHasKid] = React.useState(false);
  const [HasElder, setHasElder] = React.useState(false);
  const [WishList, setWishList] = React.useState(false);

  useEffect(() => {
    getBasketDetail()
  }, [])

  async function getBasketDetail() {
    const sessionData = JSON.parse(await AsyncStorage.getItem('USER_DATA'));
    const customer_id = sessionData.customer_id

    setisLoading(true)
    const bodyArray = {
      app: 1,
      customer_id: customer_id,
      basket_id: route.params.basket_id,
    };

    fetch(`${BASE_URL}getbasketdetails`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bodyArray)
    }).then(function (response) {
      return response.json();
    }).then(function (result) {

      setisLoading(false)
      var pnames = ''
      if (result.CODE === 200) {
        setBasketData(result.baskets[0])
        setBasketProducts(result.products)

        if (result.baskets[0].wishlist !== null) {
          setWishList(true)
        } else {
          setWishList(false)
        }

        var basketfor = result.baskets[0].basket_for
        const myArray = basketfor.split(",");

        //console.log('basketfor :',myArray)
        if (myArray != '') {
          var hasMen = basketfor.indexOf('1') != -1;
          var hasWomen = basketfor.indexOf('2') != -1;
          var hasKid = basketfor.indexOf('3') != -1;
          var hasElder = basketfor.indexOf('4') != -1;

          if (basketfor.indexOf('1') != -1) {
            setHasMen(true)
          }
          if (basketfor.indexOf('2') != -1) {
            setHasWomen(true)
          }
          if (basketfor.indexOf('3') != -1) {
            setHasKid(true)
          }
          if (basketfor.indexOf('4') != -1) {
            setHasElder(true)
          }

        }

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

  function openModal(basketData) {
    setBasketItem([])

    setbasketModalQTY(Quantity)

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
        result.data.map((product) => {
          pnames = pnames + product.product_name + ', '
        })
        setBasketProductsPopUp(pnames)
      }
    })

  }

  async function addInToWishList(basket_id) {
    const sessionData = JSON.parse(await AsyncStorage.getItem('USER_DATA'));
    const customer_id = sessionData.customer_id

    /*var newBaskets = BasketData;
    newBaskets.wishlist = customer_id;
    setBasketData(newBaskets)   */
    setWishList(true)

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

    /*var newBaskets = BasketData;
    newBaskets.wishlist = null;
    setBasketData(newBaskets)   */
    setWishList(false)

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
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.Singlepage}>
          {isLoading && <Loader />}

          <View style={styles.basketContainer}>

            <View style={styles.iconheart}>

              <View style={styles.category_shortcaticon_view}>

                {HasMen &&

                  <Image style={styles.category_shortcaticon} source={require('../../../assets/icons/men.png')} />
                }

                {HasWomen &&

                  <Image style={styles.category_shortcaticon} source={require('../../../assets/icons/women.png')} />
                }

                {HasKid &&

                  <Image style={styles.category_shortcaticon} source={require('../../../assets/icons/kid.png')} />
                }

                {HasElder &&

                  <Image style={styles.category_shortcaticon} source={require('../../../assets/icons/elder.png')} />
                }

              </View>

              {WishList ?
                <TouchableOpacity onPress={() => removeFromWishList(BasketData.basket_id)}>
                  <Icon name="heart" size={18} color="#eb5757" />
                </TouchableOpacity>

                :

                <TouchableOpacity onPress={() => addInToWishList(BasketData.basket_id)}>
                  <Icon name="hearto" size={18} color="#eb5757" />
                </TouchableOpacity>
              }

            </View>

            <View style={styles.basketWrapper}>

              <View style={styles.basketImgBox}>

                <Image style={styles.basketImg} source={{ uri: BasketData.basket_image }} />

              </View>

              <View style={styles.basketDetail}>

                <Text numberOfLines={2} style={[styles.basketProductName, styles.font_regular2, styles.font_size16]}>{BasketData.basket_name}</Text>

                {BasketData.discount_price > 0 ?
                  <View style={[styles.inLine]}>
                    <Text style={[styles.basketActualPrice, styles.font_semiboldPro]}><FIcon name="rupee" size={13} color="#272727" />{BasketData.actual_price}</Text>
                    <Text style={[styles.basketSalePrice, styles.font_regular2]}><FIcon name="rupee" size={11} color="999999" />{BasketData.basket_sale_price}</Text>
                    <Text style={[styles.basketDiscount, styles.font_regular2]}>{BasketData.discount}% OFF</Text>
                  </View>
                  :
                  <View style={[styles.inLine]}>
                    <Text style={[styles.basketActualPrice, styles.font_semiboldPro]}><FIcon name="rupee" size={13} color="#272727" />{BasketData.actual_price}</Text>
                  </View>

                }

                <View style={styles.quantityDirec}>

                  <View style={styles.addproduct_quantityview}>
                    <View style={styles.addproduct_quantityadd}>

                      <NumericInput
                        value={Quantity}
                        onChange={(val) => updateQuantity(val)}
                        totalWidth={80}
                        totalHeight={30}
                        iconSize={50}
                        step={1}
                        minValue={0}
                        maxValue={100}
                        rounded
                        textColor='#000'
                        borderColor='#f4f7fc'
                        iconStyle={[styles.numericicon, styles.font_regular2]}
                        inputStyle={[styles.numericinput, styles.font_regular2]}
                        rightButtonBackgroundColor='#f4f7fc'
                        leftButtonBackgroundColor='#f4f7fc'
                      />

                    </View>
                  </View>

                  <TouchableOpacity onPress={() => openModal(BasketData)}>
                    <View style={styles.addBtn}>
                      <Text style={[styles.addbtn_text, styles.font_regular]}>ADD</Text>
                    </View>
                  </TouchableOpacity>
                </View>

              </View>

            </View>
          </View>

          <View>
            <View style={styles.description}>
              <Text style={[styles.descriptionTitle, styles.font_regular2, styles.font_size16]}>
                Description
              </Text>
              <Text numberOfLines={4} style={[styles.descriptionPara, styles.font_regular, styles.font_size12]}>
                {BasketData.basket_description}
              </Text>
            </View>
          </View>

          <View style={styles.productWrap}>
            <View style={styles.productName}>
              <Text style={[styles.productNameTitle, styles.font_regular2, styles.font_size16]}>In Basket</Text>
              <ScrollView>

                <FlatList
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.listContainer}
                  horizontal={false}
                  data={BasketProducts}
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item) => {
                    return item.id;
                  }}
                  renderItem={({ item }) => {
                    return (
                      <View style={styles.productRow}>
                        <View style={styles.productImgBox}>
                          <Image style={styles.productImg} source={{ uri: item.product_image }} />
                        </View>

                        <View style={styles.productDetail}>

                          <Text numberOfLines={2} style={[styles.productTitle, styles.font_regular2]}>{item.product_name}</Text>
                          <Text style={[styles.productWeight, styles.font_regular2]}>Wt: {item.weight_in_kg}Kg {item.weight_in_gm}gm</Text>

                          <Text numberOfLines={2} style={[styles.productDescription, styles.font_regular, styles.font_size12]}>
                            {item.product_description}
                          </Text>

                        </View>
                      </View>
                    )
                  }} />


              </ScrollView>

            </View>
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


    </ScrollView>
  )
};