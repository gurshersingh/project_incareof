import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableHighlight,
    ScrollView,
    Linking
} from 'react-native';
import Toast from "react-native-root-toast";
import EmployerSearchFilter from './EmployerSearchFilter';
import EmployerBottomNavigator from './EmployerBottomNavigator';
import EmployerFilterOverlay from './EmployerFilterOverlay';
import UserContactOverlay from './UserContactOverlay';
import EmployerSettingsOverlay from './EmployerSettingsOverlay';
import AsyncStorage from "@react-native-community/async-storage";
import { Feather, FontAwesome, AntDesign } from "@expo/vector-icons";
import { baseUrl } from "../../utils/constants";

const JobSeekerProfile1 = (props) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [filterVisiblity, setFilterVisibility] = useState(false);
    const [settingModalVisible, setSettingModalVisible] = useState(false);
    const [loginData, setLoginData] = useState({});
    const [employerData, setEmployerData] = useState({});
    const [success, setSuccess] = useState(null);
    const [applicant, setApplicant] = useState([]);
    const [userRecord, setUserRecord] = useState({});

    function switchToScreen(screen, params) {
        props.navigation.push(screen, params);
    }

    function openSmsUrl(phone, body) {
        return `sms:${phone}${getSMSDivider()}body=${body}`;
    }
    function getSMSDivider() {
        return Platform.OS === "ios" ? "&" : "?";
    }

    useEffect(() => {
        setApplicant(props.navigation.state.params)
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
    }, []);

    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        if (employerData.id) {
            fetch(baseUrl + `api/employer-membership-plans/update/employer/credit/${employerData.id}`, {
                signal: signal,
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
                        console.log("in profile ======> ", response.result)
                    } else {
                        console.log("in profile e ======> ", response.result)
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }

        return () => {
            abortController.abort();
        };
    }, [employerData])

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
        user_id
    } = applicant;

    return (
        <View style={styles.container}>
            <View style={styles.innerContainer}>
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
                            <TouchableHighlight
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
                                        `tel:${phone_number}`
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
                                    Linking.openURL(openSmsUrl(phone_number, ''));
                                }}
                            >
                                <FontAwesome
                                    name="envelope-o"
                                    style={styles.contactIcons}
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
                            {applicant !== null ? (
                                <View style={styles.subMetaDataContainer}>
                                    <View style={styles.nameContainer}>
                                        <Text style={[styles.jobSeekerName]}>
                                            {title}
                                        </Text>
                                        <Text style={[styles.jobSeekerName]}>
                                            {first_name}
                                        </Text>
                                        <Text style={[styles.jobSeekerName]}>
                                            {last_name}
                                        </Text>
                                    </View>
                                    <View>
                                        <Text style={[styles.boldText]}>
                                            {company_name}
                                        </Text>
                                    </View>
                                    <View>
                                        <Text style={[styles.boldText]}>
                                            {phone_number}
                                        </Text>
                                    </View>
                                    <View>
                                        <Text style={[styles.boldText]}>
                                            {city}
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
                <EmployerBottomNavigator
                    employerLoginData={loginData}
                    setSettingModalVisible={setSettingModalVisible}
                    switchToScreen={switchToScreen}
                />
            </View>
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
            </Toast>
            <UserContactOverlay
                mobile={phone_number}
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
            />
            <EmployerSettingsOverlay
                switchToScreen={switchToScreen}
                settingModalVisible={settingModalVisible}
                setSettingModalVisible={setSettingModalVisible}
            />
        </View>
    )
}

JobSeekerProfile1["navigationOptions"] = (screenProps) => ({
    title: "Applicant Profile",
});

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        flex: 1,
        width: null,
        height: null,
    },
    innerContainer: {
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
})

export default JobSeekerProfile1;
