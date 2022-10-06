import React, { useEffect, useState, useRef } from "react";
import { Text, View, TextInput, TouchableHighlight, TouchableOpacity, Image, Dimensions, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Checkbox } from 'react-native-paper';
import Icon from "react-native-vector-icons/SimpleLineIcons";
import NetInfo from "@react-native-community/netinfo";
import { useDispatch, useSelector } from 'react-redux';
Icon.loadFont();
import{ AuthContext } from '../../components/context';
import Loader from "../../components/loader/Loader";
import styles from '../../assets/css/AppDesign.js'

import Constants from '../../config/Constants';
const BASE_URL = Constants.BASE_URL
//const BASE_URL = 'https://www.pharmaffiliates.com:9090/customer/'
import { saveUserData } from '../../actions/user';

export default function Login({ route, navigation }) {
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
    } else if (Password == '') {
      seUsernameErr(true)
      setPasswordErr(false)
      return false
    } else {
      seUsernameErr(true)
      setPasswordErr(true)

      const bodyArray = {
        app: 1,
        username: Username,
        password: Password
      };

      const netStatus = await (await NetInfo.fetch()).isConnected;

      if (netStatus) {
        setisLoading(true)         
        try {   
          fetch(`${BASE_URL}login`, {
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
              /*alert('200')
              setTimeout(function(){
                setisLoading(false)
              },5000)*/
              var token = 'd16f2e80c1042003cc7240699e6730eb34a3e9c3526b76550d817556c3ac41894cf09a069e20e9048e5e4f9527587b1a8038fdcbfed7ffa423ac4f14d42b2a52866bffe36597'
              try {
                var userdata = result.data[0]; 

                await saveData(userdata);
                await AsyncStorage.setItem('test_userToken', token);
                await AsyncStorage.setItem('test_USER_DATA', JSON.stringify(result.data[0]));                
                //signIn(token)

                navigation.navigate('OTPScreen',{'phoneNumber':Username})  

              } catch (error) {
                // Error saving data
              }
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
        <View style={[styles.loginscreenhalf, styles.loginscreentop]}>
          {/* <View style={{width:'width', height:'height'}}> */}
          <Image source={require('../../assets/images/logobg.png')} style={styles.logo} />
          {/* </View> */}
        </View>
        <View style={[styles.loginscreenhalf, styles.loginscreenbottom]}>
          <Text style={[styles.page_headingtitle, styles.font_semibold2]}>WELCOME BACK</Text>
          <Text style={[styles.page_headingpara, styles.font_regular2]}>Please sign in to continue with us.</Text>
          <View style={styles.form_inputContainer}>
            {/* <Text style={[styles.labletext, styles.font_light]}>Mobile Number</Text> */}
            <Image source={require('../../assets/images/email.png')} style={styles.sign_icon} />
            <TextInput style={[styles.font_semiboldPro, styles.form_inputs, !UsernameErr ? styles.error : null]}
              placeholder="Mobile number"
              keyboardType="numeric"
              maxLength={10}
              onChangeText={text => (onChangeUserName(text))}
              underlineColorAndroid='transparent' />

          </View>

          {isLoading && <Loader />}

          <View style={styles.form_inputContainer}>
            {/* <Text style={[styles.labletext, styles.font_light]}>Password</Text> */}
            <Image source={require('../../assets/images/lock.png')} style={styles.sign_icon} />
            <TextInput style={[styles.font_semiboldPro, styles.form_inputs, !PasswordErr ? styles.error : null]}
              placeholder="Password"
              keyboardType="password"              
              secureTextEntry={isSecureEntry}
              onChangeText={text => (onChangePassword(text))}
              underlineColorAndroid='transparent' />
              <TouchableOpacity onPress={()=>{

               setisSecureEntry((prev) => !prev)
              }}>{isSecureEntry ? <Image source={require('../../assets/images/eye.png')} style={styles.eye_icon} /> : <Image source={require('../../assets/images/eye_open.png')} style={styles.eye_icon} />}
              
              </TouchableOpacity>
          </View>
         
          {isLoading && <Loader />}
          <TouchableHighlight style={[styles.buttons, styles.theme_button1]} onPress={customerLogin} underlayColor='#3a600b'><Text style={[styles.theme_button_text, styles.font_semiboldPro]}>SIGN IN</Text></TouchableHighlight>

          <View style={styles.remeber_forgot}>    
            <TouchableOpacity onPress={() => navigation.navigate('Forgotpassword')}>
              <Text style={[styles.label_forgt, styles.font_semiboldPro]}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>   

          <View style={styles.create_cont}>
            <Text style={[styles.createaccount2, styles.font_regular2]}>Not a member?  <Text style={[styles.createaccounttext, styles.font_semiboldPro]} onPress={() => navigation.navigate('Signup')}>Sign up</Text></Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );

}
