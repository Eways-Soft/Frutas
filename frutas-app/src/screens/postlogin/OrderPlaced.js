import React, { useEffect, useState, useRef } from "react";

import { Text, View, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { useIsFocused } from "@react-navigation/native";

import styles from '../../assets/css/AppDesign.js';

import { emptyCart } from '../../actions/cart';

export default function OrderPlaced({props, route}){
    const navigation = useNavigation(); 
    const dispatch = useDispatch()
    
    const order_id = route.params.order_id

    const emptyCartRedux = () => dispatch(emptyCart())
    const totalItem = useSelector(state => state.cartReducer.TotalItems)
    const isFocused = useIsFocused();


    useEffect(()=>{ 
        

    },[])  

    async function goHomeScreen(){
        await emptyCartRedux();
        navigation.navigate('Home', { screen: 'Home' });
    }
        
    return (
        <View style={styles.placeorderview_screen}>
            <View style={styles.placeorderview_view}>
            <View style={styles.placeorderview}>
                <Image style={styles.orderimg} source={require('../../assets/icons/placed.png')} />

                <Text style={[styles.placeordertext, styles.font_regular2]}>Order Placed Successfully</Text>
                <Text style={[styles.placeorderid, styles.font_regular2]}>Order ID: <Text style={[styles.orderid, styles.font_regular2]}>#{order_id}</Text></Text>
            </View>
            <View>
                <TouchableOpacity style={styles.theme_button} onPress={() => { goHomeScreen()}}>
                    <Text style={[styles.theme_button_text, styles.font_regular2, styles.font_size18]}>Continue Shopping</Text>
                </TouchableOpacity>
            </View>
            </View>
        </View>
    );
}


