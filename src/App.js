import React from 'react';
import './App.css';
import Particles from 'react-particles-js';
import { Component } from 'react';
import Navigation from './Component/Navigation/Navigation';
import Logo from './Component/Logo/Logo';
import ImageLinkForm from './Component/ImageLinkForm/ImageLinkForm';
import Rank from './Component/Rank/Rank';
import FaceRecognition from './Component/FaceRecognition/FaceRecognition';
import Signin from './Component/Signin/Signin';
import Register from './Component/Register/Register';
import Clarifai from 'clarifai';
import 'tachyons';

const app = new Clarifai.App({
  apiKey: 'apiKey'
 });

const particlesOptions = {
  particles: {
    number: {
      value: 200,
      density: {
        enable: true,
        value_area: 900
      }
    }
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageURL: '', 
      box: {},
      route: 'signin',
      isSignedIn: false
    }
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftcol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightcol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({box: box});
  }

  onInputChange = (e) => {
    this.setState({input: e.target.value});
  }

  onSubmit = () => {
    this.setState({imageURL: this.state.input})
    console.log('click');
    app.models
    .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
      .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if(route === 'signout') {
      this.setState({isSignedIn: false});
    } else if(route === 'home') {
      this.setState({isSignedIn: true});
    }
    this.setState({route: route});
  }

  render() {
    const {isSignedIn, imageURL, box, route} = this.state;
    return (
      <div className="App">
        <Particles className='particales'
              params={particlesOptions}/>
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        {this.state.route === 'home' ?
          <div>
            <Logo />
            <Rank />
            <ImageLinkForm onSubmit={this.onSubmit} onInputChange={this.onInputChange}/>
            <FaceRecognition box={box} imageURL={imageURL}/>
          </div>
          : (
              route === 'signin'
              ? <Signin onRouteChange={this.onRouteChange}/>
              : <Register onRouteChange={this.onRouteChange} />
          )}
      </div>
    );
  }
}

export default App;
