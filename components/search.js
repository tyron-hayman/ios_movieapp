import React, { useState, useEffect, useRef } from 'react';
import { NavigationContainer, useNavigation, useFocusEffect } from "@react-navigation/native";
import { StatusBar } from 'expo-status-bar';
import ReactNative, { ActivityIndicator, ScrollView, ImageBackground, Image, StyleSheet, TextInput, View, Dimensions, TouchableWithoutFeedback, Text, Pressable, NativeModules } from 'react-native';
import { BlurView } from 'expo-blur';
import { BearerToken } from '@env';
import Ionicons from '@expo/vector-icons/Ionicons';
import GlobalLoader from './loader';
import GlobalModal from './modals';

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
const icoDimen = { size : 20, color: 'white' };
let searchTimer = 0;
let scrollTimer = 0;
const ScrollViewManager = NativeModules.ScrollViewManager;

const Search = ({ route }) => {
    const [searchInitText, setSearchInitText] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [searchPage, setSearchPage] = useState(1);
    const [searchResults, setSearchResults] = useState([]);
    const [scrollHeight, setScrollHeight] = useState();
    const [searchFilters, setSearchFilters] = useState([]);
    const [openModal, setOpenModal] = useState(false);
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

    const scrollRef = useRef();

    useEffect(() => {
      initSearch();
    }, []);

    let initSearch = () => {

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
            setSearchInitText(response.results);
        })
        .catch(error => console.error(error))
        .finally(() => {
            setLoading(false);
        });

    }
    

    let doSearch = (text, page) => {

      setSearchText(text);
      clearTimeout(searchTimer);

      searchTimer = setTimeout(() => {
      
      let searchArr = searchResults;

      if ( text != searchText ) {
        setSearchPage(1)
        searchArr = [];
        setSearchResults([]);
      }

      const options = {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          Authorization: 'Bearer ' + BearerToken
        }
      };
  
      fetch('https://api.themoviedb.org/3/search/multi?query=' + encodeURIComponent(text) + '&include_adult=false&language=en-US&page=' + page, options)
        .then(response => response.json())
        .then(response => {
          searchArr.push(response.results);
          setSearchResults(searchArr);
          if ( text == '' ) {
            setSearchResults([]);
          }
        })
        .catch(error => console.error(error))
        .finally(() => {
            setLoading(false);
        });

      }, 500);

    }

    let updateSearch = (text, page) => {
        let term = text;
        let pageNum = page + 1;
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
          doSearch(term, pageNum);
          setSearchPage(pageNum)
        }, 200);
    }

    let handleScroll = (event) => {
      event.persist();
      let e = event;
      let scrollDis = e.nativeEvent.contentOffset.y;
      let scrollMax = scrollHeight - 850;
  
      if ( scrollDis > scrollMax && scrollDis > 200 ) {
        updateSearch(searchText, searchPage);
      }
      
     };

    let updateModalVis = (value) => {
        if ( value ) {
          setOpenModal(false);
        } else {
          setOpenModal(true);
        }
    }

    return (
        <View style={styles.container}>
            {loading ? (
                <GlobalLoader />
            ) : (
                <>
                  <BlurView intensity={50} tint="dark" style={styles.searchWrap}>
                        <TextInput
                            style={styles.searchBox}
                            value={searchText}
                            onChangeText={text => { 
                              doSearch(text, 1);
                            }}
                            placeholder='Search movies, tv, people'
                            placeholderTextColor="#777777"
                            clearButtonMode="while-editing"
                            keyboardAppearance="dark"
                        />
                    </BlurView>
                    <ScrollView style={styles.creditScrollView}
                      pagingEnabled={false}
                      horizontal={false}
                      showsHorizontalScrollIndicator={false}
                      ref={scrollRef}
                      scrollEventThrottle={10}
                      onContentSizeChange={(contentWidth, contentHeight) => {
                        if ( contentHeight != scrollHeight ) {
                          setScrollHeight(contentHeight);
                        }
                      }}
                    >
                      <View style={styles.creditBoxViewWrap}>
                        {(searchResults.length > 0 ) ? (
                        searchResults[0]?.map((result, i) => {
                          let mediaLink = { "type" : null, "id" : null, "poster" : null };
                          if ( result.media_type == "movie" ) {
                            mediaLink = { "type" : "Movie", "id" : result.id, "poster" : result.poster_path }
                          } else if ( result.media_type == "person" ) {
                            mediaLink = { "type" : "People", "id" : result.id, "poster" : result.profile_path }
                          } else if ( result.media_type == "tv" ) {
                            mediaLink = { "type" : "Television", "id" : result.id, "poster" : result.poster_path }
                          }
                          let hasMedia = mediaLink.poster;
                          if ( hasMedia ) {
                          return(
                            <View key={i} style={styles.creditBoxView}>
                              <TouchableWithoutFeedback onPress={() =>
                                  navigation.navigate(mediaLink.type, { id: mediaLink.id })
                                }
                              >
                                  <ImageBackground source={{ uri : imgPath + mediaLink.poster }} resizeMode="cover" style={styles.creditBox}>
                                  </ImageBackground>
                              </TouchableWithoutFeedback>
                            </View>
                          );
                          }
                        })
                        ) : (
                          <View style={styles.noResultsWrap}>
                            <Text style={styles.searchInitHeading}>Trending</Text>
                            <ScrollView style={styles.noResultsKeywordScrollview}
                              pagingEnabled={false}
                              horizontal={true}
                              showsHorizontalScrollIndicator={false}
                            >
                              {searchInitText?.map((result, i) => {
                                let mediaTitle, mediaLink;
                                if ( result.media_type == "movie" ) {
                                  mediaTitle = result.original_title;
                                  mediaLink = { "type" : "Movie", "id" : result.id }
                                } else if ( result.media_type == "person" ) {
                                  mediaTitle = result.original_name;
                                  mediaLink = { "type" : "People", "id" : result.id }
                                } else if ( result.media_type == "tv" ) {
                                  mediaTitle = result.original_name;
                                  mediaLink = { "type" : "Television", "id" : result.id }
                                }
                                return(
                                  <TouchableWithoutFeedback key={i} onPress={() =>
                                      navigation.navigate(mediaLink.type, { id: mediaLink.id })
                                    }
                                  >
                                    <Text style={styles.noResultsKeywords}>{mediaTitle}</Text>
                                  </TouchableWithoutFeedback>
                                )
                              })}
                            </ScrollView>
                          </View>
                        )}
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
  "white50": 'rgba(255,255,255,0.1)'
}

const styles = StyleSheet.create({
    container: {
        width: windowWidth,
        flex: 1,
        backgroundColor: branding.black,
        alignItems: 'flex-start'
      },
      searchWrap: {
        position: 'absolute',
        width: windowWidth,
        top: 0,
        left: 0,
        backgroundColor: branding.black50,
        padding: 20,
        paddingTop: 60,
        zIndex: 10,
        flex: 1,
        flexWrap: 'wrap',
        flexDirection: 'row',
        alignContent: 'flex-start',
        justifyContent: 'space-between',
      },
      searchBox: {
        backgroundColor: branding.white50,
        padding: 15,
        fontFamily: 'DMSans_500Medium',
        color: branding.white,
        fontSize: 18,
        borderRadius: 9999,
        width: '100%'
      },
      filtersBtn: {
        overflow: 'hidden',
        borderRadius: 9999,
        position: 'relative',
        zIndex: 5
      },
      filtersBtnIcon: {
        backgroundColor: branding.white,
        padding: 20
      },
      searchInitHeading: {
        fontFamily: 'DMSans_700Bold',
        color: branding.white,
        fontSize: 20,
        marginBottom: 20
      },
      creditScrollView: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 160,
      },
      creditBoxViewWrap: {
        flex: 1,
        width: '100%',
        flexWrap: 'wrap',
        flexDirection: 'row',
        alignContent: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: 240
      },
      noResults: {
        fontFamily: 'DMSans_500Medium',
        color: branding.white,
        fontSize: 18,
      },
      creditBoxView: {
        width: ( windowWidth / 2 ) - 30,
        height: (( windowWidth / 2 ) - 30 ) * 1.5,
        borderRadius: 15,
        overflow: 'hidden',
        marginBottom: 20
      },
      creditBox: {
        width: '100%',
        height: '100%'
      },
      noResultsWrap: {
        width: windowWidth,
      },
      noResultsKeywordScrollview: {
        flex: 1,
        width: '100%',
        flexDirection: 'row'
      },
      noResultsKeywords: {
        backgroundColor: branding.black,
        borderColor: branding.white,
        borderWidth: 2,
        borderStyle: 'solid',
        color: branding.black,
        fontFamily: 'DMSans_500Medium',
        color: branding.white,
        fontSize: 16,
        padding: 10,
        paddingLeft: 20,
        paddingRight: 20,
        marginRight: 20,
        borderRadius: 20,
        overflow: 'hidden'
      },
      modalView: {
        margin: 20,
        marginTop: 60,
        backgroundColor: branding.white,
        borderRadius: 20,
        padding: 35,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 7,
      },
      button: {
        borderRadius: 20,
        padding: 10,
        elevation: 21,
      },
      buttonClose: {
        backgroundColor: '#2196F3',
      },
      modalHeading: {
        fontFamily: 'DMSans_700Bold',
        color: branding.black,
        fontSize: 30,
      }
});

export default Search;