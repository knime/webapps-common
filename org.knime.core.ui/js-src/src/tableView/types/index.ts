import type { UIExtensionService } from "@knime/ui-extension-service";
import type TableViewViewSettings from "./ViewSettings";
import type { MenuItem } from "@knime/components";
import { FilterConfig } from "@knime/knime-ui-table";

export interface DataType {
  name: string;
  renderers: { name: string; id: string }[];
}

export interface PageParams {
  currentRowCount: number;
  totalRowCount?: number;
  currentPage: number;
  columnCount: number;
  showPageControls?: boolean;
}

export interface ImageDimension {
  widthInPx: number;
  heightInPx: number;
}

export type HeaderMenuItem = MenuItem & {
  id: string;
  section: "dataRendering";
};

export interface EmptyFilterConfig {
  is: "";
  modelValue: "";
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
    columnFiltersMap?: Map<string | symbol, FilterConfig>;
    columnContentTypes: ("txt" | "multi_line_txt" | "img_path" | "html")[];
    dataTypes: Record<string, DataType>;
    columnDataTypeIds: string[];
    colNameSelectedRendererId?: Record<string, string>;
    columnFormatterDescriptions?: (string | null)[];
    columnNamesColors: string[] | null;
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
  knimeService: UIExtensionService;
  forceHideTableSizes?: boolean;
  firstRowImageDimensions: Record<string, ImageDimension>;
  settingsItems?: MenuItem[];
  enableDynamicRowHeight?: boolean;
}
