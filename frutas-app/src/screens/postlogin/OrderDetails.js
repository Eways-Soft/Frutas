import React, { useEffect, useState, useRef } from "react";

import { Text, View, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FIcon from "react-native-vector-icons/FontAwesome";
import { useDispatch, useSelector } from 'react-redux';
import { useIsFocused } from "@react-navigation/native";
import { useNavigation } from '@react-navigation/native';

import styles from '../../assets/css/AppDesign.js'
import Constants from '../../config/Constants';
import Loader from "./../../components/loader/Loader";
var BASE_URL = Constants.BASE_URL;

export default function OrderDetails({route}){
    const isFocused = useIsFocused();
    const navigation = useNavigation(); 

    const [OrderData, setOrderData] = React.useState([]);
    const [OrderNo, setOrderNo] = React.useState([]);
    const [TotalItems, setTotalItems] = React.useState([]);
    const [TotalAmount, setTotalAmount] = React.useState([]);
    const [OrderDate, setOrderDate] = React.useState();
    const [isLoading, setisLoading] = React.useState(false);
    
    const UserID = useSelector(state => state.userReducer.UserID)

    const order_no = route.params.order_no;  
    
    useEffect(() => {
        getOrderDetail()

        const unsubscribe = navigation.addListener('didFocus', () => {
            getOrderDetail()            
        });

        return unsubscribe;
        
    }, [isFocused])

    async function getOrderDetail(){
        const sessionData = JSON.parse(await AsyncStorage.getItem('USER_DATA'));
        

        const bodyArray1 = {
            app: 1,
            customer_id: sessionData.customer_id,
            order_no: order_no,
        };

        setTimeout(function(){
            setisLoading(false)
        },5000);

        fetch(`${BASE_URL}getcustomerorderdetail`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(bodyArray1)
        }).then(function (response) {
          return response.json();
        }).then(function (result) {
        
          setisLoading(false)

          if (result.CODE === 200) {

            setOrderData(result.data)
            setOrderNo(result.order_no)
            setTotalItems(result.total_items)
            setTotalAmount(result.total_amount_paid)

            var dateFuntion = new Date(result.data[0].create_date);
            

            var year = dateFuntion.getFullYear();
            var month = dateFuntion.getMonth()+1;
            var day = dateFuntion.getDate();

            var createdate = day+'-'+month+'-'+year;
            setOrderDate(createdate)

          } else {
            //console.log('! 200')
            //alert('Something went wrong !.')
          }
        }).catch(function (error) {
          console.log('error ', error);
        });      
    }  

    return (
        <View style={styles.detail_container}>

        {isLoading && <Loader />}
        
        <View style={styles.orderdetailscreen}>
            <View style={styles.orderdetail_id_item}>
                <Text style={[styles.detail_placeorderid, styles.font_semiboldPro, styles.font_size16]}>Order ID: <Text style={[styles.orderid, styles.font_regular2]}>#{order_no}</Text></Text>
                <Text style={[styles.detail_placeorderid, styles.font_regular2, styles.font_size16]}>Item: <Text style={[styles.orderid, styles.font_regular2]}>{TotalItems}</Text></Text>
                <Text style={[styles.detail_placeorderid, styles.font_regular2, styles.font_size16]}>Order Date : <Text style={[styles.orderid, styles.font_regular2]}>{OrderDate}</Text></Text>
            </View>

            {OrderData ?   
                    OrderData.map((item,ind)=>{
                        return(
                            <View style={styles.detail_card}>
                                <View style={styles.image_content}>
                                    <Image style={styles.product_shortimage} source={{ uri: item.basket_image }} />
                                    <View style={styles.detail_cardContent}>
                                        <View>
                                            <Text style={[styles.name, styles.font_regular2]}>{item.basket_name }</Text>
                                            <Text style={[styles.PriceText, styles.font_regular2]}><FIcon name="rupee" size={14} color="#000" /> {item.actual_price}</Text>
                                        </View>
                                        <View>
                                            <Text style={[styles.delivered, styles.font_regular2, styles.font_size14]}>Wt : {item.basket_weight_in_kg}kg {item.basket_weight_in_gm}gm</Text>
                                        </View>
                                    </View>
                                </View>
                                <View>
                                    <View style={styles.addproduct_quantityadd_view}>
                                        <Text style={[styles.addproduct_quantityadd_text, styles.font_light,styles.font_size16]}>Quantity: <Text style={[styles.addproduct_quantityadd, styles.font_regular2]}>{item.quantity}</Text></Text>
                                    </View>
                                </View>
                            </View>
                        )
                    })
                :

                <View style={styles.detail_card}>
                    <View style={styles.image_content}>
                        <Image style={styles.product_shortimage} source={require('../../assets/images/basket.jpg')} />
                        <View style={styles.detail_cardContent}>
                            <View>
                                <Text style={[styles.name, styles.font_regular2]}>item</Text>
                                <Text style={[styles.PriceText, styles.font_regular2]}>Rs 0.00</Text>
                            </View>
                            <View>
                                <Text style={[styles.delivered, styles.font_regular2]}>No Data Found</Text>

                            </View>
                        </View>
                    </View>
                    
                </View>
            }




            <View style={styles.detail_descriptionview}>
                
            </View>
            <View style={[styles.totaltextview, styles.margin_top]}>
                <Text style={[styles.totaltext, styles.finalamount, styles.font_regular2]}>Total Amount</Text>
                <Text style={[styles.totaltext, styles.finalamount, styles.font_semiboldPro]}><FIcon name="rupee" size={16} color="#000" /> {TotalAmount}</Text>

            </View>
        </View>
        </View>
    );
}

