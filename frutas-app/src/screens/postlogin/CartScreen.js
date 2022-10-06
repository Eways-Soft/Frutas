import React, { useEffect, useState, useRef } from "react";
import {
    StyleSheet,
    Alert,
    Text,
    View,
    Image,
    FlatList,
    ScrollView,
    TextInput,
    TouchableHighlight,
    TouchableOpacity
} from 'react-native';
import NumericInput from 'react-native-numeric-input';
import { useNavigation } from '@react-navigation/native';
import Ionicons from "react-native-vector-icons/Ionicons";
import FeatherIcon from "react-native-vector-icons/Feather";
import FIcon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from '@react-native-async-storage/async-storage';
Ionicons.loadFont();
import { useDispatch, useSelector } from 'react-redux';
import { addBasket, removeBasket, updateBasket,userID } from './../../actions/cart';
import styles from '../../assets/css/AppDesign.js'

import AntDesign from 'react-native-vector-icons/AntDesign';
import HeaderStyle from "./inc/header/HeaderStyle";

export default function CartScreen(){
    const navigation = useNavigation(); 
    const dispatch = useDispatch()
    const [PromoCode, setPromoCode] = React.useState();
    const updateBasketInCart = (BasketItem) => dispatch(updateBasket(BasketItem))

    const baskets = useSelector(state => state.cartReducer.CartBasketList)
    const subtotal = useSelector(state => state.cartReducer.SubTotal)
    const deliveryfee = useSelector(state => state.cartReducer.DeliveryFee)
    const totalamount = useSelector(state => state.cartReducer.TotalAmount)

    const saveUserID = (id) => dispatch(userID(id))
    const removeBasketFromCart = (Item) => dispatch(removeBasket(Item))

    const [showBox, setShowBox] = useState(true);

    useEffect(() => {
        
    }, [])

    function updateQuantityMinus(qty, BasketItem) {
        if(qty >= '0'){
            var newBasketItem = BasketItem
            newBasketItem.quantity = qty
            updateBasketInCart(newBasketItem)
        }
    }

    function updateQuantityPlus(qty, BasketItem) {
        var newBasketItem = BasketItem
        newBasketItem.quantity = qty
        updateBasketInCart(newBasketItem)
    }

    const showConfirmDialog = (item) => {        
        return Alert.alert(
          "Remove ?",
          "Are you sure you want to remove this item?",
          [
            {
              text: "Yes",
              onPress: () => {
                removeBasketFromCart(item);
              },
            },
            {
              text: "No",
            },
          ]
        );
    };

    async function proceed(){
        const sessionData = JSON.parse(await AsyncStorage.getItem('USER_DATA'));
        //console.log(sessionData)
        if(totalamount > 0){
            await saveUserID(sessionData.customer_id);
            navigation.navigate('Checkout')
        }else{
            
        }
    }

    return (
        <>
            { baskets.length > 0 ?

                <>
                    <ScrollView style={styles.scrollView}
                        contentContainerStyle={{ flexGrow: 1 }}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}>
                        <View style={[styles.cart_container]}>
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                showsHorizontalScrollIndicator={false}
                                style={styles.contentList}
                                columnWrapperStyle={styles.listContainer}
                                data={baskets}
                                keyExtractor={(item) => {
                                    return item.basket_id;
                                }}
                                renderItem={({ item }) => {
                                    let qty = item.quantity
                                    return (
                                        <>
                                            <View style={styles.cart_productlistitem}>
                                                <View style={styles.cart_product_dlt}>
                                                    <View style={styles.image_content}>
                                                        <Image style={styles.product_shortimage} source={{ uri: item.basket_image }} />
                                                        <View style={styles.cardContent}>
                                                            <Text style={[styles.name, styles.font_regular2]}>{item.basket_name}</Text>
                                                            <Text style={[styles.font_regular2, styles.font_size13]}>QTY: {item.quantity}</Text>
                                                            <Text style={[styles.star, styles.font_regular2]}>{item.count}</Text>
                                                        </View>
                                                    </View>
                                                    <View>
                                                        <TouchableHighlight
                                                            activeOpacity={0.6}
                                                            underlayColor="transparent"
                                                            onPress={() => showConfirmDialog(item)}>
                                                            <Ionicons name="trash-outline" style={[styles.textColorlight, styles.font_size16]} />
                                                        </TouchableHighlight>
                                                    </View>
                                                </View>

                                                <View style={styles.cart_separator} />

                                                <View style={styles.wrapperqty}>
                                                    <TouchableOpacity activeOpacity={1} backgroundColor="#ed872b" style={[styles.qtybx]} onPress={ ()=> updateQuantityMinus(qty-1, item)}>         
                                                        <FeatherIcon name="minus" style={{ color:'#fff' }} />
                                                    </TouchableOpacity>

                                                    <Text style={styles.qtyText}>{qty}</Text>

                                                    <TouchableOpacity activeOpacity={1} backgroundColor="#ed872b" style={[styles.qtybx]} onPress={ ()=> updateQuantityPlus(qty+1, item)}>
                                                        <FeatherIcon name="plus" style={{ color:'#fff' }} />
                                                    </TouchableOpacity>
                                                </View>

                                                

                                            </View>
                                        </>
                                    )
                                }} />
                            <View style={[styles.bg_white, styles.alignItemsCenter]}>
                                <View style={styles.heading}>
                                    <Text style={[styles.font_size16, styles.font_semiboldPro, styles.headingColor]}>Payment Details</Text>
                                </View>
                                <View style={styles.viewinputContainer}>
                                    <View style={styles.inputContainer_coupon}>
                                        <TextInput style={[styles.inputs, styles.font_regular2]}
                                            placeholder="Enter Promo Code"
                                            maxLength={8}
                                            keyboardType="default"
                                            underlineColorAndroid='transparent'
                                            onChangeText={(text) => setPromoCode(text)} />
                                        <View style={styles.apply}>
                                            <TouchableOpacity onPress={() => alert('No promo code available')}>
                                                <Text style={[styles.applytext, styles.font_regular2]}>Apply</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.totaltextview_view}>
                                    <View style={styles.totaltextview}>
                                        <Text style={[styles.totaltext, styles.font_size16, styles.font_regular2]}>Subtotal</Text>
                                        <Text style={[styles.totaltext, styles.font_size16, styles.font_regular2]}><FIcon name="rupee" size={14} color="#272727" /> {subtotal}</Text>
                                    </View>
                                    <View style={styles.totaltextview}>
                                        <Text style={[styles.totaltext, styles.font_size16, styles.font_regular2]}>Delivery Fee</Text>
                                        <Text style={[styles.totaltext, styles.font_size16, styles.font_regular2]}><FIcon name="rupee" size={14} color="#272727" /> {deliveryfee}</Text>
                                    </View>
                                    <View style={styles.totaltextview}>
                                        <Text style={[styles.finalamount, styles.font_size16, styles.font_semiboldPro]}>Total Amount</Text>
                                        <Text style={[styles.finalamount, styles.font_size16, styles.font_semiboldPro]}><FIcon name="rupee" size={14} color="#272727" /> {totalamount}</Text>
                                    </View>
                                </View>
                            </View>

                        </View>

                    </ScrollView>

                    <View style={styles.bottomView}>
                        <View style={[styles.bottomView_total, styles.bg_white]}>
                            {/* <Text style={[styles.font_size16,  styles.font_regular2]}>Grand Total</Text> */}
                            <Text style={[styles.chngeAmount, styles.font_size18, styles.font_semiboldPro]}><FIcon name="rupee" size={18} color="#272727" /> {totalamount}</Text>
                        </View>
                        <TouchableOpacity style={styles.theme_button_cart}  onPress={() => proceed()}>
                            <Text style={[styles.theme_button_text, styles.font_regular2, styles.font_size16]}>PROCEED</Text>
                        </TouchableOpacity>
                    </View>
                    
                </>

            :
                <>
                    <View style={styles.notfound}>
                      <View style={styles.notfWrap}>
                        <Image style={styles.notficon} source={require('./../../assets/images/cart.png')} />

                        <View style={styles.notfText}>
                          <Text style={[styles.notfoundtext, styles.font_semiboldPro]}>Oops..!</Text>
                        </View>
                        <View style={styles.notfText2}>
                          <Text style={[styles.notfoundtext2, styles.font_semiboldPro]}>No Basket To Show</Text>
                        </View>
                        <View style={styles.btndatafound}>
                          <TouchableOpacity style={styles.noData} underlayColor='#558120' onPress={()=> navigation.goBack() }>         
                            <Text style={[styles.btnNotfoundtext, styles.font_semiboldPro]}>Go Back</Text>          
                          </TouchableOpacity>
                        </View>          
                      </View>
                    </View>
                </>
            }
        </>
    );

}

