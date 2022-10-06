import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";

import { AuthContext } from "./context";

export default function Splash({ route, navigation }){
  return (
    <View>
      <Text style={styles.container}>Loading...</Text>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginVertical: 10,
    borderRadius: 5
  }
});