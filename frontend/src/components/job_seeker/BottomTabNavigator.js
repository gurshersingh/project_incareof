import React, {useEffect} from "react";
import {View, Text, StyleSheet} from "react-native";
import {AntDesign, Ionicons} from "@expo/vector-icons";
import AsyncStorage from "@react-native-community/async-storage";
import _ from "lodash";
import {route} from "../../utils/constants";

const BottomTabNavigator = ({
    routeName,
    userData,
    switchToScreen,
    setSettingModalVisible,
}) => {
    useEffect(() => {
        if (_.isEmpty(userData)) {
            try {
                AsyncStorage.getItem("jobSeekerLoginData").then((data) => {
                    const {user, login} = JSON.parse(data);
                    userData = login;
                });
            } catch (error) {
                // Error retrieving data
                console.log(error.message);
            }
        }
    }, []);

    return (
        <View style={styles.bottomNavContainer}>
            <AntDesign
                name="home"
                style={
                    route.JobSeekerScreen.includes(routeName)
                        ? [styles.bottomNavIcons, styles.activeIcon]
                        : [styles.bottomNavIcons]
                }
                onPress={() => switchToScreen("JobSeekerScreen", {})}
            />
            <AntDesign
                name="user"
                style={
                    route.JobSeekerProfile.includes(routeName)
                        ? [styles.bottomNavIcons, styles.activeIcon]
                        : [styles.bottomNavIcons]
                }
                onPress={() => switchToScreen("JobSeekerProfile", userData)}
            />
            <AntDesign
                name="pluscircleo"
                style={styles.bottomNavIcons}
                onPress={() => switchToScreen("InviteFriends", userData)}
            />
            <AntDesign
                name="staro"
                style={styles.bottomNavIcons}
                onPress={() => switchToScreen("StarredJobs", {})}
            />
            <Ionicons
                name="md-more"
                style={styles.bottomNavIcons}
                onPress={() => setSettingModalVisible(true)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    bottomNavContainer: {
        flexDirection: "row",
        height: "100%",
        textAlign: "center",
    },
    bottomNavIcons: {
        flex: 1,
        fontSize: 30,
        textAlign: "center",
        alignSelf: "center",
        color: "#9E9E9E",
    },
    activeIcon: {
        color: "blue",
    },
});

export default BottomTabNavigator;
