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

const ForgotPassword = function ({ route: { params: { phoneNumber } }, navigation }) {

  const [checked, setChecked] = React.useState(false);
  const dispatch = useDispatch()
  const { signIn } = React.useContext(AuthContext);

  const [isLoading, setisLoading] = React.useState(false);
  const [Password, sePassword] = useState('');
  const [CPassword, setCPassword] = useState('');
  const [UsernameErr, seUsernameErr] = useState(true);
  const [PasswordErr, setPasswordErr] = useState(true);
  const [isSecureEntry, setisSecureEntry] = useState(true);
  const [isSecureEntry2, setisSecureEntry2] = useState(true);
  const saveData = (userdata) => dispatch(saveUserData(userdata))
  const{width, height} = Dimensions.get('window');
  useEffect(() => {
    //console.log('useEffect');
  }, [])

  const customerLogin = async () => {

    //async function customerLogin(){
    if (Password == '') {
      alert('Password is required.');
      return false
    } else if (CPassword == '') {
      alert('Confirm password is required.');
      return false
    }else if (CPassword != Password) {
      alert('Password does not match.');
      return false
    } else {

      setisLoading(true)

      const bodyArray = {
        app: 1,
        username: phoneNumber,
        password: Password
      };

      const netStatus = await (await NetInfo.fetch()).isConnected;

      //alert('Password updated successfully.');

      navigation.navigate('SignIn')

      if (netStatus) {
        setisLoading(true)         
        try {    

          fetch(`${BASE_URL}prelogin/api/updatepassword`, {
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

              alert(result.message)

              navigation.navigate('SignIn')

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

  function onChangePassword(text) {
    sePassword(text)
  }

  function onChangeCPassword(text) {
    setCPassword(text)
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
          <Text style={[styles.page_headingotp, styles.font_semibold2]}>RESET PASSWORD</Text>
          <Text style={[styles.page_headingparaotp, styles.font_regular2]}>Please choose your new password </Text>
          

          <View style={styles.form_inputContainer}>
            {/* <Text style={[styles.labletext, styles.font_light]}>Password</Text> */}
            <Image source={require('../../../assets/images/lock.png')} style={styles.sign_icon} />
            <TextInput style={[styles.font_semiboldPro, styles.form_inputs, !PasswordErr ? styles.error : null]}
              placeholder="New Password"
              keyboardType="password"              
              secureTextEntry={isSecureEntry}
              onChangeText={text => (onChangePassword(text))}
              underlineColorAndroid='transparent' />
              <TouchableOpacity onPress={()=>{

               setisSecureEntry((prev) => !prev)
              }}>{isSecureEntry ? <Image source={require('../../../assets/images/eye.png')} style={styles.eye_icon} /> : <Image source={require('../../../assets/images/eye_open.png')} style={styles.eye_icon} />}
              
              </TouchableOpacity>
          </View>


          {isLoading && <Loader />}

          <View style={styles.form_inputContainer}>
            {/* <Text style={[styles.labletext, styles.font_light]}>Password</Text> */}
            <Image source={require('../../../assets/images/lock.png')} style={styles.sign_icon} />
            <TextInput style={[styles.font_semiboldPro, styles.form_inputs, !PasswordErr ? styles.error : null]}
              placeholder="Confirm Password"
              keyboardType="password"              
              secureTextEntry={isSecureEntry2}
              onChangeText={text => (onChangeCPassword(text))}
              underlineColorAndroid='transparent' />
              <TouchableOpacity onPress={()=>{

               setisSecureEntry2((prev) => !prev)
              }}>{isSecureEntry2 ? <Image source={require('../../../assets/images/eye.png')} style={styles.eye_icon} /> : <Image source={require('../../../assets/images/eye_open.png')} style={styles.eye_icon} />}
              
              </TouchableOpacity>
          </View>
          
          <TouchableHighlight style={[styles.buttons, styles.theme_button1]} onPress={customerLogin} underlayColor='#3a600b'><Text style={[styles.theme_button_text, styles.font_semiboldPro]}>SUBMIT</Text></TouchableHighlight>

          <View style={styles.remeber_forgot}>
            
              <Text style={[styles.createaccount1Otp, styles.font_regular2]}>Already a member?  <Text style={[styles.createaccounttext, styles.font_semiboldPro]} onPress={() => navigation.navigate('SignIn')}>Sign In</Text></Text>
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



export default ForgotPassword;