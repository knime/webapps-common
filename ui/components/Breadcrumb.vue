<script>
import FolderIcon from '../assets/img/icons/folder.svg?inline';
import WorkflowIcon from '../assets/img/icons/workflow.svg?inline';
import PlayIcon from '../assets/img/icons/circle-play.svg?inline';
import ArrowNext from '../assets/img/icons/arrow-next.svg?inline';

export default {
    components: {
        FolderIcon,
        WorkflowIcon,
        PlayIcon,
        ArrowNext
    },
    props: {
    /**
     * items as array with a 'text' and optional properties 'href', 'type' and 'noTrailingArrow'
     * e.g.
     * [
     *   { text: 'KNIME Hub', href: '/', type: 'folder' },
     *   { text: 'John Doe', href: '/john.doe' },
     *   { text: 'Public Space', href: '/john.doe/space' },
     *   { text: 'Examples', href: '/john.doe/space/examples' },
     *   { text: 'Sentiment Prediction via REST', noTrailingArrow: true }
     * ]
     */
        items: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            typeIcons: {
                Folder: FolderIcon,
                Workflow: WorkflowIcon,
                Play: PlayIcon
            }
        };
    },
    methods: {
        getTypeIcon({ type }) {
            return type && this.typeIcons[type]
                ? this.typeIcons[type]
                : this.typeIcons.other;
        }
    }
};
</script>

<template>
  <nav
    v-if="items && items.length"
    class="breadcrumb"
  >
    <ul>
      <li
        v-for="(breadcrumbItem, i) in items"
        :key="i"
      >
        <nuxt-link
          v-if="breadcrumbItem.href"
          :to="breadcrumbItem.href"
        >
          <Component :is="getTypeIcon(breadcrumbItem)" />
          {{ breadcrumbItem.text }}
        </nuxt-link>
        <span v-else>
          <Component :is="getTypeIcon(breadcrumbItem)" />
          {{ breadcrumbItem.text }}
        </span>
        <ArrowNext v-if="!breadcrumbItem.noTrailingArrow" />
      </li>
    </ul>
  </nav>
</template>

<style lang="postcss" scoped>
@import "webapps-common/ui/css/variables";

.breadcrumb {
  color: var(--theme-color-dove-gray);
  font-size: 13px;
  line-height: 18px;
  font-weight: 500;
  margin: 0;
  list-style-type: none;

  & ul,
  & li {
    display: inline-block;
    margin: 0;
    padding: 0;
  }

  & li {
    position: relative;
  }

  & span,
  & a {
    display: inline-block;
    text-decoration: none;
    overflow: visible;
    vertical-align: top;
    padding: 11px 4px 11px 0;
  }

  & svg {
    vertical-align: top;
  }

  & a > svg,
  & li > svg {
    stroke: var(--theme-color-dove-gray);
  }


  & span,
  & li:hover a {
    color: var(--theme-color-masala);
  }

  & a > svg,
  & span > svg {
    width: 18px;
    margin-right: 2px;
  }

  & li > svg {
    width: 10px;
    margin: 15px 4px;
    stroke-width: 2px;
  }

  & span > svg,
  & li:hover a svg {
    stroke: var(--theme-color-masala);
  }

  & li:nth-child(n+2) > span,
  & li:nth-child(n+2) > a {
    padding-left: 4px;
  }
}
</style>

