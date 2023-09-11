export {};
declare global {
  export interface Window {
    getNodeViewInfo: () => any;
    closeCEFWindow?: () => void;
  }
}
