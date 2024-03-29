import React, { useState, useEffect } from 'react';
import { ActivityIndicator, ScrollView, ImageBackground, Image, StyleSheet, Text, View, Dimensions, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { NavigationContainer, useNavigation, useFocusEffect } from "@react-navigation/native";
import Animated, { FadeIn, FadeOut, useAnimatedStyle, useSharedValue, interpolate, extrapolation } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BearerToken } from '@env';
import {
  useFonts,
  DMSans_400Regular,
  DMSans_400Regular_Italic,
  DMSans_500Medium,
  DMSans_500Medium_Italic,
  DMSans_700Bold,
  DMSans_700Bold_Italic,
} from '@expo-google-fonts/dm-sans';
import GlobalLoader from './loader';
import Slider from './slider';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const HomeScreen = (props) => {
  const [featuredMovie, setFeaturedMovie] = useState([]);
  const [trendingMovie, setTrendingMovie] = useState([]);
  const [featuredTV, setFeaturedTV] = useState([]);
  const [featuredPeople, setFeaturedPeople] = useState([]);
  const [popMovie, setPopMovie] = useState([]);
  const [popMovieDetails, setPopMovieDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dimensions, setDimensions] = useState({
    height: windowHeight,
  });
  const imgPath = "https://image.tmdb.org/t/p/w780";
  const navigation = useNavigation();
  const offset = useSharedValue(0);

  let [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_400Regular_Italic,
    DMSans_500Medium,
    DMSans_500Medium_Italic,
    DMSans_700Bold,
    DMSans_700Bold_Italic,
  });

  useEffect(() => {
    initHome();
  }, []);

  let initHome = () => {
    const options = {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        Authorization: 'Bearer ' + BearerToken
      }
    };

    fetch('https://api.themoviedb.org/3/trending/all/day', options)
      .then(response => response.json())
      .then(response => {
        let movies = response.results.slice(1, 11);
        setFeaturedMovie(movies);
        trendingMovies();
        setPopMovie([{"title" : response.results[0].title, "backdrop_path" : imgPath + response.results[0].poster_path, "vote_average" : response.results[0].vote_average }]);
        getMovieDetails(response.results[0].id);
        trendingTV();
        trendingPeople();
      })
      .catch(error => console.error(error))
      .finally(() => {
        setLoading(false);
      });
  }

  let trendingMovies = () => {

    const options = {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        Authorization: 'Bearer ' + BearerToken
      }
    };

    fetch('https://api.themoviedb.org/3/trending/movie/day', options)
      .then(response => response.json())
      .then(response => {
        let movies = response.results.slice(0, 10);
        setTrendingMovie(movies);
      })
      .catch(error => console.error(error))

  }

  let trendingTV = () => {

    const options = {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        Authorization: 'Bearer ' + BearerToken
      }
    };

    fetch('https://api.themoviedb.org/3/trending/tv/day', options)
      .then(response => response.json())
      .then(response => {
        let tv = response.results.slice(0, 10);
        setFeaturedTV(tv);
      })
      .catch(error => console.error(error))

  }

  let trendingPeople = () => {

    const options = {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        Authorization: 'Bearer ' + BearerToken
      }
    };

    fetch('https://api.themoviedb.org/3/trending/person/day', options)
      .then(response => response.json())
      .then(response => {
        let people = response.results.slice(0, 10);
        setFeaturedPeople(people);
      })
      .catch(error => console.error(error))

  }

  let getMovieDetails = async (id) => {

    const options = {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        Authorization: 'Bearer ' + BearerToken
      }
    };

    fetch('https://api.themoviedb.org/3/movie/' + id, options)
      .then(response => response.json())
      .then(response => {
        const d = new Date(response.release_date);
        let dateName = d.getFullYear();
        setPopMovieDetails({"release_date" : dateName, "runtime" : response.runtime, "genres" : response.genres })
      })
      .catch(error => console.error(error));

  }

  return (
    <View style={styles.container}>
        <LinearGradient
        // Background Linear Gradient
        colors={['#0f0c29', '#000000']}
        style={styles.background}
      >
          {loading ? (
            <GlobalLoader />
          ) : (
            <ScrollView style={styles.scrollView}>
                <View style={styles.featureSlider}>
                <Slider data={featuredMovie} />
                </View>
                <View style={styles.moviePopularList}>
                    <Text style={styles.moviePopularListTitle}>Trending Movies</Text>
                </View>
                <ScrollView style={styles.scrollViewTrending}
                  pagingEnabled={false}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                >
                    {trendingMovie?.map((tren_movie, i) => {
                      return(
                        <View key={i} style={styles.trendingMovieBox}>
                          <TouchableWithoutFeedback onPress={() =>
                              navigation.navigate('Movie', { id: tren_movie.id })
                            }
                          >
                              <ImageBackground source={{ uri : imgPath + tren_movie.poster_path }} resizeMode="cover" style={styles.trendingMovieBG}>
                              </ImageBackground>
                          </TouchableWithoutFeedback>
                        </View>
                      );
                    })}
                </ScrollView>
                <View style={styles.moviePopularList}>
                    <Text style={styles.moviePopularListTitle}>Trending TV</Text>
                </View>
                <ScrollView style={styles.scrollViewTrending}
                  pagingEnabled={false}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                >
                    {featuredTV?.map((tren_tv, i) => {
                      return(
                        <View key={i} style={styles.trendingMovieBox}>
                          <TouchableWithoutFeedback onPress={() =>
                              navigation.navigate('Television', { id: tren_tv.id })
                            }
                          >
                              <ImageBackground source={{ uri : imgPath + tren_tv.poster_path }} resizeMode="cover" style={styles.trendingMovieBG}>
                              </ImageBackground>
                          </TouchableWithoutFeedback>
                        </View>
                      );
                    })}
                </ScrollView>
                <View style={styles.moviePopularList}>
                    <Text style={styles.moviePopularListTitle}>Trending People</Text>
                </View>
                <ScrollView style={styles.scrollViewTrending}
                  pagingEnabled={false}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                >
                    {featuredPeople?.map((tren_ppl, i) => {
                      if ( tren_ppl.profile_path ) {
                      return(
                        <View key={i} style={styles.trendingMovieBox}>
                          <TouchableWithoutFeedback onPress={() =>
                              navigation.navigate('People', { id: tren_ppl.id })
                            }
                          >
                              <ImageBackground source={{ uri : imgPath + tren_ppl.profile_path }} resizeMode="cover" style={styles.trendingMovieBG}>
                              </ImageBackground>
                          </TouchableWithoutFeedback>
                        </View>
                      );
                      }
                    })}
                </ScrollView>
            </ScrollView>
          )}
      </LinearGradient>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    width: windowWidth,
    flex: 1,
  },
  featureSlider : {
    width: windowWidth,
    marginBottom: 100,
    marginTop: 100
  },
  scrollViewfeatureSlider: {
    width : windowWidth,
  },
  featureSlide: {
    width : windowWidth,
  },
  featureImage: {
    width: windowWidth - 50,
    height: ( windowWidth - 50 ) * 1.5,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow : 'hidden'
  },
  backgroundGrad: {
    width: windowWidth,
    height: windowWidth * 1.5,
    flex: 1,
    alignContent: 'flex-start',
    justifyContent: 'flex-end'
  },
  movieDetails: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  featuredMovieHeadinng: {
    fontFamily: 'DMSans_500Medium',
    color: branding.white,
    fontSize: 15,
    marginRight: 10,
    padding: 10,
    shadowColor: branding.black,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
  },
  movieDetailsTitle: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  featuredMovieTitle: {
    fontFamily: 'DMSans_700Bold',
    color: branding.white,
    fontSize: 40,
    marginLeft: 10,
    shadowColor: branding.black,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
  },
  movieDetailsGenre: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
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
  moviePopularListTitle: {
    fontFamily: 'DMSans_700Bold',
    color: branding.white,
    fontSize: 20,
    marginBottom: 20,
    marginLeft: '5%',
    shadowColor: branding.black,
  },
  scrollViewTrending: {
    flex: 1,
    paddingLeft: '5%',
    marginBottom: 100
  },
  trendingMovieBox: {
    width: 150,
    marginRight: 30,
    borderRadius: 15,
    overflow: 'hidden'
  },
  trendingMovieBG: {
    width: '100%',
    height: 150 * 1.5
  }
});

export default HomeScreen;