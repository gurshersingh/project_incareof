import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  //TextInput,
  TouchableOpacity,
  //Image,
} from 'react-native';
//import ImagePicker from 'react-native-image-picker';


const Payment = props => (


  <View >
    <View >
      <Text style={styles.loginText}>Make Payment</Text>
    </View>
    <View style={styles.loginBtn}>
      <TouchableOpacity onPress={() => props.navigation.push('ConfirmationPage')}>
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
  loginText: {
    color: 'black',
    fontSize: 30,
    marginTop: 20,
    //marginBottom: 100,
    marginLeft: 85
  },
  loginBtn: {
    width: '20%',
    backgroundColor: '#fb5b5a',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 550,
    marginBottom: 100,
    marginLeft: 300,
  },
});


export default Payment;
