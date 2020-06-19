import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  //TextInput,
  TouchableOpacity,
  //Image,
  //Button
} from 'react-native';
/*
import ImagePicker from 'react-native-image-picker';

const options = {
  noData: true
};

ImagePicker.launchImageLibrary(options, (response) => {
  console.log('Response = ', response);

  if (response.didCancel) {
    console.log('User cancelled image picker');
  } else if (response.error) {
    console.log('ImagePicker Error: ', response.error);
  } else if (response.customButton) {
    console.log('User tapped custom button: ', response.customButton);
  } else {
    const source = { uri: response.uri };

    this.setState({
      ImageSource: source,
    });
  }
});
*/

const UploadImage = props => (

  <View >
    <View >
      <Text style={styles.loginText}>Upload Photo</Text>
    </View>
    <View style={styles.loginBtn}>

      <TouchableOpacity onPress={() => props.navigation.push('MembershipPage')}>
        <Text style={styles.nextBtnText}>Next</Text>
      </TouchableOpacity>

    </View>
  </View>
  //  <Button title="hello" onPress={handleChoosePhoto} />
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
    marginLeft: 90
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


export default UploadImage;
