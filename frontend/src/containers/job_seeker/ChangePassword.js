import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from "react-native";
import BottomTabNavigator from "../../components/job_seeker/BottomTabNavigator";
import SearchFilterBar from "../../components/job_seeker/SearchFilterBar";
import SettingsOverlay from "../../components/job_seeker/SettingsOverlay";
import FilterOverlay from "../../components/job_seeker/FilterOverlay";
import _ from "lodash";
import AsyncStorage from "@react-native-community/async-storage";
import { baseUrl } from "../../utils/constants";

// We can use this to make the overlay fill the entire width
const { width, height } = Dimensions.get("window");

const ChangePassword = (props) => {
  const [filterVisiblity, setFilterVisibility] = useState(false);
  const [settingModalVisible, setSettingModalVisible] = useState(false);
  const [userData, setUserData] = useState({});
  const [jobSeekerData, setJobSeekerData] = useState({});
  const [passwordObj, setPasswordObj] = useState({
    old_password: null,
    new_password: null,
    confirm_password: null,
    old_password_error: {
      error: false,
      message: null,
    },
    new_password_error: {
      error: false,
      message: null,
    },
    confirm_password_error: {
      error: false,
      message: null,
    },
  });

  const {
    old_password,
    old_password_error,
    new_password,
    new_password_error,
    confirm_password,
    confirm_password_error,
  } = passwordObj;

  function switchToScreen(screen, params) {
    props.navigation.push(screen, params);
  }

  useEffect(() => {
    if (_.isEmpty(userData)) {
      try {
        AsyncStorage.getItem("userData").then((user) => {
          setUserData(JSON.parse(user));
        });
        AsyncStorage.getItem("jobSeekerData").then((user) => {
          setJobSeekerData(JSON.parse(user));
        });
      } catch (error) {
        // Error retrieving data
        console.log(error.message);
      }
    }

    return () => {
      console.log("clean up");
    };
  }, []);

  function handlePasswordChange(text, name) {
    const password = { ...passwordObj };
    password[name] = text;
    if (_.isEmpty(text)) {
      password[`${name}_error`] = {
        error: true,
        message: name.replace("_", " ") + " is required.",
      };
    } else {
      password[`${name}_error`] = {
        error: false,
        message: null,
      };
    }
    setPasswordObj(password);
  }

  function confirmPasswordChange(text, name) {
    const password = { ...passwordObj };
    password[name] = text;
    if (_.isEmpty(text)) {
      password[`${name}_error`] = {
        error: true,
        message: name.replace("_", " ") + " is required.",
      };
    } else {
      console.log(password.new_password, text);
      if (password.new_password !== text) {
        password[`${name}_error`] = {
          error: true,
          message: "Password not matched.",
        };
      } else {
        password[`${name}_error`] = {
          error: false,
          message: null,
        };
      }
    }
    setPasswordObj(password);
    console.log(password);
  }

  function changePassword() {
    if (
      old_password_error &&
      new_password &&
      !old_password_error.error &&
      !new_password_error.error &&
      !confirm_password_error.error
    ) {
      fetch(baseUrl + "api/login/change-password", {
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
          user_id: userData.id,
          old_password,
          new_password,
        }),
      })
        .then((response) => response.json())
        .then((response) => {
          if (!response.success) throw new Error(response);
          else {
            alert("Password changed successfully.");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      alert("Check fields.");
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.jobSeekerDashboard}>
        <View>
          <Text style={styles.headingText}>Change Password</Text>
        </View>
        <View style={styles.changePasswordContainer}>
          <TextInput
            name="old_password"
            secureTextEntry={true}
            style={styles.textInput}
            placeholder="Enter current password"
            onChangeText={(text) => handlePasswordChange(text, "old_password")}
          />
          {old_password_error.error ? (
            <Text style={styles.errorText}>{old_password_error.message}</Text>
          ) : null}
          <TextInput
            name="new_password"
            secureTextEntry={true}
            style={styles.textInput}
            placeholder="New password"
            onChangeText={(text) => handlePasswordChange(text, "new_password")}
          />
          {new_password_error.error ? (
            <Text style={styles.errorText}>{new_password_error.message}</Text>
          ) : null}
          <TextInput
            name="confirm_password"
            secureTextEntry={true}
            style={styles.textInput}
            placeholder="Confirm password"
            onChangeText={(text) =>
              confirmPasswordChange(text, "confirm_password")
            }
          />
          {confirm_password_error.error ? (
            <Text style={styles.errorText}>
              {confirm_password_error.message}
            </Text>
          ) : null}
          <TouchableOpacity
            style={styles.contactBtn}
            onPress={() => {
              changePassword();
            }}
          >
            <Text style={styles.contactBtnText}>Change Password</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.bottomNavigation}>
        <BottomTabNavigator
          userData={userData}
          setSettingModalVisible={setSettingModalVisible}
          switchToScreen={switchToScreen}
        />
      </View>
      <SettingsOverlay
        switchToScreen={switchToScreen}
        settingModalVisible={settingModalVisible}
        setSettingModalVisible={setSettingModalVisible}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    position: "absolute",
    left: 0,
    top: 0,
    backgroundColor: "#dddddd",
    height: 300,
    width,
    elevation: 6,
  },
  container: {
    flexDirection: "column",
    flex: 1,
    width: null,
    height: null,
  },
  jobSeekerDashboard: {
    flex: 9.2,
  },
  headingText: {
    fontWeight: "800",
    fontSize: 30,
    alignSelf: "center",
    marginVertical: 15,
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
  changePasswordContainer: {
    marginHorizontal: 20,
  },
  textInput: {
    marginVertical: 10,
    backgroundColor: "#ffffff",
    paddingHorizontal: 10,
    paddingVertical: 10,
    shadowColor: "#dddddd",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  errorText: {
    textTransform: "capitalize",
    color: "red",
  },
  contactBtn: {
    width: "40%",
    height: 50,
    backgroundColor: "#fb5b5a",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    borderColor: "#dddddd",
    borderWidth: 1,
    shadowColor: "#9E9E9E",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.8,
    shadowRadius: 4.65,
  },
  contactBtnText: {
    color: "white",
  },
  loginText: {
    color: "black",
    fontSize: 30,
    marginTop: 20,
    marginLeft: 100,
  },
  nextBtnText: {
    color: "black",
    fontSize: 20,
  },
  loginBtn: {
    width: "20%",
    backgroundColor: "#fb5b5a",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 550,
    marginBottom: 100,
    marginLeft: 300,
  },
});

export default ChangePassword;
