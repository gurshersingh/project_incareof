import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const SuccessScreen = (props) => {
    const [screenToNavigate, setScreenToNavigate] = useState(null);
    useEffect(() => {
        setScreenToNavigate(props.navigation.state.params);
        // props.navigation.push("EmployerScreen")
    }, []);

    useEffect(() => {
        if (screenToNavigate) {
            setTimeout(() => {
                props.navigation.push(screenToNavigate.screen);
            }, 3000);
        } else {
            setTimeout(() => {
                props.navigation.push("EmployerScreen");
            }, 3000);
        }
    }, [screenToNavigate]);

    return (
        <View style={styles.container}>
            <FontAwesome5 name="check-circle" style={styles.checkIcon} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    checkIcon: {
        fontSize: 200,
        color: "#C7E8AC",
        shadowColor: "#dddddd",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
});

export default SuccessScreen;
