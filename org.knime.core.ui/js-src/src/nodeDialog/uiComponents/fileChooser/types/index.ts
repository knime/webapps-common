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
};

export type BackendType = "local" | "relativeToCurrentHubSpace";
