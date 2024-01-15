export {};
declare global {
  export interface Window {
    getNodeViewInfo: () => any;
    closeCEFWindow?: () => void;
  }

  interface Crypto {
    randomUUID: () => `${string}-${string}-${string}-${string}-${string}`;
  }
}
