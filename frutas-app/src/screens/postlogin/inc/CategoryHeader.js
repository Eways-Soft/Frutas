import React from "react";
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from 'react-native-vector-icons/AntDesign';
import styles from '../../../assets/css/AppDesign.js'
import HeaderStyle from "./header/HeaderStyle";
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

const CategoryHeader = ({props}) => {
  const route = useRoute(); 
  const navigation = useNavigation(); 

  return (    
    <View style={HeaderStyle.headerContainer}>
      <AntDesign name="arrowleft" style={{ fontSize: 30,color: '#272727',padding: 3,
    marginLeft: 10}} onPress={() => navigation.goBack()} />
      <Text style={HeaderStyle.screenName}>{route.params.catName}</Text>
    </View>
  );
}


export default CategoryHeader