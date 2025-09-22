declare global {
  interface ImportMetaEnv {
    readonly VITE_URL_API?: string;
    
    readonly VITE_LOGO?: string;
    readonly VERSION?: string;
    readonly PORT?: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }

  interface Window {
    env?: { [key: string]: any };
  }
}
export const api= import.meta.env.VITE_URL_API || window.env?.VITE_URL_API || "http://localhost:9001";
export const port = import.meta.env.PORT || window.env?.PORT || "9002";
export const logo = import.meta.env.VITE_LOGO || window.env?.VITE_LOGO;
export const version = import.meta.env.VERSION || window.env?.VERSION;