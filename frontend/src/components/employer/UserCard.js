import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-community/async-storage";
import { baseUrl } from "../../utils/constants";
import Toast from "react-native-toast-message";

const UserCard = ({
    isStar,
    credits,
    applicant,
    switchToScreen,
    setModalVisible,
    setUserRecord,
}) => {
    const [isDescriptionVisible, setDescriptionVisible] = useState(false);
    const [loginData, setLoginData] = useState({});
    const [employerData, setEmployerData] = useState({});
    const [success, setSuccess] = useState(null);
    const {
        apply_jobs,
        city,
        company_name,
        created_at,
        first_name,
        id,
        image,
        last_name,
        phone_number,
        title,
        updated_at,
        user_id,
    } = applicant;

    console.log("in user card ========> ", credits);
    let isAccessible = false;
    if (credits) {
        isAccessible = credits.candidates_credit
    }

    let mobile = phone_number.replace(/\d(?=\d{2})/g, "*");

    useEffect(() => {
        try {
            AsyncStorage.getItem("employerLoginData").then((data) => {
                const { login, user } = JSON.parse(data);
                setLoginData(login);
                setEmployerData(user);
            });
        } catch (error) {
            // Error retrieving data
            console.log(error.message);
        }

        return () => { };
    }, []);

    function starUnstarCandidate(job_seeker_id, employer_id) {
        fetch(baseUrl + "api/employer/starred-candidates", {
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
            body: JSON.stringify({
                employer_id,
                job_seeker_id,
            }),
        })
            .then((response) => response.json())
            .then((response) => {
                console.log(response);
                if (!response.success) {
                    setSuccess(false);
                    setTimeout(function () {
                        setSuccess(null);
                    }, 2000);
                    throw new Error(response);
                } else {
                    setSuccess(true);
                    setTimeout(function () {
                        setSuccess(null);
                    }, 2000);
                }
            })
            .catch((err) => {
                setSuccess(false);
                setTimeout(function () {
                    setSuccess(null);
                }, 2000);
                console.log(err);
            });
    }

    return (
        <View style={styles.container}>
            <View
                style={styles.jobContainer}
                onStartShouldSetResponder={(event) => {
                    setDescriptionVisible(!isDescriptionVisible);
                }}
            >
                <View style={styles.imageContainer}>
                    <Image
                        source={{
                            uri:
                                "https://i.ya-webdesign.com/images/blank-profile-picture-png-8.png",
                        }}
                        style={styles.profileImage}
                    />
                </View>
                <View style={styles.detailContainer}>
                    <View style={styles.nameContainer}>
                        <Text style={[styles.jobSeekerName]}>{title}</Text>
                        <Text style={[styles.jobSeekerName]}>{first_name}</Text>
                        <Text style={[styles.jobSeekerName]}>{last_name}</Text>
                    </View>
                    <Text style={styles.subTitleText}>{company_name}</Text>
                    <Text>{city}</Text>
                    <Text>{mobile}</Text>
                </View>
            </View>
            {isStar ? (
                <TouchableOpacity
                    style={[styles.starBtn, styles.starIndicator]}
                >
                    <AntDesign name="staro" style={styles.starBtnIcon} />
                </TouchableOpacity>
            ) : null}
            {isDescriptionVisible ? (
                <View style={styles.toggleableView}>
                    <TouchableOpacity
                        style={styles.detailBtn}
                        onPress={() => {
                            if (isAccessible) {
                                switchToScreen("JobSeekerProfile1", applicant);
                            } else {
                                Toast.show({
                                    type: "info",
                                    position: "top",
                                    text1: "Info",
                                    text2: "Your candidate's profile view credits has been exhausted.",
                                    onHide: () => {
                                        switchToScreen("MembershipPage")
                                    }
                                });
                            }
                        }}
                    >
                        <Text style={styles.detailBtnText}>View Profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.contactBtn}
                        onPress={() => {
                            if (isAccessible) {
                                setUserRecord(applicant);
                                setModalVisible(true);
                            } else {
                                Toast.show({
                                    type: "info",
                                    position: "top",
                                    text1: "Info",
                                    text2: "Your candidate's profile view credits has been exhausted.",
                                    onHide: () => {
                                        switchToScreen("MembershipPage")
                                    }
                                });
                            }
                        }}
                    >
                        <Text style={styles.contactBtnText}>Contact</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.starBtn}
                        onPress={() => starUnstarCandidate(id, employerData.id)}
                    >
                        <AntDesign name="staro" style={styles.starBtnIcon} />
                    </TouchableOpacity>
                    {/*<Toast
                        visible={success}
                        duration={Toast.durations.SHORT}
                        position={Toast.positions.BOTTOM}
                        backgroundColor="green"
                        shadowColor="#dddddd"
                        shadow={true}
                        animation={false}
                        hideOnPress={true}
                        onHidden={() => setSuccess(null)}
                    >
                        Candidate stared successfully.
                    </Toast>
                    <Toast
                        visible={success !== null && !success}
                        duration={Toast.durations.SHORT}
                        position={Toast.positions.BOTTOM}
                        backgroundColor="red"
                        shadowColor="#dddddd"
                        shadow={true}
                        animation={false}
                        hideOnPress={true}
                        onHidden={() => setSuccess(null)}
                    >
                        Something went wrong.
                    </Toast>*/}
                </View>
            ) : null}
        </View>
    );
};

export default UserCard;

const styles = StyleSheet.create({
    container: {
        minHeight: 150,
        borderWidth: 1,
        borderColor: "#dddddd",
        backgroundColor: "#ffffff",
        borderRadius: 10,
        marginLeft: 70,
        margin: 15,
        shadowColor: "#dddddd",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
        flexDirection: "column",
    },
    jobContainer: {
        flexDirection: "row",
    },
    imageContainer: {
        height: 120,
        width: 120,
        borderColor: "#dddddd",
        backgroundColor: "#ffffff",
        borderRadius: 100,
        marginLeft: -60,
        marginRight: 10,
        marginVertical: 15,
        shadowColor: "#dddddd",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 10,
    },
    detailContainer: {
        paddingVertical: 5,
        width: 0,
        flexGrow: 1,
        flex: 1,
    },
    toggleableView: {
        minHeight: 46,
        padding: 5,
        flexDirection: "row",
        justifyContent: "space-around",
    },
    profileImage: {
        height: 120,
        width: 120,
    },
    nameContainer: {
        marginTop: 5,
        flexDirection: "row",
    },
    jobSeekerName: {
        marginRight: 5,
        fontWeight: "700",
        fontSize: 18,
    },
    titleText: {
        fontSize: 15,
        fontWeight: "800",
        textDecorationLine: "underline",
    },
    subTitleText: {
        fontWeight: "600",
        fontSize: 13,
    },
    detailBtn: {
        width: "40%",
        height: 36,
        backgroundColor: "#8fbc8f",
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "flex-end",
    },
    detailBtnText: {
        color: "white",
    },
    contactBtn: {
        width: "40%",
        height: 36,
        backgroundColor: "#fb5b5a",
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "flex-end",
    },
    contactBtnText: {
        color: "white",
    },
    starBtn: {
        width: 36,
        backgroundColor: "#ffee58",
        borderRadius: 25,
        alignSelf: "flex-end",
    },
    starBtnIcon: {
        fontSize: 30,
        padding: 3,
        color: "#9E9E9E",
    },
    starIndicator: {
        position: "absolute",
        bottom: 10,
        left: -50,
        elevation: 12,
    },
});
