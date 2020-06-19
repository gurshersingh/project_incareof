import React, {useState} from "react";
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import * as Facebook from "expo-facebook";
import {FontAwesome} from "@expo/vector-icons";

console.disableYellowBox = true;

export default function SocialLogin() {
    const [isLoggedin, setLoggedinStatus] = useState(false);
    const [userData, setUserData] = useState(null);
    const [isImageLoading, setImageLoadStatus] = useState(false);

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

            console.log({
                type,
                token,
                expires,
                permissions,
                declinedPermissions,
            });

            if (type === "success") {
                // Get the user's name using Facebook's Graph API
                fetch(
                    `https://graph.facebook.com/me?access_token=${token}&fields=id,name,email,picture.height(500)`
                )
                    .then((response) => response.json())
                    .then((data) => {
                        setLoggedinStatus(true);
                        setUserData(data);
                    })
                    .catch((e) => console.log(e));
            } else {
                // type === 'cancel'
            }
        } catch ({message}) {
            alert(`Facebook Login Error: ${message}`);
        }
    };

    logout = () => {
        setLoggedinStatus(false);
        setUserData(null);
        setImageLoadStatus(false);
    };

    return isLoggedin ? (
        userData ? (
            <View style={styles.container}>
                <Image
                    style={{width: 200, height: 200, borderRadius: 50}}
                    source={{uri: userData.picture.data.url}}
                    onLoadEnd={() => setImageLoadStatus(true)}
                />
                <ActivityIndicator
                    size="large"
                    color="#0000ff"
                    animating={!isImageLoading}
                    style={{position: "absolute"}}
                />
                <Text style={{fontSize: 22, marginVertical: 10}}>
                    Hi {userData.name}!
                </Text>
                <TouchableOpacity
                    style={styles.logoutBtn}
                    onPress={this.logout}
                >
                    <Text style={{color: "#fff"}}>Logout</Text>
                </TouchableOpacity>
            </View>
        ) : null
    ) : (
        <View style={styles.container}>
            <Image
                style={{
                    width: 200,
                    height: 200,
                    borderRadius: 50,
                    marginVertical: 20,
                }}
                source={{
                    uri:
                        "https://cdn4.iconfinder.com/data/icons/logos-3/600/React.js_logo-512.png",
                }}
            />
            <TouchableOpacity
                style={styles.loginBtn}
                onPress={this.facebookLogIn}
            >
                <FontAwesome name="facebook" size={24} color="#ffffff" />
                <Text style={{color: "#fff"}}>Login with Facebook</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#e9ebee",
        alignItems: "center",
        justifyContent: "center",
    },
    loginBtn: {
        backgroundColor: "#4267b2",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    logoutBtn: {
        backgroundColor: "grey",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        position: "absolute",
        bottom: 0,
    },
});
