import React, { Component } from "react";

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

const CANVAS_WIDTH = 760;
const CANVAS_HEIGHT = 600;

class Game extends Component {

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

            // Bucle principal del juego
            const loop = () => {

                if (data.resetting) {
                    data = this.initGameVariables(spriteSheet, canvas, tileset, sounds);
                } else {
                    input.update(data);
                    animation.update(data);
                    movement.update(data);
                    physics.update(data);

                    render.updateView(data);
                    render.update(data, CANVAS_WIDTH, CANVAS_HEIGHT);

                    data.animationFrame += 1;
                }

                requestAnimationFrame(loop);
            };

            requestAnimationFrame(loop);
        });
    }

    componentDidMount() {
        this.startGame();
    }

    render() {
        return (
            <div>
                <canvas id="game-canvas" width={CANVAS_WIDTH} height={CANVAS_HEIGHT}></canvas>
                <audio id="background_music" loop>
                    <source src="./audio/music/mario_theme.mp3" type="audio/mp3" />
                </audio>
            </div>
        )
    }
}

export default Game;
