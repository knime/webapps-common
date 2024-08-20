import { Plugin, PluginKey } from "@tiptap/pm/state";
import { getAttributes } from "@tiptap/core";
import Link from "@tiptap/extension-link";

import { navigatorUtils } from "@knime/utils";

const buildUrlRegex = () => {
  const httpPrefixCheck = "(http://www\\.|https://www\\.|http://|https://)";

  const urlCheck =
    "[a-z0-9]+([-.]{1}[a-z0-9]+)*\\.[a-z]{2,5}(:[0-9]{1,5})?(/.*)?";

  return new RegExp(`^${httpPrefixCheck}?${urlCheck}$`);
};

const URL_REGEX = buildUrlRegex();

export const validateURL = (href: string) => URL_REGEX.test(href);

export type LinkToolOptions = {
  /**
   * Custom function that can be supplied to validate urls added with the link tool
   * @param url The url of the link to be added
   */
  urlValidator: (url: string) => boolean;
  /**
   * Custom function that can, e.g., be used to append a protocol like https:// to a url if not present
   * @param url The url of the link to be added
   */
  sanitizeUrlText: (url: string) => string;
};

export const defaultLinkToolOptions: LinkToolOptions = {
  urlValidator: validateURL,
  sanitizeUrlText: (urlText: string) => {
    const containsHttp = ["http://", "https://"].some((protocol) =>
      urlText.includes(protocol),
    );
    return containsHttp ? urlText : `https://${urlText}`;
  },
};

export const CustomLink = Link.extend({
  addOptions() {
    return {
      ...this.parent?.(),
      openOnClick: false,
    };
  },

  addAttributes() {
    const modifier = navigatorUtils.isMac() ? "⌘" : "Ctrl +";

    return {
      ...this.parent?.(),

      draggable: {
        default: "false",
      },

      title: {
        default: `Use "${modifier} click" to follow link`,
      },
    };
  },

  addProseMirrorPlugins() {
    const plugins: Plugin[] = this.parent?.() || [];

    const ctrlClickHandler = new Plugin({
      key: new PluginKey("handleControlClick"),
      props: {
        handleClick(view, _pos, event) {
          const attrs = getAttributes(view.state, "link");
          const link = (event.target as HTMLElement)?.closest("a");

          const metaOrCtrlKeyPressed = event[navigatorUtils.getMetaOrCtrlKey()];

          if (metaOrCtrlKeyPressed && link && attrs.href) {
            window.open(attrs.href, attrs.target);

            return true;
          }

          return false;
        },
      },
    });

    plugins.push(ctrlClickHandler);

    return plugins;
  },
});
