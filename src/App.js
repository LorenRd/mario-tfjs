import { React, Component } from "react";
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import * as mobilenet from '@tensorflow-models/mobilenet';
import CamRecorder from "./components/CamRecorder";
import { Typography, withStyles, Grid } from "@material-ui/core";
import { connect } from "react-redux";
import Background from "./components/Background";
import setModel from "./redux/actions/setModel";
import SnackbarListener from "./components/SnackbarListener";
import showAlert from "./redux/actions/showAlert";
import CamDetector from "./components/CamDetector";

const styles = theme => ({
    loadingModel: {
        fontSize: "3rem",
        background: "linear-gradient(45deg, #0aa 20%, #0dd 80%)",
        border: 0,
        borderRadius: "10px",
        boxShadow: "7px 3px 5px 2px rgba(0, 0, 0, .5)",
        color: "black",
        width: "8em",
        height: "2.2em",
        padding: "0.2em 0.6em",
        margin: "0.1em",
        textAlign: "center",
        textTransform: "uppercase",
        textShadow: "1px 1px rgba(0, 0, 0, .4)",
        [theme.breakpoints.down("sm")]: {
            width: "6em",
        },
    },
    content: {
        height: "80vh",
    },
    footer: {
        background: "linear-gradient(45deg, rgba(150, 30, 30, 0.92) 20%, rgba(200, 60, 60, 0.92) 80%)",
        height: "20vh"
    },
    footerTitleText: {
        textAlign: "center",
        marginBottom: "1em",
        fontSize: "1.6rem",
        border: "1px solid transparent",
        boxShadow: "0 0 5px 5px rgba(0, 0, 0, 0.5)",
        [theme.breakpoints.down("sm")]: {
            fontSize: "1.2rem"
        },
    },
    footerText: {
        fontStyle: "italic",
        textAlign: "right",
        marginRight: "0.5em",
        color: "#111",
        opacity: "0.85",
        fontSize: "1.3rem",
        [theme.breakpoints.down("sm")]: {
            fontSize: "1rem"
        },
    },
});

class App extends Component {

    componentDidMount() {
        console.log(tf.version.tfjs);
        mobilenet.load()
            .then(model => {
                this.props.setModel(model);
            })
            .catch(() => {
                this.props.showAlert("error", "Ha ocurrido un error cargando el modelo");
            });
    }

    render() {
        const { model, playing, classes } = this.props;

        const footer =
            <Grid container direction="column" className={classes.footer}>
                <Grid item>
                    <Typography className={classes.footerTitleText} variant="h5">MARIO TFJS - ¡Juega a Super Mario Bros con tu cámara!</Typography>
                </Grid>
                <Grid item>
                    <Typography className={classes.footerText} variant="h5">Andrés Martínez &amp; Lorenzo Roldán</Typography>
                </Grid>
                <Grid item>
                    <Typography className={classes.footerText} variant="h5">Machine Learning Engineering (2021)</Typography>
                </Grid>
            </Grid>;

        return (
            <>
                <Background>
                    <Grid container className={classes.content}>
                        {model ?
                            playing ? <CamDetector /> : <CamRecorder />
                            :
                            <Grid container item sm={12} direction="column" alignItems="center" justify="center">
                                <Typography className={classes.loadingModel} variant="h3">Cargando mobilenet</Typography>
                            </Grid>
                        }
                    </Grid>
                    {footer}
                </Background>
                <SnackbarListener />
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
    showAlert
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(App));
