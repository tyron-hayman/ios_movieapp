import React, { useState, useEffect } from 'react';
import { NavigationContainer, useNavigation, useFocusEffect } from "@react-navigation/native";
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, ScrollView, ImageBackground, Image, StyleSheet, TextInput, View, Dimensions, TouchableOpacity } from 'react-native';
import { BearerToken } from '@env';
import Ionicons from '@expo/vector-icons/Ionicons';
import GlobalLoader from './loader';

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
const icoDimen = { size : 18, color: 'white' };

const Search = ({ route }) => {
    const [searchInit, setSearchInit] = useState([]);
    const [searchText, setSearchText] = useState('Search');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dimensions, setDimensions] = useState({
        height: windowHeight,
    });
    const imgPath = "https://image.tmdb.org/t/p/w780";
    const imgPathProfile = "https://image.tmdb.org/t/p/h632";
    const navigation = useNavigation();

    let [fontsLoaded] = useFonts({
        DMSans_400Regular,
        DMSans_400Regular_Italic,
        DMSans_500Medium,
        DMSans_500Medium_Italic,
        DMSans_700Bold,
        DMSans_700Bold_Italic,
    });

    useEffect(() => {
        setLoading(false);
    }, []);

    let initTV = (id) => {
      const options = {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          Authorization: 'Bearer ' + BearerToken
        }
      };
  
      fetch('https://api.themoviedb.org/3/trending/all/day' + id, options)
        .then(response => response.json())
        .then(response => {
            setSearchInit(response);
            console.log(response);
        })
        .catch(error => console.error(error))
        .finally(() => {
            setLoading(false);
        });
    }

    return (
        <View style={styles.container}>
            {loading ? (
                <GlobalLoader />
            ) : (
                <>
                <ScrollView style={styles.scrollView}>
                    <View style={styles.searchWrap}>
                        <TextInput
                            style={styles.searchBox}
                            value={searchText}
                        />
                    </View>
                    
                </ScrollView>
                </>
            )}
        </View>
    );
}

const branding = {
  "yellow" : '#FCA708',
  "red"    : '#F72B02',
  "black"  : '#000000',
  "white"  : '#FFFFFF',
  "black50": 'rgba(0,0,0,0.5)',
  "white50": 'rgba(255,255,255,0.5)'
}

const styles = StyleSheet.create({
    container: {
        width: windowWidth,
        flex: 1,
        backgroundColor: branding.black,
        alignItems: 'flex-start'
      },
      scrollView: {
        width: windowWidth,
        flex: 1
      },
      searchWrap: {
        paddingLeft: '5%',
        paddingRight: '5%',
        marginTop: 70,
      },
      searchBox: {
        backgroundColor: branding.white50,
        padding: 15,
        fontFamily: 'DMSans_500Medium',
        color: branding.black,
        fontSize: 18,
        borderRadius: 9999
      }
});

export default Search;