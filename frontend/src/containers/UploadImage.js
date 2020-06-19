import * as React from "react";
import { Image, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import { baseUrl } from "../utils/constants";
import Toast from "react-native-toast-message";
import { LinearGradient } from "expo-linear-gradient";
export default class UploadImage extends React.Component {
    state = {
        image: null,
        isTryAgainVisible: false,
    };

    componentDidMount() {
        this.getPermissionAsync();
        // const {registeredUser} = this.props.navigation.state.params;
        // this.setState({
        //     image: registeredUser.image,
        //     isTryAgainVisible: true,
        //     uploadBtnText: "Upload Image",
        // });

        const { registeredUser } = this.props.navigation.state.params;
        if (registeredUser.image) {
            this.setState(
                {
                    image: registeredUser.image,
                    isTryAgainVisible: true,
                    uploadBtnText: "Upload Image",
                    registeredUser,
                },
                () => {
                    console.log("in upload image ===========> ", this.state);
                }
            );
        } else {
            this.setState(
                {
                    registeredUser,
                },
                () => {
                    console.log("in upload image ===========> ", this.state);
                }
            );
        }
    }

    getPermissionAsync = async () => {
        if (Constants.platform.ios) {
            const { status } = await Permissions.askAsync(
                Permissions.CAMERA_ROLL
            );
            if (status !== "granted") {
                //alert('Sorry, we need camera roll permissions to make this work!');
            }
        }
    };
    pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.4,
            });
            if (!result.cancelled) {
                this.setState({ image: result.uri });
            }
            this.handleSubmit();
        } catch (E) {
            console.log(E);
        }
    };
    takePhoto = async () => {
        const { status: cameraPerm } = await Permissions.askAsync(
            Permissions.CAMERA
        );

        const { status: cameraRollPerm } = await Permissions.askAsync(
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
                this.setState({ image: pickerResult.uri });
            }

            // this.uploadImageAsync(pickerResult.uri);
            this.handleSubmit();
        }
    };

    handleSubmit = () => {
        let data = new FormData();
        if (this.state.image) {
            data.append(
                "image",
                Platform.OS === "android"
                    ? {
                        uri: this.state.image,
                        name: "image.png",
                        type: "image/png",
                    }
                    : {
                        uri: this.state.image.replace("file://", ""),
                        name: "image.png",
                        type: "image/png",
                    }
            );
        }
        data.append("id", this.props.navigation.getParam("id"));

        const that = this;
        fetch(baseUrl + "api/employer/add-image", {
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
                        text1: "Warning",
                        text2: `Something went wrong.`,
                        onHide: () => {
                            this.setState({
                                isTryAgainVisible: true,
                                uploadBtnText: "Try Again",
                            });
                        },
                    });
                    // throw new Error(response)
                } else {
                    Toast.show({
                        type: "success",
                        position: "top",
                        text1: "Success",
                        text2: `Profile pic has been uploaded successfully.`,
                        onHide: () => {
                            this.setState({ isTryAgainVisible: false });
                            that.props.navigation.push("MembershipPage", {
                                service_list: this.props.navigation.getParam(
                                    "service_list"
                                ),
                                id: this.props.navigation.getParam("id"),
                            });
                        },
                    });
                }
            })
            .catch((err) => {
                // console.log(err)
                this.setState(
                    {
                        success: false,
                        err: err,
                        isLoading: false,
                    },
                    () => {
                        Toast.show({
                            type: "error",
                            position: "top",
                            text1: "Warning",
                            text2: `${this.state.err}`,
                            onHide: () => {
                                this.setState({
                                    isTryAgainVisible: true,
                                    uploadBtnText: "Try Again",
                                });
                            },
                        });
                    }
                );
            });
    };

    render() {
        const { image } = this.state;

        return (
            <View style={styles.container}>
                <View>
                    <Text style={styles.headingText}>Upload Profile Pic</Text>
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
                <TouchableOpacity
                    style={styles.submitBtn}
                    onPress={this.pickImage}
                >
                    <Text style={styles.btnText}>
                        Pick an image from camera roll
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.submitBtn}
                    onPress={this.takePhoto}
                >
                    <Text style={styles.btnText}>
                        Click an image from camera
                    </Text>
                </TouchableOpacity>
                {this.state.isTryAgainVisible ? (
                    <TouchableOpacity
                        style={styles.btnTry}
                        onPress={this.handleSubmit}
                    >
                        <Text style={styles.btnText}>
                            {this.state.uploadBtnText}
                        </Text>
                    </TouchableOpacity>
                ) : null}

                <Toast ref={(ref) => Toast.setRef(ref)} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    headingText: {
        fontWeight: "800",
        fontSize: 30,
        alignSelf: "center",
        marginTop: 30,
        marginBottom: 20,
    },
    imageContainer: {
        height: 150,
        width: 150,
        borderColor: "#dddddd",
        backgroundColor: "#ffffff",
        borderRadius: 100,
        marginLeft: 15,
        shadowColor: "#000000",
        shadowOffset: {
            width: 4,
            height: 4,
        },
        shadowOpacity: 0.8,
        shadowRadius: 6,
        elevation: 10,
    },
    profileImage: {
        height: 150,
        width: 150,
        borderRadius: 100,
    },
    submitBtn: {
        width: "60%",
        backgroundColor: "#8fbc8f",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
    },
    btnText: {
        color: "black",
    },
    btnTry: {
        width: "50%",
        backgroundColor: "#fb5b5a",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
    },
});
