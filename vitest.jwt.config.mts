import { defineConfig } from 'vitest/config';
export default defineConfig({test:{include:['src/app/**/*.jwt.spec.ts','src/app/**/*.producto.spec.ts'],setupFiles:['./jwt-test-setup.ts'],environment:'node'}});
