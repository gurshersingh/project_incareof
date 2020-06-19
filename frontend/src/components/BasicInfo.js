import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';

const BasicInfo = props => (

  <View >






    <View style={styles.inputView2}>
      <Text style={styles.inputText1}>Company(optional)</Text>
      <View style={styles.firstnameText}>

        <TextInput
          style={styles.inputText}
          placeholder=" "
          placeholderTextColor="white"
        //onChangeText={text => this.setState({ email: text })}
        />
      </View>
    </View>
    <View style={styles.inputView2}>
      <Text style={styles.inputText1}>Email</Text>
      <View style={styles.firstnameText}>

        <TextInput
          style={styles.inputText}
          placeholder=" "
          placeholderTextColor="white"
        //onChangeText={text => this.setState({ email: text })}
        />
      </View>
    </View>

    <View style={styles.inputView2}>
      <Text style={styles.inputText1}>Confirm Email</Text>
      <View style={styles.firstnameText}>

        <TextInput
          style={styles.inputText}
          placeholder=" "
          placeholderTextColor="white"
        //onChangeText={text => this.setState({ email: text })}
        />
      </View>
    </View>

    <View style={styles.inputView2}>
      <Text style={styles.inputText1}>Phone Number</Text>
      <View style={styles.firstnameText}>

        <TextInput
          style={styles.inputText}
          placeholder=" "
          placeholderTextColor="white"
        //onChangeText={text => this.setState({ email: text })}
        />
      </View>
    </View>


    <View style={styles.loginBtn}>
      <TouchableOpacity onPress={() => props.navigation.push('AddInfo')}>
        <Text style={styles.nextBtnText}>Next</Text>
      </TouchableOpacity>

    </View>
  </View>

);
const styles = StyleSheet.create({
  nextBtnText: {
    color: 'black',
    fontSize: 20
  },
  inputText: {
    height: 30,
    color: 'black',
    marginTop: -17,
    marginLeft: -50,

  },
  inputText1: {
    height: 30,
    color: 'black',
    marginTop: 50,
    marginLeft: 40,
  },
  loginText: {
    color: 'black',
    fontSize: 30,
    marginTop: 20,
    //marginBottom: 100,
    marginLeft: 65,
  },
  inputView2: {
    marginBottom: -35,
  },
  firstnameText: {
    //flex: 1,
    flexDirection: 'row',
    width: '45%',
    backgroundColor: '#64358D',
    borderRadius: 25,
    height: 30,
    marginTop: -40,
    marginLeft: 160,
    marginBottom: 10,

    justifyContent: 'center',
    padding: 20,
  },

  loginBtn: {
    width: '20%',
    backgroundColor: '#fb5b5a',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 150,
    //marginBottom: 100,
    marginLeft: 285,
  },
});

export default BasicInfo;
