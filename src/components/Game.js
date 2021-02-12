import React, { Component } from "react";
import { IconButton, withStyles, Dialog, DialogTitle, DialogContent } from "@material-ui/core";
import { VideogameAsset } from "@material-ui/icons";
import { connect } from "react-redux";

import render from '../util/render';
import input from '../util/input';
import animation from '../util/animation';
import movement from '../util/movement';
import physics from '../util/physics';

import { levelOne } from '../map/level_1-1';
import MapBuilder from '../map/map_builder';

import Mario from '../entities/mario';
import Goomba from '../entities/goomba';
import Koopa from '../entities/koopa';
import Score from '../entities/score';

import "./Game.css";

const CANVAS_WIDTH = 760;
const CANVAS_HEIGHT = 600;
const FPS = 60;
const PREDICT_WAIT_FRAMES = 5;

const styles = () => ({
    controlsButton: {
        backgroundColor: "#ffb13d",
        boxShadow: "10px 3px 5px 2px rgba(0, 0, 0, .5)",
        '&:hover': {
            backgroundColor: "#ff9800",
        },
        position: "absolute",
        top: 0,
        left: 0
    }
});

class Game extends Component {

    constructor(props) {
        super(props);
        this.state = {
            controlsDialogOpened: false,
        }
    }

    initGameVariables(spriteSheet, canvas, tileset, sounds) {

        const data = {
            spriteSheet,
            canvas,
            viewport: {
                width: CANVAS_WIDTH,
                height: CANVAS_HEIGHT,
                vX: 0,
                vY: 0,
            },
            animationFrame: 0,
            mapBuilder: new MapBuilder(levelOne, tileset, spriteSheet),
            entities: {},
            sounds,
            userControl: true,
            resetting: false,
            reset: () => data.resetting = true
        };

        data.entities.mario = new Mario(spriteSheet, 175, 0, 16, 16);
        data.entities.score = new Score(270, 15);
        data.entities.coins = [];
        data.entities.mushrooms = [];
        data.entities.goombas = [];
        data.entities.koopas = [];

        // Carga los enemigos
        levelOne.koopas.forEach((koopa) => {
            data.entities.koopas.push(
                new Koopa(spriteSheet, koopa[0], koopa[1], koopa[2], koopa[3]));
        });

        levelOne.goombas.forEach((goomba) => {
            data.entities.goombas.push(
                new Goomba(spriteSheet, goomba[0], goomba[1], goomba[2], goomba[3]));
        });

        render.init(data);

        data.sounds.backgroundMusic.currentTime = 0;
        data.sounds.backgroundMusic.play();

        return data;
    }

    startGame() {

        const canvasEl = document.getElementById('game-canvas');
        const ctx = canvasEl.getContext('2d');
        ctx.scale(3, 3);

        const canvas = {
            canvas: canvasEl,
            ctx,
        };

        const sounds = {
            backgroundMusic: document.getElementById('background_music'),
            breakSound: new Audio('./audio/sounds/break_block.wav'),
            levelFinish: new Audio('./audio/music/level_complete.mp3'),
        };

        const spriteSheet = new Image();
        spriteSheet.src = './sprites/spritesheet.png';

        const tileset = new Image();
        tileset.src = './sprites/tileset_gutter.png';

        spriteSheet.addEventListener('load', () => {

            let data = this.initGameVariables(spriteSheet, canvas, tileset, sounds);
            let predictWaitCounter = 0;

            // Bucle principal del juego
            const loop = () => {

                requestAnimationFrame(loop);

                render.update(data, CANVAS_WIDTH, CANVAS_HEIGHT);
            };

            requestAnimationFrame(loop);

            setInterval(async () => {
                if (data.resetting) {
                    data = this.initGameVariables(spriteSheet, canvas, tileset, sounds);
                } else {

                    if(this.state.controlsDialogOpened) return;

                    if (this.props.predictionFunc) {
                        predictWaitCounter++;
                        if (predictWaitCounter >= PREDICT_WAIT_FRAMES) {
                            predictWaitCounter = 0;
                            await this.props.predictionFunc();
                        }
                    }

                    input.update(data);
                    animation.update(data);
                    movement.update(data);
                    physics.update(data);

                    render.updateView(data);
                    render.update(data, CANVAS_WIDTH, CANVAS_HEIGHT);

                    data.animationFrame += 1;
                }
            }, 1000 / FPS);
        });
    }

    componentDidMount() {
        this.startGame();
    }

    showControls() {
        this.setState({ controlsDialogOpened: true });
    }

    hideControls() {
        this.setState({ controlsDialogOpened: false });
    }

    render() {
        const { classes, modelType } = this.props;
        const { controlsDialogOpened } = this.state;

        return (
            <div>
                <canvas id="game-canvas" width={CANVAS_WIDTH} height={CANVAS_HEIGHT}></canvas>
                <audio id="background_music" loop>
                    <source src="./audio/music/mario_theme.mp3" type="audio/mp3" />
                </audio>

                {modelType === "entrenado" &&
                    <>
                        <IconButton className={classes.controlsButton} onClick={() => this.showControls()}>
                            <VideogameAsset />
                        </IconButton>

                        <Dialog onClose={() => this.hideControls()} open={controlsDialogOpened}>
                            <DialogTitle onClose={() => this.hideControls()}>
                                Controles del juego
                            </DialogTitle>
                            <DialogContent dividers>
                                <img src="/controls.png" alt="Controles"></img>
                            </DialogContent>
                        </Dialog>
                    </>
                }
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        modelType: state.DataReducer.modelType,
        predictionFunc: state.DataReducer.predictionFunc
    };
};

export default connect(mapStateToProps)(withStyles(styles)(Game));
