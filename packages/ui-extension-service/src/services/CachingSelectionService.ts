import type {
  SelectionParams,
  UIExtensionService,
} from "@knime/ui-extension-renderer/api";

import { SelectionService } from "./SelectionService";
import type { SelectionServiceAPILayer } from "./types/serviceApiLayers";

/**
 * A SelectionService which persists the current selection.
 */
export class CachingSelectionService extends SelectionService {
  private cachedSelection: Set<string>;

  constructor(baseService: UIExtensionService<SelectionServiceAPILayer>) {
    super(baseService);
    this.cachedSelection = new Set();
    this.addOnSelectionChangeCallback(this.addBackendSelection.bind(this));
  }

  private addBackendSelection({ mode, selection = [] }: SelectionParams) {
    switch (mode) {
      case "ADD":
        this.addToChache(selection);
        break;
      case "REPLACE":
        this.replaceCache(selection);
        break;
      case "REMOVE":
        this.removeFromCache(selection);
    }
  }

  async initialSelection(): Promise<unknown> {
    const initialSelection = await super.initialSelection();
    if (initialSelection) {
      this.cachedSelection = new Set(initialSelection as string[]);
    }
    return Promise.resolve(initialSelection);
  }

  add(selection: string[]): Promise<unknown> {
    this.addToChache(selection);
    return super.add(selection);
  }

  private addToChache(selection: string[]) {
    selection.forEach((selectedKey) => {
      this.cachedSelection.add(selectedKey);
    });
  }

  remove(selection: string[]): Promise<unknown> {
    this.removeFromCache(selection);
    return super.remove(selection);
  }

  private removeFromCache(selection: string[]) {
    selection.forEach((selectedKey) => {
      this.cachedSelection.delete(selectedKey);
    });
  }

  replace(selection: string[]): Promise<unknown> {
    this.replaceCache(selection);
    return super.replace(selection);
  }

  private replaceCache(selection: string[]) {
    this.cachedSelection = new Set(selection);
  }

  getCachedSelection() {
    return this.cachedSelection;
  }
}
