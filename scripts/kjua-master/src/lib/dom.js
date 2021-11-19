const win = window; // eslint-disable-line no-undef
const doc = win.document;
const dpr = win.devicePixelRatio || 1;

const SVG_NS = 'http://www.w3.org/2000/svg';

const get_attr = (el, key) => el.getAttribute(key);
const set_attrs = (el, obj) => {
    Object.keys(obj || {}).forEach(key => {
        el.setAttribute(key, obj[key]);
    });
    return el;
};

const create_el = (name, obj) => set_attrs(doc.createElement(name), obj);
const create_svg_el = (name, obj) => set_attrs(doc.createElementNS(SVG_NS, name), obj);

const create_canvas = (size, ratio) => {
    const canvas = create_el('canvas', {
        width: size * ratio,
        height: size * ratio
    });
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    return canvas;
};

const canvas_to_img = (canvas, elementId) => {
    const img = create_el('img', {
        crossOrigin: 'anonymous',
        src: canvas.toDataURL('image/png'),
        width: get_attr(canvas, 'width'),
        height: get_attr(canvas, 'height'),
        id: elementId
    });
    img.style.width = canvas.style.width;
    img.style.height = canvas.style.height;
    return img;
};

const calc_image_pos = (settings) => {
    let mSize = settings.mSize;
    let mPosX = settings.mPosX;
    let mPosY = settings.mPosY;
    let arrayPos = 0;
    if (settings.mode === "labelimage") {
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
    const w = settings.image.naturalWidth || 1;
    const h = settings.image.naturalHeight || 1;
    const sh = mSize * 0.01;
    const sw = sh * w / h;
    const sl = (1 - sw) * mPosX * 0.01;
    const st = (1 - sh) * mPosY * 0.01;
    const x = sl * size;
    const y = st * size;
    const iw = sw * size;
    const ih = sh * size;
    return {x, y, iw, ih};
};

module.exports = {
    dpr,
    SVG_NS,
    get_attr,
    create_el,
    create_svg_el,
    create_canvas,
    canvas_to_img,
    calc_image_pos
};
