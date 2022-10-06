import 'react-native-gesture-handler'
 
import React, { useEffect } from 'react';
import {
  Text,
  View,
  Image, ActivityIndicator, Dimensions
} from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { DrawerContent } from './src/navigation/DrawerContent';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import Animated from 'react-native-reanimated';

import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { useDispatch, useSelector } from 'react-redux';

import { AuthContext } from "./src/components/context";
import {
  SignIn,
  CreateAccount,
  Search,
  Home,
  Search2,
  Profile,
  Splash,
} from "./src/screens/Screens";

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { MainCategoryHeaderTitle } from "./src/screens/postlogin/inc/header/HeaderFunctions";
import Header from "./src/screens/postlogin/inc/Header";
import HeaderStyle from "./src/screens/postlogin/inc/header/HeaderStyle";

import CategoryHeader from "./src/screens/postlogin/inc/CategoryHeader";
import ViewAllHeader from "./src/screens/postlogin/inc/ViewAllHeader";
import BasketdetailHeader from "./src/screens/postlogin/inc/BasketdetailHeader";
import DiscountHeader from "./src/screens/postlogin/inc/DiscountHeader";
import CartHeader from "./src/screens/postlogin/inc/CartHeader";
import CheckoutHeader from "./src/screens/postlogin/inc/CheckoutHeader";
import OrderHeader from "./src/screens/postlogin/inc/OrderHeader";
import OrderDetailHeader from "./src/screens/postlogin/inc/OrderDetailHeader";
import PaymentHeader from "./src/screens/postlogin/inc/PaymentHeader";

import FirstScreen from "./src/screens/prelogin/FirstScreen";
import LoginScreen from "./src/screens/prelogin/Login";
import SignupScreen from "./src/screens/prelogin/Signup";
import OTPScreen from "./src/screens/prelogin/OTPScreen";
import Googlelogin from "./src/screens/prelogin/Googlelogin";
import UpdateSocialDetail from "./src/screens/prelogin/UpdateSocialDetail";

import HomeScreen from './src/screens/postlogin/home/Home';
import ViewAll from './src/screens/postlogin/view_all/ViewAll';
import ViewAllDiscountBaskets from './src/screens/postlogin/discount/ViewAll';
import BasketDetailScreen from './src/screens/postlogin/basket/BasketDetail';
import CategoryBasketsScreen from './src/screens/postlogin/basket/CategoryBaskets';
import SearchScreen from './src/screens/postlogin/search/Search';
import CategoryScreen from './src/screens/postlogin/CategoryScreen';
import Cart from './src/screens/postlogin/CartScreen';
import OrderPlaced from './src/screens/postlogin/OrderPlaced';
import Notifications from './src/screens/postlogin/Notifications';
import OrderDetails from './src/screens/postlogin/OrderDetails';
import Checkout from './src/screens/postlogin/Checkout';
import Payment from './src/screens/postlogin/Payment';
import OrderHistory from './src/screens/postlogin/OrderHistory';

import DeliveryAddress from './src/screens/postlogin/address/DeliveryAddress';
import WishlistScreen from './src/screens/postlogin/wishlist/Wishlist';

import ForgotPassword from "./src/screens/prelogin/forgotpass/ForgotPassword";
import ForgotOTPScreen from "./src/screens/prelogin/forgotpass/ForgotOTPScreen";
import ChangePassword from "./src/screens/prelogin/forgotpass/ChangePassword";

import { Provider } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import store from "./src/store/store";
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const{width, height} = Dimensions.get('window');

const App = () => {
  const Tab = createBottomTabNavigator();
  const HomeStack = createStackNavigator();
  const Drawer = createDrawerNavigator();

  const Stack = createStackNavigator();
  const WishlistStack = createStackNavigator();
  const SearchStack = createStackNavigator();
  const OrderStack = createStackNavigator();
  const CartStack = createStackNavigator();
  const CheckoutStack = createStackNavigator();
  const ProfileStack = createStackNavigator();
  const AuthStack = createStackNavigator();

  const initialLoginState = {
    isLoading: true,
    userName: null,
    userToken: null,
  };

  const HomeStackScreen = ({ route, navigation }) => (
    <HomeStack.Navigator initialRouteName='Home'>
      <HomeStack.Screen name="Home" component={HomeScreen} options={{ headerStyle: { height: windowHeight / 10, backgroundColor: '#fbf9ed', elevation: 0 }, headerTitle: (props) => <Header {...props} /> }} />

      <HomeStack.Screen 
        name="Category" 
        component={CategoryScreen}
        options={{
          headerLeft: (props) => (
            <CategoryHeader
              {...props}
              onPress={() => {
                // Do something
              }}
            />
          ),
          title: '',
        }}
      />

      <HomeStack.Screen name="BasketDetail" component={BasketDetailScreen}        
        options={{
          headerLeft: (props) => (
            <BasketdetailHeader
              {...props}
              onPress={() => {
                // Do something
              }}
            />
          ),
          title: '',
        }}
      />

      <HomeStack.Screen name="CategoryBaskets" component={CategoryBasketsScreen}
        options={{
          headerLeft: (props) => (
            <CategoryHeader
              {...props}
              onPress={() => {
                // Do something
              }}
            />
          ),
          title: '',
      }}
      />

      <HomeStack.Screen name="Wishlist" component={WishlistScreen}
        options={({ route }) => ({
          headerStyle: {
            backgroundColor: '#f6f6f6', elevation: 0
          },
        })}
      />

      <HomeStack.Screen name="DeliveryAddress" component={DeliveryAddress}
        options={{
          headerLeft: (props) => (
            <ViewAllHeader
              {...props}
              onPress={() => {
                // Do something
              }}
            />
          ),
          title: '',
        }}
      />

      {/* {<HomeStack.Screen name="Viewall" component={ViewAll}
        options={({ route }) => ({
          headerStyle: {
            backgroundColor: '#f6f6f6', elevation: 0
          },
        })}
      /> } */}

      <HomeStack.Screen name="Discountbaskets" component={ViewAllDiscountBaskets}
        options={({ route }) => ({
          headerStyle: {
            backgroundColor: '#f6f6f6', elevation: 0
          },
          headerTitle: props => <DiscountHeader {...props} />
        })}
      />

      <HomeStack.Screen
        name="AllRecommendBaskets"
        component={ViewAll}
        options={{
          headerLeft: (props) => (
            <ViewAllHeader
              {...props}
              onPress={() => {
                // Do something
              }}
            />
          ),
          title: '',
        }}
      />

      <HomeStack.Screen
        name="AllBestSeller"
        component={ViewAll}
        options={{
          headerLeft: (props) => (
            <ViewAllHeader
              {...props}
              onPress={() => {
                // Do something
              }}
            />
          ),
          title: '',
        }}
      />

      <HomeStack.Screen
        name="AllSingleBoxes"
        component={ViewAll}
        options={{
          headerLeft: (props) => (
            <ViewAllHeader
              {...props}
              onPress={() => {
                // Do something
              }}
            />
          ),
          title: '',
        }}
      />

    </HomeStack.Navigator>
  );

  const WishlistStackScreen = ({ route, navigation }) => (
    <WishlistStack.Navigator>
      <WishlistStack.Screen name="Wishlist" component={WishlistScreen} options={{ headerStyle: { height: windowHeight / 10, backgroundColor: '#fbf9ed', elevation: 0 }, headerTitle: (props) => <Header {...props} /> }} />

      <WishlistStack.Screen name="Category" component={WishlistScreen}
        options={({ route }) => ({
          headerStyle: {
            backgroundColor: '#f6f6f6', elevation: 0
          },
          headerTitle: props => <CategoryHeader {...props} />
        })}
      />

    </WishlistStack.Navigator>
  );

  const CartStackScreen = ({ route, navigation }) => (
    <CartStack.Navigator>
      <CartStack.Screen name="Cart" component={Cart}
        options={{
          headerLeft: (props) => (
            <CartHeader
              {...props}
              onPress={() => {
                // Do something
              }}
            />
          ),
          title: '',
        }} />
      <CartStack.Screen name="Checkout" component={Checkout}
        options={({ route }) => ({
          headerStyle: {
            backgroundColor: '#f6f6f6', elevation: 0
          },
          headerTitle: props => <CheckoutHeader {...props} />
        })} />
      <CartStack.Screen name="Payment" component={Payment}
        options={({ route }) => ({
          headerStyle: {
            backgroundColor: '#f6f6f6', elevation: 0
          },
          headerTitleStyle: {
            fontFamily: 'Mark Simonson - Proxima Nova Semibold',
            fontSize: width/18
          },
          headerTitle: props => <PaymentHeader {...props} />
        })} />
      <CartStack.Screen name="OrderPlaced" component={OrderPlaced}
      options={({ route }) => ({
        headerTitleStyle: {
          fontFamily: 'Mark Simonson - Proxima Nova Semibold',
          fontSize: width/18
        },
      })}
      />
    </CartStack.Navigator>
  )

  const loginReducer = (prevState, action) => {
    switch (action.type) {
      case 'RETRIEVE_TOKEN':
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGIN':
        return {
          ...prevState,
          userName: action.id,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGOUT':
        return {
          ...prevState,
          userName: null,
          userToken: null,
          isLoading: false,
        };
      case 'REGISTER':
        return {
          ...prevState,
          userName: action.id,
          userToken: action.token,
          isLoading: false,
        };
    }
  };

  const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState);

  const authContext = React.useMemo(() => ({
    signIn: async (foundUser) => {
      const userToken = String(foundUser[0].userToken);
      const userName = foundUser[0].username;

      try {
        await AsyncStorage.setItem('userToken', userToken);
      } catch (e) {

      }

      dispatch({ type: 'LOGIN', id: userName, token: userToken });
    },
    signOut: async () => {
      try {
        await AsyncStorage.removeItem('userToken');
      } catch (e) {

      }
      dispatch({ type: 'LOGOUT' });
    },
    signUp: () => {
      // setUserToken('fgkj');
      // setIsLoading(false);
    },
    toggleTheme: () => {
      setIsDarkTheme(isDarkTheme => !isDarkTheme);
    }
  }), []);

  useEffect(() => {
    setTimeout(async () => {
      // setIsLoading(false);
      let userToken;
      userToken = null;
      try {
        userToken = await AsyncStorage.getItem('userToken');
      } catch (e) {

      }
      dispatch({ type: 'RETRIEVE_TOKEN', token: userToken });
    }, 100);
  }, []);


  if (loginState.isLoading) {
    return <Splash />;
  }

  const OrderStackScreen = ({ route, navigation }) => (
    <OrderStack.Navigator>
      <OrderStack.Screen name="Orders" component={OrderHistory}
        options={({ route }) => ({
          headerStyle: {
            backgroundColor: '#f6f6f6', elevation: 0
          },
          headerTitle: props => <OrderHeader {...props} />
        })}
      />
      <OrderStack.Screen name="OrderDetails" component={OrderDetails}
        options={({ route }) => ({
          headerStyle: {
            backgroundColor: '#f6f6f6', elevation: 0
          },
          headerTitle: props => <OrderDetailHeader {...props} />
        })}
      />
    </OrderStack.Navigator>
  );

  function CustomDrawerContent({ progress, ...rest }) {
    const translateX = Animated.interpolate(progress, {
      inputRange: [0, 1],
      outputRange: [-100, 0],
    });

    const { signOut } = React.useContext(AuthContext);

    return (
      <DrawerContentScrollView {...rest}>
        <Animated.View style={{ transform: [{ translateX }] }}>
          <DrawerItemList {...rest} />
          <DrawerItem label="Signout" onPress={signOut} />
        </Animated.View>
      </DrawerContentScrollView>
    );
  }

  const ProfileStackScreen = () => (
    <ProfileStack.Navigator>
      <ProfileStack.Screen name="Profile" component={Profile} />
    </ProfileStack.Navigator>
  );

  function TabsScreen() {
    const CartTotalItem = useSelector(state => state.cartReducer.TotalItems)
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            if (route.name === 'Home') {
              return (
                <Ionicons
                  name={
                    focused
                      ? 'ios-information-circle'
                      : 'ios-information-circle-outline'
                  }
                  size={size}
                  color={color}
                />
              );
            } else if (route.name === 'Setthttps://stackoverflow.com/questions/49234412/react-navigation-styling-tabnavigator-textings') {
              return (
                <Ionicons
                  name={focused ? 'ios-list-box' : 'ios-list'}
                  size={size}
                  color={color}
                />
              );
            }
          },
        })}
        tabBarOptions={{
          activeTintColor: '#568121',
          inactiveTintColor: 'gray',
          style: {
            paddingVertical: 5,
            paddingBottom: 0,
            height: 60,
          },
          labelStyle: {
            fontSize: 12,
            margin: 0,
            paddingBottom: 5,
            fontFamily: 'ProximaNovaRegular',
          },
        }}
      >
        <Tab.Screen name="Home" component={HomeStackScreen}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({ color }) => (
              <Ionicons name="home" color={color} size={26} />
            ),
          }}
        />

        <Tab.Screen name="Search" component={SearchScreen}
          options={{
            tabBarLabel: 'Search',
            tabBarIcon: ({ color }) => (
              <Ionicons name="search" color={color} size={26} />
            ),
          }}
        />

        <Tab.Screen name="Wishlist" component={WishlistStackScreen}
          options={{
            tabBarLabel: 'Wishlist',
            tabBarIcon: ({ color }) => (
              <Ionicons name="heart-outline" color={color} size={26} />
            ),
          }}
        />

        <Tab.Screen name="Cart" component={CartStackScreen}
          options={{
            tabBarLabel: 'Basket',
            tabBarBadge: CartTotalItem,
            tabBarIcon: ({ color }) => (
              <Ionicons name="basket-outline" color={color} size={26} />
            ),
          }}
        />
      </Tab.Navigator>
    )
  };

  const AuthStackScreen = () => (
    <AuthStack.Navigator>
      <AuthStack.Screen
        name="FirstScreen"
        component={FirstScreen}
        options={{
          headerShown: false
        }}
      />
      <AuthStack.Screen
        name="SignIn"
        component={LoginScreen}
        options={{
          headerLeft: (props) => (
            <SignInHeaderTitle
              {...props}
              onPress={() => {
                // Do something
              }}
            />
          ),
          title: '',
        }}
      />
      <AuthStack.Screen
        name="Signup"
        component={SignupScreen}
        options={{
          headerLeft: (props) => (
            <SignUpHeaderTitle
              {...props}
              onPress={() => {
                // Do something
              }}
            />
          ),
          title: '',
        }}
      />
      <AuthStack.Screen
        name="OTPScreen"
        component={OTPScreen}
        options={{
          headerLeft: (props) => (
            <LoginOTPHeaderTitle
              {...props}
              onPress={() => {
                // Do something
              }}
            />
          ),
          title: '',
        }}
      />
      <AuthStack.Screen
        name="Googlelogin"
        component={Googlelogin}
        options={{ title: "Create Account" }}
      />

      <AuthStack.Screen
        name="UpdateSocialDetail"
        component={UpdateSocialDetail}
        options={{ title: "Create Account" }}
      />

      <AuthStack.Screen
        name="Forgotpassword"
        component={ForgotPassword}
        options={{
          headerLeft: (props) => (
            <ForgotPassHeaderTitle
              {...props}
              onPress={() => {
                // Do something
              }}
            />
          ),
          title: '',
        }}
      />

      <AuthStack.Screen
        name="Forgotpasswordotp"
        component={ForgotOTPScreen}
        options={{
          headerLeft: (props) => (
            <ForgotOTPHeaderTitle
              {...props}
              onPress={() => {
                // Do something
              }}
            />
          ),
          title: '',
        }}
      />

      <AuthStack.Screen
        name="Changepassword"
        component={ChangePassword}
        options={{
          headerLeft: (props) => (
            <ResetPassHeaderTitle
              {...props}
              onPress={() => {
                // Do something
              }}
            />
          ),
          title: '',
        }}
      />
    </AuthStack.Navigator>
  );

  return (
    <Provider store={store}>
      <AuthContext.Provider value={authContext}>
        <NavigationContainer>
          {loginState.userToken !== null ? (
            <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />}>
              <Drawer.Screen name="Home" component={TabsScreen} />
              <Drawer.Screen name="Profile" component={ProfileStackScreen} />
              <Drawer.Screen name="Orders" component={OrderStackScreen} />
              <Drawer.Screen name="Notifications" component={Notifications} />
            </Drawer.Navigator>
          )
            :
            <AuthStackScreen />
          }
        </NavigationContainer>
      </AuthContext.Provider>
    </Provider>
  );
}

export default App;

 function SignInHeaderTitle() {
  const navigation = useNavigation();
  return (    
    <View style={HeaderStyle.headerContainer}>
      <AntDesign name="arrowleft" style={{ fontSize: 30,color: '#272727',padding: 3,
    marginLeft: 10}} onPress={() => navigation.goBack()} />
      <Text style={HeaderStyle.screenName}>Sign In</Text>
    </View>
  );
}

 function LoginOTPHeaderTitle() {
  const navigation = useNavigation();
  return (    
    <View style={HeaderStyle.headerContainer}>
      <AntDesign name="arrowleft" style={{ fontSize: 30,color: '#272727',padding: 3,
    marginLeft: 10}} onPress={() => navigation.goBack()} />
      <Text style={HeaderStyle.screenName}>Verify OTP</Text>
    </View>
  );
}

 function SignUpHeaderTitle() {
  const navigation = useNavigation();
  return (    
    <View style={HeaderStyle.headerContainer}>
      <AntDesign name="arrowleft" style={{ fontSize: 30,color: '#272727',padding: 3,
    marginLeft: 10}} onPress={() => navigation.goBack()} />
      <Text style={HeaderStyle.screenName}>Sign Up</Text>
    </View>
  );
}

 function ForgotPassHeaderTitle() {
  const navigation = useNavigation();
  return (    
    <View style={HeaderStyle.headerContainer}>
      <AntDesign name="arrowleft" style={{ fontSize: 30,color: '#272727',padding: 3,
    marginLeft: 10}} onPress={() => navigation.goBack()} />
      <Text style={HeaderStyle.screenName}>Forgot Password</Text>
    </View>
  );
}

 function ForgotOTPHeaderTitle() {
  const navigation = useNavigation();
  return (    
    <View style={HeaderStyle.headerContainer}>
      <AntDesign name="arrowleft" style={{ fontSize: 30,color: '#272727',padding: 3,
    marginLeft: 10}} onPress={() => navigation.goBack()} />
      <Text style={HeaderStyle.screenName}>Verify OTP</Text>
    </View>
  );
}

 function ResetPassHeaderTitle() {
  const navigation = useNavigation();
  return (    
    <View style={HeaderStyle.headerContainer}>
      <AntDesign name="arrowleft" style={{ fontSize: 30,color: '#272727',padding: 3,
    marginLeft: 10}} onPress={() => navigation.goBack()} />
      <Text style={HeaderStyle.screenName}>Reset Password</Text>
    </View>
  );
}