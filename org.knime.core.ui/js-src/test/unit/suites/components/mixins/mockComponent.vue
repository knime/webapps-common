<template>
  <div />
</template>
  
<script>
/**
   * Return a component to be used as dummy in order
   * to mock things like mixins.
   */
export default {
    name: 'MockComponent',
    props: {
        control: {
            default: () => ({}),
            type: Object
        }
    }
};
</script>
