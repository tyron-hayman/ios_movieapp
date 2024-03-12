import React, { useState, useEffect } from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, ScrollView, ImageBackground, Image, StyleSheet, Text, View, Dimensions, RootTagContext } from 'react-native';
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

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const Stack = createNativeStackNavigator();

const AboutScreen = (props) => {
    const [content, setContent] = useState([]);
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

        const content = require('../assets/content/about.json');
        setContent(content);
        setLoading(false);

    }, []);

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#FE8615" />
            ) : (
                <ScrollView style={styles.scrollView}>
                    <View style={styles.aboutHeader}>
                        <Text style={styles.mainTitle}>{content.title}</Text>
                    </View>
                    <View style={styles.aboutContent}>
                        <Text style={styles.content}>{content.content}</Text>
                    </View>
                    <View style={styles.devTitle}>
                        <Text style={styles.mainTitle}>{content.subtitle}</Text>
                    </View>
                    <View style={styles.aboutContent}>
                        <Text style={styles.content}>{content.sub_content}</Text>
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
      aboutHeader: {
        marginTop: 100,
        paddingLeft: '5%',
        marginBottom: 30
      },
      mainTitle: {
        color: branding.white,
        fontFamily: 'DMSans_500Medium',
        fontSize: 30
      },
      devTitle: {
        marginTop: 50,
        paddingLeft: '5%',
        marginBottom: 30
      },
      aboutContent: {
        paddingLeft: '5%',
        paddingRight: '5%'
      },
      content: {
        fontSize: 18,
        color: branding.white
      }
});

export default AboutScreen;