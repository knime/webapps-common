/**
 *  This file is only used to check that the exposed API Layer for embedders
 * is exactly the layer required by all of the services
 */
import { UIExtensionServiceAPILayer } from "@/types";

import {
  AlertingServiceAPILayer,
  ColorServiceAPILayer,
  DataValueViewAPILayer,
  DialogServiceAPILayer,
  ImageGenerationServiceAPILayer,
  JsonDataServiceAPILayer,
  ReportingServiceAPILayer,
  ResourceServiceAPILayer,
  SelectionServiceAPILayer,
  SharedDataServiceAPILayer,
} from "./serviceApiLayers";

/**
 * Helper type because Promise<A> & Promise<B> is not the same as
 * Promise<A & B> but we want that to be the case for the combiner below
 */
type MergePromises<T, S> =
  T extends Promise<infer A>
    ? S extends Promise<infer B>
      ? Promise<A & B>
      : never
    : S & T;

/**
 * Merges the fields of two APIs so that return types are combined
 * with MergePromises for fields with the same name
 */
type MergeReturnTypesOfTwo<F1, F2> = {
  [K in keyof F1 | keyof F2]: K extends keyof F1
    ? F1[K] extends (...args: any[]) => infer R1
      ? K extends keyof F2
        ? F2[K] extends (...args: any[]) => infer R2
          ? (...args: Parameters<F1[K]>) => MergePromises<R1, R2>
          : never
        : F1[K]
      : never
    : K extends keyof F2
      ? F2[K]
      : never;
};

type MergeReturnTypes<T extends any[]> = T extends [
  infer F1,
  infer F2,
  ...infer Rest,
]
  ? MergeReturnTypes<[MergeReturnTypesOfTwo<F1, F2>, ...Rest]>
  : T extends [infer Last]
    ? Last
    : never;

/**
 * The API Layer required by all services.
 * If a service is added, add its baseService API to this list.
 */
type ServicesAPILayer = MergeReturnTypes<
  [
    AlertingServiceAPILayer,
    ColorServiceAPILayer,
    DataValueViewAPILayer,
    DialogServiceAPILayer,
    ImageGenerationServiceAPILayer,
    JsonDataServiceAPILayer,
    ReportingServiceAPILayer,
    ResourceServiceAPILayer,
    SelectionServiceAPILayer,
    SharedDataServiceAPILayer,
  ]
>;

/**
 * The value of these types is not important.
 * We use them to check that something extends something else.
 */
type CanBeUsedInServices<_T extends ServicesAPILayer> = true;
type IsUIExtensionAPILayer<_T extends UIExtensionServiceAPILayer> = true;

/**
 * If the APILayer exposed to the embedder contains less or more
 * than required by the services that it should be used with by the client,
 * there will be a typescirpt error here.
 */
export type APILayerIsExactlyAsRequired =
  CanBeUsedInServices<UIExtensionServiceAPILayer> &
    IsUIExtensionAPILayer<ServicesAPILayer>;
