import * as React from 'react';
import {
  Image, View
  , Text, StyleSheet, TouchableOpacity
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';

export default class ImagePickerExample extends React.Component {
  state = {
    image: null,
  };

  componentDidMount() {
    this.getPermissionAsync();
  }

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        //alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  };
  pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        this.setState({ image: result.uri });
      }

      console.log(result);
    } catch (E) {
      console.log(E);
    }
  };
  takePhoto = async () => {
    const {
      status: cameraPerm
    } = await Permissions.askAsync(Permissions.CAMERA);

    const {
      status: cameraRollPerm
    } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    // only if user allows permission to camera AND camera roll
    if (cameraPerm === 'granted' && cameraRollPerm === 'granted') {
      const pickerResult = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (!pickerResult.cancelled) {
        this.setState({ image: pickerResult.uri });
      }

      this.uploadImageAsync(pickerResult.uri);
    }
  };


  render() {
    const { image } = this.state;

    return (
      <View style={styles.container}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <View >
            <Text style={styles.title1}>Upload Photo</Text>
          </View>

          {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}

          <View style={styles.loginBtn}>
            <TouchableOpacity onPress={this.pickImage}>
              <Text style={styles.loginText}> Pick an image from camera roll </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.loginBtn}>
            <TouchableOpacity onPress={this.takePhoto}>
              <Text style={styles.loginText}> Click an image from camera </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.loginBtnnext}>
            <TouchableOpacity onPress={() => this.props.navigation.push('MembershipPage')}>
              <Text style={styles.loginText1} >Next</Text>
            </TouchableOpacity>
          </View>


        </View>
      </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  text: {
    fontSize: 30
  },

  loginBtn: {
    width: '70%',
    backgroundColor: '#8fbc8f',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  loginText: {
    color: 'black',
  },
  loginText1: {
    color: 'black',
    fontSize: 20
  },
  title1: {
    color: 'black',
    fontSize: 30,
    marginTop: 20,
    //marginBottom: 100,
    marginLeft: 65,
  },
  loginBtnnext: {
    width: '40%',
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

/*
navi = props => {
 props.navigation.push('Home');
console.log('prssed');
};
*/
