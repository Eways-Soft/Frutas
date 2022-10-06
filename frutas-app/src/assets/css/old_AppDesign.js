'use strict';
import { back } from '@react-navigation/compat/lib/typescript/src/NavigationActions';
import React, { PureComponent, Component } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { Directions } from 'react-native-gesture-handler';
import { red100 } from 'react-native-paper/lib/typescript/styles/colors';
import { block } from 'react-native-reanimated';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const{width, height} = Dimensions.get('window');

export default StyleSheet.create({
  font_light: {
    fontFamily: 'Poppins-Light'
  },
  font_light2: {
    fontFamily: 'Poppins-Light'
  },
  font_regular: {
    fontFamily: 'Poppins-Regular'
  },
  font_regular2: {
    fontFamily: 'ProximaNovaRegular'
  },
  font_medium: {
    fontFamily: 'KoHo-Medium'
  },
  font_medium2: {
    fontFamily: 'KoHo-Medium'
  },
  font_semibold: {
    fontFamily: 'KoHo-Bold'
  },
  font_semibold2: {
    fontFamily: 'KoHo-Bold'
  },
  font_semiboldPro:{
    fontFamily: 'Mark Simonson - Proxima Nova Semibold'
  },
  font_size11: {
    fontSize: 11,
  },
  font_size12: {
    fontSize: 12,
  },
  font_size13: {
    fontSize: 13,
  },
  font_size14: {
    fontSize: 14,
  },
  font_size16: {
    fontSize: 16,
  },
  font_size18: {
    fontSize: 18,
  },
  font_size20: {
    fontSize: 20,
  },
  alignItemsCenter:{
    alignItems: 'center'
  },
  container: {
    flex: 1,
    backgroundColor: '#ededed',
    alignItems: 'center',
  },
  theme_button: {
    backgroundColor: '#ed872b',
    padding: 12,
    marginVertical: 10,
    width: windowWidth /1 - 20,
    alignItems: 'center',
    borderRadius: 10,
  },
  theme_button2: {
    backgroundColor: '#558120',
    padding: 12,
    paddingVertical: height / 55,
    marginVertical: height / 75,
    width: windowWidth /1 - 40,
    alignItems: 'center',
    borderRadius: 50,
    position:'relative',
    top:height / 17.29
  },
  theme_button1:{
    backgroundColor: '#558120',
    padding: 12,
    paddingVertical: height / 53.33,
    marginVertical: height / 97.14,
    width: windowWidth /1 - 40,
    alignItems: 'center',
    borderRadius: 50,
    position:'relative',
    top:height / 22.85
  },
  themebtn:{
    backgroundColor: '#ed872b',
    padding: 12,
    paddingVertical: height / 58.18,
    marginVertical: height / 128,
    width: windowWidth / 1 - 20,
    alignItems: 'center',
    borderRadius: 50,
    position:'relative',
    // bottom:-2
  },
  firstscreen_text:{
    // flex:1,
    alignItems:'center',
    position:'relative',
    width: width / 1.11,
    height : height / 8,
    paddingTop: height / 213.33,
    marginBottom: height / 85
  },
  theme_button_text: {
    fontSize: height / 50,
    // paddingVertical:4,
    color: 'white',
    letterSpacing: 1,
  },
  buttons:{
    width: windowWidth-40,
  },
  cancle_button:{
    backgroundColor: '#ed872b',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 5,
    elevation: 3
  },
  history_button:{
    backgroundColor: 'green',
    paddingVertical: 0,
    paddingHorizontal: 3,
  },
  history_button_view:{
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  detail_button:{
    paddingHorizontal: 10,
    color: '#ed872b'
  },
  buttonblack:{
    backgroundColor: '#25282b'
  },
  bg_white: {
    backgroundColor: 'white'
  },
  bg_yellow:{
    backgroundColor:'#faf8ec'
  },
  page_headingtitle:{
    fontSize: width / 15.62,
    color:"#272727",
    textTransform:'uppercase',
    marginTop:25
    // marginBottom: 20
  },
  textWrapper:{
    marginTop: height / 117,
    marginBottom: height / 117
  },
  page_headingtitle2:{
    fontSize: width / 15.62,
    color:"#272727",
    textTransform:'uppercase',
   
    // position:"relative",
    // top:9
    // marginBottom: 20
  },
  page_headingpara:{
    color:'#8b8b8d',
    fontSize: width / 24.43,
    marginTop: -2,
    marginBottom: height / 70
  },
  form_inputContainer: {
    width: windowWidth - 40,
    marginBottom: height / 90,
    position:'relative',
    top:height / 21.3,
    flexDirection:'row',
    // flex:1,
    backgroundColor:'#fff',
    alignItems:'center',
    justifyContent:'center',
    borderRadius:50,
    paddingLeft:20,
    paddingRight:15,
    borderWidth:2,
    borderColor:'#ebebeb'
  },
  form_inputContainer2: {
    width: windowWidth - 40,
    marginBottom: height / 72,
    position:'relative',
    top:height / 16,
    flexDirection:'row',
    // flex:1,
    backgroundColor:'#fff',
    borderRadius:50,
    paddingLeft:20,
    paddingRight:12,
    alignItems:'center',
    justifyContent:'center',
    borderWidth:1,
    borderColor:'#ebebeb'
  },
  labletext: {
    marginBottom: 5,
    color: '#464c51'
  },
  form_input: {
    paddingHorizontal: 15,
    paddingVertical: height / 72,
    borderRadius: 50,
    backgroundColor:'#fff',
    flex:1,
    color:'#272727',
    fontSize: width / 25,
  },
  form_inputs: {
    paddingHorizontal: 15,
    paddingVertical: height / 72,
    borderRadius: 50,
    backgroundColor:'#fff',
    flex:1,
    color:'#272727',
    fontSize: width / 25,
  },
  form_inputs2:{
    color:'#666666'
  },
  select_inputs:{
    height: 50,
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderRadius: 10,
    flex:1
  },
  numericinput:{
    backgroundColor: '#f4f7fc', 
    fontSize: 16,
  },
  numericicon:{
    color: '#000', fontSize: 14, fontWeight: '700'
  },
  heading:{
    alignItems: 'center',
    width:windowWidth /1,
    paddingVertical:10,
    borderBottomColor: '#ddd',
    borderBottomWidth:2
  },
  headingColor:{
    color:"#000"
  },
  textColorlight:{
    color:"#5f5f5f"
  },
  textColorWhite:{
    color:"#fff"
  },
  scene: {
    flex: 1,
  },
  ship_theme_button:{
    backgroundColor: '#ed872b',
    padding: 12,
    alignItems: 'center',
  },
  textwhite:{
    color: 'white'
  },
  inner_width:{
    width: windowWidth - 20
  },
  margintop10:{
    marginTop: 10
  },
  margintop5:{
    marginTop: 5
  },
  marginbottom5:{
    marginBottom: 5
  },


// header styling ---------------------------------

main_header:{
  flexDirection: 'row',
  justifyContent: 'space-between',
  // height: 200,
  alignItems: 'center',
  padding: 0,
  margin: 0,
},
main_header1:{
  alignItems: 'center',
  justifyContent: 'center',
},
header_icons:{
  fontSize: 24,
  color: '#5f5f5f',
  padding: 3,
  marginLeft: 3,
},
header_icons_menu:{
  fontSize: 34,
  marginBottom:4,
  color: '#fff',
  marginRight: 20,
  borderRadius: 6,
  padding: 0
},
header: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
},
menu_icon_title:{
  flexDirection: 'row',
  alignItems: 'center',
},
menu_icon_title1:{
  flexDirection: 'row',
  alignItems: 'center',
  width: '100%',
 
},
menu_title_view:{
  marginLeft: 7
},
menu_title_view1:{
  marginLeft: 70
},
inputContainer:{
  flexDirection: 'row',
  alignItems: 'center',
},
menu_title:{
  fontSize: 24
},
menu_title1:{
  fontSize:15,
  color:'#fff'
},
header_icons_menu1:{
  fontSize:18,
  color:'#fff'
},
counting:{
  backgroundColor: 'red',
  textAlign: 'center',
  borderRadius: 50,
  color: 'white',
  position: 'absolute',
  right: 0,
  top: -3,
  alignSelf: 'center',
  padding: 2,
  height: 18,
  width: 18,
  zIndex: 1,
  fontSize: 12,
},
search_inputContainer: {
  width: windowWidth - 20,
  marginTop: 5,
  backgroundColor: '#fff',
  borderRadius: 5,
  flexDirection: 'row',
  alignItems: 'center',
  elevation: 1,
  overflow: 'hidden'
},
search_inputContainer1:{
  width: windowWidth - 30,
  backgroundColor: '#fff',
  borderRadius: 5,
  flexDirection: 'row',
  alignItems: 'center',
  elevation: 1,
  overflow: 'hidden',
  marginTop:3
},
search_inputs: {
  height: 40,
  marginLeft: 30,
  borderBottomColor: '#FFFFFF',
  flex: 1,
  fontSize: 16
},
search_icn:{
  fontWeight: 'bold',
  color: "#5f5f5f",
  fontSize: 14,
  position: 'absolute',
  left: 8
},
basket_listContainer:{
  paddingVertical: 10
},
basket_eachcattouch:{
  marginHorizontal: 5,
  backgroundColor: '#f6f6f6',
  flex: 1,
  alignItems: 'center',
  borderRadius: 20,
  paddingHorizontal: 15,
  paddingVertical: 6,
  elevation: 3,
  shadowColor: '#dedede',
},
basket_selectedeachcat:{
  marginHorizontal: 5,
  backgroundColor: '#ed872b',
  flex: 1,
  alignItems: 'center',
  borderRadius: 20,
  paddingHorizontal: 15,
  paddingVertical: 6
},
basketcat_eachcattext:{
  color: 'black',
  fontSize: 16,
},
other_basketcat_eachcattext:{
  color: 'white',
  fontSize: 16,
},
// firstscreeen page styling ---------------------------------
logo:{
  width: width / 3.30,
  height: 100,
},
logo2:{
  width: width / 3.00,
  height: 110,
  position:'absolute',
  top:height / 19.42
},
firstscreen:{
  flex:1,
},
firstscreenhalf:{
  flex:1
},
firstscreentop:{
  flex:62,
  alignItems:'center',
  justifyContent: 'center', 
  position:"relative",
  // height:windowHeight/2.5,
},
firstscreenbottom:{
  flex:38,
  alignItems: 'center',
  borderTopLeftRadius: 25,
  backgroundColor:"#fff"
},
center:{
  textAlign: 'center',
},
centertext:{
  marginTop: height / 226.66,
  width: windowWidth-80 ,
  color: '#8b8b8d',
  lineHeight:18,
  letterSpacing:0.2,
  fontSize: width / 24.34,
  // backgroundColor:"red"
},
headingtitle:{
  fontSize: 40,
  marginBottom: 20,
},
headingtitle_first:{
  fontSize: width / 13.39,
  marginBottom:-4
},

// login page styling ---------------------------------

loginscreen: {
  flex: 1,
  width: width, 
  height: height / 1.17,
},
loginscreentop: {
  flex: 10,
  alignItems: 'center',
  justifyContent:'center',
  marginTop: height / 22.64
  // backgroundColor:'red'
},
loginscreentop2: {
  flex: 1,
  alignItems: 'center',
  justifyContent:'center',
  // backgroundColor:'red'
},
signupscreentop2:{
  // flex:1,
  // justifyContent:'flex-end',
  marginTop:height / 6.7,

},
loginscreenbottom: {
  flex:90,
  alignItems: 'center',
},
eye_icon:{
  fontSize:10,
  width:24,
  height:24
},
remeber_forgot:{
  display:'flex',
  flexDirection:'row',
  justifyContent:'center',
  alignItems: 'center',
  width: windowWidth-40,
  marginBottom: height / 32,
  marginTop:height / 18,
  
},
label_forgt:{
  fontSize: width/25.86,
  textTransform:'uppercase',
  color:'#558120',
  borderBottomWidth:0.5,
  borderColor:'#568121',
  letterSpacing:0.5
},
checkboxContainer:{
  flexDirection: 'row',
  alignItems: 'center'
},
createaccount:{
  color:'#8b8b8d',
  marginBottom:20
},
createaccount1:{
  color:'#828282',
  marginTop: height / 13,
  // marginBottom:height / 10,
  fontSize:width / 22.05,
  letterSpacing:0.8
},
createaccount2:{
  color:'#828282',
  fontSize:width / 22.05,
  letterSpacing:0.8,
  position:'relative',
  // top:height / 62
},
createaccounttext:{
  textTransform:'uppercase',
  color:'#558120',
  fontSize:width / 23.43
},
error: {
    borderBottomWidth: 1,
    borderColor: "red",
},

// signup page styling ---------------------------------

signupscreen: {
  backgroundColor:'#faf8ec',
  width:width,
  height: height - 90
},
signupscreentop: {
  flex:20,
  alignItems: 'center',
  justifyContent: 'center',
},
signupscreenbottom: {
  flex:80,
  alignItems: 'center',
  marginTop: height / 21.3,
  // position:'relative',
  // top:-45
},
productlist:{
  flex:1,
},
page_btmtitle:{
  fontSize:width / 23.43,
  color:'#8b8b8b',
  marginBottom:25,
  letterSpacing:0.3,
  textAlign:'center'
  // position:"relative",
  // top:5
},
// Home page styling ---------------------------------

  addproduct_view: {
    flex: 1,
    marginBottom: 70
  },
  addproduct_subscriptionview: {
    marginTop: 8
  },
  addproduct_subscriptiontitle: {
    fontSize: 20,
    color: '#000',
  },
  homepage: {
    flex: 1,
    backgroundColor: '#f7f7f7fc', //#ededed
    width: windowWidth,
    marginTop: 20,
    // borderTopLeftRadius: 20,
    alignItems: 'center',
    
  },
  homepageinnercontent: {
    width: windowWidth - 30,
  },
  homeallcat: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  eachcattouch: {
    margin: 3,
    backgroundColor: '#cce1ffc9',
    flex: 1,
    alignItems: 'center',
    borderRadius: 10,
    padding: 5
  }, 
  eachcattouch1:{
    margin: 3,
    backgroundColor: '#ffdeded1',
    flex: 1,
    alignItems: 'center',
    borderRadius: 10,
    padding: 5
  },
  eachcattouch2:{
    margin: 3,
    backgroundColor: '#d0f5b8c7',
    flex: 1,
    alignItems: 'center',
    borderRadius: 10,
    padding: 5
  },
  eachcattouch3:{
    margin: 3,
    backgroundColor: '#ffe1c7c7',
    flex: 1,
    alignItems: 'center',
    borderRadius: 10,
    padding: 5
  },
  eachcat:{
    alignItems: 'center'
  },
  selectedeachcat: {
    margin: 3,
    backgroundColor: '#ed872b',
    flex: 1,
    alignItems: 'center',
    borderRadius: 10,
    padding: 5
  },
  eachcaticon: {
    width: 50,
    height: 50,
    resizeMode: 'center'
  },
  eachcattext: {
    color: '#333',
    marginTop: 3,
  },
  eachsection: {
    marginTop: 20,
  
  },
  sectionhead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft:8,
    backgroundColor:'#dedede',
    borderRadius:5,
    
  },
  sectionheadtitle: {
    fontSize: 20,
    textTransform:'uppercase',
    paddingVertical:8
  },
  sectionheadseeall: {
    color: '#ed872b',
  },

  productlistitem: {
    width: windowWidth / 3 + 20,
    marginHorizontal: 3,
    marginVertical: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#dedede',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 10,
    elevation: 8,
  },

  discountedView_section: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  discountedView_image: {
    width: 150,
    height: windowHeight / 3,
    backgroundColor: '#ed872b',
    borderRadius: 10,
    color: 'white',
    alignItems: 'center',
    justifyContent: 'center'
  },
  discountpercent: {
    fontSize: 40,
    color: 'white',
    textAlign: 'center',
  },
  discounttext: {
    color: 'white',
    fontSize: 20,
  },
  productlistitem_img: {
    height: 110,
    width: 110,
    borderRadius: 45,
    backgroundColor: '#f6f6f6',
  },
  productlistitem_imgname: {
    alignItems: 'center',
    flex: 1,
  },
  productlistitem_addview: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    height: 35,
  },
  productlistitem_price: {
    color: "#000",
    fontSize: 14,
  },
  price_decoration :{
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  productlistitem_name: {
    color: "#000",
    fontSize: 14,
    marginVertical: 12,
    height: 40,
  },
  singlebox_productlistitem: {
    width: windowWidth / 2 - 32,
    marginHorizontal: 8,
    marginVertical: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#dedede',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 10,
    elevation: 8,
  },
  addbutton: {
    borderWidth: 1.5,
    borderColor: '#ed872b',
    paddingHorizontal: 5,
    borderRadius: 20,
    alignItems: 'center',
    flexDirection: 'row',
  },
  addbutton_icon: {
    paddingRight: 2,
  },
  addbutton_text: {
    color: '#ed872b',
    fontSize: 12,
    paddingHorizontal: 5,
  },
  icn: {
    fontWeight: 'bold',
    color: "#ed872b",
    fontSize: 14
  },
  productlistitem_likeview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15
  },
  productlistitem_shortcaticonview:{
    flexDirection: 'row'
  },
  productlistitem_shortcaticon: {
    height: 21,
    width: 21,
    resizeMode: 'contain'
  },
  sliderView_img: {
    width: windowWidth / 1 - 100,
    marginHorizontal: 5,
    borderRadius: 10
  },
  healthbanner: {
    width: windowWidth,
    backgroundColor: '#ccc'
  },
  singlebox_description: {
    fontSize: 12,
    color: '#000',
    marginTop: 10
  },
  footersection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flex: 1,
    width: windowWidth,
    marginTop: 20,
    borderBottomWidth: 3,
    borderBottomColor: '#ed872b'
  },
  footericon_view: {
    backgroundColor: '#ed872b',
    alignItems: 'center',
    padding: 15,
    borderRadius: 50
  },
  footertext_view: {
    alignItems: 'center',
    marginVertical: 10,
  },
  footertext: {
    color: '#646060',
    fontSize: 13
  },
  addproduct_imageprice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  addproduct_name: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 8
  },
  addproduct_nametitle: {
    fontSize: 20,
    color: '#000'
  },
  addproduct_namedesc: {
    color: '#b6b9bc'
  },
  addproduct_image: {
    width: 60,
    height: 60,
    borderRadius: 10
  },
  addproduct_price: {
    fontSize: 22,
    color: '#000',
    padding:0,
    lineHeight:25
  },
  addproduct_price2: {
    fontSize: 18,
    textDecorationLine: 'line-through',
    color: 'gray'
  },
  addproduct_quantityview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8
  },
  addproduct_quantitytitle: {
    fontSize: 20,
    color: '#000'
  },
  addproduct_quantityshort: {
    fontSize: 12,
    color: '#b6b9bc'
  },
  addproduct_descriptionview: {
    marginTop: 8
  },
  addproduct_descriptiontitle: {
    fontSize: 20,
    color: '#000',
  },
  addproduct_description: {
    color: '#b6b9bc'
  },
  eachsubscription: {
    backgroundColor: '#f4f7fc',
    padding: 10,
    margin: 10,
    marginLeft: 0,
    alignItems: 'center',
    borderRadius: 10,
    width: windowWidth / 5 - 5,
    borderColor: '#ccc',
    borderWidth: 1
  },
  eachsubscription_count: {
    fontSize: 26,
  },
  eachsubscription_text: {
    color: '#b6b9bc'
  },
  sheet_theme_button:{
    backgroundColor: '#ed872b',
    padding: 12,
    alignItems: 'center',
    borderRadius: 2,
    width: '50%',
    justifyContent: 'center'
  },

  carticon1:{
    backgroundColor:'#e8e8e8',
    width:'50%',
    justifyContent: 'center',
    alignItems:'center',
    borderRadius: 2,
    paddingVertical:11
  },
  secondpage1:{
    marginTop:-12
  },
  secondpage: {
    flex: 1,
    backgroundColor: '#ededed',
    width: windowWidth,
    alignItems: 'center',
    paddingTop: 10,
  },
  secondpageinnercontent: {
    width: windowWidth - 30,
    paddingBottom: 20,
    flex: 1,
  },
  maincategorylist:{    
    margin: 3,
    backgroundColor: '#f6f6f6',
    flex: 1,
    alignItems: 'center',
    borderRadius: 10,
    padding: 5,
    height:10,
  },
  productlistitem_addspacing: {
    width: '50%',
    padding: 5,
  },
  productlistitem_second: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#dedede',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 10,
    elevation: 3,
  },

  // cart page styling ------------------------------------------------------------

  cart_container: {
    alignItems: 'center',
    marginBottom: 50,
  },

  bottomView: {
    borderTopColor: '#dedede',
    borderTopWidth: 1,
    flexDirection:'row',
    width: '100%',
    height: 50,
    backgroundColor: '#ed872b',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
  },
  bottomView_total:{
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  theme_button_cart:{
    flex:1,
    alignItems: 'center'
  },
  cardContent: {
    marginLeft: 10,
    alignItems: 'flex-start'
  },
  product_shortimage: {
    width: 60,
    height: 60,
  },
  card: {
    shadowColor: '#470000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    elevation: 4,
    marginHorizontal: 20,
    marginVertical: 10,
    backgroundColor: "white",
    padding: 10,
    flexDirection: 'row',
    borderRadius: 10,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  cart_productlistitem:{
    width: windowWidth / 1 - 20,
    marginHorizontal: 8,
    marginVertical: 5,
    backgroundColor: 'white',
    borderRadius: 4,
    padding: 8,
    shadowColor: '#dedede',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.17,
    shadowRadius: 4,
    elevation: 4,
  },
  cart_product_dlt:{
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  cart_separator: {
    height: .5,
    backgroundColor: "#ddd",
    marginVertical:5
  },
  price_qty:{
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  image_content: {
    flexDirection: 'row',
  },
  name: {
    fontSize: 15,
    alignSelf: 'flex-start',
    color: "#000",
  },
  star: {
    fontSize: 24,
    flex: 1,
    alignSelf: 'flex-start',
    color: "orange",
  },
  Price: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  PriceText: {
    color: "#000",
    fontSize: 16,
  },
  viewinputContainer: {
    marginVertical: 20,
    width: windowWidth / 1 - 20,
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    width: '100%',
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: "#808080",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
    overflow: 'hidden'
  },
  inputContainer_coupon:{
    flexDirection: 'row',
    backgroundColor: '#ddd8',
  },
  inputs: {
    height: 45,
    marginLeft: 16,
    borderBottomColor: '#FFFFFF',
    flex: 1,
  },
  apply: {
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#ed872b'
  },
  applytext: {
    color: '#fff',
    fontSize: 20,
  },
  totaltextview_view: {
    marginHorizontal: 20,
    width: windowWidth / 1 -20
  },
  totaltextview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  totaltext: {
    fontSize: 18,
  },
  finalamount: {
    fontSize: 16,
  },

  // order placed page styling ------------------------------------------------------------

  placeorderview_screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  placeorderview_view: {
    height: windowHeight / 2,
    justifyContent: 'space-between'
  },
  placeorderview: {
    alignItems: 'center'
  },
  orderimg: {
    marginBottom: 25,
  },
  placeordertext: {
    marginBottom: 15,
    fontSize: 20,
  },
  placeorderid: {
    fontSize: 16,
  },

// notifications page styling ------------------------------------------------------------

root: {
  backgroundColor: "#FFFFFF"
},
notification_container: {
  padding: 10,
  flexDirection: 'row',
  alignItems: 'center',
},
notification_avatar: {
  width: 40,
  height: 40,
  borderRadius: 50,
},
notification_text_view: {
  marginBottom: 5,
  flexDirection: 'row',
  flexWrap: 'wrap'
},
notificationtext: {
  fontSize: 14,
  lineHeight: 20
},
notification_content: {
  flex: 1,
  marginLeft: 16,
  marginRight: 0
},
notification_separator: {
  height: .5,
  backgroundColor: "#ddd",
  marginHorizontal: 20
},
notification_timeAgo: {
  fontSize: 12,
  color: "#696969",
  fontWeight: '500'
},

// detail page styling ------------------------------------------------------------

  detail_container:{
    backgroundColor: '#fff',
    flex: 1
},
orderdetail_id_item: {
    marginBottom: 20
},
addproduct_quantityadd_text: {
    fontSize: 16,
    fontWeight: '500',
    color: '#747474'
},
addproduct_quantityadd: {
    color: '#000',
},
detail_cardContent: {
    marginLeft: 10,
    alignItems: 'flex-start',
    justifyContent: 'space-between'
},
detail_card: {
    marginBottom: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
},
delivered: {
    fontSize: 16,
},
orderdetailscreen: {
    marginHorizontal: 20
},
detail_placeorderid: {
    marginVertical: 3
},
detail_descriptionview: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 20
},
detail_description: {
    color: 'gray',
    fontSize: 15,
},
margin_top:{
  marginTop: 15
},

// checkout page styling ------------------------------------------------------------

address_inputs:{
  backgroundColor: '#f4f4f4',
  borderBottomColor:'#ddd',
  borderBottomWidth: 2,
  height: 40,
  paddingVertical: 0,
  paddingHorizontal: 10,
  marginTop: 10,
},
select_address_inputs:{
  backgroundColor: '#f4f4f4',
  borderBottomColor:'#ddd',
  borderBottomWidth: 2,
  height: 40,
  marginTop: 10,
},
select_address_inputs_item:{
  height: 40,
},
NewAddressForm:{
  marginTop: 10,
  padding: 10,
  paddingTop: 0,
},
ship_address_view:{
  marginVertical: 10
},
address_view: {
  width: windowWidth - 20,
  justifyContent: 'space-between',
  padding: 10,
  flexDirection: 'row',
  backgroundColor:'#fff',
},
checkoutscreen:{
  alignItems: 'center'
},
checkoutinner_screen: {
  width: windowWidth / 1 - 20
},
checkout_header: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingVertical: 15
},
add_address_text: {
  fontSize: 16,
},
payment_methodeachview:{
  flexDirection:'row',
  alignItems: 'center',
  marginVertical: 2
},
payment_method_view:{
  marginVertical: 15
},
payment_method_text:{
  color: '#747474',
  marginLeft: 10
},
confirm_button:{
  marginTop: 20
},
paymentmethod_view:{
  paddingVertical: 10,
  borderBottomColor: '#ddd',
  borderBottomWidth: 2,
  alignItems: 'center'
},

Singlepage:{
  alignItems: 'center'
},

basketWrapper:{
  flexDirection:'row',
  alignItems:'center',
  marginTop:8
},

basketContainer:{
  backgroundColor:'#fff',
  width: windowWidth / 1 -20,
  borderRadius: 6,
  paddingVertical: 7,
  paddingHorizontal: 10
},

basketImgBox:{
  width:100,
  height:100,
  marginRight:10,
  borderRadius:15,
  backgroundColor: 'gray',
  marginHorizontal: 8,
  marginVertical: 5,
//   shadowColor: "#000",
// shadowOffset: {
// 	width: 0,
// 	height: 1,
// },
// shadowOpacity: 0.22,
// shadowRadius: 2.22,
// elevation: 3,
},

productDetail:{
  flex:1
},


productRow:{
  flexDirection:'row',
  alignItems:'center',
  flex:1,
  borderRadius: 6,
   marginBottom:5,
  borderWidth: 1,
    borderColor: '#ddd',
    borderBottomWidth: 1,
    
},

description:{
  backgroundColor:'#fff',
  width: windowWidth / 1 -20,
  borderRadius: 6,
  paddingHorizontal: 8,
  paddingVertical: 5,
  paddingBottom:10
},

productName:{
  backgroundColor:'#fff',
  width: windowWidth / 1 -20,
  borderRadius: 6,
  marginTop: 10,
  paddingHorizontal: 8,
  paddingVertical: 5
},

productImgBox:{
  marginVertical: 5,
  marginRight:8,
  
},

basketDetail:{
  width:205
},

basketImg:{
  width:100,
  height:100,
  borderRadius:15
},

productImg:{
  width:100,
  height:100,
},

inLine:{
  flexDirection:'row',
  alignItems:'center',
  
},

basketSalePrice:{
  color:'gray',
  textDecorationLine: 'line-through',
  fontSize:11,
  marginLeft:3
},

addBtn:{
  borderWidth: 1.5,
    borderColor: '#ed872b',
    borderRadius: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 0,
    width:80,
    marginTop:5
},

addbtn_text:{
  color: '#ed872b',
    fontSize: 12,
    paddingVertical: 3,
},

quantityDirec:{
  flexDirection:'row',
  alignItems: 'center',
  justifyContent:'space-between'
},

productWeight:{
  fontSize: 13,
  color:'#000'
},

basketProductName:{
  marginBottom:10
},

descriptionPara:{
  color:'#828282'
},

iconheart:{
  width:'100%',
  flex:1,
  flexDirection:'row',
  justifyContent: 'space-between'
},

productDescription:{
  color:'#828282',
},

basketDiscount:{
  backgroundColor:'orange',
  color:'white',
  fontSize:11,
  marginLeft:4,
  padding:0,
  paddingHorizontal:5,
  borderTopLeftRadius:5,
  borderBottomRightRadius:5,
  marginLeft:10
},

btnFixed:{
  position:'absolute',
  bottom:5,
  alignItems: 'center',
  width:'100%',
  flexDirection:'row',
  marginHorizontal:20,
},

topBanner:{
  width: windowWidth / 1 - 32,
  marginBottom:15
},

bannerInner:{
  width: windowWidth / 1 - 32 , 
  height: 110
},

sliderImageView:{
  width: windowWidth / 1 -30, 
  height: windowHeight/4,
},
sliderImageDots:{
  width: 8, 
  height: 8
},

categorySection:{
  marginTop:10,
//   shadowColor: "#333",
// shadowOffset: {
// 	width: 0,
// 	height: 2,
// },
// elevation: 1,
 },

categoryHeading:{
  paddingTop:13,
  paddingBottom:10,
  paddingLeft:8,
  marginHorizontal:1,
  // backgroundColor:'#dedede',
  borderRadius:5,
  marginTop: 4
}, 

categoryTitle:{
  fontSize:20,
  color:'#000',
  textTransform:'uppercase',
  fontFamily:'Roboto-Bold'
},

categoryInner:{
  alignItems:'flex-start',
  flexWrap: 'wrap'
},

categoryImage:{
  width:80,
  height:80,
  marginTop:25
},

categoryWrapper:{
  backgroundColor:'#fff',
  width: windowWidth /3 - 21,
  alignItems:'center',
  height: 160,
  marginHorizontal:5,
  marginTop:10,
  borderRadius:10,
  borderWidth:1,
  borderColor:'#e7e7e7'
},

catoegoryText:{
  textAlign:'center',
  fontSize:16,
  marginTop:8,
  color:'#333'
},

sliderView_img1: {
  width: windowWidth / 1 - 40,
  marginHorizontal: 5,
  borderRadius: 10
},

carticon:{
  color:'#333',
  fontSize:30,
  marginLeft: 10,
},

circle:{
  width:18,
  height:18,
  borderRadius:15,
  backgroundColor:'red', 
  alignItems:'center',
  position:'absolute',
  left:98,
  top:10
 },

  count:{
    color:'#fff'
  },
  para_text:{
    // paddingHorizontal:8,
    color:'#8b8b8b'
  }, 
  btnColor1:{
    backgroundColor:'#558120'
  },
  btnColor2:{
    backgroundColor:'white',
    borderWidth: 1,
    borderColor:'#558120'
  },
  theme_button_color1:{
    color:'#fff'
  },
  theme_button_color2:{
    color:'#558120'
  },
  background_img:{
    width:windowWidth  ,
    height: height - 80
  },
  social_container:{
    flexDirection:"row",
    justifyContent:'space-between',
    // marginBottom:10,
    width:width / 2.10,
    marginBottom:height / 24.3,
    marginTop:height / 80,
  },
  social_cont:{
    borderColor:'#ebebeb',
    borderWidth:2,
    padding:25,
    borderRadius:50,
    backgroundColor:"#fff",
    width:30,
    height:30,
    display:'flex',
    alignItems:'center',
    justifyContent:'center',
  },
  apple:{
    width:25,
   height:25,
  },
  facebook:{
    width:25,
   height:25,
  },
  google:{
    width:25,
    height:25,
  },
  text_or:{
    color:'#272727',
    marginVertical:height / 70,
    fontSize: width / 25.86
  },
  // create_cont:{
  //   backgroundColor:'red'
  // }
  // background_img:{
  //   width:null,
  //   height:null,
  //   flex:1
  // }
})

