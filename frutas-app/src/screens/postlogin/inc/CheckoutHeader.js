import React from "react";
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from "react-native-vector-icons/Ionicons";
import styles from '../../../assets/css/AppDesign.js'
Ionicons.loadFont();
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

function MyComponent(props) {

  const navigation = useNavigation();   
  const totalItem = useSelector(state => state.cartReducer.TotalItems)

  return (
    <View>
      {totalItem > 0 &&
        <Text style={[styles.counting, styles.font_semibold]}>{totalItem}</Text>
      }
      <Ionicons name="cart-outline" style={styles.header_icons} />
    </View>
  );
}

export default function CheckoutHeader() {
  const navigation = useNavigation();   
  const totalItem = useSelector(state => state.cartReducer.TotalItems)
  const Notifications = useSelector(state => state.cartReducer.TotalNotifications)

  return (
    <View style={styles.main_header}>
      <View style={styles.menu_icon_title}>
        <View style={styles.menu_title_view}>
          <Text style={[styles.menu_title, styles.font_semibold]}>Checkout</Text>
        </View>
      </View>
    </View>
  )
}
