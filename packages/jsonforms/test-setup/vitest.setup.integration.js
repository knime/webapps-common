import * as Vue from "vue";
import consola from "consola";

// @ts-expect-error migrated from ts-ignore to es-expect-error TODO: explain why error is expected
window.global.consola = consola;

window.Vue = Vue;
