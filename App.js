import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  Button,
  ActivityIndicator,
  Image,
  View
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import RNTesseractOcr from 'react-native-tesseract-ocr';

export default class App extends Component {
  constructor() {
    super()

    this.state = {
      isLoading: false,
      img_uri: null,
      ocrRes: null
    }

    this.choosePic = () => {

      const options = {
        quality: 1.0,
        storageOptions: {
          skipBackup: true
        }
      };

      this.setState({ isLoading: true })
      ImagePicker.showImagePicker(options, (res) => {
        if(res.didCancel || res.error){
          this.setState({ isLoading: false })
        }else{
          let src = (Platform.OS === 'android') ? { uri: res.uri, isStatic: true } : { uri: res.uri.replace('file://', ''), isStatic: true }
          this.setState({ img_uri: src }, this.doOcr(res.path));
        }
      })
    }

    this.doOcr = (path) => {

      const tessOptions = {
        whitelist: null, 
        blacklist: '1234567890\'!"#$%&/()={}[]+*-_:;<>'
      };
      
      const lang = 'LANG_ENGLISH'

      RNTesseractOcr.recognize(path, lang, tessOptions)
      .then((result) => {
        this.setState({ ocrResult: result, isLoading: false });
        console.log("OCR Result: ", result);
      })
      .catch((err) => {
        console.log("OCR Error: ", err);
      })
      .done();
    }

    this.cancelOcr = () => {
      RNTesseractOcr.stop()
      .then((res) => console.log('OCR Cancelled -- ', res))
      .catch((err) => console.log('OCR Cancellation ERROR! -- ', err))
      .done()
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <Button title='Select' onPress={() => this.choosePic()} >
          <View>
            {this.state.img_uri === null ?
              <Text>Tap me!</Text>
              :
              <Image style={styles.img} source={this.state.img_uri} />
            }
          </View>
        </Button>
        {(this.state.isLoading) ?
          <ActivityIndicator
            animating={this.state.isLoading}
            size="large"
          /> : <Text>{this.state.ocrRes !== null ? this.state.ocrRes.toString() : null}</Text>
        }
        <Button title='Cancel' onPress={() => this.cancelOcr()} >
          <View>
            <Text>Cancel recognition</Text>
          </View>
        </Button>
        <Text style={styles.instructions}>
          Testing!
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  img: {
    width: 500,
    height: 500
  },
});
