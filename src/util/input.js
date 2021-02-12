import { GRAVITY } from "./physics";
//import store from "../redux/store";

const input = {
    down: {},
    pressed: {},

    update(data) {
        const mario = data.entities.mario;
        
        if (data.userControl) {
            //const prediction = store.getState().DataReducer.prediction;
            
            // Movimiento a la izquierda
            if (0) {
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
            if (1) {
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
            if (0) {
                if(mario.currentState !== mario.states.jumping && mario.currentState !== mario.states.bigJumping) {
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
