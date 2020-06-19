import * as React from 'react';
import {
  Button, Image, View
  , Text
  , TouchableOpacity
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
  navi = props => {
    props.navigation.push('Home');
    console.log('prssed');
  };

  render() {
    const { image } = this.state;

    return (

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

        {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
        <Button title="Pick an image from camera roll" onPress={this.pickImage} />
        <Button title="Click an image from camera " onPress={this.takePhoto} />
        <TouchableOpacity onPress={() => this.props.navigation.push('MembershipPage')}>
          <Text >Next</Text>
        </TouchableOpacity>


      </View>

    );
  }
}
