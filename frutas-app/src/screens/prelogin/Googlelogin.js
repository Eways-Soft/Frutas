import React, {useEffect, useState} from 'react';
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

/*import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';*/

import AsyncStorage from '@react-native-async-storage/async-storage';

import Icon from "react-native-vector-icons/SimpleLineIcons";
import NetInfo from "@react-native-community/netinfo";
Icon.loadFont();

import { Picker } from '@react-native-picker/picker';
import styles from '../../assets/css/AppDesign.js'
import Constants from '../../config/Constants';
import { useDispatch, useSelector } from 'react-redux';
import{ AuthContext } from '../../components/context';
import { saveUserData } from '../../actions/user';

const BASE_URL = Constants.BASE_URL

const Googlelogin = ({ route, navigation }) => {
  const dispatch = useDispatch()
  const { signIn } = React.useContext(AuthContext);

  const [user, setUser] = useState({})
  const saveData = (userdata) => dispatch(saveUserData(userdata))

  useEffect(() => {     
    GoogleSignin.configure({
      scopes: ['email'],
      webClientId: "29412120575-737maabcrvdg60m8ugatvet5guujdccg.apps.googleusercontent.com",
      offlineAccess: true,      
    })

    //isSignedIn()
    signInGoogle()
  }, [])

  const signInGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      var bodyArray = {
          app: 1,
          email: userInfo.user.email,
        };        

        fetch(`${BASE_URL}googleemailexists`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(bodyArray)
        }).then(function (response) {
          return response.json();
        }).then(async function (result) {
          console.log(result)

          if (result.CODE == '200') {
            //alert('Signup successfully !..')
            var userdata = result.data[0]; 
          
            var token = 'd16f2e80c1042003cc7240699e6730eb34a3e9c3526b76550d817556c3ac41894cf09a069e20e9048e5e4f9527587b1a8038fdcbfed7ffa423ac4f14d42b2a52866bffe36597'

            await saveData(userdata);
            await AsyncStorage.setItem('userToken', token);
            await AsyncStorage.setItem('USER_DATA', JSON.stringify(result.data[0]));

            signIn(token) 

          } else {
            navigation.navigate('UpdateSocialDetail',{'email':userInfo.user.email,'name':userInfo.user.name,'userdata':userInfo.user});
          }
        }).catch(function (error) {
          console.log('error ', error);
        });          

      //console.log('userInfo :',userInfo.user.name)
      //setUser(userInfo)
    } catch (error) {

      console.log('Message', error.message);

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User Cancelled the Login Flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Signing In');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play Services Not Available or Outdated');
      } else {
        console.log('Some Other Error Happened');
      }
    }
  };

  const getCustomerDataByEmail = async () => {
    const netStatus = await (await NetInfo.fetch()).isConnected;

    if (netStatus) {
      try {
        const bodyArray = {
          app: 1,
          email: Email,
        };

        //console.log(bodyArray)

        fetch(`${BASE_URL}googleemailexists`, {
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
  }


  const isSignedIn = async () => {
    /*const isSignedIn = await GoogleSignin.isSignedIn();
    if (!!isSignedIn) {
      getCurrentUserInfo()
    } else {
      console.log('Please Login')
    }*/
  };

  const getCurrentUserInfo = async () => {
    try {
      const userInfo = await GoogleSignin.signInSilently();
      setUser(userInfo);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_REQUIRED) {
        alert('User has not signed in yet');
        console.log('User has not signed in yet');
      } else {
        alert("Something went wrong. Unable to get user's info");
        console.log("Something went wrong. Unable to get user's info");
      }
    }
  };

  const signOut = async () => {
    /*try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      setUser({}); // Remember to remove the user from your app's state as well
    } catch (error) {
      console.error(error);
    }*/
  };

  // signOut()
  return (
      <View style={{flex: 1,justifyContent: 'center',alignItems: 'center',}}>
        {!user.idToken ? 
          
          <View>
            <Text>Loading ...</Text>
          </View>
           :

            <TouchableOpacity onPress={signOut}>
              <Text>Logout</Text>
              <Text>user name : {user.name}</Text>
              <Text>Logout</Text>
            </TouchableOpacity>
        }
      </View>
    )
}

export default Googlelogin;