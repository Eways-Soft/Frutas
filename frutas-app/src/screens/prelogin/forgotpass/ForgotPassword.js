import React, { useEffect, useState, useRef } from "react";
import { Text, View, TextInput, TouchableHighlight, TouchableOpacity, Image, Dimensions, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Checkbox } from 'react-native-paper';
import Icon from "react-native-vector-icons/SimpleLineIcons";
import NetInfo from "@react-native-community/netinfo";
import { useDispatch, useSelector } from 'react-redux';
Icon.loadFont();
import{ AuthContext } from '../../../components/context';
import Loader from "../../../components/loader/Loader";
import styles from '../../../assets/css/AppDesign.js'

import Constants from '../../../config/Constants';
const BASE_URL = Constants.BASE_URL
//const BASE_URL = 'https://www.pharmaffiliates.com:9090/customer/'
import { saveUserData } from '../../../actions/user';

export default function ForgotPassword({ route, navigation }) {
  const [checked, setChecked] = React.useState(false);
  const dispatch = useDispatch()
  const { signIn } = React.useContext(AuthContext);

  const [isLoading, setisLoading] = React.useState(false);
  const [Username, seUsername] = useState('');
  const [Password, setPassword] = useState('');
  const [UsernameErr, seUsernameErr] = useState(true);
  const [PasswordErr, setPasswordErr] = useState(true);
  const [isSecureEntry, setisSecureEntry] = useState(true);
  const saveData = (userdata) => dispatch(saveUserData(userdata))
  const{width, height} = Dimensions.get('window');
  useEffect(() => {
    //console.log('useEffect');
  }, [])

  const customerLogin = async () => {


    //async function customerLogin(){
    if (Username == '') {
      seUsernameErr(false)
      setPasswordErr(false)
      return false
    } else {
      seUsernameErr(true)
      setPasswordErr(true)

      const bodyArray = {
        app: 1,
        username: Username,
      };

      const netStatus = await (await NetInfo.fetch()).isConnected;

      //navigation.navigate('Forgotpasswordotp',{'phoneNumber':Username})

      if (netStatus) {
        setisLoading(true)   
  
        try { 
          fetch(`${BASE_URL}prelogin/api/forgotpassword`, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(bodyArray)
          }).then(function (response) {
            return response.json();
          }).then(async function (result) {                
            var code = result.CODE;
            setisLoading(false)
            if (code === 200) {       

              navigation.navigate('Forgotpasswordotp',{'phoneNumber':Username})

            } else {
              
              setisLoading(false)
              if(code === 201){
                alert(result.error)
              }else{
                alert('Login failed')
              }
                
            }
          }).catch(function (error) {
            setisLoading(false)
            alert(error)
            //console.log('error ', error);
          });
        } catch (e) {
          setisLoading(false)
          //console.log('RequestService call catch ', ` ${e}`);
        }
      }else{
        setisLoading(false)
        alert('Internet Connection is Weak');
      }
    }
  }

  function onChangeUserName(text) {
    seUsername(text)
  }

  function onChangePassword(text) {
    setPassword(text)
  }

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={{ flexGrow: 1 }}>
      <View style={[styles.loginscreen, styles.bg_yellow]}>
        <View style={[styles.loginscreenhalf, styles.loginscreentopOtp]}>
          {/* <View style={{width:'width', height:'height'}}> */}
            <Image source={require('../../../assets/images/logobg.png')} style={styles.logo} />
          {/* </View> */}
        </View>
        <View style={[styles.loginscreenhalf, styles.loginscreenbottom]}>
          <Text style={[styles.page_headingotp, styles.font_semibold2]}>MOBILE VERIFICATION</Text>
          <Text style={[styles.page_headingparaotp, styles.font_regular2]}>Please enter your mobile number to verify your account</Text>
          <View style={styles.form_inputContainer}>
            {/* <Text style={[styles.labletext, styles.font_light]}>Mobile Number</Text> */}
            
            <TextInput style={[styles.font_semiboldPro, styles.form_inputs, !UsernameErr ? styles.error : null]}
              placeholder="Mobile number"
              keyboardType="numeric"
              maxLength={10}
              onChangeText={text => (onChangeUserName(text))}
              underlineColorAndroid='transparent' />

          </View>

          {isLoading && <Loader />}

          
          {isLoading && <Loader />}
          <TouchableHighlight style={[styles.buttons, styles.theme_button1]} onPress={customerLogin} underlayColor='#3a600b'><Text style={[styles.theme_button_text, styles.font_semiboldPro]}>SUBMIT</Text></TouchableHighlight>

          <View style={styles.remeber_forgot}>
            
            <View>
              <Text style={[styles.createaccount1Otp, styles.font_regular2]}>Already a member?  <Text style={[styles.createaccounttext, styles.font_semiboldPro]} onPress={() => navigation.navigate('SignIn')}>Sign In</Text></Text>
            </View>
          </View>   
          
          <View style={styles.or_text}>
            <Text style={styles.text_Opt}>
            OR
            </Text>
          </View>    

          <View style={styles.create_contOpt}>
            <Text style={[styles.createaccount2, styles.font_regular2]}>Not a member?  <Text style={[styles.createaccounttext, styles.font_semiboldPro]} onPress={() => navigation.navigate('Signup')}>Sign up</Text></Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );

}
