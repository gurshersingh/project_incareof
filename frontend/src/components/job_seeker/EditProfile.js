import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Image,
    TouchableHighlight,
} from "react-native";
import Toast from "react-native-toast-message";
import BottomTabNavigator from "../job_seeker/BottomTabNavigator";
import ContactOverlay from "../job_seeker/ContactOverlay";
import SettingsOverlay from "../job_seeker/SettingsOverlay";
import { baseUrl } from "../../utils/constants";
import AsyncStorage from "@react-native-community/async-storage";
import { Picker } from "@react-native-community/picker";
import _ from "lodash";
import { ScrollView } from "react-native-gesture-handler";
import ImageUploadOverlay from "./ImageUploadOverlay";

const EditProfile = (props) => {
    console.log(props.navigation.state);
    const [routeName, setRouteName] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [settingModalVisible, setSettingModalVisible] = useState(false);
    const [userData, setUserData] = useState({});
    const [jobSeekerData, setJobSeekerData] = useState({});
    const [imagePath, setImagePath] = useState(null);
    const [success, setSuccess] = useState(null);

    const world_cities = require("../../../assets/jsonContent/world_cities.json");
    let [cities, setCities] = useState([]);

    function switchToScreen(screen, params) {
        props.navigation.push(screen, params);
    }

    useEffect(() => {
        setRouteName(props.navigation.state.routeName);
        setCities(
            world_cities
                .filter((city) => city.country === "Canada")
                .sort((a, b) => (a.city > b.city ? 1 : -1))
        );

        try {
            AsyncStorage.getItem("jobSeekerLoginData").then((data) => {
                const { login, user } = JSON.parse(data);
                setUserData(login);
            });
        } catch (error) {
            // Error retrieving data
            console.log(error.message);
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

    function handleInputChange(text, name) {
        const jobSeeker = { ...jobSeekerData };
        jobSeeker[name] = text;
        setJobSeekerData(jobSeeker);
    }

    function setImageData(imageUri) {
        setImagePath(imageUri);
        jobSeekerData["image"] = imageUri;
        setJobSeekerData(jobSeekerData);
        setModalVisible(false);
    }

    function updateProfile() {
        let data = new FormData();
        if (imagePath) {
            data.append(
                "image",
                Platform.OS === "android"
                    ? { uri: imagePath, name: "image.png", type: "image/png" }
                    : {
                        uri: imagePath.replace("file://", ""),
                        name: "image.png",
                        type: "image/png",
                    }
            );
        }
        data.append("title", jobSeekerData.title);
        data.append("first_name", jobSeekerData.first_name);
        data.append("last_name", jobSeekerData.last_name);
        data.append("phone_number", jobSeekerData.phone_number);
        data.append("company_name", jobSeekerData.company_name);
        data.append("city", jobSeekerData.city);
        data.append("id", jobSeekerData.id);

        fetch(baseUrl + "api/job-seeker/profile/edit", {
            method: "POST",
            mode: "cors", // no-cors, *cors, same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, *same-origin, omit
            headers: {
                Accept: "application/json",
                "Content-Type": "multipart/form-data",
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: "follow", // manual, *follow, error
            referrerPolicy: "no-referrer",
            body: data,
        })
            .then((response) => response.json())
            .then((response) => {
                if (!response.success) {
                    Toast.show({
                        type: "error",
                        position: "top",
                        text1: "Error",
                        text2: "Something went wrong.",
                    });
                    throw new Error(response);
                } else {
                    setJobSeekerData(response.result);
                    Toast.show({
                        type: "success",
                        position: "top",
                        text1: "Success",
                        text2: "Profile updated successfully.",
                    });
                }
            })
            .catch((err) => {
                Toast.show({
                    type: "error",
                    position: "top",
                    text1: "Error",
                    text2: "Something went wrong.",
                });
                console.log(err);
            });
    }

    const {
        title,
        first_name,
        last_name,
        phone_number,
        company_name,
        city,
    } = jobSeekerData;

    return (
        <View style={styles.container}>
            <View style={styles.innerContainer}>
                <ScrollView>
                    <View style={styles.imageContainer}>
                        <TouchableHighlight
                            style={styles.imagePlaceholder}
                            onPress={() => setModalVisible(true)}
                        >
                            <View>
                                {jobSeekerData.image ? (
                                    <Image
                                        style={[styles.profileImage]}
                                        source={{ uri: jobSeekerData.image }}
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
                        </TouchableHighlight>
                        <Text style={styles.labelText}>Profile Picture</Text>
                    </View>
                    <View style={styles.rowContainer}>
                        <Text style={styles.labelText}>Title</Text>
                        <View style={[styles.pickerStyle]}>
                            <Picker
                                selectedValue={jobSeekerData.title}
                                onValueChange={(itemValue, itemIndex) =>
                                    handleInputChange(itemValue, "title")
                                }
                            >
                                <Picker.Item label="Mr." value="Mr." />
                                <Picker.Item label="Ms." value="Ms." />
                                <Picker.Item label="Mrs." value="Mrs." />
                            </Picker>
                        </View>
                    </View>
                    <View style={styles.rowContainer}>
                        <Text style={styles.labelText}>First Name</Text>
                        <TextInput
                            style={styles.inputStyle}
                            onChangeText={(text) =>
                                handleInputChange(text, "first_name")
                            }
                        >
                            {jobSeekerData.first_name}
                        </TextInput>
                    </View>
                    <View style={styles.rowContainer}>
                        <Text style={styles.labelText}>Last Name</Text>
                        <TextInput
                            style={styles.inputStyle}
                            onChangeText={(text) =>
                                handleInputChange(text, "last_name")
                            }
                        >
                            {jobSeekerData.last_name}
                        </TextInput>
                    </View>
                    <View style={styles.rowContainer}>
                        <Text style={styles.labelText}>Contact</Text>
                        <TextInput
                            style={styles.inputStyle}
                            keyboardType="numeric"
                            onChangeText={(text) =>
                                handleInputChange(text, "phone_number")
                            }
                        >
                            {jobSeekerData.phone_number}
                        </TextInput>
                    </View>
                    <View style={styles.rowContainer}>
                        <Text style={styles.labelText}>Organization</Text>
                        <TextInput
                            style={styles.inputStyle}
                            onChangeText={(text) =>
                                handleInputChange(text, "company_name")
                            }
                        >
                            {jobSeekerData.company_name}
                        </TextInput>
                    </View>
                    <View style={styles.rowContainer}>
                        <Text style={styles.labelText}>City</Text>
                        <View style={[styles.pickerStyle]}>
                            <Picker
                                selectedValue={jobSeekerData.city}
                                onValueChange={(itemValue, itemIndex) =>
                                    handleInputChange(itemValue, "city")
                                }
                            >
                                {cities.map((city) => {
                                    return (
                                        <Picker.Item
                                            key={city.id}
                                            label={city.city}
                                            value={city.city}
                                        />
                                    );
                                })}
                            </Picker>
                        </View>
                    </View>
                    <View style={styles.rowContainer}>
                        <TouchableHighlight
                            style={styles.updateBtn}
                            onPress={updateProfile}
                        >
                            <Text>Update Profile</Text>
                        </TouchableHighlight>
                    </View>
                </ScrollView>
            </View>
            <Toast ref={(ref) => Toast.setRef(ref)} />
            <View style={styles.bottomNavigation}>
                <BottomTabNavigator
                    routeName={routeName}
                    userData={userData}
                    setSettingModalVisible={setSettingModalVisible}
                    switchToScreen={switchToScreen}
                />
            </View>
            <ImageUploadOverlay
                setImageData={setImageData}
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

EditProfile["navigationOptions"] = (screenProps) => ({
    title: "Edit Profile",
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
    rowContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 20,
        marginVertical: 10,
    },
    labelText: {
        flex: 1,
        fontWeight: "700",
        fontSize: 16,
    },
    pickerStyle: {
        flex: 2,
        height: 50,
        overflow: "hidden",
        borderRadius: 5,
        backgroundColor: "#ffffff",
        shadowColor: "#dddddd",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 4,
    },
    inputStyle: {
        flex: 2,
        height: 50,
        borderRadius: 5,
        backgroundColor: "#ffffff",
        paddingLeft: 10,
        shadowColor: "#dddddd",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        marginLeft: 6,
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 4,
    },
    imageContainer: {
        flexDirection: "column",
        margin: 15,
        justifyContent: "center",
        alignItems: "center",
    },
    imagePlaceholder: {
        backgroundColor: "#ffffff",
        borderRadius: 100,
        shadowColor: "#dddddd",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    profileImage: {
        height: 120,
        width: 120,
        borderRadius: 100,
        alignSelf: "center",
    },
    loginText: {
        color: "black",
        fontSize: 30,
        marginTop: 20,
        marginLeft: 100,
    },
    updateBtn: {
        height: 50,
        width: 180,
        borderRadius: 25,
        backgroundColor: "#fb5b5a",
        shadowColor: "#dddddd",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
        alignItems: "center",
        justifyContent: "center",
    },
});

export default EditProfile;
