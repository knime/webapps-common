import type { ComputedRef } from "vue";

import DownloadIcon from "@knime/styles/img/icons/cloud-download.svg";

import type { RepositoryItem } from "../../../api/types";
import { globalContext } from "../../context";
import type { HubFileExplorerItem, MenuItemWithHandler } from "../../types";

const downloadBlacklist = ["Component", "WorkflowTemplate"];

const isDownloadable = (item: RepositoryItem) => {
  return !downloadBlacklist.includes(item.type);
};

type Options = {
  items: ComputedRef<HubFileExplorerItem[]>;
};

export const useDownloadFeature = (options: Options) => {
  const download = async () => {
    for (const item of options.items.value) {
      if (!isDownloadable(item.meta!.repositoryItem)) {
        continue;
      }

      await globalContext.downloadProvider().startDownload(item);
    }
  };

  const toMenuItem = (): MenuItemWithHandler => {
    return {
      id: "download",
      text: "Download",
      icon: DownloadIcon,
      metadata: {
        handler: download,
      },
    };
  };

  return { toMenuItem, isDownloadable };
};
