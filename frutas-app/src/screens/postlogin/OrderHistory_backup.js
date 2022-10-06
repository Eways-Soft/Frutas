import React, { useEffect, useState, useRef } from "react";
import { View, Dimensions, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../../assets/css/AppDesign.js'
import Constants from '../../config/Constants';
var BASE_URL = Constants.BASE_URL;

const RunningOrderRoute = () => {

    useEffect(() => {
        getOrders()
    }, [])

    async function getOrders(){

    const sessionData = JSON.parse(await AsyncStorage.getItem('USER_DATA'));
    const customer_id = sessionData.customer_id

        const bodyArray1 = {
            app: 1,
            customer_id: customer_id,
        };

        fetch(`${BASE_URL}getcustomerorders`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(bodyArray1)
        }).then(function (response) {
          return response.json();
        }).then(function (result) {
          console.log('result :', result)
          setisLoading(false)
          if (result.CODE === 200) {
            setBaskets(result.data)
          } else {
            //console.log('! 200')
            //alert('Something went wrong !.')
          }
        }).catch(function (error) {
          console.log('error ', error);
        });     
    }

    return (
        <View style={styles.alignItemsCenter}>
            <ScrollView>
                <View style={styles.cart_productlistitem}>
                    <View style={styles.cart_product_dlt}>
                        <View style={styles.image_content}>
                            <Image style={styles.product_shortimage} source={require('../../assets/images/basket.jpg')} />
                            <View style={styles.cardContent}>
                                <Text style={[styles.name, styles.font_regular, styles.font_size16]}>
                                    Order ID: <Text style={[styles.font_medium, styles.font_size16]}> #24353 </Text>
                                </Text>
                                <Text style={[styles.font_regular, styles.font_size14, styles.textColorlight]}>2 items</Text>

                                <TouchableOpacity style={[styles.cancle_button, styles.margintop5]} onPress={() => alert()}>
                                    <Text style={[styles.font_size14, styles.font_regular, styles.textColorWhite]}>Cancle Order</Text>
                                </TouchableOpacity>

                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
};

const HistoryOrderRoute = () => (
    <View style={styles.alignItemsCenter}>
        <ScrollView>
            <View style={styles.cart_productlistitem}>
                <View style={[styles.history_button_view, styles.marginbottom5]}>
                    <View>
                        <Text style={[styles.history_button]}>
                            <Text style={[styles.font_size14, styles.font_regular, styles.textColorWhite]}>Completed</Text>
                        </Text>
                    </View>
                    <View>
                        <Text style={[styles.font_size14, styles.font_regular, styles.detail_button]}>Details</Text>
                    </View>
                </View>
                <View style={styles.cart_separator}></View>
                <View style={styles.cart_product_dlt}>
                    <View style={styles.image_content}>
                        <Image style={styles.product_shortimage} source={require('../../assets/images/basket.jpg')} />
                        <View style={styles.cardContent}>
                            <View style={styles.history}>
                                <View>
                                    <Text style={[styles.name, styles.font_regular, styles.font_size16]}>
                                        Order ID: <Text style={[styles.font_medium, styles.font_size16]}> #24353 </Text>
                                    </Text>
                                    <Text style={[styles.font_regular, styles.font_size14, styles.textColorlight]}>2 items</Text>
                                </View>

                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    </View>
);

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