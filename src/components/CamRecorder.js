import React, { Component } from "react";
import Webcam from "react-webcam";
import { Button, Typography } from "@material-ui/core";
import * as tf from "@tensorflow/tfjs";
import { connect } from "react-redux";
import setPlaying from "../redux/actions/setPlaying";

const videoConstraints = {
    width: 480,
    height: 480,
    facingMode: "user"
};

const actions = [
    {
        name: "Adelante",
        class: "forward"
    },
    {
        name: "Atrás",
        class: "back"
    },
    {
        name: "Salto",
        class: "jump"
    },
    {
        name: "Quieto",
        class: "stop"
    }
];

class CamRecorder extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentAction: 0,
            webcamRef: React.createRef(),
            numPhotos: new Array(actions.length).fill(0)
        };
    }

    imageToTensor(img) {
        return new Promise((resolve, reject) => {
            const im = new Image()
            im.crossOrigin = 'anonymous';
            im.src = img;
            im.onload = () => {
                resolve(tf.browser.fromPixels(im));
            }
            im.onerror = () => {
                reject();
            }
        })
    }

    async takePhoto() {
        const { model, classifier } = this.props;
        const { webcamRef, currentAction } = this.state;

        const camImage = webcamRef.current.getScreenshot({ width: videoConstraints.width, height: videoConstraints.height });

        const img = await this.imageToTensor(camImage);

        const activation = model.infer(img, true);
        classifier.addExample(activation, actions[currentAction].class);

        tf.dispose(img);

        this.setState(prevState => {
            const numPhotos = [...prevState.numPhotos];
            numPhotos[prevState.currentAction]++;
            return { numPhotos };
        });
    }

    prevAction() {
        this.setState(prevState => ({
            currentAction: prevState.currentAction - 1
        }));
    }

    nextAction() {
        this.setState(prevState => ({
            currentAction: prevState.currentAction + 1
        }));
    }

    finish() {
        const hasPhotos = this.state.numPhotos.reduce((ac, v) => v === 0 ? false : ac, true);
        if (!hasPhotos) {
            // TODO Mostrar alerta
            return;
        }

        this.props.setPlaying();
    }

    render() {
        const { currentAction, numPhotos, webcamRef } = this.state;

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
                <Typography variant="h3">Acción actual: {actions[currentAction].name}</Typography>
                <Typography variant="h3">Número de fotos: {numPhotos[currentAction]}</Typography>
                <Button variant="contained" onClick={() => this.takePhoto()}>Tomar foto</Button>
                <Button variant="contained" disabled={currentAction === 0} onClick={() => this.prevAction()}>Acción anterior</Button>
                <Button variant="contained" disabled={currentAction >= actions.length - 1} onClick={() => this.nextAction()}>Siguiente acción</Button>
                <Button variant="contained" onClick={() => this.finish()}>Finalizar</Button>
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        model: state.DataReducer.model,
        classifier: state.DataReducer.classifier,
    };
};

const mapDispatchToProps = {
    setPlaying,
};

export default connect(mapStateToProps, mapDispatchToProps)(CamRecorder);
