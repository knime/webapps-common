import CreateLinkModal from "./components/CreateLinkModal.vue";
import RichTextEditor from "./components/RichTextEditor.vue";
import RichTextEditorToolbar from "./components/RichTextEditorToolbar.vue";
import createOnEscapeExtension from "./utils/createOnEscapeExtension";
import {
  type LinkToolOptions,
  defaultLinkToolOptions,
} from "./utils/custom-link";
export {
  RichTextEditor,
  RichTextEditorToolbar,
  createOnEscapeExtension,
  CreateLinkModal,
};

export { type LinkToolOptions, defaultLinkToolOptions };

export * from "./types";
