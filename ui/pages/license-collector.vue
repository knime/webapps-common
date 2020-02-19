<script>
import packages from '../../buildtools/opensourcecredits/used-packages.json';
import Description from '../components/Description';

export default {
    components: {
        Description
    },
    props: {
        additionalPackages: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            title: 'Open Source Credits'
        };
    },
    computed: {
        packages() {
            return packages.concat(this.additionalPackages).filter((pkg, pos, arr) =>  arr.indexOf(pkg) === pos);
        }
    },
    head() {
        return {
            title: this.title,
            meta: [{ name: 'robots', content: 'noindex,nofollow' }]
        };
    }
};
</script>

<template>
  <main>
    <slot
      name="header"
      :title="title"
    />
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <Description
            text="This project uses open source software components. We say thanks to the developers of these components
            and acknowledge their work. Here we list all components which may be contained in portions in this web
            application. Please refer to the individual component source for detailed information."
          />
          <ul>
            <li
              v-for="(pkg, index) of packages"
              :key="index"
            >
              <details>
                <summary>{{ pkg.name }}</summary>
                <div>
                  <a
                    v-if="pkg.repository && pkg.repository.length"
                    :href="pkg.repository"
                  >
                    source
                  </a>
                  <pre>{{ pkg.licenseText }}</pre>
                </div>
              </details>
            </li>
          </ul>
        </div>
      </div>
    </section>
  </main>
</template>


<style lang="postcss" scoped>
@import "webapps-common/ui/css/variables";

section:not(:first-child) {
  padding-top: 15px;
  padding-bottom: 55px;
}

summary {
  cursor: pointer;
  display: inline;
}

ul {
  list-style: none;
}
</style>
