import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    Text,
    View,
    Modal,
    TouchableHighlight,
    Dimensions,
    SafeAreaView,
} from "react-native";
import BottomTabNavigator from "./BottomTabNavigator";
import SearchFilterBar from "./SearchFilterBar";
import JobListing from "./JobListing";
import ContactOverlay from "./ContactOverlay";
import SettingsOverlay from "./SettingsOverlay";
import FilterOverlay from "./FilterOverlay";
import { baseUrl } from "../../utils/constants";
import AsyncStorage from "@react-native-community/async-storage";

// We can use this to make the overlay fill the entire width
const { width, height } = Dimensions.get("window");

const JobSeekerScreen = (props) => {
    const [routeName, setRouteName] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [filterVisiblity, setFilterVisibility] = useState(false);
    const [settingModalVisible, setSettingModalVisible] = useState(false);
    const [jobPosts, setJobPosts] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [userData, setUserData] = useState({});
    const [employerRecord, setEmployerRecord] = useState({});

    function switchToScreen(screen, params) {
        props.navigation.push(screen, params);
    }

    useEffect(() => {
        setRouteName(props.navigation.state.routeName);
        const { login, user } = props.navigation.state.params;
        setUserData(login);
        fetch(baseUrl + "api/job-post/list", {
            method: "GET",
            mode: "cors", // no-cors, *cors, same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, *same-origin, omit
            headers: {
                "Content-Type": "application/json",
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: "follow", // manual, *follow, error
            referrerPolicy: "no-referrer",
        })
            .then((response) => response.json())
            .then((response) => {
                if (response.success) {
                    // this.props.navigation.push('Login', {user_type:response.result.user_type})
                    //   console.log("jobs ========> ", response.result);
                    setJobPosts(response.result);
                    setJobs(response.result);
                } else throw new Error(response);
            })
            .catch((err) => {
                console.log({ err: "No job post found", success: false });
            });
    }, []);

    function markStarredJob(user_id, job_post_id) {
        fetch(baseUrl + "api/job-seeker/star-job/add", {
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
            body: JSON.stringify({ user_id, job_post_id }),
        })
            .then((response) => response.json())
            .then((response) => {
                if (!response.success) throw new Error(response);
                else {
                    alert("Job starred successfully.");
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function handleSelectedService(serviceMap) {
        const selectedService = [];
        for (var key of serviceMap.keys()) {
            if (serviceMap.get(key)) selectedService.push(key);
        }
        if (selectedService.length > 0) {
            const jobs = jobPosts.filter((job) =>
                selectedService.includes(job.job_service_id)
            );
            setJobs(jobs);
        } else {
            setJobs(jobPosts);
        }
    }

    function handleFilterByText(text) {
        if (text.length >= 3) {
            const jobs = jobPosts.filter((job) => job.job_title.includes(text));
            setJobs(jobs);
        } else {
            setJobs(jobPosts);
        }
    }

    function handleFilterByWager(wager) {
        const jobs = jobPosts.filter(
            (job) => parseInt(job.wager_offered) >= wager
        );
        setJobs(jobs);
    }

    return (
        <View style={styles.container}>
            <View style={styles.jobSeekerDashboard}>
                <SearchFilterBar
                    handleFilterByText={handleFilterByText}
                    filterVisiblity={filterVisiblity}
                    setFilterVisibility={setFilterVisibility}
                />
                <SafeAreaView style={{ flex: 1 }}>
                    <JobListing
                        jobPost={jobs}
                        userData={userData}
                        markStarredJob={markStarredJob}
                        switchToScreen={switchToScreen}
                        modalVisible={modalVisible}
                        setModalVisible={setModalVisible}
                        setEmployerRecord={setEmployerRecord}
                    />
                </SafeAreaView>
            </View>
            <View style={styles.bottomNavigation}>
                <BottomTabNavigator
                    userData={userData}
                    routeName={routeName}
                    setSettingModalVisible={setSettingModalVisible}
                    switchToScreen={switchToScreen}
                />
            </View>
            <FilterOverlay
                jobs={jobs}
                handleFilterByText={handleFilterByText}
                handleFilterByWager={handleFilterByWager}
                handleSelectedService={handleSelectedService}
                filterVisiblity={filterVisiblity}
                setFilterVisibility={setFilterVisibility}
            />
            <ContactOverlay
                mobile={employerRecord.phone_number}
                email={employerRecord.email}
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
            />
            <SettingsOverlay
                switchToScreen={switchToScreen}
                settingModalVisible={settingModalVisible}
                setSettingModalVisible={setSettingModalVisible}
            />
        </View>
    );
};

JobSeekerScreen["navigationOptions"] = (screenProps) => ({
    title: "Jobs",
});

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

export default JobSeekerScreen;
