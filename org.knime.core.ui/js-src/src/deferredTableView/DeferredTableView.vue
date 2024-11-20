// A table view which is not loaded immediately but on user request
<script lang="ts">
import { Button, SplitButton, SubMenu } from "@knime/components";
import DropdownIcon from "@knime/styles/img/icons/arrow-dropdown.svg";
import CircleArrow from "@knime/styles/img/icons/circle-arrow-down.svg";
import {
  JsonDataService,
  type UIExtensionService,
} from "@knime/ui-extension-service";

import type { InitialData } from "@/tableView/types/InitialData";
import TableViewInteractive from "../tableView/TableViewInteractive.vue";
import "../common/main.css";

const baseSubMenuItems = [
  {
    text: "100",
    value: 100,
  },
  {
    text: "1000",
    value: 1000,
  },
  {
    text: "5000",
    value: 5000,
  },
];

export default {
  components: {
    TableViewInteractive,
    Button,
    SubMenu,
    SplitButton,
    CircleArrow,
    DropdownIcon,
  },
  inject: ["getKnimeService"],
  data() {
    return {
      jsonDataService: null as null | JsonDataService,
      numRows: 100,
      tableViewInitialData: null as null | InitialData,
      tableViewKey: 0,
      baseSubMenuItems,
    };
  },
  computed: {
    knimeService() {
      return (this.getKnimeService as () => UIExtensionService)();
    },
    columnCount() {
      return this.tableViewInitialData?.table.columnCount;
    },
    numDisplayedRows() {
      if (this.tableViewInitialData) {
        const tableRowCount = this.tableViewInitialData.table.rowCount;
        if (tableRowCount < this.numRows) {
          return tableRowCount;
        }
      }
      return this.numRows;
    },
    subMenuItems() {
      return this.tableViewInitialData
        ? [
            {
              text: "Re-fetch data",
              disabled: true,
              separator: true,
            },
            ...this.baseSubMenuItems,
          ]
        : this.baseSubMenuItems;
    },
  },
  mounted() {
    this.jsonDataService = new JsonDataService(this.knimeService);
  },
  methods: {
    async fetchTableData() {
      const tableViewInitialDataString = await this.jsonDataService!.data({
        method: "getTableViewInitialData",
        options: [this.numRows],
      });
      if (!tableViewInitialDataString) {
        this.tableViewInitialData = null;
        return;
      }
      this.tableViewInitialData = JSON.parse(tableViewInitialDataString);
      this.forceTableViewRender();
    },
    onSubmenuItemClick(updatedNumRows: number) {
      this.numRows = updatedNumRows;
      this.fetchTableData();
    },
    forceTableViewRender() {
      // TODO fix this when refactoring the TableView (UIEXT-833)
      this.tableViewKey++;
    },
  },
};
</script>

<template>
  <div class="table-view-wrapper">
    <div class="submenu-wrapper">
      <SubMenu
        v-if="tableViewInitialData"
        :items="subMenuItems"
        orientation="left"
        @item-click="(_, item) => onSubmenuItemClick(item.value)"
      >
        <span>
          Rows: {{ numDisplayedRows }}
          <DropdownIcon />
        </span>
      </SubMenu>
      <span v-if="columnCount" class="column-count">
        {{ `   |   Columns: ${columnCount}` }}
      </span>
    </div>
    <TableViewInteractive
      v-if="tableViewInitialData"
      :key="tableViewKey"
      :initial-data="tableViewInitialData"
      :enable-cell-selection="false"
      :force-hide-table-sizes="true"
    />
    <div v-else class="empty-container">
      <p class="description">
        To see the output table please fetch data from database
      </p>
      <SplitButton>
        <Button primary compact @click="fetchTableData">
          <CircleArrow />
          Fetch {{ numRows }} table rows
        </Button>
        <SubMenu
          :items="subMenuItems"
          class="submenu"
          orientation="left"
          @item-click="(_, item) => onSubmenuItemClick(item.value)"
        >
          <DropdownIcon />
        </SubMenu>
      </SplitButton>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.table-view-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;

  & :deep(.table-header) {
    background-color: var(--knime-porcelain);
  }

  & :deep(.row) {
    border-bottom: 1px solid var(--knime-porcelain);
    align-content: center;

    & img {
      object-fit: contain;
      max-width: 100%;
      max-height: 100%;
      vertical-align: middle;
    }
  }

  & .submenu-wrapper {
    padding: 5px;
    display: flex;
    justify-content: left;
    align-items: center;

    & .column-count {
      color: var(--knime-dove-gray);
      font-size: 13px;
      font-weight: 500;
      font-family: Roboto, sans-serif;
      white-space: pre;
    }
  }

  & .empty-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;

    & .submenu {
      background-color: var(--knime-yellow);

      &:focus-within,
      &:hover {
        background-color: var(--knime-masala);

        & button svg {
          stroke: var(--knime-white);
        }
      }
    }

    & .description {
      margin-bottom: 20px;
    }
  }
}
</style>
