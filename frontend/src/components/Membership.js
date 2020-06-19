import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-community/async-storage";
import Toast from "react-native-toast-message";
import { baseUrl } from "../utils/constants";
import _ from "lodash";

const Membership = (props) => {
    const [employerData, setEmployerData] = useState({});

    // useEffect(() => {
    //     try {
    //         AsyncStorage.getItem("registeredUser").then((user) => {
    //             setEmployerData(JSON.parse(user));
    //         });
    //     } catch (error) {
    //         // Error retrieving data
    //         console.log(error.message);
    //     }
    // }, []);

    useEffect(() => {
        try {
            AsyncStorage.getItem("employerLoginData").then((data) => {
                const { login, user } = JSON.parse(data);
                // setLoginData(login);
                setEmployerData(user);
            });
        } catch (error) {
            // Error retrieving data
            console.log(error.message);
        } finally {
            if (!_.isEmpty(employerData)) {
                console.log("in finally block");
                try {
                    AsyncStorage.getItem("registeredUser").then((data) => {
                        setEmployerData(JSON.parse(data));
                    });
                } catch (error) {
                    // Error retrieving data
                    console.log(error.message);
                }
            }
        }
    }, []);

    console.log("employer data in ========> ", employerData);

    function saveMemberShipObject(
        membership_type,
        job_post_credit,
        candidates_info,
        price,
        employer_id
    ) {
        const data = {
            membership_type,
            job_post_credit,
            candidates_info,
            price,
            employer_id,
        };

        fetch(baseUrl + "api/employer-membership-plans/select-plan", {
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
            body: JSON.stringify(data),
        })
            .then((response) => response.json())
            .then((response) => {
                console.log("response is ============>", response);
                if (!response.success) {
                    Toast.show({
                        type: "info",
                        position: "top",
                        text1: "Info",
                        text2: `${response.err.msg}.`,
                        onHide: () => {
                            // props.navigation.push("Payment1Page", data);
                        },
                    });
                } else {
                    Toast.show({
                        type: "success",
                        position: "top",
                        text1: "Success",
                        text2: `${data.membership_type} selected.`,
                        isibilityTime: 2000,
                        onHide: () => {
                            props.navigation.push(
                                "PaymentScreen",
                                response.result
                            );
                        },
                    });
                }
            })
            .catch((error) => {
                Toast.show({
                    type: "error",
                    position: "top",
                    text1: "Warning",
                    text2: `Something went wrong.`,
                });
                console.log(error);
            });
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.planBtn}
                onPress={() =>
                    saveMemberShipObject(
                        "Basic Membership",
                        1,
                        3,
                        500,
                        employerData.id
                    )
                }
            >
                <Text style={[styles.btnText, styles.planHeadText]}>
                    Basic Membership
                </Text>
                <Text style={styles.btnText}>1 Job Post</Text>
                <Text style={styles.btnText}>5 Contact Info</Text>
                <View style={styles.btnBottom}></View>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.planBtn}
                onPress={() =>
                    saveMemberShipObject(
                        "Premium Membership",
                        3,
                        15,
                        1000,
                        employerData.id
                    )
                }
            >
                <Text style={[styles.btnText, styles.planHeadText]}>
                    Premium Membership
                </Text>
                <Text style={styles.btnText}>3 Job Post</Text>
                <Text style={styles.btnText}>15 Contact Info</Text>
                <View style={styles.btnBottom}></View>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.planBtn}
                onPress={() =>
                    saveMemberShipObject(
                        "InCareOf Membership",
                        5,
                        100,
                        1500,
                        employerData.id
                    )
                }
            >
                <Text style={[styles.btnText, styles.planHeadText]}>
                    InCareOf Membership
                </Text>
                <Text style={styles.btnText}>5 Job Post</Text>
                <Text style={styles.btnText}>Unlimited Contact Info</Text>
                <View style={styles.btnBottom}></View>
            </TouchableOpacity>
            <Toast ref={(ref) => Toast.setRef(ref)} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    planBtn: {
        backgroundColor: "#ffffff",
        justifyContent: "space-around",
        alignItems: "center",
        height: 150,
        width: "26%",
        borderColor: "#ffffff",
        borderWidth: 1,
        borderRadius: 10,
        margin: 15,
        shadowColor: "#dddddd",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    btnText: {
        textAlign: "center",
        marginHorizontal: 3,
        fontWeight: "700",
        fontStyle: "italic",
    },
    planHeadText: {
        fontSize: 16,
        fontWeight: "bold",
        textDecorationLine: "underline",
    },
    btnBottom: {
        backgroundColor: "#C7E8AC",
        borderColor: "#C7E8AC",
        borderWidth: 1,
        borderRadius: 10,
        height: 10,
        minWidth: 40,
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

export default Membership;
