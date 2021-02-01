import React, { Component } from "react";
import CamDetector from "./CamDetector";

/* Game imports */
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


class Game extends Component {
    reset() {
        //TODO Recargar el juego
    }

    updateView(data) {
        const viewport = data.viewport;
        const margin = viewport.width / 6;
        const center = {
          x: data.entities.mario.xPos + (data.entities.mario.width * 0.5),
          y: data.entities.mario.yPos + (data.entities.mario.height * 0.5),
        };
    
        if (center.x < viewport.vX + (margin * 2)) {
          viewport.vX = Math.max(center.x - margin, 0);
        } else if (center.x > (viewport.vX + viewport.width) - (margin * 2)) {
          viewport.vX = Math.min((center.x + margin) - viewport.width, 3400 - viewport.width);
        }
    }

    run(data) {
        const loop = () => {
          input.update(data);
          animation.update(data);
          movement.update(data);
          physics.update(data);
    
          this.updateView(data);
          render.update(data);
    
          data.animationFrame += 1;
          requestAnimationFrame(loop);
        };
    
        loop();
    }

    componentDidMount(){
        const canvasEl = document.getElementById('game-canvas');
        const ctx = canvasEl.getContext('2d');
        ctx.scale(3, 3);
    
        const canvas = {
          canvas: canvasEl,
          ctx,
        };
    
        const viewport = {
          width: 760,
          height: 600,
          vX: 0,
          vY: 0,
        };
    
        const backgroundMusic = document.getElementById('background_music');
            
        const spriteSheet = new Image();
        spriteSheet.src = './sprites/spritesheet.png';
    
        const tileset = new Image();
        tileset.src = './sprites/tileset_gutter.png';
    
        spriteSheet.addEventListener('load', () => {
          const data = {
            spriteSheet,
            canvas,
            viewport,
            animationFrame: 0,
            mapBuilder: new MapBuilder(levelOne, tileset, spriteSheet),
            entities: {},
            sounds: {
              backgroundMusic,
              breakSound: new Audio('./audio/sounds/break_block.wav'),
              levelFinish: new Audio('./audio/music/level_complete.mp3'),
            },
            userControl: true,
            reset: this.reset,
          };
    
          const mario = new Mario(spriteSheet, 175, 0, 16, 16);
          const score = new Score(270, 15);
    
          input.init(data);
          data.entities.mario = mario;
          data.entities.score = score;
          data.entities.coins = [];
          data.entities.mushrooms = [];
          data.entities.goombas = [];
          data.entities.koopas = [];
    
          // Load enemies from map
          levelOne.koopas.forEach((koopa) => {
            data.entities.koopas.push(
              new Koopa(spriteSheet, koopa[0], koopa[1], koopa[2], koopa[3]));
          });
    
          levelOne.goombas.forEach((goomba) => {
            data.entities.goombas.push(
              new Goomba(spriteSheet, goomba[0], goomba[1], goomba[2], goomba[3]));
          });
    
          render.init(data);
          this.run(data);
        });
    }
    render() {
        const {model, classifier} = this.props;
        return (
            <div>
                <CamDetector model={model} classifier={classifier}/>
                <canvas id="game-canvas" width="760" height="600"></canvas>
                <audio id="background_music" autoPlay loop>
                <source src="./audio/music/mario_theme.mp3" type="audio/mp3" />
                </audio>
            </div>
        )
    }
}

export default Game;