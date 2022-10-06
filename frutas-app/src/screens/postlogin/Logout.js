import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight,
  Image,
  Alert,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  CheckBox,
  ScrollView,
  Button,
} from 'react-native'; 

import AsyncStorage from '@react-native-async-storage/async-storage';

import { AuthContext } from "../context";

export default function Logout({ route, navigation }) {
  const { signOut } = React.useContext(AuthContext);
  
  return (
      <View>
        <Button title="Sign Out" onPress={() => signOut()} />
      </View>
    );
}