import RichTextEditor from "./components/RichTextEditor.vue";
import RichTextEditorToolbar from "./components/RichTextEditorToolbar.vue";
import CreateLinkModal from "./components/CreateLinkModal.vue";
import createOnEscapeExtension from "./utils/createOnEscapeExtension";
export {
  RichTextEditor,
  RichTextEditorToolbar,
  createOnEscapeExtension,
  CreateLinkModal,
};

import {
  type LinkToolOptions,
  defaultLinkToolOptions,
} from "./utils/custom-link";
export { type LinkToolOptions, defaultLinkToolOptions };

export * from "./types";
