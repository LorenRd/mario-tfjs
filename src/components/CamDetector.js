import React, { Component } from "react";
import Webcam from "react-webcam";
import { Typography } from "@material-ui/core";
import * as tf from "@tensorflow/tfjs";
import { connect } from "react-redux";
import setPrediction from "../redux/actions/setPrediction";
import Game from "./Game";
import videoConstraints from "../CamConstraints";

class CamDetector extends Component {

    constructor(props) {
        super(props);
        this.webcamRef = React.createRef();
        this.state = {
            isCamReady: false
        }
    }

    componentDidMount() {
        requestAnimationFrame(() => this.detect());
    }

    async detect() {
        const { model, classifier, setPrediction } = this.props;

        if (typeof this.webcamRef.current === "undefined" ||
            this.webcamRef.current === null ||
            this.webcamRef.current.video.readyState !== 4) {
            requestAnimationFrame(() => this.detect());
            return;
        }

        const img = tf.browser.fromPixels(this.webcamRef.current.video);

        const activation = model.infer(img, 'conv_preds');
        const result = await classifier.predictClass(activation);

        setPrediction(result.label, result.confidences[result.label] * 100);

        tf.dispose(img);

        requestAnimationFrame(() => this.detect());
    }

    camReady() {
        this.setState({ isCamReady: true });
    }

    render() {
        const { prediction, predictionProb } = this.props;
        const { isCamReady } = this.state;

        return (
            <>
                <Webcam
                    ref={this.webcamRef}
                    audio={false}
                    screenshotFormat="image/png"
                    videoConstraints={videoConstraints}
                    onUserMedia={() => this.camReady()}
                />
                {isCamReady ?
                    <>
                        <Typography variant="h3">Predicción: {prediction} [{predictionProb} %]</Typography>
                        <Game />
                    </>
                    :
                    <>
                        <Typography variant="h3">Cámara aún no lista</Typography>
                    </>
                }
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        model: state.DataReducer.model,
        classifier: state.DataReducer.classifier,
        prediction: state.DataReducer.prediction,
        predictionProb: state.DataReducer.predictionProb
    };
};

const mapDispatchToProps = {
    setPrediction
}

export default connect(mapStateToProps, mapDispatchToProps)(CamDetector);
