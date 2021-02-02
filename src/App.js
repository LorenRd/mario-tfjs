import { React, Component } from "react";
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import * as mobilenet from '@tensorflow-models/mobilenet';
import * as knnClassifier from "@tensorflow-models/knn-classifier";
import CamRecorder from "./components/CamRecorder";
import Game from "./components/Game";
import { ContextProvider } from "./appContext";
import { Typography } from "@material-ui/core";

class App extends Component {

    constructor(props) {
        super(props);
        console.log(tf.version.tfjs)
        this.state = {
            model: null,
            classifier: knnClassifier.create(),
            playing: false,
            setPlaying: this.setPlaying.bind(this)
        }
    }

    setPlaying() {
        this.setState({ playing: true });
    }

    componentDidMount() {
        mobilenet.load()
            .then(model => {
                this.setState({ model });
            })
            .catch(reason => {
                console.log(reason);
            })
    }

    render() {
        const { model, classifier } = this.state;

        return (
            <ContextProvider value={this.state}>
                {this.state.model ? 
                    this.state.playing ? 
                        <Game model={model} classifier={classifier}/>
                     : <CamRecorder />
                    :
                    <Typography variant="h3">Cargando modelo...</Typography>}
            </ContextProvider>
        );
    }
}

export default App;
