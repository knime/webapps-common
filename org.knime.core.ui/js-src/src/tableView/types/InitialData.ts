import Table from "./Table";
import TableViewViewSettings from "./ViewSettings";

export interface Renderer {
  id: string;
  name: string;
}

export interface DataType {
  name: string;
  renderers: Renderer[];
  hasDataValueView: boolean;
}

interface InitialData {
  /**
   * @return the table to be shown initially
   */
  table: Table;

  /**
   * @return a map from data type id to data type (for all data types that are possibly part of the table)
   */
  dataTypes: Record<string, DataType>;

  /**
   * @return a map from column name to column domain values; map entries can be null because the respective
   *         column doesn't have a nominal domain or there are too many possible values
   */
  columnDomainValues: Record<string, string[]>;

  /**
   * @return the initial settings
   */
  settings: TableViewViewSettings;
}

export default InitialData;
