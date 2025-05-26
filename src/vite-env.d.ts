interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_APP_TITLE: string;
  readonly VITE_THREE_PATH: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}