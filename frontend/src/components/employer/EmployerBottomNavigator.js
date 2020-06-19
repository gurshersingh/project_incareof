import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-community/async-storage";
import _ from "lodash";
import { baseUrl } from "../../utils/constants";

const EmployerBottomNavigator = ({
    employerLoginData,
    switchToScreen,
    setSettingModalVisible,
}) => {
    const [employerData, setEmployerData] = useState({});

    useEffect(() => {
        try {
            AsyncStorage.getItem("employerLoginData").then((data) => {
                const { login, user } = JSON.parse(data);
                setEmployerData(user);
            });
        } catch (error) {
            // Error retrieving data
            console.log(error.message);
        }
    }, []);

    function checkEmployerCredit() {
        if (!_.isEmpty(employerData)) {
            fetch(
                baseUrl +
                `api/employer-membership-plans/verify/credits/${employerData.id}`,
                {
                    method: "GET",
                    mode: "cors", // no-cors, *cors, same-origin
                    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                    credentials: "same-origin", // include, *same-origin, omit
                    headers: {
                        "Content-Type": "application/json",
                        // 'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    redirect: "follow", // manual, *follow, error
                    referrerPolicy: "no-referrer",
                }
            )
                .then((response) => response.json())
                .then((response) => {
                    console.log("response is ==============> ", response);
                    if (!response.success) {
                        if (!response.result.isActive)
                            switchToScreen("MembershipPage", {});
                    } else {
                        if (response.result.isActive)
                            switchToScreen("JobPost", {});
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }

    return (
        <View style={styles.bottomNavContainer}>
            <AntDesign
                name="home"
                style={styles.bottomNavIcons}
                onPress={() =>
                    switchToScreen("EmployerScreen", employerData)
                }
            />
            <AntDesign
                name="user"
                style={styles.bottomNavIcons}
                onPress={() =>
                    switchToScreen("EmployerProfile1", employerLoginData)
                }
            />
            <AntDesign
                name="pluscircleo"
                style={styles.bottomNavIcons}
                onPress={() => checkEmployerCredit()}
            />
            <AntDesign
                name="staro"
                style={styles.bottomNavIcons}
                onPress={() =>
                    switchToScreen("StarredCandidate", employerLoginData)
                }
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
});

export default EmployerBottomNavigator;
