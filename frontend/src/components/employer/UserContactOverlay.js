import React from "react";
import {
    StyleSheet,
    Modal,
    TouchableHighlight,
    View,
    Linking,
} from "react-native";
import { Feather, FontAwesome } from "@expo/vector-icons";

const ContactOverlay = ({ mobile, email, modalVisible, setModalVisible }) => {
    function openSmsUrl(phone, body) {
        return `sms:${phone}${getSMSDivider()}body=${body}`;
    }
    function getSMSDivider() {
        return Platform.OS === "ios" ? "&" : "?";
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
        >
            <View
                style={styles.centeredView}
                onStartShouldSetResponder={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.modalView}>
                    <TouchableHighlight
                        style={styles.contBtn}
                        onPress={(event) => {
                            event.stopPropagation();
                            Linking.openURL(`tel:${mobile}`);
                        }}
                    >
                        <Feather
                            name="phone-call"
                            style={styles.contactIcons}
                        />
                    </TouchableHighlight>
                    <TouchableHighlight
                        style={styles.contBtn}
                        onPress={(event) => {
                            event.stopPropagation();
                            Linking.openURL(openSmsUrl(mobile, ''));
                        }}
                    >
                        <FontAwesome
                            name="envelope-o"
                            style={styles.contactIcons}
                        />
                    </TouchableHighlight>
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
        flexDirection: "row",
        elevation: 5,
    },
    contBtn: {
        backgroundColor: "#f8bbd0",
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
        color: "#ffffff",
    },
});

export default ContactOverlay;
