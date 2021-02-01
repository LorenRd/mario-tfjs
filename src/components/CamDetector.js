import React, { Component } from "react";
import Webcam from "react-webcam";
import { Typography } from "@material-ui/core";
import * as tf from "@tensorflow/tfjs";

const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user"
};

class CamDetector extends Component {

    constructor(props) {
        super(props);
        this.state = {
            webcamRef: React.createRef(),
            prediction: "None",
            predictionProb: 0,
        };
    }

    componentDidMount() {
        setInterval(() => {
            this.detect();
        }, 16.7);
    }

    async detect() {
        const { webcamRef } = this.state;
        const { model, classifier } = this.props;

        if (typeof webcamRef.current === "undefined" ||
            webcamRef.current === null ||
            webcamRef.current.video.readyState !== 4) return;

        const img = tf.browser.fromPixels(webcamRef.current.video);

        const activation = model.infer(img, 'conv_preds');
        const result = await classifier.predictClass(activation);

        this.setState({
            prediction: result.label,
            predictionProb: result.confidences[result.label] * 100
        })

        tf.dispose(img);
    }

    render() {
        const { webcamRef, prediction, predictionProb } = this.state;

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

export default CamDetector;
