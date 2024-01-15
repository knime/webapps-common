import {} from "src/types";
import {
  SelectionEventCallbackParams,
  SelectionService,
} from "./SelectionService";

/**
 * A SelectionService which persists the current selection.
 */
export class CachingSelectionService extends SelectionService {
  private cachedSelection: Set<string>;

  constructor(baseService?: typeof SelectionService.prototype.baseService) {
    super(baseService);
    this.cachedSelection = new Set();
    this.addOnSelectionChangeCallback(this.addBackendSelection.bind(this));
  }

  private addBackendSelection({
    mode,
    selection,
  }: SelectionEventCallbackParams) {
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

  async initialSelection(): Promise<any> {
    const initialSelection = await super.initialSelection();
    if (initialSelection) {
      this.cachedSelection = new Set(initialSelection as string[]);
    }
    return Promise.resolve(initialSelection);
  }

  add(selection: string[]): Promise<any> {
    this.addToChache(selection);
    return super.add(selection);
  }

  private addToChache(selection: string[]) {
    selection.forEach((selectedKey) => {
      this.cachedSelection.add(selectedKey);
    });
  }

  remove(selection: string[]): Promise<any> {
    this.removeFromCache(selection);
    return super.remove(selection);
  }

  private removeFromCache(selection: string[]) {
    selection.forEach((selectedKey) => {
      this.cachedSelection.delete(selectedKey);
    });
  }

  replace(selection: string[]): Promise<any> {
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
