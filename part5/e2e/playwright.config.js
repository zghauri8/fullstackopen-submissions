// @ts-check
import { defineConfig } from '@playwright/test'
export default defineConfig({
  timeout: 30000,
  use: {
    headless: true,
    baseURL: 'http://localhost:5173',
  },
})