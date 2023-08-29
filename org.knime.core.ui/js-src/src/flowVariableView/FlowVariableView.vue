<script>
import { JsonDataService } from "@knime/ui-extension-service";

export default {
  inject: ["getKnimeService"],
  data() {
    return {
      initialData: null,
    };
  },
  computed: {
    knimeService() {
      return this.getKnimeService();
    },
  },
  async mounted() {
    this.initialData = await new JsonDataService(
      this.knimeService,
    ).initialData();
  },
};
</script>

<template>
  <div class="container">
    <div v-if="initialData" class="counts">
      <span class="count">Count: {{ initialData.length }}</span>
    </div>
    <div class="scroll-container">
      <table>
        <thead>
          <tr>
            <th class="title">Owner ID</th>
            <th class="title">Data Type</th>
            <th class="title">Variable Name</th>
            <th class="title">Value</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="flowVariable of initialData"
            :key="`flowVariable-${flowVariable.name}`"
          >
            <td>{{ flowVariable.ownerNodeId }}</td>
            <td>{{ flowVariable.type }}</td>
            <td>{{ flowVariable.name }}</td>
            <td>{{ flowVariable.value }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.container {
  height: 100%;
}

.scroll-container,
.counts {
  font-weight: 400;
}

.scroll-container {
  height: calc(100% - 65px); /* subtract the top margin / space */
  overflow-y: auto;
}

.counts {
  margin: 7px 0 9px 3px;
  height: 19px;
  line-height: 19px;
  font-size: 13px;
  color: var(--knime-dove-gray);

  & .count {
    &:not(:first-child) {
      padding-left: 8px;
    }

    &:not(:last-child) {
      padding-right: 8px;
      border-right: 1px solid var(--knime-silver-sand);
    }
  }
}

table {
  min-width: 100%;
  border-collapse: collapse;
  font-family: Roboto, sans-serif;
  contain: strict;

  & :deep(th),
  & :deep(td) {
    padding: 0 10px;
    text-align: left;
    max-width: 1000px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  & :deep(th) {
    border-top: 1px solid var(--knime-silver-sand-semi);
    background: var(--knime-porcelain);
    height: 41px;
    position: sticky;
    top: 0;
    border-style: hidden;
  }

  & :deep(td) {
    white-space: pre;
    max-width: 50vw;
    overflow: hidden;
    text-overflow: ellipsis;
    border: none;
    line-height: 24px;
    font-size: 13px;
  }

  & :deep(tr:not(:last-child)) {
    border-bottom: 1px solid var(--knime-porcelain);
  }
}

span {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  display: block;
  max-width: 100%;
}

.title {
  font-weight: 700;
  font-size: 14px;
  line-height: 16px;
}
</style>
