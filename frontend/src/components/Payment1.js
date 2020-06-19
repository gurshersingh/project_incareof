import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    TextInput,
    Text,
    View,
    TouchableOpacity,
    Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const Payment1 = (props) => {
    const master_card = require("../../assets/image/mastercard.png");
    const visa_card = require("../../assets/image/visa.png");
    const [plan, setPlan] = useState(null);

    useEffect(() => {
        setPlan(props.navigation.state.params);
    }, []);

    console.log("plan is ===============++> ", plan);

    return (
        <LinearGradient
            colors={["#BA9ED1", "#765A8D"]}
            style={styles.container}
            //  Linear Gradient
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
        >
            <TextInput
                placeholder="Enter you name"
                style={[styles.textInput, styles.singleInputWidth]}
            />
            <View style={styles.rowContainer}>
                <TextInput
                    placeholder="- - - -"
                    keyboardType="numeric"
                    maxLength={4}
                    style={[styles.textInput, styles.cardNumInput]}
                />
                <TextInput
                    placeholder="- - - -"
                    keyboardType="numeric"
                    maxLength={4}
                    style={[styles.textInput, styles.cardNumInput]}
                />
                <TextInput
                    placeholder="- - - -"
                    keyboardType="numeric"
                    maxLength={4}
                    style={[styles.textInput, styles.cardNumInput]}
                />
            </View>
            <View style={styles.rowContainer}>
                <TextInput
                    placeholder="- - - -"
                    keyboardType="numeric"
                    maxLength={4}
                    style={[styles.textInput, styles.text3Input]}
                />
                <TextInput
                    placeholder="- - - -"
                    keyboardType="numeric"
                    maxLength={4}
                    style={[styles.textInput, styles.text3Input]}
                />
            </View>
            <View style={styles.rowContainer}>
                <Image
                    source={master_card}
                    style={[styles.cardImage, styles.cardNumInput]}
                />
                <Image
                    source={visa_card}
                    style={[styles.cardImage, styles.cardNumInput]}
                />
                <TextInput
                    placeholder="- - - -"
                    keyboardType="numeric"
                    maxLength={4}
                    style={[styles.textInput, styles.cardNumInput]}
                />
            </View>
            <TextInput
                placeholder="Enter you name"
                style={[styles.textInput, styles.singleInputWidth]}
            />
            <TextInput
                placeholder="Enter you name"
                style={[styles.textInput, styles.singleInputWidth]}
            />
            <TextInput
                placeholder="Enter you name"
                style={[styles.textInput, styles.singleInputWidth]}
            />
            <TouchableOpacity
                style={styles.submitBtn}
                onPress={() =>
                    props.navigation.push("ConfirmationPage", plan)
                }
            >
                <Text style={styles.btnText}>Submit</Text>
            </TouchableOpacity>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    textInput: {
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
    singleInputWidth: {
        width: "81%",
    },
    rowContainer: {
        flexDirection: "row",
    },
    cardNumInput: {
        width: "25%",
        marginHorizontal: 5,
    },
    text3Input: {
        width: "39%",
        marginHorizontal: 5,
    },
    cardImage: {
        height: 40,
    },
    submitBtn: {
        backgroundColor: "#99D5CA",
        borderColor: "#99D5CA",
        borderWidth: 1,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 10,
        height: 40,
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
        color: "#ffffff",
    },
});

export default Payment1;
