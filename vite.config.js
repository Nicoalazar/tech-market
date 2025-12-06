import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'styled-components': path.resolve(__dirname, 'src/shims/styled-components.js'),
      'react-toastify': path.resolve(__dirname, 'src/shims/react-toastify.jsx'),
      'react-helmet': path.resolve(__dirname, 'src/shims/react-helmet.js'),
      'react-icons/fi': path.resolve(__dirname, 'src/shims/react-icons-fi.jsx'),
    },
  },
})
