import React, { useState, useEffect } from 'react';
import { NavigationContainer, Link } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, ScrollView, ImageBackground, Image, StyleSheet, Text, View, Dimensions, RootTagContext } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BearerToken } from '@env';
import Ionicons from '@expo/vector-icons/Ionicons';
import HomeScreen from './components/home';
import AboutScreen from './components/about';
import Movies from './components/movies';
import Television from './components/television';

import {
  useFonts,
  DMSans_400Regular,
  DMSans_400Regular_Italic,
  DMSans_500Medium,
  DMSans_500Medium_Italic,
  DMSans_700Bold,
  DMSans_700Bold_Italic,
} from '@expo-google-fonts/dm-sans';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const icoDimen = { size : 25, color: '#000000' };
const Stack = createNativeStackNavigator();

export default function App() {
  const [loading, setLoading] = useState(true);
  const [dimensions, setDimensions] = useState({
    height: windowHeight,
  });

  let [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_400Regular_Italic,
    DMSans_500Medium,
    DMSans_500Medium_Italic,
    DMSans_700Bold,
    DMSans_700Bold_Italic,
  });

  useEffect(() => {

  }, []);

  return (
    <NavigationContainer>
        <StatusBar style='light' />
        <Stack.Navigator>
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name="About"
                component={AboutScreen}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name="Movie"
                component={Movies}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name="Television"
                component={Television}
                options={{headerShown: false}}
            />
        </Stack.Navigator>
        <View style={styles.mainNav}>
          <View style={styles.mainNavBox}>
            <Link to={{ screen: 'Home', params: { id: 'jane' } }} style={styles.navicons}>
              <Ionicons name="home-outline" size={icoDimen.size} color={icoDimen.color} />
            </Link>
            <Ionicons style={styles.navicons} name="search" size={icoDimen.size} color={icoDimen.color} />
            <Link to={{ screen: 'About', params: { id: 'jane' } }} style={styles.navicons}>
              <Ionicons name="help-outline" size={icoDimen.size} color={icoDimen.color} />
            </Link>
          </View>
        </View>
    </NavigationContainer>
  );
}

const branding = {
  "yellow" : '#FCA708',
  "red"    : '#F72B02',
  "black"  : '#000000',
  "white"  : '#FFFFFF',
  "black50": 'rgba(0,0,0,0.5)'
}

const styles = StyleSheet.create({
  mainNav: {
    position: 'absolute',
    width: windowWidth,
    bottom: 30,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  mainNavBox: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    flexDirection: 'row',
    backgroundColor: branding.white,
    borderRadius: 20,
    overflow: 'hidden'
  },
  navicons: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10 
  }
});
