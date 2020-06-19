import React from "react";
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Image,
} from "react-native";
// import Toast from "react-native-root-toast";
import AsyncStorage from "@react-native-community/async-storage";
import Toast from "react-native-toast-message";
import * as Facebook from "expo-facebook";
import { FontAwesome } from "@expo/vector-icons";

import { baseUrl } from "../utils/constants";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
        alignItems: "center",
        justifyContent: "center",
    },
    inputView: {
        width: "70%",
        backgroundColor: "#64358D",
        borderRadius: 25,
        height: 50,
        marginBottom: 20,
        justifyContent: "center",
        padding: 20,
    },
    text: {
        fontSize: 30,
    },
    inputText: {
        height: 50,
        color: "white",
    },
    forgot: {
        color: "black",
        fontSize: 11,
    },
    error: {
        color: "red",
        fontSize: 12,
        marginTop: 20,
        marginLeft: 35,
        justifyContent: "center",
    },
    loginBtn: {
        width: "70%",
        backgroundColor: "#8fbc8f",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
        marginBottom: 10,
    },
    loginText: {
        color: "white",
    },
    signupBtn: {
        width: "70%",
        backgroundColor: "#fb5b5a",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
        marginBottom: 10,
    },
    signupBtnText: {
        color: "white",
    },
    fbBtn: {
        width: "70%",
        backgroundColor: "#4267b2",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
        marginBottom: 10,
        flexDirection: "row",
    },
});

class HomeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            success: true,
            routeName: null,
            isLoggedin: false,
            userFbData: null,
            isImageLoading: false,
        };
    }

    componentDidMount() {
        this.clearAsyncStorage();
    }

    clearAsyncStorage = async () => {
        let sessionLength = 0;
        AsyncStorage.getAllKeys().then(data => {
            sessionLength = data.length;
        });
        if (sessionLength > 0) {
            AsyncStorage.clear();
        }
    }

    handleEmailChange = (event) => {
        this.setState({
            email: event,
        });
    };
    handlePasswordChange = (event) => {
        this.setState({
            password: event,
        });
    };
    handleSubmit = (event) => {
        this.loginUser();
    };

    loginUser = () => {
        console.log("login uesr");
        fetch(baseUrl + "api/login/check", {
            method: "POST",
            mode: "cors", // no-cors, *cors, same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, *same-origin, omit
            headers: {
                "Content-Type": "application/json",
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: "follow", // manual, *follow, error
            referrerPolicy: "no-referrer",
            body: JSON.stringify(this.state),
        })
            .then((response) => response.json())
            .then((response) => {
                if (response.success) {
                    this.setState({ success: true });
                    const { user, login } = response.result;
                    console.log({ user, login })
                    if (login.type === "EMPLOYER") {
                        AsyncStorage.setItem(
                            "employerLoginData",
                            JSON.stringify({ login, user })
                        );
                        this.props.navigation.push(
                            "EmployerScreen",
                            response.result
                        );
                    } else if (login.type === "JOB_SEEKER") {
                        AsyncStorage.setItem(
                            "jobSeekerLoginData",
                            JSON.stringify({ user, login })
                        );
                        this.props.navigation.push(
                            "JobSeekerScreen",
                            login
                        );
                    } else {
                        Toast.show({
                            type: "error",
                            position: "top",
                            text1: "Warning",
                            text2: "Something went wrong.",
                        });
                    }
                } else throw new Error(response);
            })
            .catch((err) => {
                Toast.show({
                    type: "error",
                    position: "top",
                    text1: "Warning",
                    text2: "Login Failed",
                });
                // console.log("in error block", err);
                // this.setState({err: "Login Failed", success: false});
            });
    };

    facebookLogIn = async () => {
        try {
            // 1103337533366321
            const FB_APP_ID = "320335242291060";
            await Facebook.initializeAsync(FB_APP_ID);

            const {
                type,
                token,
                expires,
                permissions,
                declinedPermissions,
            } = await Facebook.logInWithReadPermissionsAsync(FB_APP_ID, {
                permissions: ["public_profile"],
            });

            if (type === "success") {
                // Get the user's name using Facebook's Graph API
                fetch(
                    `https://graph.facebook.com/me?access_token=${token}&fields=id,name,email,picture.height(500)`
                )
                    .then((response) => response.json())
                    .then((data) => {
                        this.setState(
                            { isLoggedin: true, userFbData: data },
                            () => {
                                console.log(this.state.userFbData);
                                this.props.navigation.push(
                                    "RegisterScr",
                                    this.state.userFbData
                                );
                            }
                        );
                        // setLoggedinStatus(true);
                        // setUserData(data);
                    })
                    .catch((e) => console.log(e));
            } else {
                // type === 'cancel'
            }
        } catch ({ message }) {
            alert(`Facebook Login Error: ${message}`);
        }
    };

    render() {
        return (
            <View style={styles.container}>
                <Toast ref={(ref) => Toast.setRef(ref)} />
                <View style={styles.image}>
                    <Image source={require("../../assets/logo.png")} />
                </View>
                <View style={styles.inputView}>
                    <TextInput
                        name="email"
                        type="text"
                        style={styles.inputText}
                        placeholder="Email"
                        placeholderTextColor="#dddddd"
                        onChangeText={this.handleEmailChange}
                    />
                </View>
                <View style={styles.inputView}>
                    <TextInput
                        name="password"
                        type="text"
                        secureTextEntry
                        style={styles.inputText}
                        placeholder="Password"
                        placeholderTextColor="#dddddd"
                        onChangeText={this.handlePasswordChange}
                    />
                </View>
                <TouchableOpacity
                    onPress={() =>
                        this.props.navigation.push("ForgatPassword")
                    }
                >
                    <Text style={styles.forgot}>Forgot Password?</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.loginBtn}
                    onPress={this.handleSubmit}
                >
                    <Text style={styles.loginText}>LOGIN</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.signupBtn}
                    onPress={() =>
                        this.props.navigation.push("RegisterScr", {})
                    }
                >
                    <Text style={styles.signupBtnText}>SIGN UP</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.fbBtn}
                    onPress={this.facebookLogIn}
                >
                    <FontAwesome name="facebook" color="#ffffff" />
                    <Text style={{ color: "#ffffff", marginLeft: 10 }}>
                        Signup with Facebook
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
}

export default HomeScreen;
