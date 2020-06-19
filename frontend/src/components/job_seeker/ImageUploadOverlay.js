import React, {useState} from "react";
import {StyleSheet, Modal, TouchableHighlight, View, Text} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";

const ImageUploadOverlay = ({modalVisible, setModalVisible, setImageData}) => {
    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [3, 4],
                quality: 0.4,
            });

            if (!result.cancelled) {
                setImageData(result.uri);
            } else {
                console.log(result);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const imageFromCamera = async () => {
        const {status: cameraPerm} = await Permissions.askAsync(
            Permissions.CAMERA
        );

        const {status: cameraRollPerm} = await Permissions.askAsync(
            Permissions.CAMERA_ROLL
        );

        // only if user allows permission to camera AND camera roll
        if (cameraPerm === "granted" && cameraRollPerm === "granted") {
            const pickerResult = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.4,
            });

            if (!pickerResult.cancelled) {
                setImageData(pickerResult.uri);
            }
        }
    };

    return (
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
            <View
                style={styles.centeredView}
                onStartShouldSetResponder={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.modalView}>
                    <View>
                        <TouchableHighlight
                            style={styles.contBtn}
                            onPress={(event) => {
                                event.stopPropagation();
                                pickImage();
                            }}
                        >
                            <Ionicons
                                name="md-images"
                                style={styles.contactIcons}
                            />
                        </TouchableHighlight>
                        <Text style={styles.textStyle}>
                            Upload from Gallery
                        </Text>
                    </View>
                    <View>
                        <TouchableHighlight
                            style={styles.contBtn}
                            onPress={(event) => {
                                event.stopPropagation();
                                imageFromCamera();
                            }}
                        >
                            <Ionicons
                                name="md-camera"
                                style={styles.contactIcons}
                            />
                        </TouchableHighlight>
                        <Text style={styles.textStyle}>Open Camera</Text>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#388e3c",
        opacity: 0.8,
    },
    modalView: {
        alignItems: "center",
        flexDirection: "column",
        elevation: 5,
    },
    contBtn: {
        alignSelf: "center",
        backgroundColor: "#f8bbd0",
        borderRadius: 50,
        marginVertical: 20,
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
        fontSize: 40,
        color: "#ffffff",
    },
});

export default ImageUploadOverlay;
