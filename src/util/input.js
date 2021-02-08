import { GRAVITY } from "./physics";
import store from "../redux/store";

const input = {
    down: {},
    pressed: {},

    update(data) {
        const mario = data.entities.mario;
        
        if (data.userControl) {
            const prediction = store.getState().DataReducer.prediction;
            
            // Movimiento a la izquierda
            if (prediction === "back") {
                if (mario.velY === GRAVITY) {
                    if (mario.bigMario) {
                        mario.currentState = mario.states.bigWalking;
                    } else {
                        mario.currentState = mario.states.walking;
                    }
                } else {
                    mario.xPos -= mario.velX;
                }
                mario.direction = 'left';
            }
            // Movimiento a la derecha
            if (prediction === "forward") {
                if (mario.velY === GRAVITY) {
                    if (mario.bigMario) {
                        mario.currentState = mario.states.bigWalking;
                    } else {
                        mario.currentState = mario.states.walking;
                    }
                } else {
                    mario.xPos += mario.velX;
                }
                mario.direction = 'right';
            }
            // Salto
            if (prediction === "jump") {
                if (mario.bigMario) {
                    mario.currentState = mario.states.bigJumping;
                } else {
                    mario.currentState = mario.states.jumping;
                }
            }
        } else {
            mario.currentState = mario.states.dead;
        }
    },

    // TODO Eliminar al integrar con mobilenet
    isDown(code) {
        return this.down[code];
    },

    isPressed(code) {
        if (this.pressed[code]) {
            return false;
        } else if (this.down[code]) {
            this.pressed[code] = true;
            return this.pressed[code];
        }
    },
};

export { input as default };
