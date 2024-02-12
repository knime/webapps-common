import type { Ref } from "vue";
import type { BackendType, FolderAndError } from "./types";
import inject from "@/nodeDialog/utils/inject";

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
     * the endings with respect to which the files are filtered. If empty or null, no filters
     * will be applied.
     */
    string[] | null,
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
  ];
}) => Promise<string>;

export default (
  props: {
    filteredExtensions?: Ref<string[]>;
    backendType: Ref<BackendType>;
  } = {},
) => {
  const getData = inject("getData") as GetFilePath & ListItems;

  const listItems = (path: string | null, nextFolder: string | null) => {
    return getData({
      method: "fileChooser.listItems",
      options: [
        props.backendType.value,
        path,
        nextFolder,
        props.filteredExtensions?.value ?? null,
      ],
    });
  };
  const getFilePath = (path: string | null, fileName: string) => {
    return getData({
      method: "fileChooser.getFilePath",
      options: [backendType.value, path, fileName],
    });
  };

  return {
    listItems,
    getFilePath,
  };
};
