import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Modal,
  TouchableOpacity,
  View,
  Text,
  TextInput,
  FlatList,
} from "react-native";
import Slider from "react-native-slider";
import EmployerSearchFilter from "./EmployerSearchFilter";
import CheckBox from "@react-native-community/checkbox";
import DateTimePicker from "@react-native-community/datetimepicker";
import { baseUrl } from "../../utils/constants";
import { ScrollView } from "react-native-gesture-handler";

const EmployerFilterOverlay = ({
  jobs,
  handleFilterByText,
  handleFilterByWager,
  filterVisiblity,
  setFilterVisibility,
  handleSelectedService,
}) => {
  const [wager, setWager] = useState(1000);
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [services, setServices] = useState([]);
  const [checkedService, setCheckedService] = useState(new Map());
  const [minWager, setMinWager] = useState(0);
  const [maxWager, setMaxWager] = useState(10000);

  function dateTimerPickerChange(event, selectedDate) {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
  }

  function showMode(currentMode) {
    setShow(true);
    setMode(currentMode);
  }

  function showDatepicker() {
    showMode("date");
  }

  function searchByService(id) {
    const isChecked = checkedService.get(id);
    setCheckedService(new Map(checkedService.set(id, !isChecked)));
    handleSelectedService(checkedService);
  }

  function getMinWager(jobsArr) {
    const job = jobsArr.reduce(function (prevJob, currJob) {
      parseInt(prevJob.wager_offered) < parseInt(currJob.wager_offered)
        ? prevJob
        : (prevJob = currJob);
      return prevJob;
    });
    return parseInt(job.wager_offered);
  }

  function getMaxWager(jobsArr) {
    const job = jobsArr.reduce(function (prevJob, currJob) {
      parseInt(prevJob.wager_offered) < parseInt(currJob.wager_offered)
        ? currJob
        : (currJob = prevJob);
      return currJob;
    });
    return parseInt(job.wager_offered);
  }

  useEffect(() => {
    if (jobs.length > 0) {
      setWager(getMinWager(jobs));
      setMinWager(getMinWager(jobs));
      setMaxWager(getMaxWager(jobs));
    }
    const api_url = baseUrl + `api/service/list`;
    fetch(api_url, {
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
          setServices(response.result);
        } else {
          throw new Error(response);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    return () => { };
  }, []);

  return (
    <Modal animationType="slide" transparent={true} visible={filterVisiblity}>
      <View
        style={styles.centeredView}
        onStartShouldSetResponder={() => {
          setFilterVisibility(!filterVisiblity);
        }}
      >
        <View
          style={[
            styles.modalView,
            {
              backgroundColor: "rgba(221, 221, 221, 1)",
            },
          ]}
          onStartShouldSetResponder={(event) => {
            event.stopPropagation();
          }}
        >
          <EmployerSearchFilter
            handleFilterByText={handleFilterByText}
            filterVisiblity={filterVisiblity}
            setFilterVisibility={setFilterVisibility}
          />
          <View style={styles.sliderOuterContainer}>
            <Text style={styles.wagerText}> Wager: </Text>
            <View style={styles.sliderContainer}>
              <Slider
                value={wager}
                minimumValue={minWager}
                maximumValue={maxWager}
                step={1}
                thumbTintColor="#3fa4db"
                minimumTrackTintColor="#3fa4db"
                maximumTrackTintColor="#b3b3b3"
                trackStyle={styles.trackStyle}
                thumbStyle={styles.thumbStyle}
                onValueChange={(value) => setWager(value)}
                onSlidingComplete={(value) => handleFilterByWager(value)}
              />
            </View>
          </View>
          {/*<View style={styles.datePickerContainer}>
            <View style={styles.inputView}>
              <TouchableOpacity onPress={showDatepicker}>
                <TextInput
                  name="created_at"
                  type="text"
                  style={styles.inputText}
                  placeholder="Filter by job post date"
                  placeholderTextColor="#dddddd"
                  editable={false}
                  value={date.toLocaleDateString("nl", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                  pointerEvents="none"
                />
              </TouchableOpacity>
              {show && (
                <DateTimePicker
                  testID="dateTimePicker"
                  timeZoneOffsetInMinutes={0}
                  value={date}
                  mode={mode}
                  is24Hour={true}
                  display="default"
                  onChange={dateTimerPickerChange}
                />
              )}
            </View>
              </View>*/}
          <View style={styles.MainContainer}>
            <FlatList
              data={services}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={{ flex: 1, flexDirection: "column", margin: 1 }}>
                  <View style={styles.imageThumbnail}>
                    <CheckBox
                      value={checkedService.get(item.id)}
                      onValueChange={() => searchByService(item.id)}
                    />
                    <Text>{item.service_name}</Text>
                  </View>
                </View>
              )}
              //Setting the number of column
              numColumns={2}
              keyExtractor={(item, index) => index}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    backgroundColor: "#388e3c",
    opacity: 0.8,
  },
  modalView: {
    alignItems: "center",
    height: 300,
    backgroundColor: "rgba(221, 221, 221, 0.9)",
    flexDirection: "column",
    elevation: 5,
  },
  contBtn: {
    backgroundColor: "#f8bbd0",
    borderRadius: 35,
    marginHorizontal: 20,
    padding: 15,
    opacity: 1,
    elevation: 10,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  contactIcons: {
    fontSize: 30,
    color: "#ffffff",
  },
  sliderOuterContainer: {
    marginVertical: 10,
    flexDirection: "row",
    marginHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  wagerText: {
    fontWeight: "700",
  },
  sliderContainer: {
    flex: 1,
    alignItems: "stretch",
    marginLeft: 15,
    justifyContent: "center",
  },
  trackStyle: {
    shadowColor: "#3fa4db",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 6,
  },
  thumbStyle: {
    backgroundColor: "#3fa4db",
    shadowColor: "#3fa4db",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 10,
  },
  datePickerContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
  },
  inputView: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderColor: "#9E9E9E",
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 40,
    justifyContent: "center",
  },
  inputText: {
    height: 40,
    color: "#333333",
  },
  scrollViewContainer: {
    marginVertical: 20,
  },
  checkBoxOuterContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "85%",
    marginLeft: 20,
    borderWidth: 1,
    borderColor: "black",
  },
  checkBoxContainer: {
    flexDirection: "row",
    width: "50%",
    borderWidth: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    borderColor: "red",
  },
  MainContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginHorizontal: 20,
    marginVertical: 15,
    flex: 1,
  },

  imageThumbnail: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
});

export default EmployerFilterOverlay;
