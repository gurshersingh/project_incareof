import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TextInput,
    TouchableOpacity,
    //Image,
} from 'react-native';
import _ from "lodash";
import { baseUrl } from '../utils/constants';
import { LinearGradient } from "expo-linear-gradient";
class NewPassword extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            otp: '',
            password: '',
            confirm_password: '',
            otp_error: '',
            password_error: '',
            confirm_password_error:'',
            id: props.navigation.state.params.user_id
        }
    }
    handleotpChange = (event) => {
        if (!_.isEmpty(event)) {
            this.setState({ otp:event, otp_error: null })
        }
        else {
            this.setState({ otp_error: "otp is required" })
        }
    }
    handlePasswordChange = (event) => {
        if (!_.isEmpty(event)) {
            if (event.length > 5) {
                this.setState({ password: event, password_error: null })
            }
            else {
                this.setState({ password_error: "you have to enter at least 6 digit!" })
            }
        } else {
            this.setState({ password_error: "password is required" })
        }
    }
    handleConfirmChange = (event) => {
        if (!_.isEmpty(event)) {
            if (this.state.password != event) {
                this.setState({ confirm_password_error: "password not match" })
            }
            else {
                this.setState({ confirm_password: event, confirm_password_error: null })
            }
        }
        else {
            this.setState({ confirm_password_error: "password is required" })
        }
    }
    handleForgot = () => {
        if (this.state.otp_error !== null ||
            this.state.password_error !== null ||
            this.state.confirm_password_error !== null
        ) {
            alert("Fill the Field.");
        }
        else {
            console.log("Successs")
            fetch(baseUrl + 'api/login/reset-password', {
                method: 'POST',
                mode: 'cors', // no-cors, *cors, same-origin
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                credentials: 'same-origin', // include, *same-origin, omit
                headers: {
                    'Content-Type': 'application/json'
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                redirect: 'follow', // manual, *follow, error
                referrerPolicy: 'no-referrer',
                body: JSON.stringify(this.state)
            })
                .then(response => response.json())
                .then((response) => {
                    if (!response.success)
                        throw new Error(response)
                    else {
                        alert("Password updated  Successfully")
                    }
                })
                .catch((err) => {
                    this.setState({ success: false, err: "Registration Failed. Please try again later" })
                })
        }
    }
    render() {
        return (
            <LinearGradient
                colors={["#BA9ED1", "#765A8D"]}
                style={styles.container}
                //  Linear Gradient
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
            >
                <View style={styles.container}>
                    <View style={styles.innerContainer}>
                        <ScrollView>
                            <View>
                                <Text style={styles.loginText}>Add New Password</Text>
                            </View>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.inputStyle}
                                    name="otp"
                                    placeholder="Enter OTP"
                                    placeholderTextColor="black"
                                    onChangeText={this.handleotpChange}
                                />
                                {this.state.otp_error ? (
                                    <Text style={styles.errorText}>{this.state.otp_error}</Text>
                                ) : null}
                            </View>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.inputStyle}
                                    name="password"
                                    placeholder="Enter New Password"
                                    placeholderTextColor="black"
                                    onChangeText={this.handlePasswordChange}
                                />
                                {this.state.password_error ? (
                                    <Text style={styles.errorText}>{this.state.password_error}</Text>
                                ) : null}
                            </View>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.inputStyle}
                                    name="confirm_password"
                                    placeholder="Enter confirm Password"
                                    placeholderTextColor="black"
                                    onChangeText={this.handleConfirmChange}
                                />
                                {this.state.confirm_password_error ? (
                                    <Text style={styles.errorText}>{this.state.confirm_password_error}</Text>
                                ) : null}
                            </View>
                            <View style={styles.rowContainer}>
                                <TouchableOpacity style={styles.updateBtn} onPress={this.handleForgot}>
                                    <Text>Submit</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </LinearGradient>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        flex: 1,
        width: null,
        height: null,
    },
    inputStyle: {
        flex: 2,
        height: 50,
        overflow: "hidden",
        borderRadius: 5,
        backgroundColor: '#fff',
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
    errorText: {
        color: 'red'
    },
    innerContainer: {
        flex: 9.2,
    },
    rowContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 20,
        marginVertical: 10,
    },
    loginText: {
        color: 'black',
        fontSize: 30,
        marginTop: 20,
        marginHorizontal:45
    },
    inputContainer: {
        flex: 2,
        marginHorizontal: 30,
        marginVertical: 10

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
export default NewPassword;
