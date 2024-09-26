export interface Item {
  isDirectory: boolean;
  /**
   * null in case of root directory
   */
  name: string;
}

export type ParentFolder =
  | {
      name: string | null; // can be null in case of root directory
      path: string;
    }
  // dummy directory containing all roots
  | {
      name: null;
      path: null;
    };

export interface Folder {
  items: Item[];
  path: string | null;
  parentFolders: ParentFolder[];
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
