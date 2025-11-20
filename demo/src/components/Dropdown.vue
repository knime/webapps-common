<!-- eslint-disable max-lines -->
<script lang="ts">
import { Dropdown, LoadingIcon } from "@knime/components";
import DiamondIcon from "@knime/styles/img/icons/diamond.svg";
import EarlyBirdIcon from "@knime/styles/img/icons/early-bird.svg";
import DisconnectIcon from "@knime/styles/img/icons/nodes-disconnect.svg";
import RocketIcon from "@knime/styles/img/icons/rocket.svg";

import CodeExample from "./demo/CodeExample.vue";
import { defineComponent } from "vue";
import { KdsDataType } from "@knime/kds-components";
// import code from "webapps-common/ui/components/forms/Dropdown.vue?raw";
const code = "";

const codeExample = `<Dropdown
  v-model="selected"
  ariaLabel="A Dropdown"
  :possible-values="[{
    id: 'foo',
    text: 'Foo'
  }, {
    id: 'bar',
    text: 'Bar'
  }, {
    id: 'baz',
    text: 'Baz'
  }]"
/>`;

const slottedCodeExample = `<Dropdown
  v-model="slottedSelected"
  ariaLabel="A Slotted dropdown"
  :possible-values="[{
      id: '1',
      text: 'The Sundering',
      slotData: {
          icon: DisconnectIcon,
          title: 'The Sundering',
          subtitle: 'Gods of the Earth',
          year: '2008'
      }
  }, {
      id: '2',
      text: 'Iron Swan',
      slotData: {
          icon: RocketIcon,
          title: 'Iron Swan',
          subtitle: 'Age of Winters',
          year: '2006'
      }
  }, {
      id: '3',
      text: 'The Dreamthieves',
      slotData: {
          icon: DiamondIcon,
          title: 'The Dreamthieves',
          subtitle: 'Low Country',
          year: '2016'
      }
  }, {
      id: '4',
      text: 'Twilight Sunrise',
      slotData: {
          icon: EarlyBirdIcon,
          title: 'Twilight Sunrise',
          subtitle: 'Used Future',
          year: '2018'
      }
  }]"
>
  <template
    #option="{ slotData: { icon, title, subtitle, year } } = {
      slotData: {},
    }"
  >
    <div class="slot-option">
      <component :is="icon" />
      <div class="description">
        <div class="title">{{ title }}</div>
        <div class="subtitle">{{ subtitle }}</div>
      </div>
      <div class="year">{{ year }}</div>
    </div>
  </template>
</Dropdown>
`;

export default defineComponent({
  components: {
    KdsDataType,
    Dropdown,
    CodeExample,
    LoadingIcon,
    DisconnectIcon,
    RocketIcon,
    DiamondIcon,
    EarlyBirdIcon,
  },
  data() {
    return {
      codeExample,
      slottedCodeExample,
      selected: "Id 123",
      placeholderModel: "",
      disabledSelected: "",
      withSlotsSelected: "",
      slottedSelected: "1",
      dropupSelected: "bar",
      withGroupSelected: "",
      slottedSmallSelected: "missing",
    };
  },
  computed: {
    slottedExamplePossibleValue() {
      return [
        {
          id: "1",
          text: "The Sundering",
          slotData: {
            icon: DisconnectIcon,
            title: "The Sundering",
            subtitle: "Gods of the Earth",
            year: "2008",
          },
        },
        {
          id: "2",
          text: "Iron Swan",
          slotData: {
            icon: RocketIcon,
            title: "Iron Swan",
            subtitle: "Age of Winters",
            year: "2006",
          },
        },
        {
          id: "3",
          text: "The Dreamthieves",
          slotData: {
            icon: DiamondIcon,
            title: "The Dreamthieves",
            subtitle: "Low Country",
            year: "2016",
          },
        },
        {
          id: "4",
          text: "Twilight Sunrise",
          slotData: {
            icon: EarlyBirdIcon,
            title: "Twilight Sunrise",
            subtitle: "Used Future",
            year: "2018",
          },
        },
      ];
    },
    code() {
      return code;
    },
  },
});
</script>

<template>
  <div>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <p>
            A list of choices the user must choose one of them, so it emits an
            <code>input</code> event when something is selected, and it has a
            <code>value</code>. Keyboard navigation works (<code>Enter</code>
            <code>Up</code>/<code>Down</code> and
            <code>Home</code>/<code>End</code>, leave with <code>Esc</code>).
          </p>
        </div>
      </div>
      <div class="grid-container">
        <div class="grid-item-5">
          <Dropdown
            v-model="selected"
            ariaLabel="A List"
            :possible-values="[
              {
                id: 'specialOption',
                text: 'Some special option',
                isSpecial: true,
              },
              ...Array.from({ length: 1000 }, (_v, i) => ({
                id: `Id ${i}`,
                text: `Option ${i}`,
              })),
            ]"
          />
        </div>
        <div class="grid-item-5">
          <Dropdown
            v-model="selected"
            ariaLabel="A limited list"
            size="3"
            :possible-values="[
              {
                id: 'foo',
                text: 'Foo',
              },
              {
                id: 'bar',
                text: 'Bar',
              },
              {
                id: 'bar2',
                text: 'Bar 2',
              },
              {
                id: 'bar3',
                text: 'Bar 3',
              },
              {
                id: 'bar4',
                text: 'Bar 4',
              },
              {
                id: 'bar5',
                text: 'Bar 5',
              },
              {
                id: 'bar6',
                text: 'Bar 6',
              },
              {
                id: 'bar7',
                text: 'Bar 8',
              },
              {
                id: 'bar9',
                text: 'Bar 9',
              },
              {
                id: 'bar10',
                text: 'Bar 10',
              },
              {
                id: 'bar11',
                text: 'Bar 11',
              },
              {
                id: 'baz',
                text: 'Baz',
              },
            ]"
          />
        </div>
        <div class="grid-item-2">selected id: {{ selected }}</div>
      </div>
      <div class="grid-container">
        <div class="grid-item-12">
          <p>
            The <code>placeholder</code> will be shown when no or empty
            <code>value</code> is set. Also it provides an invalid
            (<code>isValid=false</code>) state.
          </p>
        </div>
      </div>
      <div class="grid-container">
        <div class="grid-item-5">
          <Dropdown
            v-model="placeholderModel"
            placeholder="Placeholder…"
            ariaLabel="A List"
            :possible-values="[
              {
                id: 'foo',
                text: 'Foo',
              },
              {
                id: 'bar',
                text: 'Bar',
              },
              {
                id: 'baz',
                text: 'Baz',
              },
            ]"
          />
        </div>
        <div class="grid-item-5">
          <Dropdown
            v-model="placeholderModel"
            placeholder="Placeholder…"
            :is-valid="false"
            ariaLabel="A limited list"
            size="3"
            :possible-values="[
              {
                id: 'foo',
                text: 'Foo',
              },
              {
                id: 'bar',
                text: 'Bar',
              },
              {
                id: 'bar2',
                text: 'Bar 2',
              },
              {
                id: 'bar3',
                text: 'Bar 3',
              },
              {
                id: 'bar4',
                text: 'Bar 4',
              },
              {
                id: 'bar5',
                text: 'Bar 5',
              },
              {
                id: 'bar6',
                text: 'Bar 6',
              },
              {
                id: 'bar7',
                text: 'Bar 8',
              },
              {
                id: 'bar9',
                text: 'Bar 9',
              },
              {
                id: 'bar10',
                text: 'Bar 10',
              },
              {
                id: 'bar11',
                text: 'Bar 11',
              },
              {
                id: 'baz',
                text: 'Baz',
              },
            ]"
          />
        </div>
        <div class="grid-item-2">selected id: {{ placeholderModel }}</div>
      </div>
      <br />
      <div class="grid-container">
        <div class="grid-item-5">
          <Dropdown
            v-model="disabledSelected"
            placeholder="Disabled..."
            ariaLabel="A List"
            :possible-values="[
              {
                id: 'foo',
                text: 'Foo',
              },
              {
                id: 'bar',
                text: 'Bar',
              },
              {
                id: 'baz',
                text: 'Baz',
              },
            ]"
            disabled
          />
        </div>
        <div class="grid-item-2">selected id: {{ disabledSelected }}</div>
      </div>
      <br />
      <div class="grid-container">
        <div class="grid-item-5">
          <Dropdown
            v-model="disabledSelected"
            placeholder="No values present"
            ariaLabel="A List"
          />
        </div>
        <div class="grid-item-2">selected id: {{ disabledSelected }}</div>
      </div>
      <br />
      <div class="grid-container">
        <div class="grid-item-5">
          <Dropdown
            v-model="withSlotsSelected"
            placeholder="With slots..."
            ariaLabel="A List"
            :possible-values="[
              {
                id: 'foo',
                text: 'Foo',
              },
              {
                id: 'bar',
                text: 'Bar',
              },
              {
                id: 'baz',
                text: 'Baz',
              },
            ]"
          >
            <template #icon-right><LoadingIcon /></template>
          </Dropdown>
        </div>
        <div class="grid-item-2">selected id: {{ withSlotsSelected }}</div>
      </div>
      <br />
      <div class="grid-container">
        <div class="grid-item-5">
          <Dropdown
            v-model="withSlotsSelected"
            placeholder="In compact mode"
            ariaLabel="A List"
            compact
            :possible-values="[
              {
                id: 'foo',
                text: 'Foo',
              },
              {
                id: 'bar',
                text: 'Bar',
              },
              {
                id: 'baz',
                text: 'Baz',
              },
            ]"
          />
        </div>
        <div class="grid-item-2">selected id: {{ withSlotsSelected }}</div>
      </div>
      <div class="grid-container">
        <div class="grid-item-12">
          <p>
            The optional <code>direction</code> property can be used to display
            the dropdown above the input field.
          </p>
        </div>
      </div>
      <div class="grid-container">
        <div class="grid-item-5">
          <Dropdown
            v-model="dropupSelected"
            ariaLabel="A Dropup"
            :possible-values="[
              {
                id: 'foo',
                text: 'Foo',
              },
              {
                id: 'bar',
                text: 'Bar',
              },
              {
                id: 'baz',
                text: 'Baz',
              },
            ]"
            direction="up"
          />
        </div>
        <div class="grid-item-2">selected id: {{ dropupSelected }}</div>
      </div>
      <div class="grid-container">
        <div class="grid-item-12">
          <p>Dropdown with option groups</p>
        </div>
      </div>
      <div class="grid-container">
        <div class="grid-item-5">
          <Dropdown
            v-model="withGroupSelected"
            placeholder="With groups"
            ariaLabel="Dropdown with groups"
            :possible-values="[
              {
                id: 'foo',
                text: 'Foo',
                group: 'Group a',
              },
              {
                id: 'bar',
                text: 'Bar',
                group: 'Group a',
              },
              {
                id: 'bar2',
                text: 'Bar 2',
                group: 'Group a',
              },
              {
                id: 'bar3',
                text: 'Bar 3',
                group: 'Group b',
              },
              {
                id: 'bar4',
                text: 'Bar 4',
                group: 'Group b',
              },
              {
                id: 'bar5',
                text: 'Bar 5',
                group: 'Group c',
              },
              {
                id: 'bar6',
                text: 'Bar 6',
                group: 'Group c',
              },
              {
                id: 'bar7',
                text: 'Bar 8',
                group: 'Group c',
              },
              {
                id: 'bar9',
                text: 'Bar 9',
                group: 'Group c',
              },
              {
                id: 'bar10',
                text: 'Bar 10',
                group: 'Group c',
              },
            ]"
          />
        </div>
        <div class="grid-item-2">selected id: {{ withGroupSelected }}</div>
      </div>
    </section>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <CodeExample summary="Show usage example">{{
            codeExample
          }}</CodeExample>
        </div>
      </div>
    </section>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <h4>Slotted Dropdown</h4>
          <p>
            The optional <code>slotData</code> property can be used to
            incorporate a slot into the dropdown list and render additional data
            in a styled fashion. The local value is passed through and available
            as a slot prop. Please keep in mind that the property names must
            match.
          </p>
        </div>
      </div>
      <div class="grid-container">
        <div class="grid-item-5">
          <Dropdown
            v-model="slottedSelected"
            ariaLabel="A limited list"
            size="3"
            :possible-values="slottedExamplePossibleValue"
          >
            <template
              #option="{ slotData, isMissing, selectedValue } = {
                slotData: {},
              }"
            >
              <div v-if="isMissing" class="slot-option">
                <div class="description">
                  <div class="title">(MISSING) {{ selectedValue }}</div>
                </div>
              </div>
              <div v-else class="slot-option">
                <component :is="slotData.icon" />
                <div class="description">
                  <div class="title">{{ slotData.title }}</div>
                  <div class="subtitle">{{ slotData.subtitle }}</div>
                </div>
                <div class="year">{{ slotData.year }}</div>
              </div>
            </template>
          </Dropdown>
        </div>
        <div class="grid-item-2">selected id: {{ slottedSelected }}</div>
      </div>
      <div class="grid-container">
        <div class="grid-item-12">
          <h4>Slotted Dropdown (With datatypes)</h4>
        </div>
      </div>
      <div class="grid-container">
        <div class="grid-item-5">
          <Dropdown
            v-model="slottedSmallSelected"
            ariaLabel="A limited list"
            :possible-values="[
              {
                id: 'withoutType',
                text: 'Without Type',
                slotData: {
                  text: 'Without Type',
                },
              },
              {
                id: 'string',
                text: 'String',
                slotData: {
                  text: 'String',
                  typeId: 'string-datatype',
                  typeText: 'String Value',
                },
              },
              {
                id: 'set',
                text: 'Set',
                slotData: {
                  text: 'Set',
                  typeId: 'collection-set-datatype',
                  typeText: 'Set Value',
                },
              },
              {
                id: 'pmml',
                text: 'PMML',
                slotData: {
                  text: 'PMML',
                  typeId: 'model-pmml-datatype',
                  typeText: 'PMML Value',
                },
              },
            ]"
          >
            <template
              #option="{ slotData, selectedValue, isMissing } = {
                slotData: {},
              }"
            >
              <div
                :class="[
                  'data-type-entry',
                  {
                    missing: isMissing,
                    'with-type': isMissing || slotData.typeId,
                  },
                ]"
              >
                <template v-if="isMissing">
                  <DataType size="small" />
                  <span>(MISSING) {{ selectedValue }}</span>
                </template>
                <template v-else>
                  <template v-if="slotData.typeId">
                    <DataType
                      :icon-name="slotData.typeId"
                      :icon-title="slotData.typeText"
                      size="small"
                    />
                  </template>
                  <span>{{ slotData.text }}</span>
                </template>
              </div>
            </template>
          </Dropdown>
        </div>
        <div class="grid-item-2">selected id: {{ slottedSmallSelected }}</div>
      </div>
    </section>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <CodeExample summary="Show slotted usage example">{{
            slottedCodeExample
          }}</CodeExample>
          <CodeExample summary="Show Dropdown.vue source code">{{
            code
          }}</CodeExample>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="postcss" scoped>
.dropdown {
  & .slot-option {
    display: flex;
    flex-direction: row;
    padding: 10px;

    & > svg {
      flex: 0 0 18px;
      height: 18px;
      stroke-width: calc(32px / 18);
    }

    & .description {
      flex: 1 1 auto;
      padding: 0 10px;

      & .title {
        font-size: 13px;
        font-weight: 500;
        line-height: 150%;
      }

      & .subtitle {
        font-size: 11px;
        font-weight: 300;
        line-height: 150%;
      }
    }

    & .year {
      flex: 1 1 auto;
      font-size: 13px;
      font-weight: 500;
      line-height: 150%;
      text-align: right;
    }
  }

  & .data-type-entry.with-type {
    display: flex;
    gap: var(--space-4);
    align-items: center;

    & > span {
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
