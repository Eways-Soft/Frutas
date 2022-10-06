import React, { useEffect, useState, useRef } from "react";

import { View, Text, Button, StyleSheet , ScrollView, Dimensions, Image, TouchableOpacity, TouchableHighlight, RefreshControl, SafeAreaView, TextInput , Pressable} from 'react-native';

import { useNavigation, useIsFocused } from '@react-navigation/native';

import { FlatList } from 'react-native-gesture-handler';
import FIcon from "react-native-vector-icons/FontAwesome";
import FeatherIcon from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";

import AsyncStorage from '@react-native-async-storage/async-storage';

import styles from '../../../assets/css/AppDesign.js'
import Loader from "../../../components/loader/Loader";

import Constants from '../../../config/Constants';

import { useSelector, useDispatch } from 'react-redux'

import { addBasket, deleteBasket, updateBasket, saveSubscriptions } from '../../../actions/cart';
import { saveRecomendedBasketsForHome } from '../../../actions/home';

var BASE_URL = Constants.BASE_URL;

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const colors = ['tomato', 'thistle', 'skyblue', 'teal'];

export default function RbSheet(props) {

  const dispatch = useDispatch()
    const navigation = useNavigation(); 

  const refRBSheet = useRef();

  const [BasketItem, setBasketItem] = useState(props.BasketItem);

  const [BasketImagePopUp, setBasketImagePopUp] = React.useState(props.BasketImagePopUp);
  const [BasketDiscountPricePopUp, setBasketDiscountPricePopUp] = React.useState(props.BasketDiscountPricePopUp);
  const [BasketSalePricePopUp, setBasketSalePricePopUp] = React.useState(props.BasketSalePricePopUp);
  const [BasketPricePopUp, setBasketPricePopUp] = React.useState(props.BasketPricePopUp);
  const [BasketNamePopUp, setBasketNamePopUp] = React.useState(props.BasketNamePopUp);
  const [BasketProductsPopUp, setBasketProductsPopUp] = React.useState(props.BasketProductsPopUp);
  const [BasketDescriptionPopUp, setBasketDescriptionPopUp] = React.useState(props.BasketDescriptionPopUp);

  const [Subscriptions, setSubscriptions] = useState([]);
  const [basketModalQTY, setbasketModalQTY] = useState(1);
  const [qty, setqty] = useState(1);


  const addBasketInCart = (BasketItem) => dispatch(addBasket(BasketItem))
  const saveSubscriptionsIntoRedux = (data) => dispatch(saveSubscriptions(data))

  const deleteBasketInCart = (BasketItem) => dispatch(deleteBasket(BasketItem))
  const updateBasketInCart = (BasketItem) => dispatch(updateBasket(BasketItem))

  const cbaskets = useSelector(state => state.cartReducer.CartBasketList)
  const CartTotalItem = useSelector(state => state.cartReducer.TotalItems)
  const isFocused = useIsFocused();


  useEffect(() => {
    

  }, [])


  function updateQuantity(uqty) { 
    if (uqty >= 0) {   
      setbasketModalQTY(uqty)

      var BasketItemNew = BasketItem

      BasketItemNew.quantity = uqty
      setBasketItem(BasketItemNew)
      
      updateBasketInCart(BasketItem)
      
    }
    
  }

  function addToCart() {

    var basketData = BasketItem
    let existed_item = cbaskets.find(item => BasketItem.basket_id === item.basket_id);
    if (existed_item) {
      basketData.quantity = basketModalQTY + existed_item.quantity
    } else {
      basketData.quantity = basketModalQTY
    }
    addBasketInCart(basketData)

  }

  return(
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        <View style={styles.addproduct_view}>
          <View style={styles.addproduct_imageprice}>
            <Image style={styles.addproduct_image} source={{ uri: BasketImagePopUp }} />

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
            <Text style={[styles.addproduct_nametitle, styles.font_semibold]}>{BasketNamePopUp}</Text>
            <Text style={[styles.addproduct_namedesc, styles.font_regular2]}>{BasketProductsPopUp}</Text>
          </View>
          <View style={styles.addproduct_quantityview}>
            <View style={styles.addproduct_quantitytext}>
              <Text style={[styles.addproduct_quantitytitle, styles.font_semibold]}>Quantity</Text>
              <Text style={[styles.addproduct_quantityshort, styles.font_regular2]}>Please Add Quantity</Text>
            </View>
            <View style={styles.addproduct_quantityadd}>
              
            <View style={styles.wrapperqty}>
                <TouchableOpacity activeOpacity={1} backgroundColor="#ed872b" style={[styles.qtybx]} onPress={ ()=> updateQuantity(basketModalQTY-1)} >         
                    <FeatherIcon name="minus" style={{color:'#fff'}} />
                </TouchableOpacity>

                <Text style={styles.qtyText}>{basketModalQTY}</Text>

                <TouchableOpacity activeOpacity={1} backgroundColor="#ed872b" style={[styles.qtybx]} onPress={ ()=> updateQuantity(basketModalQTY+1)} >
                    <FeatherIcon name="plus" style={{color:'#fff'}}  />
                </TouchableOpacity>
            </View>

            </View>
          </View>

          <View style={styles.addproduct_subscriptionview}>
            <Text style={[styles.addproduct_subscriptiontitle, styles.font_semibold]}>Subscription</Text>
            <SafeAreaView style={{ flex: 1 }}>
              <FlatList style={styles.productlist}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
                horizontal={true}
                data={Subscriptions}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => {
                  return item.subscription_id;
                }}
                renderItem={({ item, ind }) => {
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
            <Text style={[styles.addproduct_descriptiontitle, styles.font_semibold]}>Description</Text>
            <Text style={[styles.addproduct_description, styles.font_light]}>
              {BasketDescriptionPopUp}
            </Text>
          </View>

        </View>

      </ScrollView>

      <View style={[styles.btnFixed]}>
        <TouchableOpacity style={[styles.sheet_theme_button]} onPress={() => addToCart()}>
          <Text style={[styles.theme_button_text, styles.font_semibold, styles.font_size18]}>Add to Cart</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.carticon1]} onPress={() => navigation.navigate('Cart')}>
          <Text>
            <Ionicons name="basket-outline" style={[styles.carticon]} />
          </Text>

          <View style={styles.circle}>
            <Text style={styles.count}>{CartTotalItem}</Text>
          </View>

        </TouchableOpacity>
      </View>
    </>
  )
}


