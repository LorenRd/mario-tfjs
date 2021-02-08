import { Component } from "react";
import { Button, Typography, Grid, withStyles } from "@material-ui/core";
import * as mobilenet from '@tensorflow-models/mobilenet';
import setModel from "../redux/actions/setModel";
import setModelType from "../redux/actions/setModelType";
import setPlaying from "../redux/actions/setPlaying";
import showAlert from "../redux/actions/showAlert";
import { connect } from "react-redux";
import { loadGraphModel } from "@tensorflow/tfjs-converter";

const styles = theme => ({
    box: {
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
    button: {
        width: "16em",
        margin: "0.4em",
        backgroundColor: "#ffb13d",
        boxShadow: "10px 3px 5px 2px rgba(0, 0, 0, .5)",
        fontSize: "1.5rem",
        marginTop: "1em",
        '&:hover': {
            backgroundColor: "#ff9800",
        },
        [theme.breakpoints.down("sm")]: {
            fontSize: "1.2rem"
        },
    },
});

class ModelSelector extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loadingModel: false,
        };
    }

    loadMobileNet() {
        this.setState({ loadingModel: true });
        this.props.setModelType("mobilenet");

        mobilenet.load()
            .then(model => {
                this.props.setModel(model);
            })
            .catch(() => {
                this.props.showAlert("error", "Ha ocurrido un error cargando el modelo de mobilenet");
                this.setState({ loadingModel: false });
            });
    }

    loadPretrained() {
        this.setState({ loadingModel: true });
        this.props.setModelType("entrenado");

        loadGraphModel("/model/model.json")
            .then(model => {
                this.props.setModel(model);
                this.props.setPlaying();    // This model is already trained
            })
            .catch(() => {
                this.props.showAlert("error", "Ha ocurrido un error cargando el modelo pre-entrenado");
                this.setState({ loadingModel: false });
            });
    }

    render() {
        const { loadingModel } = this.state;
        const { classes, modelType } = this.props;

        return (
            <Grid container item sm={12} direction="column" alignItems="center" justify="center">
                {loadingModel ?
                    <Typography className={classes.box} variant="h3">Cargando {modelType}</Typography >
                    :
                    <Grid container item sm={12} direction="column" alignItems="center" justify="center">
                        <Grid item>
                            <Typography className={classes.box} variant="h3">Selecciona el modelo</Typography>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" className={classes.button} onClick={() => this.loadMobileNet()}>Modelo de Mobilenet</Button>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" className={classes.button} onClick={() => this.loadPretrained()}>Modelo pre-entrenado</Button>
                        </Grid>
                    </Grid>
                }
            </Grid>);
    }
}

const mapStateToProps = (state) => {
    return {
        modelType: state.DataReducer.modelType,
    };
};

const mapDispatchToProps = {
    setPlaying,
    setModel,
    setModelType,
    showAlert
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ModelSelector));
