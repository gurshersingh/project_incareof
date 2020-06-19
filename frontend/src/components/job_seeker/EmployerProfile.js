import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Dimensions,
    Image,
    TouchableHighlight,
    TouchableOpacity,
    SafeAreaView,
    FlatList,
} from "react-native";
import Toast from "react-native-root-toast";
import _ from "lodash";
import AsyncStorage from "@react-native-community/async-storage";
import BottomTabNavigator from "./BottomTabNavigator";
import ContactOverlay from "./ContactOverlay";
import SettingsOverlay from "./SettingsOverlay";
import { baseUrl } from "../../utils/constants";
import { AntDesign } from "@expo/vector-icons";

// We can use this to make the overlay fill the entire width
const { width, height } = Dimensions.get("window");

const EmployerProfile = (props) => {
    const [routeName, setRouteName] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [settingModalVisible, setSettingModalVisible] = useState(false);
    const [employerData, setEmployerData] = useState({});
    const [userData, setUserData] = useState({});
    const [jobSeekerData, setJobSeekerData] = useState({});
    const [jobsData, setJobsData] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [success, setSuccess] = useState(null);

    function switchToScreen(screen, params) {
        props.navigation.push(screen, params);
    }

    useEffect(() => {
        let { userData, employer } = props.navigation.state.params;
        setEmployerData(employer);
        setUserData(userData);
        setRouteName(props.navigation.state.routeName);

        try {
            AsyncStorage.getItem("jobSeekerLoginData").then((data) => {
                const { user, login } = JSON.parse(data);
                setUserData(login);
                setJobSeekerData(user);
            });
        } catch (error) {
            // Error retrieving data
            console.log(error.message);
        }

        fetch(baseUrl + "api/employer/get-jobs", {
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
                employer_id: employer.id,
            }),
        })
            .then((response) => response.json())
            .then((response) => {
                if (!response.success) throw new Error(response);
                else {
                    setJobsData(response.result);
                    if (response.result) {
                        setJobs([response.result[0]]);
                    }
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    function viewMoreJobs() {
        setJobs(jobsData);
    }

    function applyJobs(job_post_id) {
        const user_id = jobSeekerData.id;

        fetch(baseUrl + "api/job-seeker/apply-job", {
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
                user_id,
                job_post_id,
            }),
        })
            .then((response) => response.json())
            .then((response) => {
                if (!response.success) {
                    setSuccess(false);
                    setTimeout(function () {
                        setSuccess(null);
                    }, 3000);
                    throw new Error(response);
                } else {
                    setSuccess(true);
                    setTimeout(function () {
                        setSuccess(null);
                    }, 3000);
                }
            })
            .catch((err) => {
                console.log(err);
                setSuccess(false);
                setTimeout(function () {
                    setSuccess(null);
                }, 3000);
            });
    }

    const {
        image,
        company_name,
        first_name,
        last_name,
        phone_number,
        email,
    } = employerData;

    return (
        <View style={styles.container}>
            <View style={styles.jobSeekerDashboard}>
                <ScrollView>
                    <View style={{ flexDirection: "column" }}>
                        <View style={styles.backDrop}></View>
                        <View style={styles.imageContainer}>
                            {image ? (
                                <Image
                                    style={styles.profileImage}
                                    source={{ uri: image }}
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
                            {employerData !== null ? (
                                <View style={styles.subMetaDataContainer}>
                                    <View>
                                        <Text style={[styles.jobSeekerName]}>
                                            {company_name}
                                        </Text>
                                    </View>
                                    <View style={styles.nameContainer}>
                                        <Text style={[styles.boldText]}>
                                            {first_name}
                                        </Text>
                                        <Text style={[styles.boldText]}>
                                            {last_name}
                                        </Text>
                                    </View>
                                    <View>
                                        <Text style={[styles.boldText]}>
                                            {phone_number}
                                        </Text>
                                    </View>
                                </View>
                            ) : null}
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
                                <TouchableOpacity
                                    style={styles.contactBtn}
                                    onPress={() => {
                                        setModalVisible(true);
                                    }}
                                >
                                    <Text style={styles.contactBtnText}>
                                        Contact
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <SafeAreaView style={{ flex: 1 }}>
                            {jobs.length > 0 ? (
                                <FlatList
                                    showsVerticalScrollIndicator={false}
                                    data={jobs}
                                    keyExtractor={(job) => job.id.toString()}
                                    renderItem={({ item }) => {
                                        return (
                                            <View style={styles.dataContainer}>
                                                <View style={styles.jobRow}>
                                                    <Text
                                                        style={styles.labelText}
                                                    >
                                                        Job Title:
                                                    </Text>
                                                    <Text
                                                        style={styles.dataText}
                                                    >
                                                        {item.job_title}
                                                    </Text>
                                                </View>
                                                <View style={styles.jobRow}>
                                                    <Text
                                                        style={styles.labelText}
                                                    >
                                                        Job Description:
                                                    </Text>
                                                    <Text
                                                        style={styles.dataText}
                                                    >
                                                        {item.job_description}
                                                    </Text>
                                                </View>
                                                <View style={styles.jobRow}>
                                                    <Text
                                                        style={styles.labelText}
                                                    >
                                                        Wager Offered:
                                                    </Text>
                                                    <Text
                                                        style={styles.dataText}
                                                    >
                                                        {item.wager_offered}
                                                    </Text>
                                                </View>
                                                <TouchableOpacity
                                                    style={styles.applyBtn}
                                                    onPress={() => {
                                                        applyJobs(item.id);
                                                    }}
                                                >
                                                    <Text
                                                        style={
                                                            styles.moreBtnText
                                                        }
                                                    >
                                                        Easy Apply
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        );
                                    }}
                                />
                            ) : (
                                    <View style={styles.container}>
                                        <Text>Job Post not found.</Text>
                                    </View>
                                )}
                        </SafeAreaView>

                        <TouchableOpacity
                            style={styles.moreBtn}
                            onPress={() => {
                                viewMoreJobs();
                            }}
                        >
                            <Text style={styles.moreBtnText}>
                                View more jobs
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
            <View style={styles.bottomNavigation}>
                <BottomTabNavigator
                    userData={userData}
                    routeName={routeName}
                    setSettingModalVisible={setSettingModalVisible}
                    switchToScreen={switchToScreen}
                />
            </View>
            <Toast
                visible={success}
                duration={Toast.durations.LONG}
                position={Toast.positions.BOTTOM}
                backgroundColor="green"
                shadowColor="#dddddd"
                shadow={true}
                animation={false}
                hideOnPress={true}
                onHidden={() => setSuccess(null)}
            >
                You have successfully applied for current job.
            </Toast>
            <Toast
                visible={success !== null && !success}
                duration={Toast.durations.LONG}
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
            <ContactOverlay
                mobile={phone_number}
                email={email}
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

EmployerProfile["navigationOptions"] = (screenProps) => ({
    title: "Employer's Profile",
});

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
    backDrop: {
        height: 170,
        backgroundColor: "#f8bbd0",
    },
    imageContainer: {
        height: 120,
        width: 120,
        borderColor: "#dddddd",
        backgroundColor: "#ffffff",
        borderRadius: 100,
        marginLeft: 15,
        marginTop: 15,
        position: "absolute",
        shadowColor: "#dddddd",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 10,
    },
    metaContainer: {
        backgroundColor: "#f8bbd0",
        position: "absolute",
        marginTop: 30,
        width: "100%",
        paddingBottom: 10,
    },
    subMetaDataContainer: {
        marginLeft: 150,
        width: "100%",
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
    profileImage: {
        height: 120,
        width: 120,
    },
    actionContainer: {
        height: 60,
        width: 200,
        flexDirection: "row",
        justifyContent: "flex-end",
        width: "100%",
    },
    contactBtn: {
        width: "40%",
        height: 40,
        backgroundColor: "#8fbc8f",
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "flex-end",
        shadowColor: "#dddddd",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 10,
        marginHorizontal: 15,
    },
    contactBtnText: {
        color: "white",
        fontSize: 16,
    },
    starBtn: {
        width: 40,
        backgroundColor: "#ffee58",
        borderRadius: 25,
        alignSelf: "flex-end",
        marginHorizontal: 5,
        shadowColor: "#dddddd",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 10,
    },
    starBtnIcon: {
        fontSize: 30,
        padding: 5,
        color: "#9E9E9E",
    },
    dataContainer: {
        minHeight: 150,
        backgroundColor: "#ffffff",
        borderRadius: 5,
        marginHorizontal: 15,
        marginVertical: 10,
        shadowColor: "#dddddd",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 1,
        elevation: 10,
    },
    jobRow: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        marginVertical: 5,
        marginHorizontal: 10,
    },
    labelText: {
        flex: 1,
        fontWeight: "700",
    },
    dataText: {
        flex: 1,
    },
    applyBtn: {
        width: "40%",
        height: 40,
        backgroundColor: "#90caf9",
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#dddddd",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 10,
        marginVertical: 5,
        marginHorizontal: 10,
    },
    moreBtn: {
        width: "40%",
        height: 40,
        backgroundColor: "#b9f6ca",
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        shadowColor: "#dddddd",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 10,
        marginVertical: 15,
    },
    moreBtnText: {
        color: "white",
        fontSize: 16,
    },
});

export default EmployerProfile;
