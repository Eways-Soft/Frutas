import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  Dimensions,
  ScrollView,
  TextInput
} from 'react-native';

import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';

import styles from '../../../assets/css/AppDesign.js'

function NoData() {
  const navigation = useNavigation();

  useEffect(() => {

  }, [])

  return (
          
    <View style={styles.notfound}>
      <View style={styles.notfWrap}>
        <Image style={styles.notficon} source={require('../../../assets/images/notfound.png')} />

        <View style={styles.notfText}>
          <Text style={[styles.notfoundtext, styles.font_semiboldPro]}>Oops..!</Text>
        </View>
        <View style={styles.notfText2}>
          <Text style={[styles.notfoundtext2, styles.font_semiboldPro]}>No Basket To Show</Text>
        </View>
        <View style={styles.btndatafound}>
          <TouchableOpacity style={styles.noData} underlayColor='#558120' onPress={()=> navigation.goBack() }>         
            <Text style={[styles.btnNotfoundtext, styles.font_semiboldPro]}>Go Back</Text>          
          </TouchableOpacity>
        </View>          
      </View>
    </View>
           
  )
};


export default NoData