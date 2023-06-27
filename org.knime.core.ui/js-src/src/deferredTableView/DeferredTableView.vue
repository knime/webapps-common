// A table view which is not loaded immediately but on user request
<script>
import { JsonDataService } from '@knime/ui-extension-service';
import TableView from '../tableView/TableView.vue';
import Button from 'webapps-common/ui/components/Button.vue';
import SubMenu from 'webapps-common/ui/components/SubMenu.vue';
import SplitButton from 'webapps-common/ui/components/SplitButton.vue';
import CircleArrow from 'webapps-common/ui/assets/img/icons/circle-arrow-down.svg';
import DropdownIcon from 'webapps-common/ui/assets/img/icons/arrow-dropdown.svg';

const subMenuItems = [
    {
        text: '100',
        value: 100
    },
    {
        text: '1000',
        value: 1000
    },
    {
        text: '5000',
        value: 5000
    }
];

export default {
    components: {
        TableView,
        Button,
        SubMenu,
        SplitButton,
        CircleArrow,
        DropdownIcon
    },
    inject: ['getKnimeService'],
    data() {
        return {
            jsonDataService: null,
            numRows: 100,
            tableViewInitialData: null,
            tableViewKey: 0,
            subMenuItems
        };
    },
    computed: {
        knimeService() {
            return this.getKnimeService();
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
        }
    },
    mounted() {
        this.jsonDataService = new JsonDataService(this.knimeService);
    },
    methods: {
        async fetchTableData() {
            const tableViewInitialDataString = await this.jsonDataService.data({
                method: 'getTableViewInitialData',
                options: [this.numRows]
            });
            if (!tableViewInitialDataString) {
                this.tableViewInitialData = null;
                return;
            }
            this.tableViewInitialData = JSON.parse(tableViewInitialDataString);
            this.forceTableViewRender();
        },
        onSubmenuItemClick(updatedNumRows, shouldReFetch = false) {
            this.numRows = updatedNumRows;
            if (shouldReFetch) {
                this.fetchTableData();
            }
        },
        forceTableViewRender() {
            // TODO fix this when refactoring the TableView (UIEXT-833)
            this.tableViewKey++;
        }
    }
};
</script>

<template>
  <div class="table-view-wrapper">
    <div class="submenu-wrapper">
      <SubMenu
        v-if="tableViewInitialData"
        :items="subMenuItems"
        orientation="left"
        @item-click="(_, item) => onSubmenuItemClick(item.value, true)"
      >
        <span>
          Rows: {{ numDisplayedRows }}
          <DropdownIcon />
        </span>
      </SubMenu>
      <span
        v-if="columnCount"
        class="column-count"
      >
        {{ `   |   Columns: ${columnCount}` }}
      </span>
    </div>
    <TableView
      v-if="tableViewInitialData"
      :key="tableViewKey"
      :initial-data="tableViewInitialData"
    />
    <div
      v-else
      class="empty-container"
    >
      <p class="description">
        To see the output table please fetch data from database
      </p>
      <SplitButton>
        <Button
          primary
          compact
          @click="fetchTableData"
        >
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
    position: absolute;
    top: 50px;
    left: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
  
    & .column-count {
      color: var(--knime-dove-gray);
      font-size: 14px;
      font-family: Roboto Condensed;
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

    .description {
      margin-bottom: 20px;
    }
  }
}
</style>
