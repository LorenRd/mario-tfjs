import './App.css';
import { React, Component } from "react";
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import * as mobilenet from '@tensorflow-models/mobilenet';
import CamRecorder from "./components/CamRecorder";

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            model: null
        }
    }

    componentDidMount() {

        // Load the model
        mobilenet.load()
            .then(model => {
                this.setState({ model });
            })
            .catch(reason => {
                console.log(reason);
            })
    }

    render() {
        return (
            <>
                {this.state.model ? <CamRecorder model={this.state.model} /> : null}
            </>
        );
    }
}

export default App;
