import React from "react";
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from 'react-native-vector-icons/AntDesign';
import HeaderStyle from "./header/HeaderStyle";
AntDesign.loadFont();
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

export default function CartHeader() {
  const navigation = useNavigation();
  const totalItem = useSelector(state => state.cartReducer.TotalItems)
  const Notifications = useSelector(state => state.cartReducer.TotalNotifications)

  return (    
    <View style={HeaderStyle.headerContainer}>
      <AntDesign name="arrowleft" style={{ fontSize: 30,color: '#272727',padding: 3,
    marginLeft: 10}} onPress={() => navigation.goBack()} />
      <Text style={HeaderStyle.screenName}>Cart({totalItem})</Text>
    </View>
  );

}
