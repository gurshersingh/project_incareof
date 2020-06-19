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
class ForgatPassword extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      email_error: ''
    }
  }
  handleEmailChange = (event) => {
    let regex_email = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!_.isEmpty(event)) {
      if (!regex_email.test(event)) {
        this.setState({ email_error: "invalid email" })
      } else {
        this.setState({
          email: event
        })
        this.setState({ email_error: null })
      }
    }
    else {
      this.setState({ email_error: "email is required" })
    }
  }
  handleForgot = () => {
    if (this.state.email_error !== null
    ) {
      alert("Fill the Field.");
    }
    else {
      const that = this
      fetch(baseUrl + 'api/login/forget-password', {
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
          console.log("respoce", response)
          if (!response.success)
            throw new Error(response)
          else {
            console.log("Successsss", response)
            that.props.navigation.push('NewPassword', { user_id: response.result.id })
          }
        })
        .catch((err) => {
          console.log("Errrororro", err)
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
        <ScrollView>
          <Text style={styles.loginText}>Forgot Password</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputStyle}
              name="email"
              placeholder="Enter Registred Mail ID"
              placeholderTextColor="black"
              onChangeText={this.handleEmailChange}
            />
            {this.state.email_error ? (
              <Text style={styles.errorText}>{this.state.email_error}</Text>
            ) : null}
          </View>
          <View style={styles.rowContainer}>
            <TouchableOpacity style={styles.updateBtn} onPress={this.handleForgot}>
              <Text>Submit</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
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
  },
  inputContainer: {
    flex: 2,
    marginHorizontal: 30,
    marginVertical: 30

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
export default ForgatPassword;
