import React, { Component } from "react";
import Webcam from "react-webcam";
import { Typography, Grid, withStyles } from "@material-ui/core";
import * as tf from "@tensorflow/tfjs";
import { connect } from "react-redux";
import setPrediction from "../redux/actions/setPrediction";
import setPredictionFunction from "../redux/actions/setPredictionFunction";
import Game from "./Game";
import "./CamStyles.css";
import actions from "../gameActions";

const styles = theme => ({
    predictionText: {
        fontStyle: "italic",
        textAlign: "center",
        width: "82.3vh",
        height: "1.4em",
        color: "#779",
        borderRadius: "10%",
        textShadow: "2px 2px rgba(0, 0, 0, .8)",
        background: "linear-gradient(45deg, rgba(150, 30, 30, 0.92) 20%, rgba(200, 60, 60, 0.92) 80%)",
        [theme.breakpoints.down("sm")]: {
            width: "100vw",
            fontSize: "1.6rem",
        },
    },
    camCenter: {
        textAlign: "center"
    }
});

class CamDetector extends Component {

    constructor(props) {
        super(props);
        this.webcamRef = React.createRef();
        this.state = {
            isCamReady: false
        }
    }

    componentDidMount() {
        if(this.props.modelType === "mobilenet") {
            this.props.setPredictionFunction(this.detectMobilenet.bind(this));
        } else {
            this.props.setPredictionFunction(this.detectPretrained.bind(this));
        }
    }

    detectPretrained() {
        
        const { model, setPrediction } = this.props;

        if (typeof this.webcamRef.current === "undefined" ||
            this.webcamRef.current === null ||
            this.webcamRef.current.video.readyState !== 4) {
            return;
        }

        const img = tf.browser.fromPixels(this.webcamRef.current.video);
        const resized = tf.image.resizeBilinear(img, [224, 224]);
        const expanded = resized.expandDims(0);
        const result = model.predict(expanded);

        const scores = result.arraySync()[0];
        const maxScore = result.max().arraySync();
        const maxScoreIndex = scores.indexOf(maxScore);

        setPrediction(actions[maxScoreIndex].class, maxScore * 100);

        tf.dispose(expanded);
        tf.dispose(resized);
        tf.dispose(img);
    }

    async detectMobilenet() {
        const { model, classifier, setPrediction } = this.props;

        if (typeof this.webcamRef.current === "undefined" ||
            this.webcamRef.current === null ||
            this.webcamRef.current.video.readyState !== 4) {
            return;
        }

        const img = tf.browser.fromPixels(this.webcamRef.current.video);

        const activation = model.infer(img, 'conv_preds');
        const result = await classifier.predictClass(activation);

        setPrediction(result.label, result.confidences[result.label] * 100);

        tf.dispose(img);
    }

    camReady() {
        this.setState({ isCamReady: true });
    }

    render() {
        const { prediction, predictionProb, classes } = this.props;
        const { isCamReady } = this.state;

        const predictionItem = actions.find(v => v.class === prediction);
        const predictionText = predictionItem ? predictionItem.name : prediction;

        return (
            <Grid container item direction="row">
                <Grid item xs={12} sm={6} className={classes.camCenter}>
                    <Webcam
                        className="camdetector camborder"
                        ref={this.webcamRef}
                        audio={false}
                        screenshotFormat="image/png"
                        videoConstraints={this.props.videoConstraints}
                        onUserMedia={() => this.camReady()}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    {isCamReady &&
                        <>
                            <Game />
                            <Typography variant="h4" className={classes.predictionText}>Predicción: {predictionText} [{predictionProb.toFixed(2)} %]</Typography>
                        </>
                    }
                </Grid>
            </Grid>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        model: state.DataReducer.model,
        classifier: state.DataReducer.classifier,
        prediction: state.DataReducer.prediction,
        predictionProb: state.DataReducer.predictionProb,
        modelType: state.DataReducer.modelType,
        videoConstraints: state.CameraReducer
    };
};

const mapDispatchToProps = {
    setPrediction,
    setPredictionFunction
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(CamDetector));
