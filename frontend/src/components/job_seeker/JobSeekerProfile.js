import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableHighlight,
    ScrollView,
    Dimensions,
    Linking,
} from "react-native";
import { Feather, FontAwesome, AntDesign } from "@expo/vector-icons";
import BottomTabNavigator from "../job_seeker/BottomTabNavigator";
import ContactOverlay from "../job_seeker/ContactOverlay";
import SettingsOverlay from "../job_seeker/SettingsOverlay";
import { baseUrl } from "../../utils/constants";
import AsyncStorage from "@react-native-community/async-storage";
import _ from "lodash";

// We can use this to make the overlay fill the entire width
const { width, height } = Dimensions.get("window");

const JobSeekerProfile = (props) => {
    const [routeName, setRouteName] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [settingModalVisible, setSettingModalVisible] = useState(false);
    const [userData, setUserData] = useState({});
    const [jobSeekerData, setJobSeekerData] = useState({});

    function switchToScreen(screen, params) {
        props.navigation.push(screen, params);
    }

    useEffect(() => {
        setRouteName(props.navigation.state.routeName);
        if (_.isEmpty(userData)) {
            try {
                AsyncStorage.getItem("jobSeekerLoginData").then((data) => {
                    const { login, user } = JSON.parse(data);
                    setUserData(login);
                });
            } catch (error) {
                // Error retrieving data
                console.log(error.message);
            }
        }
    }, []);

    useEffect(() => {
        if (userData.id) {
            const api_url = baseUrl + `api/job-seeker/profile/${userData.id}`;
            fetch(api_url, {
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
            })
                .then((response) => response.json())
                .then((response) => {
                    if (response.success) {
                        // this.props.navigation.push('Login', {user_type:response.result.user_type})
                        setJobSeekerData(response.result);
                    } else {
                        throw new Error(response);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, [userData]);

    const { image } = jobSeekerData;

    return (
        <View style={styles.container}>
            <View style={styles.jobSeekerDashboard}>
                <ScrollView>
                    <View>
                        <View>
                            <Image
                                style={styles.imageBackdrop}
                                source={{
                                    uri:
                                        "https://images.befunky.com/wp/wp-2016-03-blur-background-featured-1.jpg?auto=format&fm=jpg&q=75&w=880&ixlib=js-1.4.1",
                                }}
                            />
                        </View>
                        <View style={styles.actionContainer}>
                            {/*<TouchableHighlight
                                style={styles.starBtn}
                                onPress={() =>
                                    alert(
                                        "Contact overlay should be displayed."
                                    )
                                }
                            >
                                <AntDesign
                                    name="staro"
                                    style={styles.starBtnIcon}
                                />
                            </TouchableHighlight>
                            <TouchableHighlight
                                style={styles.contBtn}
                                onPress={(event) => {
                                    event.stopPropagation();
                                    Linking.openURL(
                                        `tel:${jobSeekerData.phone_number}`
                                    );
                                }}
                            >
                                <Feather
                                    name="phone-call"
                                    style={styles.contactIcons}
                                />
                            </TouchableHighlight>
                            <TouchableHighlight
                                style={styles.contBtn}
                                onPress={(event) => {
                                    event.stopPropagation();
                                    Linking.openURL(
                                        `mailto:support@example.com?subject=SendMail&body=Description`
                                    );
                                }}
                            >
                                <FontAwesome
                                    name="envelope-o"
                                    style={styles.contactIcons}
                                />
                            </TouchableHighlight>*/}
                            <TouchableHighlight
                                style={styles.editBtn}
                                onPress={() =>
                                    props.navigation.push(
                                        "EditJobSeekerProfile",
                                        userData
                                    )
                                }
                            >
                                <Feather
                                    name="edit-3"
                                    style={styles.editIcon}
                                />
                            </TouchableHighlight>
                        </View>
                        <View style={styles.imageContainer}>
                            {image ? (
                                <Image
                                    source={{ uri: image }}
                                    style={styles.profileImage}
                                />
                            ) : (
                                    <Image
                                        source={{
                                            uri:
                                                "https://i.ya-webdesign.com/images/blank-profile-picture-png-8.png",
                                        }}
                                        style={styles.profileImage}
                                    />
                                )}
                        </View>
                        <View style={styles.metaContainer}>
                            {jobSeekerData !== null ? (
                                <View style={styles.subMetaDataContainer}>
                                    <View style={styles.nameContainer}>
                                        <Text style={[styles.jobSeekerName]}>
                                            {jobSeekerData.title}
                                        </Text>
                                        <Text style={[styles.jobSeekerName]}>
                                            {jobSeekerData.first_name}
                                        </Text>
                                        <Text style={[styles.jobSeekerName]}>
                                            {jobSeekerData.last_name}
                                        </Text>
                                    </View>
                                    <View>
                                        <Text style={[styles.boldText]}>
                                            {jobSeekerData.company_name}
                                        </Text>
                                    </View>
                                    <View>
                                        <Text style={[styles.boldText]}>
                                            {jobSeekerData.phone_number}
                                        </Text>
                                    </View>
                                    <View>
                                        <Text style={[styles.boldText]}>
                                            {jobSeekerData.city}
                                        </Text>
                                    </View>
                                </View>
                            ) : null}
                        </View>
                        <View style={styles.dataContainer}></View>
                    </View>
                </ScrollView>
            </View>
            <View style={styles.bottomNavigation}>
                <BottomTabNavigator
                    routeName={routeName}
                    loginData={userData}
                    jobSeekerData={jobSeekerData}
                    setSettingModalVisible={setSettingModalVisible}
                    switchToScreen={switchToScreen}
                />
            </View>
            <ContactOverlay
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
            />
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
    jobSeekerDashboard: {
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
    loginText: {
        color: "black",
        fontSize: 30,
        marginTop: 20,
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
    imageBackdrop: {
        height: 260,
    },
    actionContainer: {
        height: 60,
        width: 200,
        position: "absolute",
        top: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    contBtn: {
        width: 40,
        backgroundColor: "#f8bbd0",
        borderRadius: 25,
        alignSelf: "flex-end",
        marginHorizontal: 5,
    },
    contactIcons: {
        fontSize: 30,
        padding: 5,
        color: "#9E9E9E",
    },
    starBtn: {
        width: 40,
        backgroundColor: "#ffee58",
        borderRadius: 25,
        alignSelf: "flex-end",
        marginHorizontal: 5,
    },
    starBtnIcon: {
        fontSize: 30,
        padding: 5,
        color: "#9E9E9E",
    },
    imageContainer: {
        height: 120,
        width: 120,
        borderColor: "#dddddd",
        backgroundColor: "#ffffff",
        borderRadius: 100,
        marginLeft: 15,
        marginTop: -50,
        shadowColor: "#000000",
        shadowOffset: {
            width: 4,
            height: 4,
        },
        shadowOpacity: 0.8,
        shadowRadius: 6,
        elevation: 10,
    },
    editBtn: {
        height: 40,
        width: 40,
        borderColor: "#dddddd",
        backgroundColor: "#ffffff",
        borderRadius: 100,
        alignSelf: "flex-end",
        marginRight: 15,
        marginTop: -50,
        shadowColor: "#000000",
        shadowOffset: {
            width: 4,
            height: 4,
        },
        shadowOpacity: 0.8,
        shadowRadius: 6,
        elevation: 10,
    },
    editIcon: {
        padding: 5,
        fontSize: 30,
    },
    metaContainer: {
        height: 100,
        backgroundColor: "#f8bbd0",
        marginTop: -70,
    },
    subMetaDataContainer: {
        marginLeft: 150,
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
    boldText: {
        fontWeight: "700",
    },
    dataContainer: {},
    profileImage: {
        height: 120,
        width: 120,
        borderRadius: 100,
    },
});

export default JobSeekerProfile;
