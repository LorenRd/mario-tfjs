import React, { Component } from "react";
import Webcam from "react-webcam";
import { Button, Typography } from "@material-ui/core";
import * as tf from "@tensorflow/tfjs";
import { ContextConsumer } from "../appContext";

const videoConstraints = {
    width: 640,
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
        })
    }

    async takePhoto(model, classifier) {
        const { webcamRef, currentAction } = this.state;

        const camImage = webcamRef.current.getScreenshot({ width: videoConstraints.width, height: videoConstraints.height });

        const img = await this.imageToTensor(camImage);

        const activation = model.infer(img, true);
        classifier.addExample(activation, actions[currentAction].class);

        tf.dispose(img);

        this.setState(prevState => {
            const numPhotos = [...prevState.numPhotos];
            numPhotos[prevState.currentAction] ++;
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

    finish(setPlaying) {
        const hasPhotos = this.state.numPhotos.reduce((ac, v) => v === 0 ? false : ac, true);
        if(!hasPhotos) return;

        setPlaying();
    }

    render() {
        const { currentAction, numPhotos, webcamRef } = this.state;

        return (
            <ContextConsumer>
                {ctx => (
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
                        <Button variant="contained" onClick={() => this.takePhoto(ctx.model, ctx.classifier)}>Tomar foto</Button>
                        <Button variant="contained" disabled={currentAction === 0} onClick={() => this.prevAction()}>Acción anterior</Button>
                        <Button variant="contained" disabled={currentAction >= actions.length - 1} onClick={() => this.nextAction()}>Siguiente acción</Button>
                        <Button variant="contained" onClick={() => this.finish(ctx.setPlaying)}>Finalizar</Button>
                    </>
                )}
            </ContextConsumer>
        );
    }
}

export default CamRecorder;
