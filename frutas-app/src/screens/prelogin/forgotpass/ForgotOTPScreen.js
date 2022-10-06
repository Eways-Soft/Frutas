import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator, Dimensions } from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from '@react-native-async-storage/async-storage';

import{ AuthContext } from '../../../components/context';
import Loader from "../../../components/loader/Loader";

import { Styles } from '../Styles';
import ErrorBoundary from '../components/ErrorBoundry';
import { isAndroid } from '../utils/HelperFunctions';
import CustomText from '../components/CustomText';
import CustomTextInput from '../components/CustomTextInput';
import FullButtonComponent from '../components/FullButtonComponent';

import Constants from '../../../config/Constants';
const BASE_URL = Constants.BASE_URL

const{width, height} = Dimensions.get('window');
const ForgotOTPScreen = function ({ route: { params: { phoneNumber } }, navigation }) {
  
  const { signIn } = React.useContext(AuthContext);


  const [otpArray, setOtpArray] = useState(['', '', '', '']);
  const [submittingOtp, setSubmittingOtp] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [confirm, setConfirm] = useState(null);
  const [isLoading, setisLoading] = React.useState(false);
  const [MobNo, setMobNo] = React.useState('');

  const firstTextInputRef = useRef(null);
  const secondTextInputRef = useRef(null);
  const thirdTextInputRef = useRef(null);
  const fourthTextInputRef = useRef(null);
  const fivthTextInputRef = useRef(null);
  const sixthTextInputRef = useRef(null);

  const refCallback = textInputRef => node => {
    textInputRef.current = node;
  };

  useEffect(() => { 
    setisLoading(false)

    let list = phoneNumber
    let newn = list.substr(6, 4);
    
    setMobNo(newn)

  }, [])

  
  async function confirmCode() {
    var SampleArray = otpArray.toString();

    var finalOtp = SampleArray.replace(/,/g, '');
    
    try{

      const bodyArray = {
        app: 1,
        mobile: phoneNumber,
        code: finalOtp
      };

      const netStatus = await (await NetInfo.fetch()).isConnected;
      //navigation.navigate('Changepassword',{'phoneNumber':phoneNumber});

      if (netStatus) {
        setisLoading(true)         
         
          fetch(`${BASE_URL}prelogin/api/otp_verify`, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(bodyArray)
          }).then(function (response) {
            return response.json();
          }).then(async function (result) {  
            setisLoading(false)
            if (result.CODE === 200) {
              
              navigation.navigate('Changepassword',{'phoneNumber':phoneNumber});

            }else{
              alert(result.error)
            }
          })
      }else{
        alert('Internet connection is Weak.')
      }
      
    } catch(e){  

      alert(JSON.stringify(e));
    }
  }
  
  const onOtpChange = index => {
    
    return value => {
      if (isNaN(Number(value))) {
        return;
      }

      const otpArrayCopy = otpArray.concat();
      
      otpArrayCopy[index] = value;
      setOtpArray(otpArrayCopy);
      if (value !== '') {
        if (index === 0) {
          secondTextInputRef.current.focus();
        } else if (index === 1) {
          thirdTextInputRef.current.focus();
        } else if (index === 2) {
          fourthTextInputRef.current.focus();
        } else if (index === 3) {
          fivthTextInputRef.current.focus();
        } else if (index === 4) {
          sixthTextInputRef.current.focus();
          setSubmittingOtp(false);
        }
      }
    };
  };

  const onOtpKeyPress = index => {
    return ({ nativeEvent: { key: value } }) => {
      if (value === 'Backspace' && otpArray[index] === '') {
        if (index === 1) {
          firstTextInputRef.current.focus();
        } else if (index === 2) {
          secondTextInputRef.current.focus();
        } else if (index === 3) {
          thirdTextInputRef.current.focus();
        } else if (index === 4) {
          fourthTextInputRef.current.focus();
        } else if (index === 5) {
          fivthTextInputRef.current.focus();
        }
        if (isAndroid && index > 0) {
          const otpArrayCopy = otpArray.concat();
          otpArrayCopy[index - 1] = '';
          setOtpArray(otpArrayCopy);
        }
      }
    };
  };

  return (
    <ErrorBoundary screenName={'OTPScreen'}>
      <View style={styles.container}>
      <View style={styles.text_cont}>
        <CustomText style={styles.container_otp}>
          Enter OTP sent to your mobile number
        </CustomText>
        <CustomText style={styles.container_otpnum}>
          {'xxxxxx' + MobNo}
        </CustomText>
      </View>
        <View style={[Styles.row, Styles.mt12]}>
          {[
            firstTextInputRef,
            secondTextInputRef,
            thirdTextInputRef,
            fourthTextInputRef,
            fivthTextInputRef,
            sixthTextInputRef,
          ].map((textInputRef, index) => (
            <CustomTextInput
              containerStyle={[Styles.fill, Styles.mr12]}
              value={otpArray[index]}
              onKeyPress={onOtpKeyPress(index)}
              onChangeText={onOtpChange(index)}
              keyboardType={'numeric'}
              maxLength={1}
              style={[styles.otpText, Styles.centerAlignedText]}
              autoFocus={index === 0 ? true : undefined}
              refCallback={refCallback(textInputRef)}
              key={index}
            />
          ))}
        </View>
        {errorMessage ? (
          <CustomText
            style={[
              Styles.negativeText,
              Styles.mt12,
              Styles.centerAlignedText,
            ]}>
            {errorMessage}
          </CustomText>
        ) : null}

        {isLoading && <Loader />}

        <FullButtonComponent
          type={'fill'}
          text={'Submit'}
          textStyle={styles.submitButtonText}
          buttonStyle={styles.mt24}
          onPress={() => confirmCode()}
          disabled={submittingOtp}
        />
      </View>
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  container: {
    // marginHorizontal:width/25,
    paddingLeft:width/25,
    flex: 1,
    alignItems: 'center',
    paddingTop: 130,
    width:width / 1 ,
    backgroundColor: '#faf8ec',
  },
  text_cont:{
    alignItems:'center',
    marginBottom:height / 20,
  },
  submitButtonText: {
    color: '#fff',
    fontFamily: 'Mark Simonson - Proxima Nova Semibold',
    fontSize:height / 48,
    paddingVertical:3,
    letterSpacing:0.4
  },
  mt24:{
    backgroundColor:'#558120',
    marginBottom:15,
    width:width / 1 - 32,
    marginLeft:-2,
    marginTop:height/20,
    borderRadius:50,
  },
  otpText: {
    color: '#558120',
    fontSize: 18,
    width:'100%',
  },
  container_otp:{
    fontFamily: 'ProximaNovaRegular',
    fontSize: 18
  },
  container_otpnum:{
    fontFamily: 'Mark Simonson - Proxima Nova Semibold',
    fontSize: 18
  },
});

export default ForgotOTPScreen;