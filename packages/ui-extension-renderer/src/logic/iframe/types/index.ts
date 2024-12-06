type MethodSignature<
  Name extends string = string,
  Params extends any[] = any[],
  Result extends any = any,
> = {
  name: Name;
  params: Params;
  result: Result;
};
export type Method = (...args: any[]) => any;
export type API = Record<string, Method>;
type Names<T extends API> = keyof T & string;

type MethodSignatureForKey<T extends API, K extends Names<T>> = MethodSignature<
  K,
  Parameters<T[K]>,
  ReturnType<T[K]>
>;

// ProxyMehod

export type ProxyMethod<T extends MethodSignature> = (
  method: T["name"],
  ...params: T["params"]
) => T["result"];

type ProxyMethodForKey<T extends API, K extends Names<T>> = ProxyMethod<
  MethodSignatureForKey<T, K>
>;

export type ProxyMethodFor<T extends API> = {
  [K in Names<T>]: ProxyMethodForKey<T, K>;
}[Names<T>];

// Payload

type Payload<T extends MethodSignature> = {
  method: T["name"];
  params: T["params"];
};

export type PayloadForKey<T extends API, K extends Names<T>> = Payload<
  MethodSignatureForKey<T, K>
>;

// Request

export type IframeProxyMessageEvent<T = string> = {
  type: T;
  requestId: string;
};

export type RequestForKey<
  A extends API,
  K extends Names<A>,
> = IframeProxyMessageEvent<"UIExtensionRequest"> & {
  payload: PayloadForKey<A, K>;
};

export type RequestFor<A extends API> = {
  [K in Names<A>]: RequestForKey<A, K>;
}[Names<A>];

// Response

export type Response<T = any> =
  IframeProxyMessageEvent<"UIExtensionResponse"> & {
    payload: T;
  };
