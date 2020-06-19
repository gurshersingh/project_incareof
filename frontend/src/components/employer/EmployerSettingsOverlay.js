import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    Modal,
    TouchableHighlight,
    View,
    BackHandler,
    Alert,
} from "react-native";
import _ from "lodash";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-community/async-storage";

const EmployerSettingsOverlay = ({
    switchToScreen,
    settingModalVisible,
    setSettingModalVisible,
}) => {
    const [employerLoginData, setEmployerLoginData] = useState({});

    function backPressed() {
        Alert.alert(
            "Exit App",
            "Do you want to exit?",
            [
                {
                    text: "No",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel",
                },
                {
                    text: "Yes",
                    onPress: () => {
                        try {
                            const asyncStorageKeys = AsyncStorage.getAllKeys();
                            if (asyncStorageKeys.length > 0) {
                                AsyncStorage.clear();
                            }
                            // AsyncStorage.removeItem("employerLoginData");
                            // AsyncStorage.removeItem("registeredUser");
                            BackHandler.exitApp();
                        } catch (e) {
                            // remove error
                        }
                    },
                },
            ],
            { cancelable: false }
        );
        return true;
    }

    useEffect(() => {
        try {
            AsyncStorage.getItem("employerLoginData").then((data) => {
                const { login, user } = JSON.parse(data);
                setEmployerLoginData(login);
            });
        } catch (error) {
            // Error retrieving data
            console.log(error.message);
        }
    }, []);

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={settingModalVisible}
            onRequestClose={() => {
                Alert.alert("Modal has been closed.");
            }}
        >
            <View
                style={styles.centeredView}
                onStartShouldSetResponder={() => {
                    setSettingModalVisible(!settingModalVisible);
                }}
            >
                <View style={styles.modalView}>
                    <TouchableHighlight
                        style={styles.contBtn}
                        onPress={(event) => {
                            event.stopPropagation();
                            setSettingModalVisible(false);
                            switchToScreen(
                                "EmployerProfile1",
                                employerLoginData
                            );
                        }}
                    >
                        <AntDesign name="user" style={styles.contactIcons} />
                    </TouchableHighlight>
                    <TouchableHighlight
                        style={styles.contBtn}
                        onPress={(event) => {
                            event.stopPropagation();
                            setSettingModalVisible(false);
                            switchToScreen(
                                "ChangeEmployerPassword",
                                employerLoginData
                            );
                        }}
                    >
                        <AntDesign name="setting" style={styles.contactIcons} />
                    </TouchableHighlight>
                </View>
                <View style={styles.modalView}>
                    <TouchableHighlight
                        style={styles.contBtn}
                        onPress={(event) => {
                            event.stopPropagation();
                            console.log("Question clicked");
                        }}
                    >
                        <AntDesign
                            name="question"
                            style={styles.contactIcons}
                        />
                    </TouchableHighlight>
                    <TouchableHighlight
                        style={styles.contBtn}
                        onPress={(event) => {
                            event.stopPropagation();
                            console.log("Books clicked");
                        }}
                    >
                        <AntDesign name="book" style={styles.contactIcons} />
                    </TouchableHighlight>
                </View>
                <View style={styles.modalView}>
                    <TouchableHighlight
                        style={styles.contBtn}
                        onPress={(event) => {
                            event.stopPropagation();
                            backPressed();
                        }}
                    >
                        <AntDesign name="logout" style={styles.contactIcons} />
                    </TouchableHighlight>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flexDirection: "column",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#388e3c",
        opacity: 0.8,
    },
    modalView: {
        alignItems: "center",
        flexDirection: "row",
        marginVertical: 15,
        elevation: 5,
    },
    contBtn: {
        backgroundColor: "#ffffff",
        borderRadius: 35,
        marginHorizontal: 20,
        padding: 15,
        opacity: 1,
        elevation: 10,
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
    },
    contactIcons: {
        fontSize: 30,
    },
});

export default EmployerSettingsOverlay;
