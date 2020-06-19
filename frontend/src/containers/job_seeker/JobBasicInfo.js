import React from "react";
import _ from "lodash";
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { baseUrl } from "../../utils/constants";
import { Picker } from "@react-native-community/picker";
import { getNameAttributes } from "../../utils/utility";
import Toast from "react-native-toast-message";
const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        flex: 1,
        width: null,
        height: null,
    },
    headingText: {
        fontWeight: "800",
        fontSize: 30,
        alignSelf: "center",
        marginTop: 30,
        marginBottom: 20,
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
        backgroundColor: "#64358D",
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
        color: "#ffffff",
        backgroundColor: "#64358D",
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
    loginText: {
        color: "black",
        fontSize: 30,
        marginTop: 20,
        marginLeft: 65,
    },
});

// make the GET request to fetch data from the URL then using promise function to handle response.
class JobBasicInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            first_name: "",
            last_name: "",
            email: "",
            password: "",
            company_name: "",
            confirm_email: "",
            phone_number: "",
            title: "",
            success: true,
            picture: {},
            first_name_error: "",
            last_name_error: "",
            campany_error: "",
            email_error: "",
            confirm_email_error: "",
            password_error: "",
            mobile_error: "",
            title_error: "",
        };
    }

    componentDidMount() {
        const { email, name, picture } = this.props.navigation.state.params;
        const { first_name, last_name } = getNameAttributes(name);
        this.setState(
            {
                userFbData: this.props.navigation.state.params,
                email,
                first_name,
                last_name,
                picture,
                email_error: null,
                first_name_error: null,
                last_name_error: null,
                confirm_email_error: null,
            },
            () => {
                console.log(
                    "in jobseeker signup =============> ",
                    this.state.userFbData
                );
            }
        );
    }

    handleTitleChange = (event) => {
        if (!_.isEmpty(event)) {
            this.setState({ title: event, title_error: null });
        } else {
            this.setState({ title_error: "title is required" });
        }
    };
    handleFirstNameChange = (event) => {
        let regex_name = /^[a-zA-Z ]*$/;
        if (!_.isEmpty(event)) {
            if (!regex_name.test(event)) {
                this.setState({ first_name_error: "only Allow only character" });
            } else {
                this.setState({
                    first_name: event,
                });
                this.setState({ first_name_error: null });
            }
        } else {
            this.setState({ first_name_error: "name is required" });
        }
    };
    handleLastNameChange = (event) => {
        let regex_name = /^[a-zA-Z ]*$/;
        if (!_.isEmpty(event)) {
            if (!regex_name.test(event)) {
                this.setState({ last_name_error: "only Allow only character" });
            } else {
                this.setState({
                    last_name: event,
                });
                this.setState({ last_name_error: null });
            }
        } else {
            this.setState({ last_name_error: "last is required" });
        }
    };
    handleEmailChange = (event) => {
        let regex_email = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!_.isEmpty(event)) {
            if (!regex_email.test(event)) {
                this.setState({ email_error: "invalid email" });
            } else {
                this.setState({
                    email: event,
                });
                this.setState({ email_error: null });
            }
        } else {
            this.setState({ email_error: "email is required" });
        }
    };
    handlePhoneNumberChange = (event) => {
        if (!_.isEmpty(event)) {
            this.setState({
                phone_number: event,
            });
            this.setState({ mobile_error: null });
        } else {
            this.setState({ mobile_error: "phone no is required" });
        }
    };
    handleConfirmEmailChange = (event) => {
        let regex_email = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!_.isEmpty(event)) {
            if (!regex_email.test(event)) {
                this.setState({ confirm_email_error: "invalid email" });
            } else {
                if (this.state.email != event) {
                    this.setState({ confirm_email_error: "email not match" });
                } else {
                    this.setState({
                        confirm_email: event,
                        confirm_email_error: null,
                    });
                }
            }
        } else {
            this.setState({ confirm_email_error: "email is required" });
        }
    };
    handleCompanyChange = (event) => {
        if (!_.isEmpty(event)) {
            this.setState({
                company_name: event,
            });
            this.setState({ campany_error: null });
        } else {
            this.setState({ campany_error: "campany is required" });
        }
    };
    handlePassowrdChange = (event) => {
        if (!_.isEmpty(event)) {
            if (event.length > 5) {
                this.setState({ password: event, password_error: null });
            } else {
                this.setState({
                    password_error: "you have to enter at least 6 digit!",
                });
            }
        } else {
            this.setState({ password_error: "password is required" });
        }
    };
    handleSubmit = () => {
        if (
            this.state.first_name_error !== null ||
            this.state.last_name_error !== null ||
            this.state.campany_error !== null ||
            this.state.email_error !== null ||
            this.state.password_error !== null ||
            this.state.title_error !== null ||
            this.state.mobile_error !== null ||
            this.state.confirm_email_error !== null
        ) {
            Toast.show({
                type: "error",
                position: "top",
                text1: "Warning",
                text2: `Fill all the fields.`,
            });
        } else {
            // this.props.navigation.push('AddInfo')
            const that = this;
            // that.props.navigation.push('AddInfo')
            fetch(baseUrl + "api/job-seeker/registration", {
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
                body: JSON.stringify(this.state),
            })
                .then((response) => response.json())
                .then((response) => {
                    if (!response.success) {
                        // throw new Error(response);
                        Toast.show({
                            type: "error",
                            position: "top",
                            text1: "Warning",
                            text2: `${response.message}`,
                        });
                    } else {
                        Toast.show({
                            type: "success",
                            position: "top",
                            text1: "Success",
                            text2: `Your account has been created successfully.`,
                            visibilityTime: 1000,
                            onHide: () => {
                                if (!_.isEmpty(this.state.picture)) {
                                    that.props.navigation.push(
                                        "JobAdditionalInfo",
                                        {
                                            ...response.result,
                                            image: this.state.picture.data.url,
                                        }
                                    );
                                } else {
                                    that.props.navigation.push(
                                        "JobAdditionalInfo",
                                        response.result
                                    );
                                }
                            },
                        });
                    }
                })
                .catch((err) => {
                    Toast.show({
                        type: "error",
                        position: "top",
                        text1: "Warning",
                        text2: `Something went wrong.`,
                    });
                    this.setState({
                        success: false,
                        err: "Registration Failed. Please try again later",
                    });
                });
        }
    };

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.innerContainer}>
                    <ScrollView>
                        <View>
                            <Text style={styles.headingText}>
                                Basic Information
                            </Text>
                        </View>
                        <View style={styles.rowContainer}>
                            <Text style={styles.labelText}>Title/Prefix</Text>
                            <View style={styles.inputContainer}>
                                <View style={[styles.pickerStyle]}>
                                    <Picker
                                        style={{ color: "#ffffff" }}
                                        selectedValue={this.state.title}
                                        onValueChange={(itemValue, itemIndex) =>
                                            this.handleTitleChange(itemValue)
                                        }
                                    >
                                        <Picker.Item
                                            label="Select a title"
                                            value=""
                                        />
                                        <Picker.Item label="Mr." value="Mr." />
                                        <Picker.Item label="Ms." value="Ms." />
                                        <Picker.Item
                                            label="Mrs."
                                            value="Mrs."
                                        />
                                    </Picker>
                                </View>
                                {this.state.title_error ? (
                                    <Text style={styles.errorText}>
                                        {this.state.title_error}
                                    </Text>
                                ) : null}
                            </View>
                        </View>
                        <View style={styles.rowContainer}>
                            <Text style={styles.labelText}>First Name</Text>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.inputStyle}
                                    placeholder="John"
                                    name="first_name"
                                    value={this.state.first_name}
                                    onChangeText={this.handleFirstNameChange}
                                />
                                {this.state.first_name_error ? (
                                    <Text style={styles.errorText}>
                                        {this.state.first_name_error}
                                    </Text>
                                ) : null}
                            </View>
                        </View>
                        <View style={styles.rowContainer}>
                            <Text style={styles.labelText}>Last Name</Text>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.inputStyle}
                                    placeholder="Doe"
                                    value={this.state.last_name}
                                    onChangeText={this.handleLastNameChange}
                                />
                                {this.state.last_name_error ? (
                                    <Text style={styles.errorText}>
                                        {this.state.last_name_error}
                                    </Text>
                                ) : null}
                            </View>
                        </View>
                        <View style={styles.rowContainer}>
                            <Text style={styles.labelText}>Company Name</Text>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.inputStyle}
                                    placeholder="Company Name Ltd"
                                    onChangeText={this.handleCompanyChange}
                                />
                                {this.state.campany_error ? (
                                    <Text style={styles.errorText}>
                                        {this.state.campany_error}
                                    </Text>
                                ) : null}
                            </View>
                        </View>
                        <View style={styles.rowContainer}>
                            <Text style={styles.labelText}>Email</Text>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.inputStyle}
                                    placeholder="john@example.com"
                                    value={this.state.email}
                                    onChangeText={this.handleEmailChange}
                                />
                                {this.state.email_error ? (
                                    <Text style={styles.errorText}>
                                        {this.state.email_error}
                                    </Text>
                                ) : null}
                            </View>
                        </View>
                        <View style={styles.rowContainer}>
                            <Text style={styles.labelText}>Confirm Email</Text>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.inputStyle}
                                    name="confirm_email"
                                    placeholder="john@example.com"
                                    value={this.state.email}
                                    onChangeText={this.handleConfirmEmailChange}
                                />
                                {this.state.confirm_email_error ? (
                                    <Text style={styles.errorText}>
                                        {this.state.confirm_email_error}
                                    </Text>
                                ) : null}
                            </View>
                        </View>
                        <View style={styles.rowContainer}>
                            <Text style={styles.labelText}>Password</Text>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    name="password"
                                    type="text"
                                    secureTextEntry
                                    style={styles.inputStyle}
                                    placeholder="***********"
                                    onChangeText={this.handlePassowrdChange}
                                />
                                {this.state.password_error ? (
                                    <Text style={styles.errorText}>
                                        {this.state.password_error}
                                    </Text>
                                ) : null}
                            </View>
                        </View>
                        <View style={styles.rowContainer}>
                            <Text style={styles.labelText}>Phone Number</Text>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.inputStyle}
                                    placeholder="i.e. 999*******"
                                    keyboardType="numeric"
                                    maxLength={10}
                                    onChangeText={this.handlePhoneNumberChange}
                                />
                                {this.state.mobile_error ? (
                                    <Text style={styles.errorText}>
                                        {this.state.mobile_error}
                                    </Text>
                                ) : null}
                            </View>
                            {/* {
                    !this.state.success && <View><Text style={styles.error}>{this.state.err}</Text></View>
                  } */}
                        </View>

                        <View style={styles.rowContainer}>
                            <TouchableOpacity
                                style={styles.updateBtn}
                                onPress={this.handleSubmit}
                            >
                                <Text>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>

                <Toast ref={(ref) => Toast.setRef(ref)} />
            </View>
        );
    }
}
export default JobBasicInfo;
