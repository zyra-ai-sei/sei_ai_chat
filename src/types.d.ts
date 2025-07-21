import { FixTypeLater } from "./interface/common.interface";

declare module "*.svg" {
  const content: FixTypeLater;
  export default content;
}

declare global {
  interface Window {
    gtag: FixTypeLater;
  }
}
interface Window {
  ethereum: FixTypeLater;
  dappWeb3Provider: FixTypeLater;
}
