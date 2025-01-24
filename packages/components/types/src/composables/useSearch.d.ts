import { type MaybeRef, type Ref } from "vue";
declare const _default: <T extends {
    text: string;
}>(searchTerm: Ref<string | null | undefined>, caseSensitiveSearch: Ref<boolean>, allValues: Ref<T[] | null>, isActive?: MaybeRef<boolean>) => Ref<T[]>;
export default _default;
