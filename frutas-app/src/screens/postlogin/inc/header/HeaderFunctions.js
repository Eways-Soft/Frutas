import React, { useEffect } from 'react';
import {
  Text,
  View,
  Image, ActivityIndicator, Dimensions
} from 'react-native';

import Animated from 'react-native-reanimated';

import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { useDispatch, useSelector } from 'react-redux';

import { AuthContext } from "./src/components/context";

import { Provider } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const{width, height} = Dimensions.get('window');

 function SignInHeaderTitle() {
  const navigation = useNavigation();
  return (    
    <View style={HeaderStyle.headerContainer}>
      <AntDesign name="arrowleft" style={{ fontSize: 30,color: '#272727',padding: 3,
    marginLeft: 10}} onPress={() => navigation.goBack()} />
      <Text style={HeaderStyle.screenName}>Sign In</Text>
    </View>
  );
}

 function LoginOTPHeaderTitle() {
  const navigation = useNavigation();
  return (    
    <View style={HeaderStyle.headerContainer}>
      <AntDesign name="arrowleft" style={{ fontSize: 30,color: '#272727',padding: 3,
    marginLeft: 10}} onPress={() => navigation.goBack()} />
      <Text style={HeaderStyle.screenName}>Verify OTP</Text>
    </View>
  );
}

 function SignUpHeaderTitle() {
  const navigation = useNavigation();
  return (    
    <View style={HeaderStyle.headerContainer}>
      <AntDesign name="arrowleft" style={{ fontSize: 30,color: '#272727',padding: 3,
    marginLeft: 10}} onPress={() => navigation.goBack()} />
      <Text style={HeaderStyle.screenName}>Sign Up</Text>
    </View>
  );
}

 function ForgotPassHeaderTitle() {
  const navigation = useNavigation();
  return (    
    <View style={HeaderStyle.headerContainer}>
      <AntDesign name="arrowleft" style={{ fontSize: 30,color: '#272727',padding: 3,
    marginLeft: 10}} onPress={() => navigation.goBack()} />
      <Text style={HeaderStyle.screenName}>Forgot Password</Text>
    </View>
  );
}

 function ForgotOTPHeaderTitle() {
  const navigation = useNavigation();
  return (    
    <View style={HeaderStyle.headerContainer}>
      <AntDesign name="arrowleft" style={{ fontSize: 30,color: '#272727',padding: 3,
    marginLeft: 10}} onPress={() => navigation.goBack()} />
      <Text style={HeaderStyle.screenName}>Verify OTP</Text>
    </View>
  );
}

  function ResetPassHeaderTitle() {
    const navigation = useNavigation();
    return (    
      <View style={HeaderStyle.headerContainer}>
        <AntDesign name="arrowleft" style={{ fontSize: 30,color: '#272727',padding: 3,
      marginLeft: 10}} onPress={() => navigation.goBack()} />
        <Text style={HeaderStyle.screenName}>Reset Password</Text>
      </View>
    );
  }

  export function MainCategoryHeaderTitle() {
    const navigation = useNavigation();
    return (    
      <View style={HeaderStyle.headerContainer}>
        <AntDesign name="arrowleft" style={{ fontSize: 30,color: '#272727',padding: 3,
      marginLeft: 10}} onPress={() => navigation.goBack()} />
        <Text style={HeaderStyle.screenName}>Reset Password</Text>
      </View>
    );
  }