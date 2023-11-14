import type { KnimeService } from "@knime/ui-extension-service";
import type TableViewViewSettings from "./ViewSettings";

export interface DataType {
  name: string;
  renderers: { name: string; id: string }[];
}

export interface PageParams {
  currentRowCount: number;
  totalRowCount?: number;
  currentPage: number;
  columnCount: number;
}

export interface ImageDimension {
  widthInPx: number;
  heightInPx: number;
}

export type ColumnSizes = Record<string | symbol, number>;

export interface TableViewDisplayProps {
  settings: TableViewViewSettings;
  rows: {
    loaded: boolean;
    top: any[][];
    bottom?: any[][];
    numRowsAbove?: number;
    numRowsBelow?: number;
  };
  header: {
    displayedColumns: string[];
    columnFiltersMap?: Map<string | symbol, any>;
    columnContentTypes: ("txt" | "img_path" | "html")[];
    dataTypes: Record<string, DataType>;
    columnDataTypeIds: string[];
    colNameSelectedRendererId?: Record<string, string>;
    columnFormatterDescriptions?: (string | null)[];
    indicateRemainingColumnsSkipped: boolean;
  };
  selection?: {
    top: boolean[];
    bottom: boolean[];
    totalSelected: boolean;
  };
  page: PageParams;
  sorting?: {
    columnSortIndex: number;
    columnSortDirection: number;
  };
  globalSearchQuery: string;
  enableVirtualScrolling: boolean;
  enableCellSelection: boolean;
  enableColumnResizing: boolean;
  enableRowResizing: boolean;
  currentRowHeight: number;
  includeImageResources: boolean;
  knimeService: KnimeService;
  forceHideTableSizes?: boolean;
  firstRowImageDimensions: Record<string, ImageDimension>;
  settingsItems?: object[];
  enableDynamicRowHeight?: boolean;
}
