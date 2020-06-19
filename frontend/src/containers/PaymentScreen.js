import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Modal } from "react-native";
import { WebView } from "react-native-webview";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { baseUrl } from "../utils/constants";
import Toast from "react-native-toast-message";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            showSpinner: false,
            status: "Pending",
            url: null,
        };
    }

    componentDidMount() {
        this.setState({ memberShip: this.props.navigation.state.params });
    }

    handleResponse = (data) => {
        if (data.title.includes("success")) {
            this.setState({ showModal: false, status: "Complete" });
            this.props.navigation.push(
                "ConfirmationPage",
                this.state.memberShip
            );
            // this.props.navigation.push("SuccessScreen");
        } else if (data.title === "cancel") {
            this.setState({ showModal: false, status: "Cancelled" });
            Toast.show({
                type: "error",
                position: "top",
                text1: "Warning",
                text2:
                    "Something went wrong. Payment is not processed. Please, try again later.",
            });
        } else {
            return;
        }
    };

    initiatePaypal = () => {
        this.setState({ showSpinner: true });
        const { memberShip } = this.state;
        const transactionData = {
            employer_id: memberShip.employer_id,
            membership_id: memberShip.id,
            membership_type: memberShip.membership_type,
            price: memberShip.price,
        };

        const api_url = baseUrl + `api/paypal`;
        fetch(api_url, {
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
            body: JSON.stringify(transactionData),
        })
            .then((response) => response.json())
            .then((response) => {
                console.log("payment response ===========> ", response);
                if (response.success) {
                    // props.navigation.push("Browser", {
                    //     url: response.url,
                    // });
                    this.setState({
                        url: response.url,
                        showModal: true,
                        showSpinner: false,
                    });
                } else {
                    throw new Error(response);
                }
            })
            .catch((err) => {
                this.setState({ showSpinner: false });
                console.log(err);
            });
    };

    render() {
        return (
            <View style={styles.container}>
                <Modal
                    visible={this.state.showModal}
                    onRequestClose={() => this.setState({ showModal: false })}
                >
                    <WebView
                        source={{ uri: this.state.url }}
                        onNavigationStateChange={(data) =>
                            this.handleResponse(data)
                        }
                        injectedJavaScript={`document.f1.submit()`}
                    />
                </Modal>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.showSpinner}
                    onRequestClose={() => this.setState({ showSpinner: false })}
                >
                    <View
                        style={styles.centeredView}
                        onStartShouldSetResponder={() => {
                            setFilterVisibility(!filterVisiblity);
                        }}
                    >
                        <FontAwesome5 name="spinner" size={24} color="black" />
                    </View>
                </Modal>
                <TouchableOpacity
                    style={styles.paymentBtn}
                    onPress={() => this.initiatePaypal()}
                >
                    <FontAwesome name="paypal" color="#ffffff" />
                    <Text style={{ color: "#ffffff", marginLeft: 10 }}>
                        Pay with PayPal
                    </Text>
                </TouchableOpacity>
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
    paymentBtn: {
        width: "70%",
        backgroundColor: "#4267b2",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
        marginBottom: 10,
        flexDirection: "row",
    },
    centeredView: {
        flex: 1,
        backgroundColor: "#388e3c",
        opacity: 0.8,
        justifyContent: "center",
        alignItems: "center",
    },
});
