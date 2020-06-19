import React from "react";
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-community/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-community/picker";
import Toast from "react-native-toast-message";
import _ from "lodash";

import { baseUrl } from "../utils/constants";
export default class JobPost extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            job_title: "",
            job_description: "",
            start_date: new Date(),
            show: false,
            mode: "date",
            end_date: new Date(),
            endShow: false,
            endMode: "date",
            wager_offered: "",
            job_service_id: "",
            services: [],
            success: false,
            err: "",
            user_id: null,
            validation_error: {
                job_title: {
                    error: false,
                    message: null,
                },
                job_description: {
                    error: false,
                    message: null,
                },
                start_date: {
                    error: false,
                    message: null,
                },
                end_date: {
                    error: false,
                    message: null,
                },
                wager_offered: {
                    error: false,
                    message: null,
                },
                job_service_id: {
                    error: false,
                    message: null,
                },
            },
        };
    }

    componentDidMount() {
        this.fetchService();
        try {
            AsyncStorage.getItem("employerLoginData").then((data) => {
                const { login, user } = JSON.parse(data);
                console.log("data in job post", user.id);
                this.setState({
                    user_id: user.id,
                });
            });
        } catch (error) {
            // Error retrieving data
            console.log(error.message);
        } finally {
            console.log("in finally")
            if (!_.isEmpty(this.state.user_id)) {
                console.log("in finally user id blank")
                try {
                    AsyncStorage.getItem("registeredUser").then((data) => {
                        const registeredUser = JSON.parse(data);
                        this.setState({
                            user_id: registeredUser.id,
                        });
                    });
                } catch (error) {
                    // Error retrieving data
                    console.log(error.message);
                }
            }
        }
    }

    fetchService() {
        const api_url = baseUrl + `api/service/list`;
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
                    this.setState({ services: response.result });
                } else {
                    throw new Error(response);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    handleSubmit = () => {
        const {
            job_title,
            job_description,
            start_date,
            end_date,
            wager_offered,
            job_service_id,
            user_id,
        } = this.state;

        if (
            job_title &&
            job_description &&
            start_date &&
            end_date &&
            wager_offered &&
            job_service_id
        ) {
            const params = {
                job_title,
                job_description,
                start_date,
                end_date,
                wager_offered,
                job_service_id,
                user_id,
            };
            fetch(baseUrl + "api/employer/post-job", {
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
                body: JSON.stringify(params),
            })
                .then((response) => response.json())
                .then((response) => {
                    if (!response.success) {
                        console.log(response);
                        Toast.show({
                            type: "info",
                            position: "top",
                            text1: "Info",
                            text2: `Your job post credits have been exhausted. ${response.err}.`,
                            onHide: () => {
                                this.props.navigation.push(
                                    "MembershipPage"
                                );
                            },
                        });
                        // throw new Error(response);
                    } else {
                        this.props.navigation.push("SuccessScreen", {
                            screen: "EmployerScreen",
                        });
                        // Toast.show({
                        //   type: 'success',
                        //   position: 'top',
                        //   text1: 'Success',
                        //   text2: 'Profile updated successfully.',
                        // });
                    }
                })
                .catch((err) => {
                    Toast.show({
                        type: "error",
                        position: "top",
                        text1: "Warning",
                        text2: "Something went wrong. Please, try again later.",
                    });
                    // this.setState({
                    //   success: false,
                    //   err: "Registration Failed. Please try again later",
                    // });
                });
        } else {
            Toast.show({
                type: "error",
                position: "top",
                text1: "Warning",
                text2: "Please, check input fileds",
            });
        }
    };

    dateTimerPickerChange = (event, selectedDate) => {
        const currentDate = selectedDate || this.state.start_date;
        this.setState({ show: Platform.OS === "ios", start_date: currentDate });
    };

    showMode = (currentMode) => {
        this.setState({ show: true, mode: currentMode });
    };

    showDatepicker = () => {
        this.showMode("date");
    };

    endDateTimerPickerChange = (event, selectedDate) => {
        const currentDate = selectedDate || this.state.end_date;
        this.setState({ endShow: Platform.OS === "ios", end_date: currentDate });
    };

    showEndMode = (currentMode) => {
        this.setState({ endShow: true, endMode: currentMode });
    };

    showEndDatepicker = () => {
        this.showEndMode("date");
    };

    handleInputChange = (text, name) => {
        const { validation_error } = this.state;
        if (_.isEmpty(text)) {
            validation_error[name] = {
                error: true,
                message: name.replace(/_/g, " ") + " is required.",
            };
        } else {
            validation_error[name] = {
                error: false,
                message: null,
            };
        }
        this.setState({ [name]: text, validation_error });
    };

    render() {
        const {
            job_title,
            job_description,
            start_date,
            end_date,
            wager_offered,
            job_service_id,
        } = this.state.validation_error;

        return (
            <ScrollView
                contentContainerStyle={{
                    flex: 1,
                }}
            >
                <View style={styles.container}>
                    <View>
                        <Text style={styles.headingText}>Post a new Job</Text>
                    </View>
                    <TextInput
                        placeholder="Enter job's title"
                        style={[styles.textInput, styles.inputWidth]}
                        onSubmitEditing={() => {
                            this.secondTextInput.focus();
                        }}
                        returnKeyType={"next"}
                        // autoFocus={true}
                        onChangeText={(text) =>
                            this.handleInputChange(text, "job_title")
                        }
                    />
                    {job_title.error ? (
                        <Text style={styles.errorText}>
                            {job_title.message}
                        </Text>
                    ) : null}
                    <TextInput
                        ref={(input) => {
                            this.secondTextInput = input;
                        }}
                        placeholder="Enter job's description"
                        style={[styles.textInput, styles.inputWidth]}
                        onSubmitEditing={() => {
                            this.thirdTextInput.focus();
                        }}
                        returnKeyType={"next"}
                        onChangeText={(text) =>
                            this.handleInputChange(text, "job_description")
                        }
                    />
                    {job_description.error ? (
                        <Text style={styles.errorText}>
                            {job_description.message}
                        </Text>
                    ) : null}
                    <TouchableOpacity
                        onPress={this.showDatepicker}
                        style={[styles.textInput, styles.inputWidth]}
                    >
                        <TextInput
                            placeholder="Select a start date"
                            editable={false}
                            returnKeyType={"next"}
                            value={this.state.start_date.toLocaleDateString(
                                "nl",
                                {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                }
                            )}
                            pointerEvents="none"
                        />
                    </TouchableOpacity>
                    {start_date.error ? (
                        <Text style={styles.errorText}>
                            {start_date.message}
                        </Text>
                    ) : null}
                    {this.state.show && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            timeZoneOffsetInMinutes={0}
                            value={this.state.start_date}
                            mode={this.state.mode}
                            is24Hour={true}
                            display="default"
                            onChange={this.dateTimerPickerChange}
                        />
                    )}
                    <TouchableOpacity
                        onPress={this.showEndDatepicker}
                        style={[styles.textInput, styles.inputWidth]}
                    >
                        <TextInput
                            placeholder="Select an end date"
                            editable={false}
                            returnKeyType={"next"}
                            value={this.state.end_date.toLocaleDateString(
                                "nl",
                                {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                }
                            )}
                            pointerEvents="none"
                        />
                    </TouchableOpacity>
                    {end_date.error ? (
                        <Text style={styles.errorText}>{end_date.message}</Text>
                    ) : null}
                    {this.state.endShow && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            timeZoneOffsetInMinutes={0}
                            value={this.state.end_date}
                            mode={this.state.endMode}
                            is24Hour={true}
                            display="default"
                            onChange={this.endDateTimerPickerChange}
                        />
                    )}
                    <TextInput
                        ref={(input) => {
                            this.thirdTextInput = input;
                        }}
                        placeholder="Enter wager"
                        keyboardType="numeric"
                        style={[styles.textInput, styles.inputWidth]}
                        returnKeyType={"next"}
                        onChangeText={(text) =>
                            this.handleInputChange(text, "wager_offered")
                        }
                    />
                    {wager_offered.error ? (
                        <Text style={styles.errorText}>
                            {wager_offered.message}
                        </Text>
                    ) : null}
                    <View style={[styles.pickerStyle, styles.inputWidth]}>
                        <Picker
                            selectedValue={parseInt(this.state.job_service_id)}
                            onValueChange={(itemValue, itemIndex) =>
                                this.handleInputChange(
                                    itemValue.toString(),
                                    "job_service_id"
                                )
                            }
                        >
                            <Picker.Item label="Select service" value="" />
                            {this.state.services.map((service) => {
                                return (
                                    <Picker.Item
                                        key={service.id}
                                        label={service.service_name}
                                        value={service.id}
                                    />
                                );
                            })}
                        </Picker>
                    </View>
                    {job_service_id.error ? (
                        <Text style={styles.errorText}>
                            {job_service_id.message}
                        </Text>
                    ) : null}
                    {this.state.success ? (
                        <View style={styles.showMessage}>
                            <Text>{this.state.message}</Text>
                        </View>
                    ) : this.state.err ? (
                        <View style={styles.showMessage}>
                            <Text>{this.state.message}</Text>
                        </View>
                    ) : null}
                    <TouchableOpacity
                        style={styles.submitBtn}
                        onPress={this.handleSubmit}
                    >
                        <Text style={styles.btnText}>Post job</Text>
                    </TouchableOpacity>
                    <Toast ref={(ref) => Toast.setRef(ref)} />
                </View>
            </ScrollView>
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
    scrollContianer: {
        flex: 1,
    },
    boxContainer: {
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
    textInput: {
        height: 50,
        backgroundColor: "#ffffff",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderColor: "#ffffff",
        borderWidth: 1,
        borderRadius: 5,
        marginVertical: 10,
        shadowColor: "#dddddd",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    inputWidth: {
        width: "70%",
    },
    pickerStyle: {
        height: 50,
        backgroundColor: "#ffffff",
        paddingHorizontal: 10,
        paddingVertical: 0,
        borderColor: "#ffffff",
        borderWidth: 1,
        borderRadius: 5,
        marginVertical: 10,
        shadowColor: "#dddddd",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    submitBtn: {
        height: 50,
        backgroundColor: "#99D5CA",
        borderColor: "#99D5CA",
        borderWidth: 1,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 60,
        width: "35%",
        shadowColor: "#dddddd",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    btnText: {
        textTransform: "uppercase",
        fontWeight: "700",
        color: "#ffffff",
    },
    errorText: {
        textTransform: "capitalize",
        fontWeight: "700",
        color: "#ffffff",
        // width: "70%",
        // borderColor: 'red',
        // borderWidth: 1
    },
});
