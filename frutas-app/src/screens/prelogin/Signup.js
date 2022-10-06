import React, { useEffect, useState, useRef } from "react";
import Icon from "react-native-vector-icons/SimpleLineIcons";
import NetInfo from "@react-native-community/netinfo";
Icon.loadFont();
import {
  Text,
  View,
  TextInput,
  TouchableHighlight,
  ScrollView,
  Image,
  TouchableOpacity, 
  Dimensions
} from 'react-native';

import { Picker } from '@react-native-picker/picker';
import styles from '../../assets/css/AppDesign.js'
import Constants from '../../config/Constants';
const BASE_URL = Constants.BASE_URL

//const BASE_URL = 'https://www.pharmaffiliates.com:9090/customer/'

export default function Signup({ route, navigation }) {
  const [isLoading, setisLoading] = React.useState(false);
  const [Cities, seCities] = useState([]);
  const [selectedValue, setSelectedValue] = useState("java");

  const [Fname, setFname] = useState('');
  const [Uname, setUname] = useState('');
  const [City, setCity] = useState('');
  const [Password, setPassword] = useState('');
  const [CPassword, setCPassword] = useState('');
  const [FnameErr, seFnameErr] = useState(true);
  const [UnameErr, seUnameErr] = useState(true);
  const [CityErr, seCityErr] = useState(true);
  const [PasswordErr, setPasswordErr] = useState(true);
  const [CPasswordErr, setCPasswordErr] = useState(true);
  const [isSecureEntry, setisSecureEntry] = useState(true);
  const [isSecureConEntry, setisSecureConEntry] = useState(true);
  const [ValidationErr, setValidationErr] = useState(false);
  const{width, height} = Dimensions.get('window');

  useEffect(() => {
    fetch(`${BASE_URL}getcity`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(function (response) {
      return response.json();
    }).then(function (result) {
      console.log(result.data)
      if (result.CODE === 200) {
        let serviceItems = result.data.map((val, i) => {
          return <Picker.Item key={i} value={val.city_id} label={val.city_name} />
        });

        seCities(serviceItems)
      } else {
        console.log('! 200')
        //alert('Something went wrong !.')
      }
    }).catch(function (error) {
      console.log('error ', error);
    });
  }, [])

  const onSubmit = async () => {
    //console.log(Uname.toString().length);return false;
    if (Fname == '') {
      seFnameErr(false)
      alert('Full Name is required.')
      return false
    } else {
      seFnameErr(true)
    }
    if (Uname == '' || Uname.toString().length < 10) {
      alert('Please enter 10 disit mobile number')
      seUnameErr(false)
      return false
    } else {
      seUnameErr(true)
    }
    /*if (City == '') {
      seCityErr(false)
      return false     
    }else {
      seCityErr(true)
    } */
    if (Password == '') {
      alert('Please enter password')
      setPasswordErr(false)
      return false
    } else {
      setPasswordErr(true)
    }
    if (CPassword == '') {
      alert('Please enter confirm password')
      setCPasswordErr(false)
      return false
    } else {
      setCPasswordErr(true)
    }

    if (CPassword != Password) {
      setCPasswordErr(false)
      alert('Confirm password does not match with password')
      return false
    } else {
      setCPasswordErr(true)
    }

    if (Fname != '', Uname != '', City != '', Password != '', CPassword != '') {
      const netStatus = await (await NetInfo.fetch()).isConnected;
      if (netStatus) {
        try {
          const bodyArray = {
            app: 1,
            fullname: Fname,
            username: Uname,
            city: City,
            password: Password
          };

          fetch(`${BASE_URL}signup`, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(bodyArray)
          }).then(function (response) {
            return response.json();
          }).then(function (result) {

            if (result.CODE == '200') {
              alert('Signup successfully !..')
              setTimeout(function () {
                navigation.navigate('SignIn')
              }, 3000)

            } else {
              alert(result.error)
            }
          }).catch(function (error) {
            console.log('error ', error);
          });
        } catch (e) {
          console.log('RequestService call catch ', ` ${e}`);
        }
      } else {
        console.log('Fail')
      }
    } else {
      console.log('Validate false')
    }
  }

  const pickerRef = useRef();

  function open() {
    pickerRef.current.focus();
  }

  function close() {
    pickerRef.current.blur();
  }

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={{ flexGrow: 1 }}>

      <View style={styles.signupscreen}>
        <View style={[styles.signupscreenhalf, styles.signupscreentop]}>
          <View style={[styles.loginscreenhalf, styles.signupscreentop2]}>
            <Image source={require('../../assets/images/logobg.png')} style={styles.logo} />
          </View>
          <View style={styles.textWrapper}>
          <Text style={[styles.page_headingtitle2, styles.font_semibold2]}>CREATE ACCOUNT</Text>
          <Text style={[styles.page_btmtitle, styles.font_regular2]}>Please sign up to join us</Text>
          </View>
        </View>



        <View style={[styles.signupscreenhalf, styles.signupscreenbottom]}>
          <View style={styles.form_inputContainer2}>
            <Image source={require('../../assets/images/user.png')} style={styles.sign_icon} />
            <TextInput style={[styles.font_semiboldPro, styles.form_input, !FnameErr ? styles.error : null]}
              placeholder="Full Name"
              keyboardType="default"
              onChangeText={text => setFname(text)}
              underlineColorAndroid='transparent' />
          </View>
          <View style={styles.form_inputContainer2}>
            <Image source={require('../../assets/images/email.png')} style={styles.sign_icon} />
            <TextInput style={[styles.font_semiboldPro, styles.form_input, !UnameErr ? styles.error : null]}
              placeholder="Mobile Number"
              keyboardType="numeric"
              maxLength={10}
              onChangeText={text => setUname(text)}
              underlineColorAndroid='transparent' />
          </View>

          <View style={styles.form_inputContainer2}>
            <Image source={require('../../assets/images/bulding.png')} style={styles.sign_icon} />
            <View style={[styles.select_inputs, !CityErr ? styles.error : null]}>
              <Picker
                style={[styles.font_regular2, styles.select_inputs]}
                ref={pickerRef}
                selectedValue={City}
                onValueChange={(itemValue, itemIndex) =>
                  setCity(itemValue)
                }>

                {Cities}

              </Picker>
            </View>
          </View>

          <View style={styles.form_inputContainer2}>
            <Image source={require('../../assets/images/lock.png')} style={styles.sign_icon} />
            <TextInput style={[styles.font_semiboldPro, styles.form_input, !PasswordErr ? styles.error : null]}
              placeholder="Password"
              autoCompleteType="password"
              secureTextEntry={isSecureEntry}
              onChangeText={text => setPassword(text)}
              underlineColorAndroid='transparent' />
            <TouchableOpacity onPress={() => {

              setisSecureEntry((prev) => !prev)
            }}>{isSecureEntry ? <Image source={require('../../assets/images/eye.png')} style={styles.eye_icon} /> : <Image source={require('../../assets/images/eye_open.png')} style={styles.eye_icon} />}

            </TouchableOpacity>
          </View>
          <View style={styles.form_inputContainer2}>
            <Image source={require('../../assets/images/lock.png')} style={styles.sign_icon} />
            <TextInput style={[styles.font_semiboldPro, styles.form_input, !CPasswordErr ? styles.error : null]}
              placeholder="Confirm Password"
              secureTextEntry={isSecureConEntry}
              onChangeText={text => setCPassword(text)}
              underlineColorAndroid='transparent' />
            <TouchableOpacity onPress={() => {

              setisSecureConEntry((prev) => !prev)
            }}>{isSecureConEntry ? <Image source={require('../../assets/images/eye.png')} style={styles.eye_icon} /> : <Image source={require('../../assets/images/eye_open.png')} style={styles.eye_icon} />}

            </TouchableOpacity>
          </View>
          <TouchableHighlight style={[styles.buttons, styles.theme_button2]} underlayColor='#3a600b' onPress={onSubmit}><Text style={[styles.theme_button_text, styles.font_semiboldPro]}>CREATE</Text></TouchableHighlight>
          <View>

            <Text style={[styles.createaccount1, styles.font_regular2]}>Already a member?  <Text style={[styles.createaccounttext, styles.font_semiboldPro]} onPress={() => navigation.navigate('SignIn')}>Sign In</Text></Text>

          </View>
        </View>
      </View>
    </ScrollView>
  );

}

