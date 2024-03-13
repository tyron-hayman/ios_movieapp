import React, { useState, useEffect } from 'react';
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, ScrollView, ImageBackground, Image, StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BearerToken } from '@env';
import Ionicons from '@expo/vector-icons/Ionicons';

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

const People = ({ route }) => {
    const [personDetails, setPersonDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dimensions, setDimensions] = useState({
        height: windowHeight,
    });
    const imgPath = "https://image.tmdb.org/t/p/w780";
    const imgPathProfile = "https://image.tmdb.org/t/p/original";
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

        const options = {
            method: 'GET',
            headers: {
              "Content-Type": "application/json",
              Authorization: 'Bearer ' + BearerToken
            }
          };
      
          fetch('https://api.themoviedb.org/3/person/' + route.params.id, options)
            .then(response => response.json())
            .then(response => {
                setPersonDetails(response);
                console.log(response);
            })
            .catch(error => console.error(error))
            .finally(() => {
                setLoading(false);
            });

    }, []);

    let getMovieCredits = (id) => {

        const options = {
            method: 'GET',
            headers: {
              "Content-Type": "application/json",
              Authorization: 'Bearer ' + BearerToken
            }
          };
      
          fetch('https://api.themoviedb.org/3/tv/' + id + '/credits', options)
            .then(response => response.json())
            .then(response => {
                setMovieCredits(response);
            })
            .catch(error => console.error(error))

    }

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#FE8615" />
            ) : (
                <ScrollView style={styles.scrollView}>
                    <View style={styles.profileImageMain}>
                        <ImageBackground source={{ uri : imgPathProfile + personDetails.profile_path }} style={styles.profileImage}>
                        </ImageBackground>
                    </View>
                    <View style={styles.castDetails}>
                        <Text style={styles.castName}>{personDetails.name}</Text>
                        <Text style={styles.castBio}>{personDetails.biography}</Text>
                    </View>
                </ScrollView>
            )}
        </View>
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
      profileImageMain: {
        flex: 1,
        width: windowWidth,
        alignItems: 'center',
        marginTop: 80,
        marginBottom: 50,
      },
      profileImage: {
        width: windowWidth - 100,
        height: windowWidth - 100,
        borderRadius: 9999,
        overflow: 'hidden'
      },
      castDetails: {
        paddingLeft: '5%',
        paddingRight: '5%'
      },
      castName: {
        fontFamily: 'DMSans_700Bold',
        color: branding.white,
        fontSize: 30,
        marginBottom: 30
      },
      castBio: {
        fontFamily: 'DMSans_500Medium',
        color: branding.white,
        fontSize: 18,
        lineHeight: 30
      }
});

export default People;