import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    Text,
    View,
    Share,
    Dimensions,
    Image,
    TouchableHighlight,
    TouchableOpacity,
} from "react-native";
import BottomTabNavigator from "./job_seeker/BottomTabNavigator";
import ContactOverlay from "./job_seeker/ContactOverlay";
import SettingsOverlay from "./job_seeker/SettingsOverlay";

// We can use this to make the overlay fill the entire width
const { width, height } = Dimensions.get("window");

const InviteFriends = (props) => {
    const [settingModalVisible, setSettingModalVisible] = useState(false);
    const [userData, setUserData] = useState({});

    function switchToScreen(screen, params) {
        props.navigation.push(screen, params);
    }

    useEffect(() => {
        setUserData(props.navigation.state.params);

        return () => {
            console.log("Cleanup in setting overlay.");
        };
    }, []);

    const onShare = async ({ code }) => {
        try {
            const result = await Share.share({
                message: `Use this code: ${code} to register with Incareof.`,
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                    console.log(
                        "shared with ==============> ",
                        result.activityType
                    );
                } else {
                    // shared
                    console.log("else shared ==============> ", result);
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
                console.log("share cancelled.");
            }
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.inviteFriendScreen}>
                <View style={styles.inviteCodeContainer}>
                    <Text
                        style={styles.codeText}
                        onPress={() => onShare({ code: "EX434Z54" })}
                    >
                        EX434Z54
                    </Text>
                </View>
            </View>
            <View style={styles.bottomNavigation}>
                <BottomTabNavigator
                    userData={userData}
                    setSettingModalVisible={setSettingModalVisible}
                    switchToScreen={switchToScreen}
                />
            </View>
            <SettingsOverlay
                switchToScreen={switchToScreen}
                settingModalVisible={settingModalVisible}
                setSettingModalVisible={setSettingModalVisible}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        position: "absolute",
        left: 0,
        top: 0,
        backgroundColor: "#dddddd",
        height: 300,
        width,
        elevation: 6,
    },
    container: {
        flexDirection: "column",
        flex: 1,
        width: null,
        height: null,
    },
    inviteFriendScreen: {
        flex: 9.2,
    },
    bottomNavigation: {
        flex: 0.8,
        backgroundColor: "#dddddd",
        shadowColor: "#dddddd",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    inviteCodeContainer: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
    },
    codeText: {
        borderStyle: "dashed",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#9E9E9E",
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: "#8fbc8f",
        fontSize: 20,
        fontWeight: "700",
    },
});

export default InviteFriends;
