import React from "react";
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ScrollView,
    FlatList,
} from "react-native";
import _ from "lodash";

import CheckBox from "@react-native-community/checkbox";
import { LinearGradient } from "expo-linear-gradient";
import { baseUrl } from "../../utils/constants";
import { Picker } from "@react-native-community/picker";
import Toast from "react-native-toast-message";
const world_cities = require("../../../assets/jsonContent/world_cities.json");

export default class JobAdditionalInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            city: "",
            city_error: "",
            services: [],
            serviceList: [],
            isLoading: false,
            error: "",
            success: true,
            checkedItems: new Map(),
        };
    }

    componentWillMount() {
        console.log(
            "in job seeker additional info ==========> ",
            this.props.navigation.state.params
        );
        this.setState({
            cities: world_cities
                .filter((city) => city.country === "Canada")
                .sort((a, b) => (a.city > b.city ? 1 : -1)),
            registeredUser: this.props.navigation.state.params,
        });

        fetch(baseUrl + "api/service/list")
            .then((response) => response.json())
            .then((response) => {
                this.setState({ isLoading: false });
                if (!response.success) throw new Error(response);
                else {
                    response.result.map((key, index) => {
                        this.setState({
                            checkedItems: this.state.checkedItems.set(
                                key.id,
                                false
                            ),
                        });
                    });
                    this.setState({
                        serviceList: response.result,
                        success: true,
                    });
                }
            })
            .catch((err) => {
                this.setState({
                    isLoading: false,
                    success: true,
                    error: err,
                });
            });
    }
    handleCity = (event) => {
        let regex_name = /^[a-zA-Z ]*$/;
        if (!_.isEmpty(event)) {
            this.setState({ city: event, city_error: null });
        } else {
            this.setState({ city_error: "City is required" });
        }
    };
    handleSubmit = () => {
        if (this.state.city_error !== null) {
            Toast.show({
                type: "error",
                position: "top",
                text1: "Warning",
                text2: `Fill required fields.`,
            });
        } else {
            // this.props.navigation.push('UploadPic')
            this.setState({ isLoading: true });
            fetch(baseUrl + "api/job-seeker/add-ctiy-services", {
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
                body: JSON.stringify({
                    services: this.state.services,
                    city: this.state.city,
                    id: this.props.navigation.getParam("id"),
                }),
            })
                .then((response) => response.json())
                .then((response) => {
                    console.log(response);
                    if (!response.success) throw new Error(response);
                    else {
                        this.props.navigation.push("JobUploadImage", {
                            user_id: this.props.navigation.getParam("user_id"),
                            registeredUser: this.state.registeredUser,
                        });
                    }
                })
                .catch((err) => {
                    this.setState({ success: false, err: err, isLoading: false });
                });
        }
    };
    handlePress = (val) => {
        const arr = this.state.services;
        const isChecked = this.state.checkedItems.get(val.id);
        console.log(isChecked);
        !isChecked ? arr.push(val.id) : arr.pop(val.id);
        this.setState(
            {
                services: arr,
                checkedItems: this.state.checkedItems.set(val.id, !isChecked),
            },
            () => {
                console.log(this.state.services);
            }
        );
    };
    render() {
        return (
            <View style={styles.container}>
                <ScrollView>
                    <View style={styles.labelHeading}>
                        <Text style={styles.headingText}>
                            Additional Information
                        </Text>
                    </View>
                    <View style={styles.label}>
                        <Text style={styles.labelText}>Select Services</Text>
                    </View>
                    <View style={styles.labelHeading}>
                        <View style={styles.MainContainer}>
                            <FlatList
                                data={this.state.serviceList}
                                showsVerticalScrollIndicator={false}
                                renderItem={({ item }) => (
                                    <View
                                        style={{
                                            flex: 1,
                                            flexDirection: "column",
                                            margin: 1,
                                        }}
                                    >
                                        <View style={styles.imageThumbnail}>
                                            <CheckBox
                                                value={this.state.checkedItems.get(
                                                    item.id
                                                )}
                                                onValueChange={() =>
                                                    this.handlePress(item)
                                                }
                                            />
                                            <Text>{item.service_name}</Text>
                                        </View>
                                    </View>
                                )}
                                //Setting the number of column
                                numColumns={2}
                                keyExtractor={(item, index) => index}
                            />
                        </View>
                    </View>
                    <View>
                        <View style={styles.rowContainer}>
                            <Text style={styles.labelText}>City</Text>
                            <View style={styles.inputContainer}>
                                <View style={[styles.pickerStyle]}>
                                    <Picker
                                        selectedValue={this.state.city}
                                        onValueChange={(itemValue, itemIndex) =>
                                            this.handleCity(itemValue, "city")
                                        }
                                    >
                                        {this.state.cities.map((city) => {
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
                                {this.state.city_error ? (
                                    <Text style={styles.errorText}>
                                        {this.state.city_error}
                                    </Text>
                                ) : null}
                            </View>
                        </View>
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
                <Toast ref={(ref) => Toast.setRef(ref)} />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    nextBtnText: {
        color: "black",
        fontSize: 20,
    },
    inputContainer: {
        flex: 2,
    },
    headingText: {
        fontWeight: "800",
        fontSize: 30,
        alignSelf: "center",
        marginTop: 30,
        marginBottom: 20,
    },
    rowContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 20,
        marginVertical: 10,
    },
    pickerStyle: {
        flex: 2,
        height: 50,
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
        backgroundColor: "#fff",
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
    errorText: {
        textTransform: "capitalize",
        color: "red",
        marginLeft: 5,
    },
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    label: {
        margin: 8,
    },
    labelHeading: {
        marginTop: 25,
    },
    checkboxContainer: {
        flexDirection: "row",
        marginBottom: 15,
        alignContent: "center",
        justifyContent: "center",
    },
    inputText: {
        height: 30,
        color: "black",
        marginTop: -17,
        marginLeft: -50,
    },
    checkbox: {
        alignSelf: "center",
    },
    loginText: {
        color: "black",
        fontSize: 30,
        marginTop: 20,
        alignContent: "center",
        justifyContent: "center",
        marginHorizontal: 30,
        // marginLeft: 50,
    },
    firstnameText: {
        flexDirection: "row",
        width: "45%",
        backgroundColor: "#64358D",
        borderRadius: 25,
        height: 30,
        marginTop: -40,
        marginLeft: 160,
        marginBottom: 10,

        justifyContent: "center",
        padding: 20,
    },

    loginBtn: {
        width: "20%",
        backgroundColor: "#fb5b5a",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 150,
        marginLeft: 285,
    },
    loginBtn1: {
        width: "20%",
        backgroundColor: "#fb5b5a",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 150,
        //marginBottom: 100,
        marginLeft: 85,
    },
    imageThumbnail: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
    },
    labelText: {
        flex: 1,
        fontWeight: "700",
        fontSize: 16,
    },
    MainContainer: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        flex: 1,
    },
});
