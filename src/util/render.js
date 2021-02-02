const render = {
    init(data) {
        data.entities.scenery = [];
        data.mapBuilder.create(data);
    },

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
    },

    update(data, width, height) {
        data.canvas.ctx.clearRect(0, 0, width, height);
        data.canvas.ctx.fillStyle = '#63adff';
        data.canvas.ctx.fillRect(0, 0, width, height);

        data.mapBuilder.renderMap(data);

        data.entities.coins.forEach((coin) => {
            this.drawEntity(coin, data);
        });

        data.entities.mushrooms.forEach((mushroom) => {
            this.drawEntity(mushroom, data);
        });

        data.entities.goombas.forEach((goomba) => {
            this.drawEntity(goomba, data);
        });

        data.entities.koopas.forEach((koopa) => {
            this.drawEntity(koopa, data);
        });

        this.drawText(data);
        this.drawEntity(data.entities.mario, data);
    },

    drawEntity(entity, data) {

        // Si está en el viewport...
        if (((entity.xPos + entity.width >= data.viewport.vX &&
            entity.xPos + entity.width <= data.viewport.vX + data.viewport.width)) &&
            ((entity.yPos + entity.height >= data.viewport.vY &&
                entity.yPos + entity.height <= data.viewport.vY + data.viewport.height))) {
            data.canvas.ctx.drawImage(
                entity.sprite.img,
                entity.sprite.srcX, entity.sprite.srcY,
                entity.sprite.srcW, entity.sprite.srcH,
                entity.xPos - data.viewport.vX, entity.yPos - data.viewport.vY,
                entity.width, entity.height,
            );
        }
    },

    // Dibuja el score
    drawText(data) {
        const text = data.entities.score;

        data.canvas.ctx.font = `${text.size} ${text.font}`;
        data.canvas.ctx.fillStyle = text.color;
        data.canvas.ctx.fillText(
            `Score: ${text.value}`, text.xPos - (data.viewport.width / 3), text.yPos,
        );
    },
};

export { render as default };
