import React, { useEffect, useState, useRef } from "react";

import {
  Alert,  Button,  Linking,  PermissionsAndroid,  Platform,  ScrollView,
  StyleSheet,  Switch,  Text,  ToastAndroid,  View, TextInput, TouchableHighlight,RefreshControl,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from "react-native-vector-icons/Ionicons";
import Icon from "react-native-vector-icons/AntDesign";
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import Geolocation from 'react-native-geolocation-service';

import styles from '../../../assets/css/AppDesign.js'
Ionicons.loadFont();

export default function Header() {
  const navigation = useNavigation();
  const Notifications = useSelector(state => state.cartReducer.TotalNotifications)

  const [forceLocation, setForceLocation] = useState(true);
  const [highAccuracy, setHighAccuracy] = useState(true);
  const [locationDialog, setLocationDialog] = useState(true);
  const [significantChanges, setSignificantChanges] = useState(false);
  const [observing, setObserving] = useState(false);
  const [foregroundService, setForegroundService] = useState(false);
  const [useLocationManager, setUseLocationManager] = useState(false);
  const [location, setLocation] = useState(null);

  const watchId = useRef(null);

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    const hasPermission = await hasLocationPermission();

    if (!hasPermission) {
      return;
    }

    Geolocation.getCurrentPosition(
      (position) => {
        setLocation(position);

        var lat= position.altitude;
        var long= position.longitude;

        fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + lat + ',' + long + '&key=AIzaSyDZUGrE__uO1R_-CSZCz3fnxWPgAub5Yuw')
        .then((response) => response.json())
        .then((responseJson) => {
        })


      },
      (error) => {
        Alert.alert(`Code ${error.code}`, error.message);
        setLocation(null);
        
      },
      {
        accuracy: {
          android: 'high',
          ios: 'best',
        },
        enableHighAccuracy: highAccuracy,
        timeout: 15000,
        maximumAge: 10000,
        distanceFilter: 0,
        forceRequestLocation: forceLocation,
        forceLocationManager: useLocationManager,
        showLocationDialog: locationDialog,
      },
    );
  };

  const hasLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const hasPermission = await hasPermissionIOS();
      return hasPermission;
    }

    if (Platform.OS === 'android' && Platform.Version < 23) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show(
        'Location permission denied by user.',
        ToastAndroid.LONG,
      );
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show(
        'Location permission revoked by user.',
        ToastAndroid.LONG,
      );
    }

    return false;
  };

  return (
    <>

      <View style={styles.main_header1}>

        <View style={styles.menu_icon_title1}>
          <View style={styles.menu_icon}>
            <Ionicons name="ios-reorder-three-outline" style={[styles.header_icons_menu]} onPress={() => navigation.openDrawer()}/>
          </View>
          <View style={styles.menu_title_view1}>
            <Text style={[styles.location_title]}>Your Location</Text>
            
          <View style={styles.display_locate}>
            <Text style={[styles.menu_title1, styles.font_semiboldPro]}>Panchkula, India</Text>
            <Text style={[styles.icon_caret]}> <Icon name="caretdown" style={[styles.header_icons_menu1]} /> </Text>
          </View>

          </View>
          <View style={styles.search_inputContainer1}>
           <Icon name="search1" style={styles.search_icn} 
            onChangeText={text => (getSearchBaskets(text))}            
            onTouchStart={()=>  navigation.navigate('Search')}/>
           {/* <TextInput style={[styles.search_inputs]} placeholder="Search Basket" underlineColorAndroid='transparent'
            onChangeText={text => (getSearchBaskets(text))}            
            onTouchStart={()=>  navigation.navigate('Search')}
           /> */}
        </View>
        </View>

        

      </View>

    </>
  )
}
