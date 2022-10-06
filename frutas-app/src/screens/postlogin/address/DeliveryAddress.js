import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, View, Dimensions, Text, TouchableOpacity, ScrollView, TextInput, FlatList, Image } from 'react-native';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import {Picker} from '@react-native-picker/picker';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

import Loader from "../../../components/loader/Loader";
import Constants from '../../../config/Constants';
var BASE_URL = Constants.BASE_URL;

var loading = false;

import { saveShippingAddress } from '../../../actions/cart';

import styles from '../../../assets/css/AppDesign.js'

function DeliveryAddress(){
    const navigation = useNavigation();
    const dispatch = useDispatch()
    const [Addresses, setAddresses] = React.useState([]);
    const [isLoading, setisLoading] = React.useState(false);
    const totalItem = useSelector(state => state.cartReducer.TotalItems)
    const UserID = useSelector(state => state.cartReducer.UserID)

    const saveShipAddress = (data) => dispatch(saveShippingAddress(data))
    const isFocused = useIsFocused();

    useEffect(() => {
        getcustomeraddresses();

    }, [isFocused])

    async function getcustomeraddresses() {
        setisLoading(true)

        setTimeout(function(){
            setisLoading(false)
        },5000);

        const sessionData = JSON.parse(await AsyncStorage.getItem('USER_DATA'));

        var bodyArray = { 'customer_id': sessionData.customer_id }

        fetch(`${BASE_URL}getcustomeraddresses`, {
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

            if (result.CODE === 200) {
                setAddresses(result.data)
            } else {

            }
        }).catch(function (error) {
        });
    }

    return (

        <>
            {Addresses.length > 0 ? 
                <>
                    <View style={styles.checkoutscreen}>
                        <View style={styles.checkoutinner_screen}>

                        {isLoading && <Loader />}

                        
                                <View style={styles.mainaddress_view}>
                                    <ScrollView>

                                        {Addresses && (
                                            Addresses.map((val, ind) => {

                                                return (
                                                    <View key={ind} style={[styles.ship_address_view]}>
                                                        <View style={[styles.address_view, styles.active_address_view]}>
                                                            <View>
                                                                <Text style={[styles.name_text, styles.font_regular2]}>
                                                                    {val.full_name}
                                                                </Text>
                                                                <Text style={[styles.address_text, styles.font_regular2]}>
                                                                    {val.address}
                                                                </Text>
                                                                <Text style={[styles.pincode_text, styles.font_regular2]}>
                                                                    {val.city} - {val.pincode}
                                                                </Text>
                                                                <Text style={[styles.phone_text, styles.font_regular2]}>
                                                                    {val.mobile_no}
                                                                </Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                )

                                            })

                                        )}

                                    </ScrollView>
                                </View>
                            
                        

                            </View>
                        </View>
                </>

            :
                <>
                    <View style={styles.notfound}>
                      <View style={styles.notfWrap}>
                        <Image style={styles.notficon} source={require('../../../assets/images/notfound.png')} />

                        <View style={styles.notfText}>
                          <Text style={[styles.notfoundtext, styles.font_semiboldPro]}>Oops..!</Text>
                        </View>
                        <View style={styles.notfText2}>
                          <Text style={[styles.notfoundtext2, styles.font_semiboldPro]}>No Address To Show</Text>
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


        
    )
};


export default DeliveryAddress