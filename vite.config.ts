import { defineConfig } from 'vite'

export default defineConfig(async () => {
  // Dynamically import the plugin to avoid ESM/CJS loader issues in some envs
  const react = (await import('@vitejs/plugin-react')).default
  return {
    plugins: [react()]
  }
})
