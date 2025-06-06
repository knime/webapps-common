<script>
import ArrowNextIcon from "@knime/styles/img/icons/arrow-next.svg";

import Description from "../Description/Description.vue";

/**
 * This component displays a list of npm packages to be used on a credits/licenses
 * page. Each item in the list is displayed as the name of an npm package and can
 * be expanded to show the licenses text as well as a link to the remote repository
 * where the package is maintained. If the project uses additional npm packages, they
 * can be provided as a prop, where they will be de-duplicated before being displayed.
 *
 * It requires an additional build step to be run to generate the JSON file.
 * It is recommended to use the @knime/licenses 'license-check' tool in a postinstall step so that the file is
 * also present during development time.
 */
export default {
  name: "OpenSourceCredits",
  components: {
    Description,
    ArrowNextIcon,
  },
  props: {
    /**
     * Packages provided for display. They will be sorted and de-duplicated before being displayed.
     *
     * The packages should be the correct format when provided as a prop. For information
     * @see file:@knime/licenses/config/collect-packages-format.json
     *
     */
    packages: {
      type: Array,
      default: () => [],
    },
    /**
     * Additional packages may be provided for display. The packages (provided in an array)
     * will be combined with the packages imported from the `packages` prop. They will
     * be sorted and de-duplicated before being displayed.
     *
     * The packages should be the correct format when provided as a prop. For information
     * @see file:@knime/licenses/config/collect-packages-format.json
     *
     * Additionally, packages can have a `repository` property with a URL to their source.
     */
    additionalPackages: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      title: "Open Source Credits",
    };
  },
  computed: {
    displayPackages() {
      const allUniquePackages = [];

      this.packages.concat(this.additionalPackages).forEach((pkg) => {
        const alreadyExists = allUniquePackages.some(
          (firstPkg) =>
            firstPkg.name.toLowerCase() === pkg.name.toLowerCase() &&
            firstPkg.repository.toLowerCase() ===
              pkg.repository.toLowerCase() &&
            firstPkg.licenseText.replace(/\s+/g, "") ===
              pkg.licenseText.replace(/\s+/g, ""),
        );

        if (!alreadyExists) {
          allUniquePackages.push(pkg);
        }
      });

      // sort packages by name
      allUniquePackages.sort((a, b) => a.name.localeCompare(b.name));
      return allUniquePackages;
    },
  },
  methods: {
    toggleDetails(e) {
      const expanded = e.target.getAttribute("aria-expanded") === "true";
      e.target.setAttribute("aria-expanded", (!expanded).toString());
      e.target.parentElement.parentElement.classList[
        expanded ? "remove" : "add"
      ]("open");
    },
  },
};
</script>

<template>
  <main>
    <slot name="header" :title="title" />
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <Description
            text="This project uses open source software components. We say thanks to the developers of these components
            and acknowledge their work. Here we list all components which may be contained in portions in this web
            application. Please refer to the individual component source for detailed information."
          />
          <dl v-for="(pkg, index) of displayPackages" :key="index">
            <dt>
              <button aria-expanded="false" tabindex="0" @click="toggleDetails">
                <ArrowNextIcon />
                {{ pkg.name }}
              </button>
            </dt>
            <dd class="details">
              <a
                v-if="pkg.repository && pkg.repository.length"
                tabindex="0"
                :href="pkg.repository"
              >
                source
              </a>
              <pre>{{ pkg.licenseText }}</pre>
            </dd>
          </dl>
        </div>
      </div>
    </section>
  </main>
</template>

<style lang="postcss" scoped>
section:not(:first-child) {
  padding-top: 15px;
  padding-bottom: 55px;
}

dl {
  padding-left: 40px;
  list-style: none;

  & .details {
    display: none;
  }

  & button {
    cursor: pointer;
    font-weight: 300;
    color: var(--knime-masala);
    border: none;
    background-color: transparent;

    & svg {
      position: relative;
      top: 3px;
      height: 16px;
      width: 16px;
      transition: transform 0.2s ease-in-out;
      pointer-events: none;
    }
  }

  & button:active,
  & button:hover,
  & button:focus,
  & :deep(a:focus),
  & :deep(a:hover) {
    outline: none;
    font-weight: 400;
  }

  &.open {
    & svg {
      transform: rotate(90deg);
    }

    & .details {
      display: block;

      & pre {
        white-space: pre-wrap;
      }
    }
  }
}
</style>
