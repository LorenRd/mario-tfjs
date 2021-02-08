import { React, Component } from "react";
import "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import CamRecorder from "./components/CamRecorder";
import { Typography, withStyles, Grid } from "@material-ui/core";
import { connect } from "react-redux";
import Background from "./components/Background";
import SnackbarListener from "./components/SnackbarListener";
import CamDetector from "./components/CamDetector";
import ModelSelector from "./components/ModelSelector";

const styles = theme => ({
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

    render() {
        const { model, playing, classes } = this.props;

        const footer =
            <Grid container direction="column" className={classes.footer}>
                <Grid item>
                    <Typography className={classes.footerTitleText} variant="h5">MARIO TFJS - ¡Juega a Super Mario Bros con tu cámara!</Typography>
                </Grid>
                <Grid item>
                    <Typography className={classes.footerText} variant="h5">Andrés Martínez &amp; Lorenzo Rondán</Typography>
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
                            <ModelSelector />
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
        model: state.DataReducer.model
    };
};

export default connect(mapStateToProps)(withStyles(styles)(App));
