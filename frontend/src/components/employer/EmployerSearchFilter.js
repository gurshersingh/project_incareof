import React from "react";
import {StyleSheet, Text, TextInput, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";

const EmployerSearchFilter = ({
  handleFilterByText,
  filterVisiblity,
  setFilterVisibility,
}) => {
  return (
    <View style={styles.filterSearchContainer}>
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        placeholder="search"
        style={[styles.searchInput, styles.elementHeight]}
        onChangeText={handleFilterByText}
      />
      <Ionicons
        style={[styles.searchIcon, styles.elementHeight]}
        name="ios-search"
      />
      <Ionicons
        style={[styles.menuIcon, styles.elementHeight]}
        name={filterVisiblity ? "ios-close-circle-outline" : "md-menu"}
        onPress={() => setFilterVisibility(!filterVisiblity)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  elementHeight: {
    height: 40,
  },
  filterSearchContainer: {
    flexDirection: "row",
    margin: 15,
  },
  searchInput: {
    flex: 8,
    borderWidth: 1,
    borderColor: "#dddddd",
    backgroundColor: "#ffffff",
    borderRadius: 30,
    paddingLeft: 15,
    marginRight: 15,
    shadowColor: "#dddddd",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  searchIcon: {
    flex: 1,
    alignSelf: "center",
    fontSize: 30,
    fontWeight: "700",
    padding: 5,
    color: "#9E9E9E",
    elevation: 8,
  },
  menuIcon: {
    flex: 1,
    alignSelf: "center",
    fontSize: 30,
    fontWeight: "700",
    paddingVertical: 5,
    marginLeft: 15,
    color: "#9E9E9E",
    elevation: 8,
  },
});

export default EmployerSearchFilter;
