<script>
import Collapser from '../Collapser';
import Description from '../Description';

export default {
    components: {
        Collapser,
        Description
    },
    props: {
        options: {
            type: Array,
            default: () => []
        }
    }
};
</script>

<template>
  <div v-if="options.length">
    <template
      v-for="(option, index) in options"
    >
      <Component
        :is="option.sectionName ? 'Collapser' : 'div'"
        v-if="(option.fields && option.fields.length) || option.sectionDescription"
        :key="index"
        :class="['options', { 'with-section' : option.sectionName}]"
        :initially-expanded="options.length === 1"
      >
        <template v-slot:title><h5>{{ option.sectionName }}</h5></template>
        <Description
          v-if="option.sectionDescription"
          :text="option.sectionDescription"
          :render-as-html="true"
          class="section-description"
        />
        <ul class="panel">
          <li
            v-for="(field, fieldIndex) in option.fields"
            :key="fieldIndex"
          >
            <p class="option-field-name">
              {{ field.name }}
              <span
                v-if="field.optional"
                class="optional"
              >
                (optional)
              </span>
            </p>

            <!-- Possible markup: "Extended description" -->
            <!-- See here: https://bitbucket.org/KNIME/knime-core/src/03569e7ae48f6d89cb337f146ecc1364a114a9dc/org.knime.core/src/eclipse/org/knime/core/node/Node_v3.6.xsd#Node_v3.6.xsd-316 -->
            <Description
              class="option-description"
              :text="field.description"
              :render-as-html="true"
            />
          </li>
        </ul>
      </Component>
    </template>
  </div>
</template>

<style lang="postcss" scoped>
@import "webapps-common/ui/css/variables";

h5 {
  padding: 15px 30px;
  margin: 0;
  position: relative;
}

.options {
  padding-top: 20px;
  margin-bottom: 10px;
  background-color: var(--knime-white);

  & .panel {
    margin: 0;
    padding: 0 30px 10px 60px;
  }

  &.with-section {
    padding-top: 0;
  }
}

li {
  margin-bottom: 14px;
}

.option-field-name {
  display: block;
  margin: 0;
  padding: 0;
  font-size: 16px;
  line-height: 20px;
  font-style: normal;
  font-weight: bold;
}

.option-description {
  font-size: 16px;
  line-height: 28px;

  @media only screen and (max-width: 900px) {
    font-size: 13px;
    line-height: 24px;
  }
}

.optional {
  font-weight: normal;
}

.section-description {
  font-size: 16px;
  padding: 0 30px 15px 30px;
}
</style>
