import type { Ref } from "vue";
import type { BackendType, FolderAndError, PathAndError } from "./types";
import inject from "@/nodeDialog/utils/inject";

interface ListItemsConfig {
  /**
   * the endings with respect to which the files are filtered. If empty or null, no filters
   * will be applied.
   */
  extensions: string[] | null;
  /**
   * Setting this will impact whether non-readable or non-writable files are not displayed
   */
  isWriter: boolean;
}

type ListItems = (params: {
  method: "fileChooser.listItems";
  options: [
    /**
     * The id of the used file system.
     */
    BackendType,
    /**
     * The current path or null to reference the root level
     */
    string | null,
    /**
     * The name of the to be accessed folder relative to the path or ".." if the parent folder
     * should be accessed. Set to null in order to access the path directly.
     */
    string | null,
    /**
     *  additional configuration for the filters applied to the listed files
     */
    ListItemsConfig,
  ];
}) => Promise<FolderAndError>;

type GetFilePath = (params: {
  method: "fileChooser.getFilePath";
  options: [
    /**
     * The id of the used file system.
     */
    BackendType,
    /**
     * The path of the folder containing the file.
     */
    string | null,
    /**
     * The name of the to be accessed file relative to the path.
     */
    string,
    /**
     * A file extension that is added to the filename whenever it does not already exist or end with the extension.
     */
    string | null,
  ];
}) => Promise<PathAndError>;

export default ({
  filteredExtensions,
  appendedExtension,
  isWriter,
  backendType,
}: {
  /**
   * The extensions by which files listed in a folder are filtered
   */
  filteredExtensions: Ref<string[]>;
  /**
   * The extension to append when selecting a file.
   * Only appended if the file does not already exist or end with the extension.
   */
  appendedExtension: Ref<string | null>;
  isWriter: Ref<boolean>;
  backendType: Ref<BackendType>;
}) => {
  const getData = inject("getData") as GetFilePath & ListItems;

  const listItems = (path: string | null, nextFolder: string | null) => {
    return getData({
      method: "fileChooser.listItems",
      options: [
        backendType.value,
        path,
        nextFolder,
        {
          extensions: filteredExtensions.value,
          isWriter: isWriter.value,
        },
      ],
    });
  };
  const getFilePath = (path: string | null, fileName: string) => {
    return getData({
      method: "fileChooser.getFilePath",
      options: [backendType.value, path, fileName, appendedExtension?.value],
    });
  };

  return {
    listItems,
    getFilePath,
  };
};
