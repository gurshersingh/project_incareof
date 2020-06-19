import React, {useState, useEffect} from "react";
import {StyleSheet, Text, View, Modal} from "react-native";
import {WebView} from "react-native-webview";

export default function Browser(props) {
    const [url, setUrl] = useState("");
    const [showModal, setShowModal] = useState(false);

    console.log("************************ Browser ************************");

    useEffect(() => {
        console.log("In Browser ================> ", props.navigation);
        setUrl(props.navigation.state.params.url);
    }, []);

    function handleResponse(data) {
        if (data.title === "success") {
            this.setState({showModal: false, status: "Complete"});
        } else if (data.title === "cancel") {
            this.setState({showModal: false, status: "Cancelled"});
        } else {
            return;
        }
    }

    return (
        <View style={{flex: 1}}>
            <Modal
                visible={this.state.showModal}
                onRequestClose={() => setShowModal(false)}
            >
                <WebView
                    source={{uri: url}}
                    style={{flex: 1}}
                    onNavigationStateChange={(data) => handleResponse(data)}
                    injectedJavaScript={`document.f1.submit()`}
                />
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({});
