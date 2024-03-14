import React, { useState, useEffect } from 'react';
import { NavigationContainer, useNavigation, useFocusEffect, Link } from "@react-navigation/native";
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, ScrollView, ImageBackground, Image, StyleSheet, Text, View, Dimensions, TouchableOpacity, Button } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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

const People = ({ route }) => {
    const [personDetails, setPersonDetails] = useState([]);
    const [creditDetails, setCreditDetails] = useState([]);
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

    useFocusEffect(
      React.useCallback(() => {
        setLoading(true);
    
        initPeople(route.params.id);
    
        return () => {
          setLoading(false);
        };
      }, [route.params.id])
    );


    useEffect(() => {
      initPeople(route.params.id);
    }, []);

    let initPeople = (id) => {
      const options = {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          Authorization: 'Bearer ' + BearerToken
        }
      };
  
      fetch('https://api.themoviedb.org/3/person/' + id, options)
        .then(response => response.json())
        .then(response => {
            setPersonDetails(response);
            getMovieCredits(route.params.id);
        })
        .catch(error => console.error(error))
        .finally(() => {
            setLoading(false);
        });
    }

    let getMovieCredits = (id) => {

        const options = {
            method: 'GET',
            headers: {
              "Content-Type": "application/json",
              Authorization: 'Bearer ' + BearerToken
            }
          };
      
          fetch('https://api.themoviedb.org/3/person/' + id + '/combined_credits', options)
            .then(response => response.json())
            .then(response => {
              setCreditDetails(response);
              console.log(response);
            })
            .catch(error => console.error(error))

    }

    return (
        <View style={styles.container}>
            {loading ? (
                <GlobalLoader />
            ) : (
              <>
              <TouchableOpacity style={styles.backBtn} onPress={() =>
                        navigation.goBack()
                      }
                    >
                      <Ionicons name="chevron-back-outline" size={icoDimen.size} color={icoDimen.color} />
                    </TouchableOpacity>
                <ScrollView style={styles.scrollView}>
                    <View style={styles.profileImageMain}>
                        <ImageBackground resizeMode='cover' source={{ uri : imgPathProfile + personDetails.profile_path }} style={styles.profileImage}>
                        <LinearGradient
                        // Background Linear Gradient
                        colors={['transparent', 'rgba(0,0,0,1)']}
                        style={styles.backgroundGrad}
                        ></LinearGradient>
                        </ImageBackground>
                    </View>
                    <View style={styles.castDetails}>
                        <Text style={styles.castName}>{personDetails.name}</Text>
                        <Text style={styles.castBio}>{personDetails.biography}</Text>
                    </View>
                    <View style={styles.castCreditTitle}>
                    <Text style={styles.castCredit}>Known For</Text>
                    </View>
                    <ScrollView style={styles.creditScrollView}
                      pagingEnabled={false}
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                    >
                        {creditDetails.cast?.map((credit, i) => {
                          if ( credit.poster_path ) {
                          let mediaLink;
                          if ( credit.media_type == "move" ) {
                            mediaLink = { "type" : "Movie", "id" : credit.id }
                          } else {
                            mediaLink = { "type" : "Movie", "id" : credit.id }
                          }
                          return(
                            <View key={i} style={styles.creditBoxView}>
                              <TouchableOpacity onPress={() =>
                                  navigation.navigate(mediaLink.type, { id: mediaLink.id })
                                }
                              >
                                  <ImageBackground source={{ uri : imgPath + credit.poster_path }} resizeMode="cover" style={styles.creditBox}>
                                  </ImageBackground>
                              </TouchableOpacity>
                            </View>
                          );
                          }
                        })}
                    </ScrollView>
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
      backBtn: {
        position: 'absolute',
        left: '5%',
        top: 60,
        zIndex: 10,
        backgroundColor: branding.black,
        padding: 10,
        borderRadius: 9999,
        overflow: 'hidden'
      },
      backgroundGrad: {
        width: windowWidth,
        height: 350
      },
      profileImageMain: {
        flex: 1,
        width: windowWidth,
        alignItems: 'center',
        marginBottom: 50,
      },
      profileImage: {
        width: windowWidth,
        height: windowWidth * 1.5,
        overflow: 'hidden',
        flex: 1,
        justifyContent: 'flex-end'
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
      },
      castCreditTitle: {
        marginTop: 60,
        paddingLeft: '5%',
        paddingRight: '5%'
      },
      castCredit: {
        fontFamily: 'DMSans_500Medium',
        color: branding.white,
        fontSize: 25,
        marginBottom: 20,
      },
      creditScrollView: {
        flex: 1,
        paddingLeft: '5%',
        marginBottom: 100
      },
      creditBoxView: {
        width: 200,
        marginRight: 30,
        borderRadius: 15,
        overflow: 'hidden'
      },
      creditBox: {
        width: '100%',
        height: 300
      }
});

export default People;