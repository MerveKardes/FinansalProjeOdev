// ekrana yükleniyor iconu getiren component
import React from "react";
import { View, ActivityIndicator } from "react-native";

const SplashScreen = () => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ActivityIndicator size="large" color="#00acac" />
    </View>
  );
};

export default SplashScreen;
