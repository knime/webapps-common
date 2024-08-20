import RichTextEditor from "./components/RichTextEditor.vue";
import RichTextEditorToolbar from "./components/RichTextEditorToolbar.vue";
import createOnEscapeExtension from "./utils/createOnEscapeExtension";
export { RichTextEditor, RichTextEditorToolbar, createOnEscapeExtension };

import {
  type LinkToolOptions,
  defaultLinkToolOptions,
} from "./utils/custom-link";
export { type LinkToolOptions, defaultLinkToolOptions };

export * from "./types";
