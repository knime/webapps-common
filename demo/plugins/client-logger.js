import c from 'consola';

if (!process.server) {
    window.consola = c.create();
}
