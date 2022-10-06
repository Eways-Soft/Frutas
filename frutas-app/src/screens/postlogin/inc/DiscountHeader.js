import React from "react";
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from "react-native-vector-icons/Ionicons";
import styles from '../../../assets/css/AppDesign.js'
Ionicons.loadFont();
import { useNavigation,useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

function MyComponent(props) {

  const navigation = useNavigation();   
  const totalItem = useSelector(state => state.cartReducer.TotalItems)

  return (
    <View>
      <Text style={[styles.counting, styles.font_semibold]}>{totalItem}</Text>
      <Ionicons name="cart-outline" style={styles.header_icons} />
    </View>
  );
}

const DiscountHeader = ({props}) => {
  const route = useRoute(); 
  const navigation = useNavigation(); 

  return (
    <View style={styles.main_header}>

      <View style={styles.menu_icon_title}>
        <View style={styles.menu_title_view}>
          <Text style={[styles.menu_title, styles.font_semibold]}>Discount</Text>
        </View>
      </View>


    </View>
  )
}


export default DiscountHeader