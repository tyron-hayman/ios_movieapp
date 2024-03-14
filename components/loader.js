import React from 'react';
import { ActivityIndicator , StyleSheet, View, Dimensions  } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const branding = {
    "yellow" : '#FCA708',
    "red"    : '#F72B02',
    "black"  : '#000000',
    "white"  : '#FFFFFF',
    "black50": 'rgba(0,0,0,0.5)'
  }

const GlobalLoader = (props) => {
  return (
            <View style={styles.loaderWrap}><ActivityIndicator size="large" color={branding.red} style={styles.loadermain} /></View>
  );
}

const styles = StyleSheet.create({
    loaderWrap: {
        width: windowWidth,
        height: windowHeight,
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center'
      },
      loadermain: {
      },
});

export default GlobalLoader;