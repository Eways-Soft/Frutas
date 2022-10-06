import React, { useEffect, useState, useRef } from "react";
import { Text, View, TouchableOpacity } from 'react-native';
import { Checkbox } from 'react-native-paper';

import { useDispatch, useSelector } from 'react-redux';
import { useNavigation,useIsFocused } from '@react-navigation/native';
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { addBasket, removeBasket, updateBasket } from './../../actions/cart';
import Constants from '../../config/Constants';
var BASE_URL = Constants.BASE_URL;
import styles from '../../assets/css/AppDesign.js'

const Payment = () => {
    const navigation = useNavigation(); 
    const dispatch = useDispatch()

    const [isLoading, setisLoading] = React.useState(false);

    const [checked, setChecked] = React.useState(false);
    const [checked1, setChecked1] = React.useState(false);
    const [checked2, setChecked2] = React.useState(false);

    const baskets = useSelector(state => state.cartReducer.CartBasketList)
    const totalItem = useSelector(state => state.cartReducer.TotalItems)
    const subtotal = useSelector(state => state.cartReducer.SubTotal)
    const deliveryfee = useSelector(state => state.cartReducer.DeliveryFee)
    const totalamount = useSelector(state => state.cartReducer.TotalAmount)
    const shipAdd = useSelector(state => state.cartReducer.ShippingAddress) 
    const isFocused = useIsFocused();
    useEffect(()=>{        
        if(totalItem === 0){
            navigation.navigate('Cart')
            return false;
        }
    },[isFocused])   

    async function placeOrder() {
        const sessionData = JSON.parse(await AsyncStorage.getItem('USER_DATA'));
        const bodyArray = {
            app: 1,
            customer_id: sessionData.customer_id,
            payment_method: '1',
            total_amount_paid: totalamount,
            delivery_address: shipAdd,
            items: baskets,
            total_item: totalItem,
            sub_total: subtotal,
            delivery_fee: deliveryfee,
        };

        const netStatus = await (await NetInfo.fetch()).isConnected;

        if (netStatus) {
            setisLoading(true)  
            try {
              fetch(`${BASE_URL}orderplace`, {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(bodyArray)
              }).then(function (response) {
                return response.json();
              }).then(async function (result) {
                setisLoading(false)  
                if (result.CODE === 200) {                                  
                    navigation.navigate('OrderPlaced',{order_id: result.data})
                } else {
                    console.log('no')
                }
              }).catch(function (error) {
                console.log('error ', error);
              });
            } catch (e) {
                setisLoading(false)  
              console.log('RequestService call catch ', ` ${e}`);
            }

        }else{
            alert('Internet connection weak!..')
        }

    }


    return (
        <View style={[styles.alignItemsCenter]}>
        <View style={[styles.paymnet_screen]}>
            <View style={styles.paymentmethod_view}>
                <Text style={[styles.font_size18, styles.font_medium]}>Payment Method</Text>
            </View>

            {isLoading && <Loader /> }

            <View style={[styles.payment_method_view]}>
                <View style={[styles.payment_methodeachview]}>
                    <Checkbox
                        color={'#ed872b'}
                        status={checked ? 'checked' : 'unchecked'}
                        onPress={() => {
                            setChecked(!checked);
                        }}
                    />
                    <Text style={[styles.payment_method_text, styles.font_medium]}>Cash On Delievry</Text>
                </View>
                <View style={[styles.payment_methodeachview]}>
                    <Checkbox
                        color={'#ed872b'}
                        status={checked1 ? 'checked' : 'unchecked'}
                        onPress={() => {
                            setChecked1(!checked1);
                        }}
                    />
                    <Text style={[styles.payment_method_text, styles.font_medium]}>Mobile Payment</Text>
                </View>
                <View style={[styles.payment_methodeachview]}>
                    <Checkbox
                        color={'#ed872b'}
                        status={checked2 ? 'checked' : 'unchecked'}
                        onPress={() => {
                            setChecked2(!checked2);
                        }}
                    />
                    <Text style={[styles.payment_method_text, styles.font_medium]}>Debit or Credit Card Payment</Text>
                </View>
            </View>

            <View style={styles.confirm_button}>
                <TouchableOpacity style={styles.theme_button} onPress={() => placeOrder()}>
                    <Text style={[styles.theme_button_text, styles.font_medium]}>Order Placed</Text>
                </TouchableOpacity>
            </View>
        </View>
        </View>
    )
}

export default Payment;
