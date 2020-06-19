import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Image,
    TouchableHighlight,
    TextInput,
} from "react-native";
import _ from "lodash";
import Toast from "react-native-toast-message";
import EmployerBottomNavigator from "./EmployerBottomNavigator";
import EmployerSettingsOverlay from "./EmployerSettingsOverlay";
import AsyncStorage from "@react-native-community/async-storage";
import { Picker } from "@react-native-community/picker";
import { baseUrl } from "../../utils/constants";
import EmployerImageUploadOverlay from "./EmployerImageUploadOverlay";

const EditEmployerProfile = (props) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [settingModalVisible, setSettingModalVisible] = useState(false);
    const [loginData, setLoginData] = useState({});
    const [employerData, setEmployerData] = useState({});
    const [imagePath, setImagePath] = useState(null);
    const [validationError, setValidationError] = useState({
        title_error: {
            error: false,
            message: null,
        },
        first_name_error: {
            error: false,
            message: null,
        },
        last_name_error: {
            error: false,
            message: null,
        },
        phone_number_error: {
            error: false,
            message: null,
        },
        company_name_error: {
            error: false,
            message: null,
        },
        city_error: {
            error: false,
            message: null,
        },
    });

    const world_cities = require("../../../assets/jsonContent/world_cities.json");
    const [cities, setCities] = useState([]);

    function switchToScreen(screen, params) {
        props.navigation.push(screen, params);
    }

    useEffect(() => {
        setCities(
            world_cities
                .filter((city) => city.country === "Canada")
                .sort((a, b) => (a.city > b.city ? 1 : -1))
        );
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

    function handleInputChange(text, name) {
        const employer = { ...employerData };
        employer[name] = text;
        if (_.isEmpty(text)) {
            validationError[`${name}_error`] = {
                error: true,
                message: name.replace("_", " ") + " is required.",
            };
        } else {
            validationError[`${name}_error`] = {
                error: false,
                message: null,
            };
        }
        setEmployerData(employer);
        setValidationError(validationError);
    }

    function setImageData(imageUri) {
        setImagePath(imageUri);
        employerData["image"] = imageUri;
        setEmployerData(employerData);
        setModalVisible(false);
    }

    function updateProfile() {
        if (
            !validationError.title_error.error &&
            !validationError.first_name_error.error &&
            !validationError.last_name_error.error &&
            !validationError.phone_number_error.error &&
            !validationError.company_name_error.error &&
            !validationError.city_error.error
        ) {
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
            data.append("title", employerData.title);
            data.append("first_name", employerData.first_name);
            data.append("last_name", employerData.last_name);
            data.append("phone_number", employerData.phone_number);
            data.append("company_name", employerData.company_name);
            data.append("city", employerData.city);
            data.append("id", employerData.id);

            fetch(baseUrl + "api/employer/profile/edit", {
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
                        // throw new Error(response);
                    } else {
                        // setJobSeekerData(response.result);
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
        } else {
            Toast.show({
                type: "error",
                position: "top",
                text1: "Warning",
                text2: "Please, check input fileds",
            });
        }
    }

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
                                {employerData.image ? (
                                    <Image
                                        style={[styles.profileImage]}
                                        source={{ uri: employerData.image }}
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
                        <View style={styles.inputContainer}>
                            <View style={[styles.pickerStyle]}>
                                <Picker
                                    selectedValue={employerData.title}
                                    onValueChange={(itemValue, itemIndex) =>
                                        handleInputChange(itemValue, "title")
                                    }
                                >
                                    <Picker.Item
                                        label="Select Title"
                                        value=""
                                    />
                                    <Picker.Item label="Mr." value="Mr." />
                                    <Picker.Item label="Ms." value="Ms." />
                                    <Picker.Item label="Mrs." value="Mrs." />
                                </Picker>
                            </View>
                            {validationError.title_error.error ? (
                                <Text style={styles.errorText}>
                                    {validationError.title_error.message}
                                </Text>
                            ) : null}
                        </View>
                    </View>
                    <View style={styles.rowContainer}>
                        <Text style={styles.labelText}>First Name</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.inputStyle}
                                onChangeText={(text) =>
                                    handleInputChange(text, "first_name")
                                }
                            >
                                {employerData.first_name}
                            </TextInput>
                            {validationError.first_name_error.error ? (
                                <Text style={styles.errorText}>
                                    {validationError.first_name_error.message}
                                </Text>
                            ) : null}
                        </View>
                    </View>
                    <View style={styles.rowContainer}>
                        <Text style={styles.labelText}>Last Name</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.inputStyle}
                                onChangeText={(text) =>
                                    handleInputChange(text, "last_name")
                                }
                            >
                                {employerData.last_name}
                            </TextInput>
                            {validationError.last_name_error.error ? (
                                <Text style={styles.errorText}>
                                    {validationError.last_name_error.message}
                                </Text>
                            ) : null}
                        </View>
                    </View>
                    <View style={styles.rowContainer}>
                        <Text style={styles.labelText}>Contact</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.inputStyle}
                                keyboardType="numeric"
                                onChangeText={(text) =>
                                    handleInputChange(text, "phone_number")
                                }
                            >
                                {employerData.phone_number}
                            </TextInput>
                            {validationError.phone_number_error.error ? (
                                <Text style={styles.errorText}>
                                    {validationError.phone_number_error.message}
                                </Text>
                            ) : null}
                        </View>
                    </View>
                    <View style={styles.rowContainer}>
                        <Text style={styles.labelText}>Organization</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.inputStyle}
                                onChangeText={(text) =>
                                    handleInputChange(text, "company_name")
                                }
                            >
                                {employerData.company_name}
                            </TextInput>
                            {validationError.company_name_error.error ? (
                                <Text style={styles.errorText}>
                                    {validationError.company_name_error.message}
                                </Text>
                            ) : null}
                        </View>
                    </View>
                    <View style={styles.rowContainer}>
                        <Text style={styles.labelText}>City</Text>
                        <View style={styles.inputContainer}>
                            <View style={[styles.pickerStyle]}>
                                <Picker
                                    selectedValue={employerData.city}
                                    onValueChange={(itemValue, itemIndex) =>
                                        handleInputChange(itemValue, "city")
                                    }
                                >
                                    <Picker.Item label="Select city" value="" />
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
                            {validationError.city_error.error ? (
                                <Text style={styles.errorText}>
                                    {validationError.city_error.message}
                                </Text>
                            ) : null}
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
            <View style={styles.bottomNavigation}>
                <EmployerBottomNavigator
                    employerLoginData={loginData}
                    setSettingModalVisible={setSettingModalVisible}
                    switchToScreen={switchToScreen}
                />
            </View>
            <Toast ref={(ref) => Toast.setRef(ref)} />
            <EmployerImageUploadOverlay
                setImageData={setImageData}
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
            />
            <EmployerSettingsOverlay
                settingModalVisible={settingModalVisible}
                setSettingModalVisible={setSettingModalVisible}
            />
        </View>
    );
};

EditEmployerProfile["navigationOptions"] = (screenProps) => ({
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
    inputContainer: {
        flex: 2,
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
        overflow: "hidden",
        borderRadius: 5,
        backgroundColor: "#ffffff",
        paddingLeft: 10,
        shadowColor: "#dddddd",
        shadowOffset: {
            width: 0,
            height: 4,
        },
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
    errorText: {
        textTransform: "capitalize",
        color: "red",
        marginLeft: 5,
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

export default EditEmployerProfile;
