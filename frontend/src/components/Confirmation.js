import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const Confirmation = (props) => {
    const [plan, setPlan] = useState(null);

    useEffect(() => {
        setPlan(props.navigation.state.params);
    }, []);

    return (
        <View style={styles.container}>
            {plan && (
                <View style={styles.receiptContianer}>
                    <Text style={styles.headingText}>
                        {plan.membership_type}
                    </Text>
                    <Text style={styles.labelText}>Job Post Credit</Text>
                    <Text>{plan.job_post_credit}</Text>
                    <Text style={styles.labelText}>
                        Candidate Profile Views
                    </Text>
                    <Text>{plan.candidates_info}</Text>
                    <Text style={styles.labelText}>Plan's Price</Text>
                    <Text>{plan.price}</Text>
                </View>
            )}
            <TouchableOpacity
                style={styles.submitBtn}
                onPress={() => props.navigation.push("JobPost", {})}
            >
                <Text style={styles.btnText}>Next</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    receiptContianer: {
        backgroundColor: "#ffffff",
        justifyContent: "space-around",
        alignItems: "center",
        width: "70%",
        borderColor: "#ffffff",
        borderWidth: 1,
        borderRadius: 10,
        margin: 15,
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
        backgroundColor: "#99D5CA",
        borderColor: "#99D5CA",
        borderWidth: 1,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 100,
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
    headingText: {
        fontWeight: "800",
        fontSize: 20,
        textDecorationLine: "underline",
        paddingVertical: 5,
        marginVertical: 5,
    },
    labelText: {
        fontWeight: "700",
        marginVertical: 5,
    },
});

export default Confirmation;
