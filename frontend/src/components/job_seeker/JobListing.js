import React from "react";
import {StyleSheet, View, FlatList, Text} from "react-native";
import JobDetail from "./JobDetail";

const JobListing = ({
  jobPost,
  userData,
  markStarredJob,
  switchToScreen,
  setModalVisible,
  setEmployerRecord,
}) => {
  return (
    <View>
      {jobPost.length > 0 ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={jobPost}
          keyExtractor={(job) => job.id.toString()}
          renderItem={({item}) => {
            return (
              <JobDetail
                job={item}
                userData={userData}
                markStarredJob={markStarredJob}
                switchToScreen={switchToScreen}
                setModalVisible={setModalVisible}
                setEmployerRecord={setEmployerRecord}
              />
            );
          }}
        />
      ) : (
        <View style={styles.container}>
          <Text>Job Post not found.</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default JobListing;
