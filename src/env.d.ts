/// <reference types="astro/client" />

declare namespace App {
  interface Locals {}
}

interface ImportMetaEnv {
  readonly PUBLIC_DISPATCH_URL?: string;
  readonly ASTRO_DATABASE_FILE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
