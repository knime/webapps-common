export interface Cell {
  metadata: null | string;
  value?: string;
  color?: string;
}

export interface ImageDimension {
  widthInPx: number;
  heightInPx: number;
}

export type ColumnContentType =
  | "txt"
  | "img_path"
  | "multi_line_txt"
  | "html"
  | "json"
  | "xml";

export interface Table {
  /**
   * the displayed columns which remain after missing columns are filtered out.
   */
  displayedColumns: string[];

  /**
   * the content type per column (which depends on the selected renderer per column)
   */
  columnContentTypes: ColumnContentType[];

  /**
   * the data type ids per column; can be used to access the actual data type via
   */
  columnDataTypeIds: string[];

  /**
   * the description of the formatters attached to the columns or null where none is attached.
   */
  columnFormatterDescriptions: string[];

  /**
   * the color for each displayed column or an empty array when there is no color handler specified.
   */
  columnNamesColors: string[];

  /**
   * the requested rows; contains string for existing values and can contain null or
   *         Cell in case of missing values
   */
  rows: (Cell | string | null)[][];

  /**
   * the indices of the rows in {@link rows} within the original table (prior to windowing, filtering and
   *         sorting).
   */
  rowIndices: number[];

  /**
   * the row count of the table in use
   */
  rowCount: number;

  /**
   * the number of valid selected columns of the table in use. These can be possibly more than the displayed
   *         ones if the columns are trimmed.
   */
  columnCount: number;

  /**
   * the number of selected rows of the table in use
   */
  totalSelected: number;

  /**
   * the column sizes of image columns
   */
  firstRowImageDimensions: Record<string, ImageDimension>;
}
