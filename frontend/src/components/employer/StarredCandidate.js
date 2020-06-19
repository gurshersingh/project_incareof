import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, SafeAreaView, FlatList } from "react-native";
import EmployerSearchFilter from "./EmployerSearchFilter";
import EmployerBottomNavigator from "./EmployerBottomNavigator";
import EmployerFilterOverlay from "./EmployerFilterOverlay";
import UserContactOverlay from "./UserContactOverlay";
import EmployerSettingsOverlay from "./EmployerSettingsOverlay";
import AsyncStorage from "@react-native-community/async-storage";
import { baseUrl } from "../../utils/constants";
import UserCard from "./UserCard";

const StarredCandidate = (props) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [filterVisiblity, setFilterVisibility] = useState(false);
    const [settingModalVisible, setSettingModalVisible] = useState(false);
    const [loginData, setLoginData] = useState({});
    const [employerData, setEmployerData] = useState({});
    const [jobsData, setJobsData] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [starredCandidate, setStarredCandidate] = useState({});
    const [userRecord, setUserRecord] = useState({});

    function switchToScreen(screen, params) {
        props.navigation.push(screen, params);
    }

    useEffect(() => {
        console.log("component did mount in starred candidate.");
        try {
            AsyncStorage.getItem("employerLoginData").then((data) => {
                const { login, user } = JSON.parse(data);
                setLoginData(login);
                setEmployerData(user);
            });
        } catch (error) {
            // Error retrieving data
            console.log(error.message);
        }

        return () => { };
    }, []);

    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        if (employerData.id) {
            fetch(baseUrl + `api/employer/starred/list/${employerData.id}`, {
                signal: signal,
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
                        console.log(response.result);
                        setStarredCandidate(response.result);
                    } else {
                        throw new Error(response);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }

        return () => {
            abortController.abort();
        };
    }, [employerData]);

    function handleSelectedService(serviceMap) {
        const selectedService = [];
        for (var key of serviceMap.keys()) {
            if (serviceMap.get(key)) selectedService.push(key);
        }
        if (selectedService.length > 0) {
            const jobs = jobsData.filter((job) =>
                selectedService.includes(job.job_service_id)
            );
            setJobs(jobs);
        } else {
            setJobs(jobsData);
        }
    }

    function handleFilterByText(text) {
        if (text.length >= 3) {
            const jobs = jobsData.filter((job) => job.job_title.includes(text));
            setJobs(jobs);
        } else {
            setJobs(jobsData);
        }
    }

    function handleFilterByWager(wager) {
        const jobs = jobsData.filter(
            (job) => parseInt(job.wager_offered) >= wager
        );
        setJobs(jobs);
    }

    const { phone_number } = userRecord;

    return (
        <View style={styles.container}>
            <View style={styles.innerContainer}>
                {/*<EmployerSearchFilter
          handleFilterByText={handleFilterByText}
          filterVisiblity={filterVisiblity}
          setFilterVisibility={setFilterVisibility}
        />*/}
                <SafeAreaView style={{ flex: 1 }}>
                    {starredCandidate.length > 0 ? (
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            data={starredCandidate}
                            keyExtractor={(candidate) =>
                                candidate.job_seeker.id.toString()
                            }
                            renderItem={({ item }) => {
                                return (
                                    <UserCard
                                        isStar={true}
                                        applicant={item.job_seeker}
                                        setModalVisible={setModalVisible}
                                        switchToScreen={switchToScreen}
                                        setUserRecord={setUserRecord}
                                    />
                                );
                            }}
                        />
                    ) : (
                            <View style={styles.container}>
                                <Text style={{ textAlign: "center" }}>
                                    Job Post not found.
                            </Text>
                            </View>
                        )}
                </SafeAreaView>
            </View>
            <View style={styles.bottomNavigation}>
                <EmployerBottomNavigator
                    employerLoginData={employerData}
                    setSettingModalVisible={setSettingModalVisible}
                    switchToScreen={switchToScreen}
                />
            </View>
            <EmployerFilterOverlay
                jobs={jobs}
                handleFilterByText={handleFilterByText}
                handleFilterByWager={handleFilterByWager}
                handleSelectedService={handleSelectedService}
                filterVisiblity={filterVisiblity}
                setFilterVisibility={setFilterVisibility}
            />
            <UserContactOverlay
                mobile={phone_number}
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
            />
            <EmployerSettingsOverlay
                switchToScreen={switchToScreen}
                settingModalVisible={settingModalVisible}
                setSettingModalVisible={setSettingModalVisible}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        flex: 1,
        width: null,
        height: null,
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

export default StarredCandidate;
