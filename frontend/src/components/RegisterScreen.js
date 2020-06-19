import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    Text,
    View,
    //  TextInput,
    TouchableOpacity,
    Image,
} from "react-native";

const RegisterScreen = (props) => {
    const [userFbData, setUserFbData] = useState(null);

    useEffect(() => {
        setUserFbData(props.navigation.state.params);
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.image}>
                <Image source={require("../../assets/logo.png")} />
            </View>

            <TouchableOpacity
                style={styles.loginBtn}
                onPress={() =>
                    props.navigation.push("JobBasicInfo", userFbData)
                }
            >
                <Text style={styles.loginText}>Job Seeker</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.loginBtn}
                onPress={() => props.navigation.push("Basic0", userFbData)}
            >
                <Text style={styles.loginText}>Employer</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        fontSize: 30,
    },
    loginBtn: {
        width: "70%",
        backgroundColor: "#8fbc8f",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
        marginBottom: 10,
    },
    loginText: {
        color: "white",
    },
});

export default RegisterScreen;
