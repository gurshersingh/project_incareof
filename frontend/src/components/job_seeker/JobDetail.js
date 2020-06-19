import React, {useState, useEffect} from "react";
import {StyleSheet, Text, View, Image, TouchableOpacity} from "react-native";
import {AntDesign} from "@expo/vector-icons";
import AsyncStorage from "@react-native-community/async-storage";
import _ from "lodash";

const JobDetail = ({
  job,
  userData,
  markStarredJob,
  switchToScreen,
  setModalVisible,
  setEmployerRecord,
}) => {
  const [isDescriptionVisible, setDescriptionVisible] = useState(false);
  const [jobSeekerData, setJobSeekerData] = useState({});

  const {
    id,
    employer_id,
    employer,
    job_title,
    job_description,
    job_service_id,
    service,
    start_date,
    end_date,
    wager_offered,
    created_at,
    updated_at,
    job_post,
  } = job;

  useEffect(() => {
    try {
      AsyncStorage.getItem("jobSeekerLoginData").then((data) => {
        const {user, login} = JSON.parse(data);
        setJobSeekerData(user);
      });
    } catch (error) {
      // Error retrieving data
      console.log(error.message);
    }
  }, []);

  return (
    <View style={styles.container}>
      <View
        style={styles.jobContainer}
        onStartShouldSetResponder={(event) => {
          setDescriptionVisible(!isDescriptionVisible);
        }}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri:
                "https://i.ya-webdesign.com/images/blank-profile-picture-png-8.png",
            }}
            style={styles.profileImage}
          />
        </View>
        <View style={styles.detailContainer}>
          <Text style={styles.titleText}>
            {job_title ? job_title : job_post.job_title}
          </Text>
          <Text style={styles.subTitleText}>
            {employer ? employer.company_name : job_post.employer.company_name}
          </Text>
          <Text>
            {job_description ? job_description : job_post.job_description}
          </Text>
        </View>
      </View>
      {isDescriptionVisible ? (
        <View style={styles.toggleableView}>
          <TouchableOpacity
            style={styles.detailBtn}
            onPress={() =>
              switchToScreen("EmployerProfile", {
                employer,
                userData,
              })
            }
          >
            <Text style={styles.detailBtnText}>View Details</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.contactBtn}
            onPress={() => {
              setEmployerRecord(employer ? employer : job_post.employer);
              setModalVisible(true);
            }}
          >
            <Text style={styles.contactBtnText}>Contact</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.starBtn}
            onPress={() => markStarredJob(jobSeekerData.id, id)}
          >
            <AntDesign name="staro" style={styles.starBtnIcon} />
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 150,
    borderWidth: 1,
    borderColor: "#dddddd",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    marginLeft: 70,
    margin: 15,
    shadowColor: "#dddddd",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    flexDirection: "column",
  },
  jobContainer: {
    flexDirection: "row",
  },
  imageContainer: {
    height: 120,
    width: 120,
    borderColor: "#dddddd",
    backgroundColor: "#ffffff",
    borderRadius: 100,
    marginLeft: -60,
    marginRight: 10,
    marginVertical: 15,
    shadowColor: "#dddddd",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 10,
  },
  detailContainer: {
    minHeight: 150,
    paddingVertical: 5,
    width: 0,
    flexGrow: 1,
    flex: 1,
  },
  toggleableView: {
    minHeight: 46,
    padding: 5,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  profileImage: {
    height: 120,
    width: 120,
  },
  titleText: {
    fontSize: 15,
    fontWeight: "800",
    textDecorationLine: "underline",
  },
  subTitleText: {
    fontWeight: "600",
    fontSize: 13,
  },
  detailBtn: {
    width: "40%",
    height: 36,
    backgroundColor: "#8fbc8f",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
  },
  detailBtnText: {
    color: "white",
  },
  contactBtn: {
    width: "40%",
    height: 36,
    backgroundColor: "#fb5b5a",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
  },
  contactBtnText: {
    color: "white",
  },
  starBtn: {
    width: 36,
    backgroundColor: "#ffee58",
    borderRadius: 25,
    alignSelf: "flex-end",
  },
  starBtnIcon: {
    fontSize: 30,
    padding: 3,
    color: "#9E9E9E",
  },
});

export default JobDetail;
