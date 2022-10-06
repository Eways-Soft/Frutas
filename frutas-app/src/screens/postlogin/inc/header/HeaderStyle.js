'use strict';
import { back } from '@react-navigation/compat/lib/typescript/src/NavigationActions';
import React, { PureComponent, Component } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { Directions } from 'react-native-gesture-handler';
import { red100 } from 'react-native-paper/lib/typescript/styles/colors';
import { block } from 'react-native-reanimated';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  headerContainer:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 0,
    margin: 0,
    color:"#272727",
  },
  screenName:{
    fontSize:20,
    fontWeight: '500',
    color:"#272727",
    marginLeft:3,
  },
})

