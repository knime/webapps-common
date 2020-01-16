<script>
/**
 * Static (Sub)Label for Elements that contain more than one input field
 */
export default {
    props: {
        text: {
            default: '',
            type: String
        }
    }
};
</script>

<template>
    <fieldset>
        <legend>{{ text }} <slot name="icon" /></legend>
        <slot></slot>
    </fieldset>
</template>

<style lang="postcss" scoped>
@import "../../css/variables";

fieldset {
    /* reset default styles */
    margin: 0;
    padding: 0;
    outline: none;
    border: none;

    & > legend {
        font-weight: 700;
        font-size: 16px;
        line-height: 24px;
        display: block;
        margin-bottom: 5px;
    }

    /* labels inside of the fieldset look different (smaller) */
    & >>> .knime-qf-title {
        font-weight: 300;
        font-size: 14px;
        line-height: 18px;
        display: block;
        margin-bottom: 5px;
    }

    & svg {
        margin-right: 0;
        height: 14px;
        width: 14px;
        stroke-width: calc(32px / 18);
        stroke: var(--theme-color-masala);
        cursor: pointer;
        display: block;
        float: right;
        margin-top: 5px;
        margin-left: 4px;
    }
}

</style>
