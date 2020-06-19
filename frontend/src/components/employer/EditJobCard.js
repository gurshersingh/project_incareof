import React, {useState} from "react";
import {StyleSheet, Text, View, Image, TouchableOpacity} from "react-native";
import {AntDesign} from "@expo/vector-icons";

const EditJobCard = ({
  job,
  switchToScreen,
  setModalVisible,
  setEmployerRecord,
}) => {
  const {
    created_at,
    employer_id,
    end_date,
    id,
    job_description,
    job_seekers,
    job_service_id,
    job_title,
    selected_user,
    start_date,
    updated_at,
    wager_offered,
  } = job;

  return (
    <View style={styles.container}>
      <View style={styles.jobContainer}>
        <View style={styles.detailContainer}>
          <Text style={styles.titleText}>{job_title}</Text>
          <Text>
            {job_description ? job_description : job_post.job_description}
          </Text>
          <Text style={styles.subTitleText}>{start_date}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 120,
    borderWidth: 1,
    borderColor: "#dddddd",
    backgroundColor: "#ffffff",
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
    flexDirection: "column",
  },
  jobContainer: {
    flexDirection: "row",
  },
  detailContainer: {
    minHeight: 120,
    paddingVertical: 5,
    paddingHorizontal: 10,
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

export default EditJobCard;
