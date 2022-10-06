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

const ViewAllHeader = ({props}) => {
  const route = useRoute(); 
  const navigation = useNavigation(); 

  return (    
    <View style={HeaderStyle.headerContainer}>
      <AntDesign name="arrowleft" style={{ fontSize: 30,color: '#272727',padding: 3,
    marginLeft: 10}} onPress={() => navigation.goBack()} />
      <Text style={HeaderStyle.screenName}>{route.params.title_text}</Text>
    </View>
  );
}


export default ViewAllHeader