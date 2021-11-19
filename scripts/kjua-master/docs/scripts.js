/* eslint-disable func-names,no-var,prefer-reflect,prefer-arrow-callback */
(function () {
    var win = window; // eslint-disable-line no-undef
    var FR = win.FileReader;
    var doc = win.document;
    var kjua = win.kjua;

    var gui_val_pairs = [
        ['size', 'px'],
        ['minversion', ''],
        ['quiet', ' modules'],
        ['rounded', '%'],
        ['msize', '%'],
        ['mposx', '%'],
        ['mposy', '%'],
        ['msize2', '%'],
        ['mposx2', '%'],
        ['mposy2', '%']
    ];

    function el_by_id(id) {
        return doc.getElementById(id);
    }

    function val_by_id(id) {
        var el = el_by_id(id);
        return el && el.value;
    }

    function checked_by_id(id) {
        var el = el_by_id(id);
        return el && el.checked;
    }

    function int_by_id(id) {
        return parseInt(val_by_id(id), 10);
    }

    function on_event(el, type, fn) {
        el.addEventListener(type, fn);
    }

    function on_ready(fn) {
        on_event(doc, 'DOMContentLoaded', fn);
    }

    function for_each(list, fn) {
        Array.prototype.forEach.call(list, fn);
    }

    function all(query, fn) {
        var els = doc.querySelectorAll(query);
        if (fn) {
            for_each(els, fn);
        }
        return els;
    }

    function update_gui() {
        gui_val_pairs.forEach(function (pair) {
            var label = all('label[for="' + pair[0] + '"]')[0];
            var text = label.innerHTML;
            label.innerHTML = text.replace(/:.*$/, ': ' + val_by_id(pair[0]) + pair[1]);
        });
    }

    function update_qrcode() {
        let image = val_by_id('image-text');
        if (image === "") {
            image = el_by_id('img-buffer');
        }
        let mode = val_by_id('mode');
        let mSize = int_by_id('msize');
        let mPosX = int_by_id('mposx');
        let mPosY = int_by_id('mposy');
        if (mode === "labelimage" || mode === "imagelabel") {
            mSize = [int_by_id('msize'), int_by_id('msize2')];
            mPosX = [int_by_id('mposx'), int_by_id('mposx2')];
            mPosY = [int_by_id('mposy'), int_by_id('mposy2')];
            document.getElementById("pos2").style.display = "";
        } else {
            document.getElementById("pos2").style.display = "none";
        }

        var options = {
            render: val_by_id('render'),
            crisp: val_by_id('crisp') === 'true',
            ecLevel: val_by_id('eclevel'),
            minVersion: int_by_id('minversion'),

            fill: val_by_id('fill'),
            back: val_by_id('back'),

            text: val_by_id('text'),
            size: int_by_id('size'),
            rounded: int_by_id('rounded'),
            quiet: int_by_id('quiet'),

            mode,

            mSize,
            mPosX,
            mPosY,

            label: val_by_id('label'),
            fontname: val_by_id('font'),
            fontoutline: checked_by_id('fontoutline'),
            fontcolor: val_by_id('fontcolor'),

            imageAsCode: checked_by_id('image-as-code'),

            image
        };

        var container = el_by_id('container');
        var qrcode = kjua(options);
        container.innerHTML = "";
        if (!!qrcode) {
            container.appendChild(qrcode);
        }
    }

    function update() {
        update_gui();
        update_qrcode();
    }

    function on_img_input() {
        var input = el_by_id('image');
        if (input.files && input.files[0]) {
            var reader = new FR();
            reader.onload = function (ev) {
                el_by_id('img-buffer').setAttribute('src', ev.target.result);
                el_by_id('mode').value = 4;
                setTimeout(update, 250);
            };
            reader.readAsDataURL(input.files[0]);
        }
    }

    on_ready(function () {
        on_event(el_by_id('image'), 'change', on_img_input);
        all('input, textarea, select', function (el) {
            on_event(el, 'input', update);
            on_event(el, 'change', update);
        });
        on_event(win, 'load', update);
        update();
    });
}());
/* eslint-enable */
