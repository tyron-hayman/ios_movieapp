import React, { useState, useEffect } from 'react';
import { NavigationContainer, useNavigation, useFocusEffect } from "@react-navigation/native";
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, ScrollView, ImageBackground, Image, StyleSheet, Text, View, Dimensions, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
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

const Television = ({ route }) => {
    const [movieDetails, setMovieDetails] = useState([]);
    const [movieDetailsDate, setMovieDetailsDate] = useState([]);
    const [movieCredits, setMovieCredits] = useState([]);
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

    useFocusEffect(
      React.useCallback(() => {
        setLoading(true);
    
        initTV(route.params.id);
    
        return () => {
          setLoading(false);
        };
      }, [route.params.id])
    );

    useEffect(() => {
      initTV(route.params.id)
    }, []);

    let initTV = (id) => {
      const options = {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          Authorization: 'Bearer ' + BearerToken
        }
      };
  
      fetch('https://api.themoviedb.org/3/tv/' + id, options)
        .then(response => response.json())
        .then(response => {
            const d = new Date(response.last_air_date);
            let dateName = d.getFullYear();
            setMovieDetails(response);
            setMovieDetailsDate(dateName);
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
                    <ImageBackground source={{ uri : imgPath + movieDetails.poster_path }} style={styles.featuredMovie}>
                        <LinearGradient
                            // Background Linear Gradient
                            colors={['transparent', 'rgba(0,0,0,1)']}
                            style={styles.backgroundGrad}
                        >
                        <View style={styles.movieDetailsGenre}>
                            {movieDetails.genres?.map((genre, i) => {
                            return(<Text key={i} style={styles.featuredMovieGenres}>{genre.name}</Text>);
                            })}
                        </View>
                        <View style={styles.movieDetailsTitle}>
                            <Text style={styles.featuredMovieTitle}>{movieDetails.name}</Text>
                        </View>
                        </LinearGradient>
                    </ImageBackground>
                    <View style={styles.movieDetails}>
                        <Text style={styles.movieDetailsHeadinng}><Ionicons style={styles.navicons} name="calendar" size={icoDimen.size} color={icoDimen.color} /> {movieDetailsDate}</Text>
                        {(movieDetails.last_episode_to_air) ? (
                          <Text style={styles.movieDetailsHeadinng}><Ionicons style={styles.navicons} name="timer" size={icoDimen.size} color={icoDimen.color} /> {movieDetails.last_episode_to_air.runtime} MIN</Text>
                        ) : (null)}
                        <Text style={styles.movieDetailsHeadinng}><Ionicons style={styles.navicons} name="star" size={icoDimen.size} color="#FCA708" /> {Math.round(movieDetails.vote_average)}/10</Text>
                    </View>
                    <View style={styles.movieDetailsDesc}>
                        <Text style={styles.movieDescHeading}>Overview</Text>
                        <Text style={styles.movieDesc}>{movieDetails.overview}</Text>
                    </View>
                    <View style={styles.movieDetailsCast}>
                        <Text style={styles.movieDetailsCastHeading}>Cast</Text>
                        <ScrollView style={styles.scrollViewCast}
                            pagingEnabled={false}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                        >
                        {movieCredits.cast?.map((movieCredit, i) => {
                            if ( movieCredit.profile_path != "" && movieCredit.profile_path ) {
                                return(
                                    <View key={i} style={styles.creditView}>
                                    <TouchableWithoutFeedback onPress={() =>
                                        navigation.navigate('People', { id: movieCredit.id })
                                    }
                                    >
                                        <ImageBackground source={{ uri : imgPathProfile + movieCredit.profile_path }} resizeMode="cover" style={styles.creditImage}>
                                        </ImageBackground>
                                    </TouchableWithoutFeedback>
                                </View>
                                );
                            }
                        })}
                        </ScrollView>
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
      featuredMovie: {
        width: windowWidth,
        height: windowWidth * 1.5,
        marginBottom: 20,
        flex: 1,
        alignContent: 'flex-start',
        justifyContent: 'flex-end'
      },
      backgroundGrad: {
        width: windowWidth,
        height: windowWidth * 1.5,
        flex: 1,
        alignContent: 'flex-start',
        justifyContent: 'flex-end'
      },
      movieDetailsGenre: {
        paddingLeft: '5%',
        paddingRight: '5%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        marginBottom: 10,
      },
      featuredMovieGenres: {
        fontFamily: 'DMSans_500Medium',
        backgroundColor: branding.white,
        color: branding.black,
        fontSize: 13,
        margin: 10,
        padding: 10,
        borderRadius: 18,
        overflow: 'hidden'
      },
      movieDetails: {
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'flex-start'
      },
      movieDetailsTitle: {
        paddingLeft: '5%',
        paddingRight: '5%',
      },
      featuredMovieTitle: {
        fontFamily: 'DMSans_700Bold',
        color: branding.white,
        fontSize: 40,
        shadowColor: branding.black,
        shadowOffset: {
          width: 0,
          height: 6,
        },
        shadowOpacity: 0.37,
        shadowRadius: 7.49,
        elevation: 12,
      },
      movieDetailsDesc: {
        paddingLeft: '5%',
        paddingRight: '5%'
      },
      movieDescHeading: {
        fontFamily: 'DMSans_700Bold',
        color: branding.white,
        fontSize: 25,
        marginBottom: 20
      },
      movieDesc: {
        fontFamily: 'DMSans_500Medium',
        color: branding.white,
        fontSize: 16,
      },
      movieDetails: {
        width: '90%',
        paddingLeft: '5%',
        marginBottom: 30,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
      },
      movieDetailsHeadinng: {
        fontFamily: 'DMSans_500Medium',
        color: branding.white,
        fontSize: 16,
        marginRight: 20
      },
      movieDetailsCast: {
        flex: 1,
        marginBottom: 100,
      },
      scrollViewCast: {
        paddingLeft: '5%'
      },
      movieDetailsCastHeading: {
        fontFamily: 'DMSans_700Bold',
        color: branding.white,
        fontSize: 25,
        marginBottom: 20,
        marginTop: 30,
        paddingLeft: '5%'
      },
      creditImage: {
        width: 110,
        height: 110,
        marginRight: 30,
        borderRadius: 100,
        overflow: 'hidden'
      }
});

export default Television;