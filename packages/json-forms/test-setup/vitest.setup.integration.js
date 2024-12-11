import { vi } from "vitest";
import * as Vue from "vue";
import consola from "consola";

// @ts-ignore
window.global.consola = consola;

window.Vue = Vue;

vi.mock("@knime/ui-extension-service");
vi.mock("@knime/ui-extension-service/internal");
