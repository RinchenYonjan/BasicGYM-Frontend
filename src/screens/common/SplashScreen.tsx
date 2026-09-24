import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

import { getToken } from "@/helper/tokenStorage";

type SplashScreenProps = {
  onFinish?: () => void;
};

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const iconScale = useRef(new Animated.Value(0)).current;
  const iconRotate = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(12)).current;
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {

    // SPLASH ANIMATION
    Animated.sequence([
      Animated.parallel([
        Animated.spring(iconScale, {
          toValue: 1,
          friction: 5,
          tension: 60,
          useNativeDriver: true,
        }),

        Animated.timing(iconRotate, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.exp),
          useNativeDriver: true,
        }),
      ]),

      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),

        Animated.timing(textTranslateY, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {

      // PULSE ANIMATION
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, {
            toValue: 1.08,
            duration: 700,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),

          Animated.timing(pulse, {
            toValue: 1,
            duration: 700,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    });

    // CHECK TOKEN AFTER 2 SECONDS
    const timer = setTimeout(() => {
      const token = getToken();

      if (token) {
        console.log("Token exists", token);
        router.replace("/(tabs)/dashboard");

      } else {
        console.log("No token exists", token);
        router.replace("/login");
      }

      if (onFinish) {
        onFinish();
      }
    }, 2000);

    // Cleanup timer if component unmounts
    return () => {
      clearTimeout(timer);
    };
  }, [onFinish]);

  const rotateInterpolate = iconRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["-15deg", "0deg"],
  });

  return (
    <LinearGradient
      colors={["#E8291C", "#7A0A0A"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}>

      <View style={styles.content}>
        <Animated.Image
          source={require("../../../assets/app-images/app-logo.png")}
          resizeMode="contain"
          style={[
            styles.icon,
            {
              opacity: textOpacity,
              transform: [
                {
                  scale: Animated.multiply(iconScale, pulse),
                },
                {
                  rotate: rotateInterpolate,
                },
              ],
            },
          ]}
        />
      </View>
    </LinearGradient>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  icon: {
    width: 160,
    height: 160,
  },
});