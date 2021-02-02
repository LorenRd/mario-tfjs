import { React, Component } from "react";
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import * as mobilenet from '@tensorflow-models/mobilenet';
import CamRecorder from "./components/CamRecorder";
import Game from "./components/Game";
import { Typography } from "@material-ui/core";
import { connect } from "react-redux";
import setModel from "./redux/actions/setModel";

class App extends Component {

    componentDidMount() {
        mobilenet.load()
            .then(model => {
                this.props.setModel(model);
            })
            .catch(reason => {
                // TODO Cambiar por alerta
                console.log(reason);
            });
    }

    render() {
        const { model, playing } = this.props;

        return (
            <>
                {model ?
                    playing ? <Game/> : <CamRecorder />
                    :
                    <div>
                        <Typography variant="h4">TFJS version: {tf.version.tfjs}</Typography>
                        <Typography variant="h3">Cargando modelo...</Typography>
                    </div>
                }
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
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
