const {calc_image_pos} = require('./dom');

const draw_label = (ctx, settings) => {
    let mSize = settings.mSize;
    let mPosX = settings.mPosX;
    let mPosY = settings.mPosY;
    let arrayPos = 0;
    if (settings.mode === "imagelabel") {
        arrayPos = 1;
    }
    if (Array.isArray(settings.mSize)) {
        mSize = settings.mSize[arrayPos];
    }
    if (Array.isArray(settings.mPosX)) {
        mPosX = settings.mPosX[arrayPos];
    }
    if (Array.isArray(settings.mPosY)) {
        mPosY = settings.mPosY[arrayPos];
    }

    const size = settings.size;
    const font = 'bold ' + mSize * 0.01 * size + 'px ' + settings.fontname;

    ctx.strokeStyle = settings.back;
    ctx.lineWidth = mSize * 0.01 * size * 0.1;
    ctx.fillStyle = settings.fontcolor;
    ctx.font = font;

    const w = ctx.measureText(settings.label).width;
    const sh = mSize * 0.01;
    const sw = w / size;
    const sl = (1 - sw) * mPosX * 0.01;
    const st = (1 - sh) * mPosY * 0.01;
    const x = sl * size;
    const y = st * size + 0.75 * mSize * 0.01 * size;

    ctx.strokeText(settings.label, x, y);
    ctx.fillText(settings.label, x, y);
};

const draw_image = (ctx, settings) => {
    const imagePos = calc_image_pos(settings);
    if (settings.imageAsCode) {
        ctx.drawImage(settings.image, 0, 0, settings.size, settings.size);
    } else {
        ctx.drawImage(settings.image, imagePos.x, imagePos.y, imagePos.iw, imagePos.ih);
    }
};

const draw_mode = (ctx, settings) => {
    const mode = settings.mode;
    if (mode === 'label') {
        draw_label(ctx, settings);
    } else if (mode === 'image') {
        draw_image(ctx, settings);
    } else if (mode === 'labelimage') {
        draw_label(ctx, settings);
        draw_image(ctx, settings);
    } else if (mode === 'imagelabel') {
        draw_image(ctx, settings);
        draw_label(ctx, settings);
    }
};

module.exports = draw_mode;
