import React, { useEffect, useState, useRef } from "react";
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

import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from "react-native-vector-icons/SimpleLineIcons";
Icon.loadFont();
import { Picker } from '@react-native-picker/picker';
import { useDispatch, useSelector } from 'react-redux';
import{ AuthContext } from '../../components/context';
import { saveUserData } from '../../actions/user';

import styles from '../../assets/css/AppDesign.js'
import Constants from '../../config/Constants';
const BASE_URL = Constants.BASE_URL

//const BASE_URL = 'https://www.pharmaffiliates.com:9090/customer/'

export default function UpdateSocialDetail({ route, navigation }) {
  const dispatch = useDispatch()
  const { signIn } = React.useContext(AuthContext);
  const [isLoading, setisLoading] = React.useState(false);
  const [Cities, seCities] = useState([]);
  const [selectedValue, setSelectedValue] = useState("java");

  const [Fname, setFname] = useState(route.params.name);
  const [Email, setEmail] = useState(route.params.email);
  const [Uname, setUname] = useState('');
  const [City, setCity] = useState('');
  const [FnameErr, seFnameErr] = useState(true);
  const [UnameErr, seUnameErr] = useState(true);
  const [CityErr, seCityErr] = useState(true);
  const [isSecureEntry, setisSecureEntry] = useState(true);
  const [isSecureConEntry, setisSecureConEntry] = useState(true);
  const [ValidationErr, setValidationErr] = useState(false);
  const{width, height} = Dimensions.get('window');

  const saveData = (userdata) => dispatch(saveUserData(userdata))

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

    if (Fname != '', Uname != '', City != '') {

      const netStatus = await (await NetInfo.fetch()).isConnected;

      if (netStatus) {
        try {

          const bodyArray = {
            app: 1,
            fullname: Fname,
            username: Uname,
            city: City,
            email: Email,
          };

          //console.log(bodyArray)

          fetch(`${BASE_URL}updategoogleuserdetail`, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(bodyArray)
          }).then(function (response) {
            return response.json();
          }).then(async function (result) {

            if (result.CODE == '200') {
              //alert('Signup successfully !..')
              var userdata = result.data[0]; 
              console.log(result)
            
              var token = 'd16f2e80c1042003cc7240699e6730eb34a3e9c3526b76550d817556c3ac41894cf09a069e20e9048e5e4f9527587b1a8038fdcbfed7ffa423ac4f14d42b2a52866bffe36597'

              await saveData(userdata);
              await AsyncStorage.setItem('userToken', token);
              await AsyncStorage.setItem('USER_DATA', JSON.stringify(result.data[0]));

              signIn(token) 

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
          <Text style={[styles.page_headingtitle2, styles.font_semibold]}>UPDATE DETAIL</Text>
          <Text style={[styles.page_btmtitle, styles.font_regular2]}>Please enter detail to join us</Text>
          </View>
        </View>



        <View style={[styles.signupscreenhalf, styles.signupscreenbottom]}>
          <View style={styles.form_inputContainer2}>
            <Image source={require('../../assets/images/user.png')} style={styles.sign_icon} />
            <TextInput style={[styles.font_semiboldPro, styles.form_input, !FnameErr ? styles.error : null]}
              placeholder="Full Name"
              keyboardType="default"
              value={Fname}
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

          
          <TouchableHighlight style={[styles.buttons, styles.theme_button2]} underlayColor='#3a600b' onPress={onSubmit}>
            <Text style={[styles.theme_button_text, styles.font_semiboldPro]}>Update</Text>
          </TouchableHighlight>

        </View>
      </View>
    </ScrollView>
  );

}

