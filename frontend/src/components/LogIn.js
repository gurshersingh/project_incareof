import React from "react";
import {
  StyleSheet,
  Text,
  View,
  //TextInput,
  TouchableOpacity,
  //Image,
} from "react-native";

const LogIn = (props) => (
  <View>
    <View>
      <Text style={styles.loginText}> Dashboard </Text>{" "}
    </View>{" "}
    <View style={styles.loginBtn}>
      <TouchableOpacity onPress={() => props.navigation.push("Basic")}>
        <Text style={styles.nextBtnText}> Next </Text>{" "}
      </TouchableOpacity>{" "}
    </View>{" "}
  </View>
);
const styles = StyleSheet.create({
  loginText: {
    color: "black",
    fontSize: 30,
    marginTop: 20,
    //marginBottom: 100,
    marginLeft: 100,
  },
  nextBtnText: {
    color: "black",
    fontSize: 20,
  },
  loginBtn: {
    width: "20%",
    backgroundColor: "#fb5b5a",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 550,
    marginBottom: 100,
    marginLeft: 300,
  },
});

export default LogIn;
