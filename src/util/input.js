const input = {
    down: {},
    pressed: {},

    update(data) {
        const mario = data.entities.mario;

        if (data.userControl) {

            // Movimiento a la izquierda
            if (this.isDown(37) || this.isDown(65)) {
                if (mario.velY === 1.2) {
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
            if (this.isDown(39) || this.isDown(68)) {
                if (mario.velY === 1.2) {
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
            if (this.isPressed(38) || this.isPressed(32) || this.isPressed(87)) {
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
