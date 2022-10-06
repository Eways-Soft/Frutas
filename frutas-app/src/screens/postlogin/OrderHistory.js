import React, { useEffect, useState, useRef } from "react";
import { View, Dimensions, Text, ScrollView, Image, TouchableOpacity,ActivityIndicator } from 'react-native';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { useIsFocused } from "@react-navigation/native";
import styles from '../../assets/css/AppDesign.js'
import Constants from '../../config/Constants';
import Loader from "./../../components/loader/Loader";
var BASE_URL = Constants.BASE_URL;

const RunningOrderRoute = () => {
    const navigation = useNavigation(); 
    const isFocused = useIsFocused();
    
    const [RunningOrder, setRunningOrder] = React.useState([]);
    const [isloading, setisloading] = React.useState(false);

    const UserID = useSelector(state => state.userReducer.UserID)
    
    useEffect(() => {
        getOrders()
        const unsubscribe = navigation.addListener('didFocus', () => {
            alert('again call')
            getOrders()            
        });

        return unsubscribe;

    }, [isFocused])

    async function getOrders(){
        setisloading(true) 

        setTimeout(function(){
            setisloading(false)
        },2000);
        const sessionData = JSON.parse(await AsyncStorage.getItem('USER_DATA'));
        const customer_id = sessionData.customer_id

        const bodyArray1 = {
            app: 1,
            customer_id: customer_id,
        };

        fetch(`${BASE_URL}getcustomerrunningorders`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(bodyArray1)
        }).then(function (response) {
          return response.json();
        }).then(function (result) {
            
          setisloading(false)
          //setisLoading(false)
          if (result.CODE === 200) {
            setRunningOrder(result.data)
          } else {
            //console.log('! 200')
            //alert('Something went wrong !.')
          }
        }).catch(function (error) {
          console.log('error ', error);
        });     
    }

    function orderDetail(order_no){
        
        navigation.navigate('OrderDetails',{order_no: order_no})
    }

    return (
        <View style={styles.alignItemsCenter}>
            <ScrollView>

                {RunningOrder ?   
                    RunningOrder.map((item,ind)=>{
                        var dateFuntion = new Date(item.create_date);
                        var year = dateFuntion.getFullYear();
                        var month = dateFuntion.getMonth()+1;
                        var day = dateFuntion.getDate();

                        var createdate = day+'-'+month+'-'+year;

                        return(
                            <View style={styles.cart_productlistitem}>
                            <View style={[styles.history_button_view, styles.marginbottom5]}>
                                    <View>
                                        <Text style={[styles.history_button]}>
                                            <Text style={[styles.font_size14, styles.font_regular2, styles.textColorWhite]}>{item.name}</Text>
                                        </Text>
                                    </View>
                                    <View>
                                        <TouchableOpacity onPress={() => orderDetail(item.order_no)}>
                                            <Text style={[styles.font_size14, styles.font_regular2, styles.detail_button]}>Details</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={styles.cart_separator}></View>
                                <View style={styles.cart_product_dlt}>
                                    <View style={styles.image_content}>

                                        <View style={styles.cardContent}>
                                            <Text style={[styles.name, styles.font_semibold, styles.font_size16]}>
                                                Order ID: <Text style={[styles.font_semibold, styles.font_size16]}> #{item.order_no} </Text>
                                            </Text>
                                            <Text style={[styles.font_regular2, styles.font_size14, styles.textColorlight]}>{item.total_items} items</Text>
                                            <Text style={[styles.font_regular2, styles.font_size14, styles.textColorlight]}>Total Amount : {item.total_amount_paid}</Text>
                                            <Text style={[styles.font_regular2, styles.font_size14, styles.textColorlight]}>Order Date :{createdate}</Text>
                                        </View>

                                    </View>
                                </View>
                            </View>
                        )
                    })

                    :

                    <View style={styles.cart_productlistitem}>
                        <View style={styles.cart_product_dlt}>
                            <View style={styles.image_content}>
                                
                                <View style={styles.cardContent}>
                                    <Text style={[styles.name, styles.font_regular2, styles.font_size16]}>
                                        No Order Yet <Text style={[styles.font_regular2, styles.font_size16]}></Text>
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                }

            </ScrollView>
        </View>
    )
};


const HistoryOrderRoute = () => {
    const navigation = useNavigation(); 
    const isFocused = useIsFocused();
    const [CompletedOrder, setCompletedOrder] = React.useState([]);

    useEffect(() => {
        getOrders()
        const unsubscribe = navigation.addListener('didFocus', () => {
            getOrders()            
        });

        return unsubscribe;
    }, [isFocused])

    async function getOrders(){

    const sessionData = JSON.parse(await AsyncStorage.getItem('USER_DATA'));
    const customer_id = sessionData.customer_id

        const bodyArray1 = {
            app: 1,
            customer_id: customer_id,
        };

        fetch(`${BASE_URL}getcustomercompletedorders`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(bodyArray1)
        }).then(function (response) {
          return response.json();
        }).then(function (result) {
          
          //setisLoading(false)
          if (result.CODE === 200) {
            setCompletedOrder(result.data)
          } else {
            //console.log('! 200')
            //alert('Something went wrong !.')
          }
        }).catch(function (error) {
          console.log('error ', error);
        });     
    }

    function orderDetail(order_no){
        navigation.navigate('OrderDetails',{order_no: order_no})
    }

    return (
        <View style={styles.alignItemsCenter}>
            <ScrollView>
                {CompletedOrder ?   
                    CompletedOrder.map((item,ind)=>{

                        var dateFuntion = new Date(item.create_date);
                        var year = dateFuntion.getFullYear();
                        var month = dateFuntion.getMonth()+1;
                        var day = dateFuntion.getDate();

                        var createdate = day+'-'+month+'-'+year;

                        return(
                            <View style={styles.cart_productlistitem}>
                                <View style={[styles.history_button_view, styles.marginbottom5]}>
                                    <View>
                                        <Text style={[styles.history_button]}>
                                            <Text style={[styles.font_size14, styles.font_regular2, styles.textColorWhite]}>Completed</Text>
                                        </Text>
                                    </View>
                                    <View>
                                        <TouchableOpacity onPress={() => orderDetail(item.order_no)}>
                                            <Text style={[styles.font_size14, styles.font_regular, styles.detail_button]}>Details</Text>
                                        </TouchableOpacity>

                                            
                                    </View>
                                </View>
                                <View style={styles.cart_separator}></View>
                                <View style={styles.cart_product_dlt}>
                                    <View style={styles.image_content}>
                                        <Image style={styles.product_shortimage} source={require('../../assets/images/basket.jpg')} />
                                        <View style={styles.cardContent}>
                                            <View style={styles.history}>
                                                <View>
                                                    <Text style={[styles.name, styles.font_semibold, styles.font_size16]}>
                                                        Order ID: <Text style={[styles.font_regular2, styles.font_size16]}> #{item.order_no} </Text>
                                                    </Text>
                                                    <Text style={[styles.font_regular2, styles.font_size14, styles.textColorlight]}>{item.total_items} items</Text>
                                                    <Text style={[styles.font_regular2, styles.font_size14, styles.textColorlight]}>Total Amount :{item.total_amount_paid}</Text>

                                                    <Text style={[styles.font_regular2, styles.font_size14, styles.textColorlight]}>Order Date :{createdate}</Text>

                                                </View>

                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )
                    })

                :
                
                    <View style={styles.cart_productlistitem}>
                        <View style={styles.cart_product_dlt}>
                            <View style={styles.image_content}>
                                
                                <View style={styles.cardContent}>
                                    <View style={styles.history}>
                                        <View>
                                            <Text style={[styles.name, styles.font_regular2, styles.font_size16]}>
                                                No Completed Order<Text style={[styles.font_regular2, styles.font_size16]}> </Text>
                                            </Text>
                                        </View>

                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                    
                }

            </ScrollView>
        </View>
    )
};

const initialLayout = { width: Dimensions.get('window').width };

const OrderHistory = () => {
    const renderScene = SceneMap({
        RunningOrder: RunningOrderRoute,
        HistoryOrder: HistoryOrderRoute,
    });
    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'RunningOrder', title: 'Running' },
        { key: 'HistoryOrder', title: 'History' },
    ]);

    const renderTabBar = props => (
        <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: '#ed872b' }}
            style={{ backgroundColor: '#FFFFFF', padding: 0 }}
            labelStyle={{ color: '#000', fontSize: 16, fontFamily: 'Poppins-Regular' }}
            pressColor='#ed872b'
            activeColor='#ed872b'
            inactiveColor='gray'
        />
    );

    return (
        <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={initialLayout}
            renderTabBar={renderTabBar}
        />
    )
}

export default OrderHistory;