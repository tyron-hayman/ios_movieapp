import React from "react";
import { View, SafeAreaView, Text, Dimensions, ImageBackground, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
  interpolateColor,
  Extrapolation,
} from "react-native-reanimated";
import Ionicons from "@expo/vector-icons/Ionicons";

const { width, height } = Dimensions.get("screen");

const textColor = "#ffffff";
const gray = "#444444";
const slideWidth = width * 0.70;
const slideHeight = ( width * 0.70 ) * 1.5;
const imgPath = "https://image.tmdb.org/t/p/w780";
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Slide = ({ slide, scrollOffset, index, navigation }) => {
  const animatedStyle = useAnimatedStyle(() => {
    const input = scrollOffset.value / slideWidth;
    const inputRange = [index - 1, index, index + 1];

    return {
      transform: [
        {
          scale: interpolate(
            input,
            inputRange,
            [0.8, 1, 0.8],
            Extrapolation.CLAMP
          ),
        },
      ],
    };
  });

  if ( slide.poster_path ) {
        let mediaLink;
        if ( slide.media_type == "movie" ) {
            mediaLink = { "type" : "Movie", "id" : slide.id }
        } else {
            mediaLink = { "type" : "Television", "id" : slide.id }
        }

        return (
            <Animated.View
            key={index}
            style={[
                {
                flex: 1,
                width: slideWidth,
                height: slideHeight,
                paddingVertical: 10,
                },
                animatedStyle,
            ]}
            >
            <View
                style={{
                alignItems: "center",
                height: "100%",
                justifyContent: "center",
                }}
            >
                <TouchableWithoutFeedback onPress={() =>
                    navigation.navigate(mediaLink.type, { id: mediaLink.id })
                }
                >
                    <ImageBackground source={{ uri : imgPath + slide.poster_path }} resizeMode="cover" style={styles.featureImage}>
                    </ImageBackground>
                </TouchableWithoutFeedback>
            </View>
            </Animated.View>
        );
    }
};

const Indicator = ({ scrollOffset, index }) => {
  const animatedStyle = useAnimatedStyle(() => {
    const input = scrollOffset.value / slideWidth;
    const inputRange = [index - 1, index, index + 1];
    const animatedColor = interpolateColor(input, inputRange, [
      gray,
      textColor,
      gray,
    ]);

    return {
      width: interpolate(input, inputRange, [15, 30, 15], Extrapolation.CLAMP),
      backgroundColor: animatedColor,
    };
  });

  return (
    <Animated.View
      style={[
        {
          marginHorizontal: 5,
          height: 15,
          borderRadius: 10,
          backgroundColor: '#ffffff',
        },
        animatedStyle,
      ]}
    />
  );
};

const Slider = (props) => {
    const navigation = useNavigation();
  const scrollOffset = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollOffset.value = event.contentOffset.x;
    },
  });

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "space-around" }}>
      <Animated.ScrollView
        scrollEventThrottle={1}
        horizontal
        snapToInterval={slideWidth}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          alignItems: "center",
          paddingHorizontal: (width - slideWidth) / 2,
          justifyContent: "center",
        }}
        onScroll={scrollHandler}
        style={styles.mainSlider}
      >
        {props.data?.map((slide, index) => {
          return (
            <Slide
              key={index}
              index={index}
              slide={slide}
              scrollOffset={scrollOffset}
              navigation={navigation}
            />
          );
        })}
      </Animated.ScrollView>
      <View style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}>
        {props.data?.map((_, index) => {
          return (
            <Indicator key={index} index={index} scrollOffset={scrollOffset} />
          );
        })}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    mainSlider: {
        marginBottom : 20
    },
    featureImage: {
        width: '100%',
        height: '100%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        overflow : 'hidden'
      },
});


export default Slider;