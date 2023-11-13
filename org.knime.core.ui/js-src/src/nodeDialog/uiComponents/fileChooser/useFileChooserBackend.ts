import type { FolderAndError } from "./types";
import { injectJsonDataService } from "@/nodeDialog/utils/inject";

type ListItems = (params: {
  method: "fileChooser.listItems";
  options: [
    /**
     * The id of the used file system.
     */
    "local",
    /**
     * The current path or null to reference the root level
     */
    string | null,
    /**
     * The name of the to be accessed folder relative to the path or ".." if the parent folder
     * should be accessed. Set to null in order to access the path directly.
     */
    string | null,
  ];
}) => Promise<FolderAndError>;

type GetFilePath = (params: {
  method: "fileChooser.getFilePath";
  options: [
    /**
     * The id of the used file system.
     */
    "local",
    /**
     * The path of the folder containing the file.
     */
    string | null,
    /**
     * The name of the to be accessed file relative to the path.
     */
    string,
  ];
}) => Promise<string>;

export default () => {
  let jsonDataService: { data: GetFilePath & ListItems } | null = null;
  const getDataService = () => {
    if (jsonDataService === null) {
      jsonDataService = injectJsonDataService();
    }
    return jsonDataService;
  };

  const listItems = (path: string | null, nextFolder: string | null) => {
    return getDataService().data({
      method: "fileChooser.listItems",
      options: ["local", path, nextFolder],
    });
  };
  const getFilePath = (path: string | null, fileName: string) => {
    return getDataService().data({
      method: "fileChooser.getFilePath",
      options: ["local", path, fileName],
    });
  };

  return {
    listItems,
    getFilePath,
  };
};
