import React, { Component } from "react";
import Webcam from "react-webcam";
import { Button, Typography, Grid, withStyles, IconButton } from "@material-ui/core";
import { SwitchCamera } from '@material-ui/icons';
import * as tf from "@tensorflow/tfjs";
import { connect } from "react-redux";
import setPlaying from "../redux/actions/setPlaying";
import showAlert from "../redux/actions/showAlert";
import "./CamStyles.css";
import changeCamera from "../redux/actions/changeCamera";
import { MobileView } from "react-device-detect";
import actions from "../gameActions";

const styles = theme => ({
    box: {
        fontSize: "2.4rem",
        background: "#ff9800",
        border: 0,
        borderRadius: "10px",
        boxShadow: "10px 3px 5px 2px rgba(0, 0, 0, .5)",
        color: "white",
        width: "5em",
        height: "1em",
        padding: "0.2em 0.6em",
        margin: "0.1em",
        textAlign: "center",
        textTransform: "uppercase",
        textShadow: "3px 3px rgba(0, 0, 0, .4)",
        [theme.breakpoints.down("sm")]: {
            fontSize: "1.8rem"
        },
    },
    button: {
        width: "9em",
        margin: "0.4em",
        backgroundColor: "#ffb13d",
        boxShadow: "10px 3px 5px 2px rgba(0, 0, 0, .5)",
        '&:hover': {
            backgroundColor: "#ff9800",
        }
    },
    changeCamButton: {
        backgroundColor: "#ffb13d",
        boxShadow: "10px 3px 5px 2px rgba(0, 0, 0, .5)",
        '&:hover': {
            backgroundColor: "#ff9800",
        },
        position: "absolute",
        top: 0,
        right: 0
    }
});

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

        const camImage = this.webcamRef.current.getScreenshot({ width: this.props.videoConstraints.width, height: this.props.videoConstraints.height });

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
    
    changeCameraMobile() {
        this.props.changeCamera(this.props.videoConstraints.facingMode);
    }

    render() {
        const { currentAction, numPhotos, isCamReady } = this.state;
        const { classes } = this.props;

        return (
            <>
                <Grid container item xs={12} direction="column" alignItems="center" justify="center">
                    <Grid item xs={12}>
                        <Webcam
                            className="camrecorder camborder"
                            ref={this.webcamRef}
                            audio={false}
                            screenshotFormat="image/png"
                            videoConstraints={this.props.videoConstraints}
                            onUserMedia={() => this.camReady()}
                        />
                        <MobileView>
                            <IconButton className={classes.changeCamButton} onClick={() => this.changeCameraMobile()}>
                                <SwitchCamera/>
                            </IconButton>
                        </MobileView>
                    </Grid>
                </Grid>
                <Grid container item>
                    {isCamReady &&
                        <>
                            <Grid container item alignItems="center" justify="center">
                                <Grid item>
                                    <Typography className={classes.box} variant="h3">{actions[currentAction].name}</Typography>
                                </Grid>
                                <Grid item>
                                    <Typography className={classes.box} variant="h3">Fotos: {numPhotos[currentAction]}</Typography>
                                </Grid>
                            </Grid>
                            <Grid container item alignItems="center" justify="center">
                                <Grid item>
                                    <Button variant="contained" className={classes.button} disabled={currentAction === 0} onClick={() => this.prevAction()}>Acción anterior</Button>
                                </Grid>
                                <Grid item>
                                    <Button variant="contained" className={classes.button} disabled={currentAction >= actions.length - 1} onClick={() => this.nextAction()}>Siguiente acción</Button>
                                </Grid>
                            </Grid>
                            <Grid container item alignItems="center" justify="center">
                                <Grid item>
                                    <Button variant="contained" className={classes.button} onClick={() => this.takePhoto()}>Tomar foto</Button>
                                </Grid>
                                <Grid item>
                                    <Button variant="contained" className={classes.button} onClick={() => this.finish()}>Finalizar</Button>
                                </Grid>
                            </Grid>
                        </>
                    }
                </Grid>
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        model: state.DataReducer.model,
        classifier: state.DataReducer.classifier,
        videoConstraints: state.CameraReducer
    };
};

const mapDispatchToProps = {
    changeCamera,
    setPlaying,
    showAlert
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(CamRecorder));
