<script>
let labelForId = 0;
/**
 * Default label component
 *
 * Usage:
 * <Label text="label">
 *   <template #default="{ labelForId }">
 *     <input :id="labelForId" type="text">
 *   </template>
 * </Label>
 *
 * Or standalone usage:
 * <Label text="label" :generateId="false" />
 *
 */
export default {
    props: {
        generateId: {
            type: Boolean,
            default: true
        },
        idPrefix: {
            type: String,
            default: 'comp'
        },
        text: {
            default: '',
            type: String
        }
    },
    computed: {
        labelFor() {
            if (this.generateId) {
                return `${this.idPrefix}-${this.labelForId}`;
            }
            return null;
        },
        labelId() {
            if (this.generateId) {
                return `label-${this.labelFor}`;
            }
            return null;
        }
    },
    beforeCreate() {
        labelForId += 1;
        Object.defineProperties(this, {
            labelForId: {
                get() {
                    return labelForId;
                }
            }
        });
    }
};
</script>

<template>
  <div class="label-wrapper">
    <label
      :id="labelId"
      :for="labelFor"
      class="label-text"
      v-text="text"
    />
    <slot :labelForId="labelFor" />
  </div>
</template>

<style lang="postcss" scoped>
@import "../../css/variables";

.label-wrapper {
  margin-top: 0;
}

.label-text {
  font-weight: 700;
  font-size: 16px;
  font-family: var(--theme-text-bold-font-family);
  color: var(--theme-text-bold-color);
  line-height: 20px;
  display: block;
  width: max-content;
  margin-bottom: 10px;
}
</style>
