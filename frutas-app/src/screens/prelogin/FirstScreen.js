import React, { Component } from 'react';
import Icon from "react-native-vector-icons/SimpleLineIcons";
Icon.loadFont();
import {Text,View,TouchableHighlight,Image,Dimensions} from 'react-native';
import styles from '../../assets/css/AppDesign.js'

const{width, height} = Dimensions.get('window');
export default class FirstScreen extends Component {

  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    return (
      <View style={{ width: width, height: height }}>
        
        <View style={[styles.firstscreenhalf, styles.firstscreentop]}>
          <Image source={require('../../assets/images/getstarted.png')} style={styles.background_img} />  
          
          <Image source={require('../../assets/images/logobg.png')} style={styles.logo2} />  
        </View>
        <View style={[styles.firstscreenhalf, styles.firstscreenbottom]}> 
         <View style={[styles.firstscreen_text]}> 
            <Text style={[styles.headingtitle_first, styles.font_semibold2]}>WELCOME!</Text>
            <Text style={[styles.center, styles.para_text, styles.centertext, styles.font_regular2]}>Because you deserve to eat fresh and Get a healthy meal for every one</Text>
         </View>
            <TouchableHighlight style={[styles.themebtn, styles.btnColor1, styles.buttons]} underlayColor='#3a600b' onPress={() => this.props.navigation.push('SignIn')}><Text style={[styles.theme_button_text, styles.theme_button_color1, styles.font_semiboldPro]}>SIGN IN</Text></TouchableHighlight>
            <TouchableHighlight style={[styles.themebtn, styles.btnColor2, styles.buttons]} underlayColor='#f5f5f5' onPress={() => this.props.navigation.push('Signup')} ><Text style={[styles.theme_button_text, styles.theme_button_color2, styles.font_semiboldPro]}>SIGN UP</Text></TouchableHighlight>
        </View>
      </View>
    );
  }
}

