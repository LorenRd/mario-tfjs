import React, { Component } from "react";
import Webcam from "react-webcam";
import { Button, Typography, Grid } from "@material-ui/core";
import * as tf from "@tensorflow/tfjs";
import { connect } from "react-redux";
import setPlaying from "../redux/actions/setPlaying";
import showAlert from "../redux/actions/showAlert";
import videoConstraints from "../CamConstraints";
import "./CamRecorder.css";

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
            numPhotos: new Array(actions.length).fill(0),
            isCamReady: false,
        };
        this.webcamRef = React.createRef();
    }

    imageToTensor(img) {
        return new Promise((resolve, reject) => {
            const im = new Image();
            im.crossOrigin = 'anonymous';
            im.src = img;
            im.onload = () => {
                resolve(tf.browser.fromPixels(im));
            }
            im.onerror = () => {
                reject();
            }
        });
    }

    camReady() {
        this.setState({ isCamReady: true });
    }

    async takePhoto() {
        const { model, classifier } = this.props;
        const { currentAction } = this.state;

        const camImage = this.webcamRef.current.getScreenshot({ width: videoConstraints.width, height: videoConstraints.height });

        this.imageToTensor(camImage)
            .then(img => {
                const activation = model.infer(img, true);
                classifier.addExample(activation, actions[currentAction].class);

                tf.dispose(img);

                this.setState(prevState => {
                    const numPhotos = [...prevState.numPhotos];
                    numPhotos[prevState.currentAction]++;
                    return { numPhotos };
                });
            })
            .catch(() => {
                this.props.showAlert("error", "Ha ocurrido un error capturando la imagen");
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
            this.props.showAlert("info", "Todavía faltan gestos por definir");
            return;
        }

        this.props.setPlaying();
    }

    render() {
        const { currentAction, numPhotos, isCamReady } = this.state;

        return (
            <Grid container>
                <Grid item xs={4} />
                <Grid container item xs={4} direction="column" alignItems="center" justify="center">
                    <Grid item xs={12}>
                    <Webcam
                        className="camrecorder"
                        ref={this.webcamRef}
                        audio={false}
                        screenshotFormat="image/png"
                        videoConstraints={videoConstraints}
                        onUserMedia={() => this.camReady()}
                    />
                    </Grid>
                    {isCamReady ?
                        <>
                            <Typography variant="h3">Acción actual: {actions[currentAction].name}</Typography>
                            <Typography variant="h3">Número de fotos: {numPhotos[currentAction]}</Typography>
                            <Button variant="contained" onClick={() => this.takePhoto()}>Tomar foto</Button>
                            <Button variant="contained" disabled={currentAction === 0} onClick={() => this.prevAction()}>Acción anterior</Button>
                            <Button variant="contained" disabled={currentAction >= actions.length - 1} onClick={() => this.nextAction()}>Siguiente acción</Button>
                            <Button variant="contained" onClick={() => this.finish()}>Finalizar</Button>
                        </>
                        :
                        <>
                            <Typography variant="h3">Cámara aún no lista...</Typography>
                        </>
                    }
                </Grid>
                <Grid item xs={4} />
            </Grid>
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
    showAlert
};

export default connect(mapStateToProps, mapDispatchToProps)(CamRecorder);
