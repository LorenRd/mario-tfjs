import React, { Component } from "react";
import Webcam from "react-webcam";
import { Button, Typography } from "@material-ui/core";

const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user"
};

const actions = [
    "Adelante",
    "Atrás",
    "Salto"
]

class CamRecorder extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentAction: 0,
            webcamRef: React.createRef()
        };
    }

    takePhoto() {

    }

    nextAction() {
        if(this.state.currentAction < actions.length - 1) {
            this.setState(prevState => ({
                currentAction: prevState.currentAction + 1
            }));
        }
    }

    render() {
        return (
            <>
                <Typography variant="h1">Acción actual: {actions[this.state.currentAction]}</Typography>
                <Webcam
                    ref={this.webcamRef}
                    audio={false}
                    screenshotFormat="image/png"
                    width={videoConstraints.width}
                    height={videoConstraints.height}
                    videoConstraints={videoConstraints}
                />
                <Button variant="contained" onClick={() => this.takePhoto()}>Tomar foto</Button>
                <Button variant="contained" onClick={() => this.nextAction()}>Siguiente acción</Button>
            </>
        );
    }
}

export default CamRecorder;
