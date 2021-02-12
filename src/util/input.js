import { GRAVITY } from "./physics";
import store from "../redux/store";

const input = {
    down: {},
    pressed: {},

    update(data) {
        const mario = data.entities.mario;

        if (data.userControl) {
            const dataReducer = store.getState().DataReducer;

            let prediction = dataReducer.prediction;
            const predictionProb = dataReducer.predictionProb;
            if(prediction === "jump") {
                if(mario.direction === "right") prediction = "forward_jump";
                else prediction = "back_jump";
            }

            // Movimiento a la izquierda
            if ((prediction === "back" || prediction === "back_jump") && predictionProb > 0.7) {
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
            else if ((prediction === "forward" || prediction === "forward_jump") && predictionProb > 0.7) {
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
            if ((prediction === "forward_jump" || prediction === "back_jump") && predictionProb > 0.7) {
                if (mario.onFloor) {
                    if (mario.bigMario) {
                        mario.currentState = mario.states.bigJumping;
                    } else {
                        mario.currentState = mario.states.jumping;
                    }
                }
            }
        } else {
            mario.currentState = mario.states.dead;
        }
    },
};

export { input as default };
