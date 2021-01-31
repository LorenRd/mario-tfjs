import './App.css';
import {React, Component} from "react";
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import * as mobilenet from '@tensorflow-models/mobilenet';

class App extends Component{
  async componentDidMount() {
    const img = document.getElementById('img');

    // Load the model.
    const model = await mobilenet.load();
    
    // Classify the image.
    const predictions = await model.classify(img);
    
    console.log('Predictions: ');
    console.log(predictions);
  }

  render(){
    return(
      <img id="img" alt="demo" src="mushroom.jpg" />

    )
  }


}


export default App;
