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
import BottomTabNavigator from "./job_seeker/BottomTabNavigator";
import SearchFilterBar from "./job_seeker/SearchFilterBar";
import JobListing from "./job_seeker/JobListing";
import ContactOverlay from "./job_seeker/ContactOverlay";
import SettingsOverlay from "./job_seeker/SettingsOverlay";
import FilterOverlay from "./job_seeker/FilterOverlay";
import AsyncStorage from "@react-native-community/async-storage";
import _ from "lodash";
import { baseUrl } from "../utils/constants";

// We can use this to make the overlay fill the entire width
const { width, height } = Dimensions.get("window");

const StarredJobs = (props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [filterVisiblity, setFilterVisibility] = useState(false);
  const [settingModalVisible, setSettingModalVisible] = useState(false);
  const [jobPost, setJobPost] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [userData, setUserData] = useState({});
  const [jobSeekerData, setJobSeekerData] = useState({});
  const [employerRecord, setEmployerRecord] = useState({});

  useEffect(() => {
    if (_.isEmpty(jobSeekerData)) {
      try {
        AsyncStorage.getItem("jobSeekerLoginData").then((data) => {
          const { user, login } = JSON.parse(data);
          setJobSeekerData(user);
        });
      } catch (error) {
        // Error retrieving data
        console.log(error.message);
      }
    }

    return () => { };
  }, []);

  useEffect(() => {
    if (jobSeekerData.id) {
      console.log(
        baseUrl + `api/job-seeker/starred-job/list/${jobSeekerData.id}`
      );
      fetch(baseUrl + `api/job-seeker/starred-job/list/${jobSeekerData.id}`, {
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
            setJobPost(response.result);
            setJobs(response.result);
          } else throw new Error(response);
        })
        .catch((err) => {
          console.log({ err: "Login Failed", success: false });
        });
    }
  }, [jobSeekerData]);

  function switchToScreen(screen, params) {
    props.navigation.push(screen, params);
  }

  function markStarredJob(user_id, job_post_id) {
    console.log({ user_id, job_post_id });
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
    const jobs = jobsData.filter((job) => parseInt(job.wager_offered) >= wager);
    setJobs(jobs);
  }

  return (
    <View style={styles.container}>
      {/* {filterVisiblity ? <View style={styles.overlay}></View> : null} */}
      <View style={styles.jobSeekerDashboard}>
        <SearchFilterBar
          handleFilterByText={handleFilterByText}
          filterVisiblity={filterVisiblity}
          setFilterVisibility={setFilterVisibility}
        />
        <SafeAreaView style={{ flex: 1 }}>
          <JobListing
            jobPost={jobPost}
            userData={userData}
            jobSeekerData={jobSeekerData}
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

export default StarredJobs;
