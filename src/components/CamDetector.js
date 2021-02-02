import React, { Component } from "react";
import Webcam from "react-webcam";
import { Typography } from "@material-ui/core";
import * as tf from "@tensorflow/tfjs";
import { connect } from "react-redux";
import setPrediction from "../redux/actions/setPrediction";

const videoConstraints = {
    width: 480,
    height: 480,
    facingMode: "user"
};

class CamDetector extends Component {

    constructor(props) {
        super(props);
        this.state = {
            webcamRef: React.createRef()
        };
    }

    componentDidMount() {
        requestAnimationFrame(() => this.detect());
    }

    async detect() {
        const { webcamRef } = this.state;
        const { model, classifier, setPrediction } = this.props;

        if (typeof webcamRef.current === "undefined" ||
            webcamRef.current === null ||
            webcamRef.current.video.readyState !== 4) {
                requestAnimationFrame(() => this.detect());
                return;
            }

        const img = tf.browser.fromPixels(webcamRef.current.video);

        const activation = model.infer(img, 'conv_preds');
        const result = await classifier.predictClass(activation);

        setPrediction(result.label, result.confidences[result.label] * 100);

        tf.dispose(img);

        requestAnimationFrame(() => this.detect());
    }

    render() {
        const { webcamRef } = this.state;
        const { prediction, predictionProb } = this.props;

        return (
            <>
                <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/png"
                    width={videoConstraints.width}
                    height={videoConstraints.height}
                    videoConstraints={videoConstraints}
                />
                <Typography variant="h3">Predicción: {prediction} [{predictionProb} %]</Typography>
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
