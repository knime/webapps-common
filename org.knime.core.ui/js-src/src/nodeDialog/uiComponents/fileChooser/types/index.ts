export interface Item {
  isDirectory: boolean;
  /**
   * null in case of root directory
   */
  name: string;
}

export interface Folder {
  items: Item[];
  path: string | null;
}

export type FolderAndError = {
  folder: Folder;
  errorMessage?: string;
  filePathRelativeToFolder: string;
};

export type PathAndError =
  | {
      path: string;
      errorMessage: null;
    }
  | {
      path: null;
      errorMessage: string;
    };

export type BackendType =
  | "local"
  | "relativeToCurrentHubSpace"
  | "embedded"
  | `connected${number}`;
