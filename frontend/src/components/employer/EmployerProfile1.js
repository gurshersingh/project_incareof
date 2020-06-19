import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Image,
    TouchableHighlight,
    TouchableOpacity,
    SafeAreaView,
    FlatList,
} from "react-native";
import EmployerBottomNavigator from "./EmployerBottomNavigator";
import UserContactOverlay from "./UserContactOverlay";
import EmployerSettingsOverlay from "./EmployerSettingsOverlay";
import AsyncStorage from "@react-native-community/async-storage";
import { baseUrl } from "../../utils/constants";
import { AntDesign, Feather } from "@expo/vector-icons";
import EditJobCard from "./EditJobCard";

const EmployerProfile1 = (props) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [settingModalVisible, setSettingModalVisible] = useState(false);
    const [loginData, setLoginData] = useState({});
    const [employerData, setEmployerData] = useState({});
    const [jobs, setJobs] = useState([]);

    function switchToScreen(screen, params) {
        props.navigation.push(screen, params);
    }

    useEffect(() => {
        console.log('component did mount in employer profile.');
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
            const api_url =
                baseUrl + `api/employer/job-applicants/${employerData.id}`;
            fetch(api_url, {
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
                        setJobs(response.result);
                    } else {
                        console.log(response);
                        // throw new Error(response);
                    }
                })
                .catch((err) => {
                    console.log({ err });
                });
        }

        return () => {
            abortController.abort();
        };
    }, [employerData]);

    const {
        id,
        city,
        company_name,
        title,
        first_name,
        last_name,
        image,
        phone_number,
    } = employerData;

    return (
        <View style={styles.container}>
            <View style={styles.innerContainer}>
                <ScrollView>
                    <View style={{ flexDirection: "column" }}>
                        <View style={styles.backDrop}>
                            <View style={styles.actionContainer}>
                                <TouchableHighlight
                                    style={styles.editBtn}
                                    onPress={() => {
                                        props.navigation.push(
                                            "EditEmployerProfile",
                                            employerData
                                        );
                                    }}
                                >
                                    <Feather
                                        name="edit-3"
                                        style={styles.editIcon}
                                    />
                                </TouchableHighlight>
                            </View>
                        </View>
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
                                    <View style={styles.nameContainer}>
                                        <Text style={[styles.boldText]}>
                                            {title}
                                        </Text>
                                        <Text style={[styles.boldText]}>
                                            {first_name}
                                        </Text>
                                        <Text style={[styles.boldText]}>
                                            {last_name}
                                        </Text>
                                    </View>
                                    <View>
                                        <Text style={[styles.companyName]}>
                                            {company_name}
                                        </Text>
                                    </View>
                                    <View>
                                        <Text style={[styles.boldText]}>
                                            {phone_number}
                                        </Text>
                                    </View>
                                </View>
                            ) : null}
                            {/*<View style={styles.actionContainer}>
                <TouchableHighlight
                  style={styles.starBtn}
                  onPress={() => alert("Contact overlay should be displayed.")}
                >
                  <AntDesign name="staro" style={styles.starBtnIcon} />
                </TouchableHighlight>
                <TouchableOpacity
                  style={styles.contactBtn}
                  onPress={() => {
                    setModalVisible(true);
                  }}
                >
                  <Text style={styles.contactBtnText}>Contact</Text>
                </TouchableOpacity>
                </View>*/}
                        </View>

                        <SafeAreaView>
                            {jobs.length > 0 ? (
                                <FlatList
                                    showsVerticalScrollIndicator={false}
                                    data={jobs}
                                    keyExtractor={(job) => job.id.toString()}
                                    renderItem={({ item }) => {
                                        return (
                                            <EditJobCard
                                                job={item}
                                                setModalVisible={
                                                    setModalVisible
                                                }
                                                switchToScreen={switchToScreen}
                                            />
                                        );
                                    }}
                                />
                            ) : (
                                    <View style={styles.container}>
                                        <Text style={{ textAlign: "center" }}>
                                            Job Post not found.
                                    </Text>
                                    </View>
                                )}
                        </SafeAreaView>
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
            <UserContactOverlay
                mobile={phone_number}
                email={phone_number}
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
            />
            <EmployerSettingsOverlay
                switchToScreen={switchToScreen}
                settingModalVisible={settingModalVisible}
                setSettingModalVisible={setSettingModalVisible}
            />
        </View>
    );
};

EmployerProfile1["navigationOptions"] = (screenProps) => ({
    title: "Profile",
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
    backDrop: {
        height: 170,
        backgroundColor: "#f8bbd0",
    },
    imageContainer: {
        height: 130,
        width: 130,
        borderColor: "#dddddd",
        backgroundColor: "#ffffff",
        borderRadius: 100,
        marginLeft: 15,
        marginTop: 27,
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
        marginTop: 55,
        width: "100%",
        paddingBottom: 10,
    },
    subMetaDataContainer: {
        marginLeft: 160,
        width: "100%",
    },
    nameContainer: {
        marginTop: 5,
        flexDirection: "row",
    },
    companyName: {
        marginRight: 5,
        fontWeight: "700",
        fontSize: 18,
    },
    boldText: {
        fontWeight: "700",
    },
    profileImage: {
        height: 130,
        width: 130,
        borderRadius: 100,
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
    actionContainer: {
        height: 50,
        position: "absolute",
        top: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "flex-end",
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
});

export default EmployerProfile1;
