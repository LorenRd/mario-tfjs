import { React, Component } from "react";
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import * as mobilenet from '@tensorflow-models/mobilenet';
import CamRecorder from "./components/CamRecorder";
import { Typography } from "@material-ui/core";
import { connect } from "react-redux";
import Background from "./components/Background";
import setModel from "./redux/actions/setModel";
import SnackbarListener from "./components/SnackbarListener";
import showAlert from "./redux/actions/showAlert";
import CamDetector from "./components/CamDetector";

class App extends Component {

    componentDidMount() {
        mobilenet.load()
            .then(model => {
                this.props.setModel(model);
            })
            .catch(() => {
                this.props.showAlert("error", "Ha ocurrido un error cargando el modelo");
            });
    }

    render() {
        const { model, playing } = this.props;

        return (
            <>
                <Background>
                    {model ?
                        playing ? <CamDetector /> : <CamRecorder />
                        :
                        <div>
                            <Typography variant="h3">Cargando modelo...</Typography>
                        </div>
                    }
                    <Typography variant="h4">TFJS version: {tf.version.tfjs}</Typography>
                </Background>
                <SnackbarListener />
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        playing: state.DataReducer.playing,
        model: state.DataReducer.model,
    };
};

const mapDispatchToProps = {
    setModel,
    showAlert
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
