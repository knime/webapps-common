import c from 'consola';

export default function () {
    global.consola = c.create({
        level: 5
    });
}
