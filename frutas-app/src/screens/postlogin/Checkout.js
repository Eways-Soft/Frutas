import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, View, Dimensions, Text, TouchableOpacity, ScrollView, TextInput, FlatList } from 'react-native';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import {Picker} from '@react-native-picker/picker';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

import Loader from "./../../components/loader/Loader";
import Constants from '../../config/Constants';
var BASE_URL = Constants.BASE_URL;

var loading = false;

import { saveShippingAddress } from '../../actions/cart';

import styles from '../../assets/css/AppDesign.js'

const SavedAddressRoute = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch()
    const [Addresses, setAddresses] = React.useState([]);
    const [isLoading, setisLoading] = React.useState(false);
    const totalItem = useSelector(state => state.cartReducer.TotalItems)
    const UserID = useSelector(state => state.cartReducer.UserID)

    const saveShipAddress = (data) => dispatch(saveShippingAddress(data))
    const isFocused = useIsFocused();

    useEffect(() => {
        if (totalItem === 0) {
            navigation.navigate('Cart')
            return false;
        }

        getcustomeraddresses();

    }, [isFocused])

    async function getcustomeraddresses() {
        setisLoading(true)

        setTimeout(function(){
            setisLoading(false)
        },5000);

        var bodyArray = { 'customer_id': UserID }

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

    async function saveShipingAddressInRedux(data) {
        var completeAdd = data.full_name + ' ' + data.address + '' + data.city + ' ' + data.pincode + '' + data.mobile_no;
        //console.log('completeAdd :',completeAdd)

        var cdata = {'name':data.full_name,'mobile':data.mobile_no,'city':data.city,'pincode':data.pincode,'address':data.address}
        
        await saveShipAddress(cdata);

        navigation.navigate('Payment')
    }

    return (
        <View style={styles.checkoutscreen}>
            <View style={styles.checkoutinner_screen}>

                {isLoading && <Loader />}

                <View style={styles.mainaddress_view}>
                    <ScrollView>

                        {Addresses && (
                            Addresses.map((val, ind) => {

                                return (
                                    <View style={[styles.ship_address_view]}>
                                        <View style={[styles.address_view, styles.active_address_view]}>
                                            <View>
                                                <Text style={[styles.name_text, styles.font_semiboldPro,]}>
                                                    {val.full_name}
                                                </Text>
                                                <Text style={[styles.address_text, styles.font_regular2, styles.checkAddress]}>
                                                    {val.address}
                                                </Text>
                                                <Text style={[styles.pincode_text, styles.font_regular2, styles.checkAddress]}>
                                                    {val.city} - {val.pincode}
                                                </Text>
                                                <Text style={[styles.phone_text, styles.font_regular2, styles.checkAddress]}>
                                                    {val.mobile_no}
                                                </Text>
                                            </View>
                                        </View>
                                        <TouchableOpacity style={styles.ship_theme_button} onPress={() => saveShipingAddressInRedux(val)}>
                                            <Text style={[styles.font_regular2, styles.textwhite, styles.font_size16]}>SHIP TO THIS ADDRESS <Ionicons style={[styles.checkicon, styles.textColorWhite, styles.font_size18]} name="chevron-forward" /></Text>
                                        </TouchableOpacity>
                                    </View>
                                )

                            })

                        )}

                    </ScrollView>
                </View>
            </View>
        </View>
    )
};

const NewAddressRoute = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch()

    const [isSaveLoading, setisSaveLoading] = React.useState(false);
    const [Cities, setCities] = React.useState([]);

    const [FullName, setFullName] = useState('');
    const [Address, setAddress] = useState('');
    const [City, setCity] = useState('');
    const [Pincode, setPincode] = useState('');
    const [Mobile, setMobile] = useState('');

    const saveShipAddress = (data) => dispatch(saveShippingAddress(data))

    const UserID = useSelector(state => state.cartReducer.UserID)
      const pickerRef = useRef();

      function open() {
        pickerRef.current.focus();
      }

      function close() {
        pickerRef.current.blur();
      }
    useEffect(() => {
        getcity();
    }, [])

    async function getcity() {

        fetch(`${BASE_URL}getcity`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(function (response) {
            return response.json();
        }).then(function (result) {

            if (result.CODE === 200) {

                let serviceItems = result.data.map( (val, i) => {
                    return <Picker.Item key={i} value={val.city_name} label={val.city_name} />
                });

                setCities(serviceItems);
            } else {

            }
        }).catch(function (error) {
        });
    }

    async function saveAddress() {
        if (FullName == '') {
            alert('Please enter your full name');
            return false;
        } else if (Address == '') {
            alert('Please enter your Address');
            return false;
        } else if (City == '') {
            alert('Please select your City');
            return false;
        } else if (Pincode == '') {
            alert('Please enter your Pincode');
            return false;
        } else if (Mobile == '') {
            alert('Please enter your Mobile');
            return false;
        } else {

            setisSaveLoading(true)

            setTimeout(function(){
                setisSaveLoading(false)
            },2000);


            var bodyArray = {
                'customer_id': UserID,
                'full_name': FullName,
                'mobile_no': Mobile,
                'city': City,
                'address': Address,
                'pincode': Pincode,
            }

            fetch(`${BASE_URL}savecustomeraddressfororder`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bodyArray)
            }).then(function (response) {
                return response.json();
            }).then(function (result) {
                console.log(result)
                setisSaveLoading(false)
                if (result.CODE == 200) {
                    var completeAdd = FullName + ' ' + Address + '' + City + ' ' + Pincode + '' + Mobile;

                    var cdata = {'name':FullName,'mobile':Mobile,'city':City,'pincode':Pincode,'address':Address}


                    saveShipAddress(cdata);

                    navigation.navigate('Payment')

                } else {

                }
            }).catch(function (error) {
            });

        }
    }
    return (
        <ScrollView>

            {isSaveLoading && <Loader />}

            <View style={styles.alignItemsCenter}>
                <View style={[styles.inner_width,]}>
                    <View style={[styles.NewAddressForm, styles.bg_white]}>
                        <View>
                            <TextInput
                                style={[styles.address_inputs, styles.font_regular2]}
                                placeholder='Full Name'
                                keyboardType='default'
                                onChangeText={text => setFullName(text)}
                            />
                            <TextInput
                                style={[styles.address_inputs, styles.font_regular2]}
                                placeholder='Enter Your Address'
                                keyboardType='default'
                                onChangeText={text => setAddress(text)}
                            />
                            <View style={[styles.font_regular2, styles.select_address_inputs]}>
                             <Picker
                             style={[styles.font_regular2, styles.select_address_inputs_item]}
                                ref={pickerRef}
                                selectedValue={City}
                                onValueChange={(itemValue, itemIndex) =>
                                  setCity(itemValue)
                                }>
                                
                                {Cities}
                              </Picker>
                              </View>
                            <TextInput
                                style={[styles.address_inputs, styles.font_regular2]}
                                placeholder='Enter Your Pincode'
                                keyboardType='numeric'
                                maxLength={6}
                                onChangeText={text => setPincode(text)}
                            />
                            <TextInput
                                style={[styles.address_inputs, styles.font_regular2]}
                                placeholder='Enter Your Phone'
                                keyboardType='numeric'
                                maxLength={10}
                                onChangeText={text => setMobile(text)}
                            />
                            <TouchableOpacity
                                style={[styles.ship_theme_button, styles.margintop10]}
                                onPress={() => saveAddress()}
                            >
                                <Text style={[styles.font_regular2, styles.textwhite, styles.font_size16]}>SAVE ADDRESS</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

const initialLayout = { width: Dimensions.get('window').width };

const renderScene = SceneMap({
    SavedAddress: SavedAddressRoute,
    NewAddress: NewAddressRoute,
});

export default function TabViewExample() {
    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'SavedAddress', title: 'Saved Addresses' },
        { key: 'NewAddress', title: 'New Address' },
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
    );
}

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        height: 40,
        fontSize: 15,
        color: "#666666f0",
        justifyContent: 'center',
        width: windowWidth - 50,
    },
    inputAndroid: {
        height: 40,
        fontSize: 15,
        color: "#666666f0",
        justifyContent: 'center',
        width: windowWidth - 50,
        borderWidth: 1,
        borderColor: 'gray',
    },
});