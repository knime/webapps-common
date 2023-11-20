<script>
import CodeExample from './demo/CodeExample.vue';
import Dropdown from '../../ui/components/forms/Dropdown.vue';
import code from '!!raw-loader!../../ui/components/forms/Dropdown';
import DisconnectIcon from '../../ui/assets/img/icons/nodes-disconnect.svg';
import RocketIcon from '../../ui/assets/img/icons/rocket.svg';
import DiamondIcon from '../../ui/assets/img/icons/diamond.svg';
import EarlyBirdIcon from '../../ui/assets/img/icons/early-bird.svg';


const codeExample = `<Dropdown
  v-model="selected"
  aria-label="A Dropdown"
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
  aria-label="A Slotted dropdown"
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
  <template #default="slotProps">
    <div class="slot-option">
      <component :is="slotProps.slotData.icon" />
      <div class="description">
        <div class="title">{{ slotProps.slotData.title }}</div>
        <div class="subtitle">{{ slotProps.slotData.subtitle }}</div>
      </div>
      <div class="year">{{ slotProps.slotData.year }}</div>
    </div>
  </template>
</Dropdown>
`;

export default {
    components: {
        Dropdown,
        CodeExample,
        DisconnectIcon,
        RocketIcon,
        DiamondIcon,
        EarlyBirdIcon
    },
    data() {
        return {
            slottedCodeExample,
            codeExample,
            selected: 'bar',
            placeholderModel: '',
            disabledSelected: '',
            slottedSelected: '1',
            slottedExamplePossibleValue: [{
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
            }]
        };
    },
    computed: {
        code() {
            return code;
        }
    }
};
</script>

<template>
  <div>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <h2>Dropdown</h2>
          <p>
            A list of choices the user must choose one of them, so it emits an <code>input</code> event
            when something is selected, and it has a <code>value</code>. Keyboard navigation works
            (<code>Enter</code> <code>Up</code>/<code>Down</code> and <code>Home</code>/<code>End</code>, leave
            with <code>Esc</code>).
          </p>
        </div>
      </div>
      <div class="grid-container">
        <div class="grid-item-5">
          <Dropdown
            v-model="selected"
            aria-label="A List"
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
          />
        </div>
        <div class="grid-item-5">
          <Dropdown
            v-model="selected"
            aria-label="A limited list"
            size="3"
            :possible-values="[{
              id: 'foo',
              text: 'Foo'
            }, {
              id: 'bar',
              text: 'Bar'
            },{
              id: 'bar2',
              text: 'Bar 2'
            },{
              id: 'bar3',
              text: 'Bar 3'
            }, {
              id: 'bar4',
              text: 'Bar 4'
            }, {
              id: 'bar5',
              text: 'Bar 5'
            }, {
              id: 'bar6',
              text: 'Bar 6'
            }, {
              id: 'bar7',
              text: 'Bar 8'
            }, {
              id: 'bar9',
              text: 'Bar 9'
            }, {
              id: 'bar10',
              text: 'Bar 10'
            }, {
              id: 'bar11',
              text: 'Bar 11'
            }, {
              id: 'baz',
              text: 'Baz'
            }]"
          />
        </div>
        <div class="grid-item-2">
          selected id: {{ selected }}
        </div>
      </div>
      <div class="grid-container">
        <div class="grid-item-12">
          <p>
            The <code>placeholder</code> will be shown when no or empty <code>value</code> is set.
            Also it provides an invalid (<code>isValid=false</code>) state.
          </p>
        </div>
      </div>
      <div class="grid-container">
        <div class="grid-item-5">
          <Dropdown
            v-model="placeholderModel"
            placeholder="Placeholder…"
            aria-label="A List"
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
          />
        </div>
        <div class="grid-item-5">
          <Dropdown
            v-model="placeholderModel"
            placeholder="Placeholder…"
            :is-valid="false"
            aria-label="A limited list"
            size="3"
            :possible-values="[{
              id: 'foo',
              text: 'Foo'
            }, {
              id: 'bar',
              text: 'Bar'
            },{
              id: 'bar2',
              text: 'Bar 2'
            },{
              id: 'bar3',
              text: 'Bar 3'
            }, {
              id: 'bar4',
              text: 'Bar 4'
            }, {
              id: 'bar5',
              text: 'Bar 5'
            }, {
              id: 'bar6',
              text: 'Bar 6'
            }, {
              id: 'bar7',
              text: 'Bar 8'
            }, {
              id: 'bar9',
              text: 'Bar 9'
            }, {
              id: 'bar10',
              text: 'Bar 10'
            }, {
              id: 'bar11',
              text: 'Bar 11'
            }, {
              id: 'baz',
              text: 'Baz'
            }]"
          />
        </div>
        <div class="grid-item-2">
          selected id: {{ placeholderModel }}
        </div>
      </div>
      <br>
      <div class="grid-container">
        <div class="grid-item-5">
          <Dropdown
            v-model="disabledSelected"
            placeholder="Disabled..."
            aria-label="A List"
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
            disabled
          />
        </div>
        <div class="grid-item-2">
          selected id: {{ placeholderModel }}
        </div>
      </div>
      <div class="grid-container">
        <div class="grid-item-12">
          <CodeExample summary="Show usage example">{{ codeExample }}</CodeExample>
        </div>
      </div>
      <div class="grid-container">
        <div class="grid-item-12">
          <h4>Slotted Dropdown</h4>
          <p>
            The optional <code>slotData</code> property can be used to incorporate a slot into the dropdown list and
            render additional data in a styled fashion. The local value is passed through and available as a slot prop.
            Please keep in mind that the property names must match.
            <br><br>
            If a slot is used all corresponding styles for hover, focus etc. have to be implemented accordingly.
          </p>
        </div>
      </div>
      <div class="grid-container">
        <div class="grid-item-5">
          <Dropdown
            v-model="slottedSelected"
            aria-label="A limited list"
            size="3"
            :possible-values="slottedExamplePossibleValue"
          >
            <template #default="slotProps">
              <div class="slot-option">
                <component :is="slotProps.slotData.icon" />
                <div class="description">
                  <div class="title">{{ slotProps.slotData.title }}</div>
                  <div class="subtitle">{{ slotProps.slotData.subtitle }}</div>
                </div>
                <div class="year">{{ slotProps.slotData.year }}</div>
              </div>
            </template>
          </Dropdown>
        </div>
        <div class="grid-item-2">
          selected id: {{ slottedSelected }}
        </div>
      </div>
      <div class="grid-container">
        <div class="grid-item-12">
          <CodeExample summary="Show slotted usage example">{{ slottedCodeExample }}</CodeExample>
          <CodeExample summary="Show Dropdown.vue source code">{{ code }}</CodeExample>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="postcss" scoped>
.dropdown{
  & .slot-option {
    background: var(--theme-dropdown-background-color);
    color: var(--theme-dropdown-foreground-color-hover);
    display: flex;
    flex-direction: row;
    padding: 10px;

    & > svg{
      flex: 0 0 18px;
      height: 18px;
      stroke-width: calc(32px / 18);
      stroke: var(--theme-dropdown-foreground-color);
    }

    & .description {
      flex: 1 1 auto;
      padding: 0 10px;

      & .title {
        color: inherit;
        font-size: 13px;
        font-weight: 500;
        line-height: 150%;
      }

      & .subtitle {
        color: inherit;
        font-size: 11px;
        font-weight: 300;
        line-height: 150%;
      }
    }

    & .year {
      color: inherit;
      flex: 1 1 auto;
      font-size: 13px;
      font-weight: 500;
      line-height: 150%;
      text-align: right;
    }

    &:hover {
      background: var(--theme-dropdown-background-color-hover);
      color: var(--theme-dropdown-foreground-color-hover);

      & svg{
        stroke: var(--theme-dropdown-foreground-color-hover);
      }
    }

    &:focus {
      background: var(--theme-dropdown-background-color-focus);
      color: var(--theme-dropdown-foreground-color-focus);

      & svg{
        stroke: var(--theme-dropdown-foreground-color-focus);
      }
    }
  }

  & .focused {
    & .slot-option {
      background: var(--theme-dropdown-background-color-selected);
      color: var(--theme-dropdown-foreground-color-selected);

      & svg{
        stroke: var(--theme-dropdown-foreground-color-selected);
      }
    }
  }

  & .noselect {
    user-select: none;
  }
}
</style>
