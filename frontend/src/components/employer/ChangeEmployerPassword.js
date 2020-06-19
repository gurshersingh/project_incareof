import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, SafeAreaView } from 'react-native';
import EmployerSearchFilter from './EmployerSearchFilter';
import EmployerBottomNavigator from './EmployerBottomNavigator';
import EmployerFilterOverlay from './EmployerFilterOverlay';
import UserContactOverlay from './UserContactOverlay';
import EmployerSettingsOverlay from './EmployerSettingsOverlay';
import AsyncStorage from "@react-native-community/async-storage";

const ChangeEmployerPassword = (props) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [filterVisiblity, setFilterVisibility] = useState(false);
    const [settingModalVisible, setSettingModalVisible] = useState(false);
    const [employerLoginData, setEmployerLoginData] = useState({});
    const [passwordObj, setPasswordObj] = useState({
        old_password: null,
        new_password: null,
        confirm_password: null,
        old_password_error: {
            error: false,
            message: null,
        },
        new_password_error: {
            error: false,
            message: null,
        },
        confirm_password_error: {
            error: false,
            message: null,
        },
    });

    function switchToScreen(screen, params) {
        props.navigation.push(screen, params);
    }

    useEffect(() => {
        try {
            AsyncStorage.getItem("employerLoginData").then((employer) => {
                setEmployerLoginData(JSON.parse(employer));
            });
        } catch (error) {
            // Error retrieving data
            console.log(error.message);
        }
    }, [])

    const {
        old_password,
        old_password_error,
        new_password,
        new_password_error,
        confirm_password,
        confirm_password_error,
    } = passwordObj;

    return (
        <View style={styles.container}>
            <View style={styles.jobSeekerDashboard}>
                <View style={{ alignItems: "stretch", marginVertical: 20 }}>
                    <Text style={styles.headingText}>Change Password</Text>
                </View>
                <View style={styles.changePasswordContainer}>
                    <TextInput
                        name="old_password"
                        secureTextEntry={true}
                        style={styles.textInput}
                        placeholder="Enter current password"
                        onChangeText={(text) =>
                            handlePasswordChange(text, "old_password")
                        }
                    />
                    {old_password_error.error ? (
                        <Text style={styles.errorText}>
                            {old_password_error.message}
                        </Text>
                    ) : null}
                    <TextInput
                        name="new_password"
                        secureTextEntry={true}
                        style={styles.textInput}
                        placeholder="New password"
                        onChangeText={(text) =>
                            handlePasswordChange(text, "new_password")
                        }
                    />
                    {new_password_error.error ? (
                        <Text style={styles.errorText}>
                            {new_password_error.message}
                        </Text>
                    ) : null}
                    <TextInput
                        name="confirm_password"
                        secureTextEntry={true}
                        style={styles.textInput}
                        placeholder="Confirm password"
                        onChangeText={(text) =>
                            confirmPasswordChange(text, "confirm_password")
                        }
                    />
                    {confirm_password_error.error ? (
                        <Text style={styles.errorText}>
                            {confirm_password_error.message}
                        </Text>
                    ) : null}
                    <TouchableOpacity
                        style={styles.contactBtn}
                        onPress={() => {
                            changePassword();
                        }}
                    >
                        <Text style={styles.contactBtnText}>Change Password</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.bottomNavigation}>
                <EmployerBottomNavigator
                    employerLoginData={employerLoginData}
                    setSettingModalVisible={setSettingModalVisible}
                    switchToScreen={switchToScreen}
                />
            </View>
            <EmployerSettingsOverlay
                switchToScreen={switchToScreen}
                settingModalVisible={settingModalVisible}
                setSettingModalVisible={setSettingModalVisible}
            />
        </View>
    )
}

const styles = StyleSheet.create({
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
    changePasswordContainer: {
        marginHorizontal: 20,
    },
    headingText: {
        fontWeight: '800',
        fontSize: 30,
        alignSelf: "center"
    },
    textInput: {
        marginVertical: 10,
        backgroundColor: "#ffffff",
        paddingHorizontal: 10,
        paddingVertical: 10,
        shadowColor: "#dddddd",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
    },
    errorText: {
        textTransform: "capitalize",
        color: "red",
    },
    contactBtn: {
        width: "40%",
        height: 50,
        backgroundColor: "#fb5b5a",
        borderRadius: 25,
        justifyContent: "center",
        marginVertical: 15,
        alignItems: "center",
        alignSelf: "center",
        borderColor: "#dddddd",
        borderWidth: 1,
        shadowColor: "#9E9E9E",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.8,
        shadowRadius: 4.65,
    },
    contactBtnText: {
        color: "white",
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
})

export default ChangeEmployerPassword;
