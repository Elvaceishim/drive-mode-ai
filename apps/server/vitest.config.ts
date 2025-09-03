import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    // @ts-expect-error: Type mismatch due to multiple vite installations
    tailwindcss(),
  ],
})