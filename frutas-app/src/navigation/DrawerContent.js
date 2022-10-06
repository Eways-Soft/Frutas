import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet,Dimensions } from 'react-native';
import {
    useTheme,
    Avatar,
    Title,
    Caption,
    Paragraph,
    Drawer,
    Text,
    TouchableRipple,
    Switch,
} from 'react-native-paper';
import {
    DrawerContentScrollView,
    DrawerItem
} from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon1 from "react-native-vector-icons/FontAwesome";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import{ AuthContext } from '../components/context';

const{width, height} = Dimensions.get('window');

export function DrawerContent (props) {
    const paperTheme = useTheme();

    const { signOut, toggleTheme } = React.useContext(AuthContext);

    const [CustomerName, setCustomerName] = React.useState('');
    const [CustomerUserName, setCustomerUserName] = React.useState('');

    useEffect(() => {
        getUserData()
        
    }, [])


    async function getUserData(){
        const sessionData = JSON.parse(await AsyncStorage.getItem('USER_DATA'));
        setCustomerName(sessionData.customer_name)
        setCustomerUserName(sessionData.username)
        
    }

    return(
        <View style={{flex:1}}>
            <DrawerContentScrollView {...props}>
                <View style={{ marginTop:-5}}>
                    <View style={{backgroundColor:'#568121'}}>
                        <View style={{flexDirection:'row',justifyContent:"center"}}>
                            <View style={{ flexDirection:'column',marginTop:height/26,marginBottom:height/150}}>
                                <Icon1 name="user-circle-o" size={width/9.40} color="#fff" style={{textAlign:'center'}}/>
                                <Text style={{color:'#fff',paddingVertical:10,fontSize:17,fontFamily: 'ProximaNovaRegular'}}>{CustomerName}</Text>
                            </View>
                        </View>
                    </View>

                    <Drawer.Section style={[styles.drawerSection]}>
                        <DrawerItem 
                            icon={({color, size}) => (
                                <Icon 
                                name="home-outline" 
                                color={color}
                                size={20}
                                />
                            )}
                            label="Home"
                            labelStyle={{fontSize: 16, fontFamily: 'Mark Simonson - Proxima Nova Semibold'}}
                            onPress={() => {props.navigation.navigate('Home',{screen:'Home'})}}
                        />

                        <DrawerItem 
                            icon={({color, size}) => (
                                <Icon 
                                name="cart-outline" 
                                color={color}
                                size={20}
                                />
                            )}
                            label="My Order"
                            labelStyle={{fontSize: 16, fontFamily: 'Mark Simonson - Proxima Nova Semibold'}}
                            onPress={() => {props.navigation.navigate('Orders')}}
                        />


                        <DrawerItem 
                            icon={({color, size}) => (
                                <Icon 
                                name="heart-outline" 
                                color={color}
                                size={20}
                                />
                            )}
                            label="Wishlist"
                            labelStyle={{fontSize: 16, fontFamily: 'Mark Simonson - Proxima Nova Semibold'}}
                            onPress={() => {props.navigation.navigate('Wishlist')}}
                        />

                        <DrawerItem 
                            icon={({color, size}) => (
                                <Icon 
                                name="location-enter" 
                                color={color}
                                size={20}
                                />
                            )}
                            label ="Delivery Address"
                            labelStyle={{fontSize: 16, fontFamily: 'Mark Simonson - Proxima Nova Semibold'}}
                            onPress={() => {props.navigation.navigate('DeliveryAddress',{'title_text':'Delivery Address'})}}
                        />
                        
                    </Drawer.Section>
                    
                </View>
            </DrawerContentScrollView>
            <Drawer.Section  style={styles.bottomDrawerSection}>
                <DrawerItem 
                style={{backgroundColor: '#858585'}}
                    icon={({color, size}) => (
                        <Icon 
                        name="exit-to-app" 
                        color={'#fff'}
                        size={20}
                        />
                    )}
                    label="Sign Out"
                    labelStyle={{color:'#fff', fontSize: 16 ,fontFamily: 'Mark Simonson - Proxima Nova Semibold',}}
                    onPress={() => {signOut()}}
                />
            </Drawer.Section>
        </View>
    );
}

const styles = StyleSheet.create({
    drawerContent: {
      flex: 1,
    },
    userInfoSection: {
      paddingLeft: 20,
    },
    title: {
      fontSize: 16,
      marginTop: 3,
      fontWeight: 'bold',
    },
    caption: {
      fontSize: 14,
      lineHeight: 14,
    },
    row: {
      marginTop: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    section: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 15,
    },
    paragraph: {
      fontWeight: 'bold',
      marginRight: 3,
    },
    drawerSection: {
      marginTop: 15,
    },
    bottomDrawerSection: {
        marginBottom: 15,
        borderTopColor: '#f4f4f4',
        borderTopWidth: 1
    },
    preference: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
  });
