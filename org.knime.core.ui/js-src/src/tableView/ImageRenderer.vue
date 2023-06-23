<script setup lang="ts">
import { uniqueId } from 'lodash';
import { computed, ref, watch, onMounted, type Ref } from 'vue';
import { fetchImage } from './utils/images';
import { useStore } from 'vuex';

const props = defineProps<{
    path: string,
    baseUrl: string,
    height?: number,
    width?: number,
    update?: boolean,
    includeDataInHtml: boolean
}>();

const emit = defineEmits(['pending', 'rendered']);

const inlinedSrc: Ref<false | string> = ref(false);

// TODO: UIEXT-887 We don't want to have to access the store here.
const store = useStore();
const imageUrl = computed(() => store.getters['api/uiExtResourceLocation']({ resourceInfo: {
    baseUrl: props.baseUrl,
    path: props.path
} }));
const urlWithDimensions = computed(() => props.width && props.height
    ? `${imageUrl.value}?w=${Math.floor(props.width)}&h=${Math.floor(props.height)}`
    : imageUrl.value);

onMounted(async () => {
    if (props.includeDataInHtml) {
        const uuid = uniqueId('Image');
        if (props.includeDataInHtml) {
            emit('pending', uuid);
        }
        inlinedSrc.value = await fetchImage(urlWithDimensions.value);
        emit('rendered', uuid);
    }
});

let fixedSrc: null | string = null;
watch(() => props.update, (update) => {
    fixedSrc = update ? null : urlWithDimensions.value;
}, { immediate: true });
</script>

<template>
  <img
    v-if="!includeDataInHtml || inlinedSrc"
    loading="lazy"
    :src="includeDataInHtml ? inlinedSrc : fixedSrc || urlWithDimensions"
    alt=""
  >
</template>
