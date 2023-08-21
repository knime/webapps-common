require("consola");
import { vi } from "vitest";

import * as Vue from "vue";
window.Vue = Vue;

vi.mock("@knime/ui-extension-service");
