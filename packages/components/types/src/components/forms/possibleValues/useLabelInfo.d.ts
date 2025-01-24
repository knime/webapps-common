import { type Ref } from "vue";
import { type Id, type PossibleValue } from "./types";
/**
 * Create label for Searchable Widgets - Twinlist - SearchableCheckboxes - SearchableList
 */
export declare const useLabelInfo: (filteredValues: Ref<PossibleValue[] | null>, numAllValues: number, selectedValues?: Ref<Id[]>) => string;
