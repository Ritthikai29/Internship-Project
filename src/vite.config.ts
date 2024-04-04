import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import reactRefresh from '@vitejs/plugin-react-refresh';
// import { splitVendorChunkPlugin } from 'vite'

export default defineConfig({
  plugins: [react(), reactRefresh()],
  base:"/STSBidding/frontend",
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          fontawesome: [
            '@fortawesome/fontawesome-free',
            '@fortawesome/fontawesome-svg-core',
            '@fortawesome/free-solid-svg-icons',
            '@fortawesome/react-fontawesome',
          ],
          mui: ['@mui/x-date-pickers'],
          axios: ['axios'],
          dayjs: ['dayjs'],
          currencyInputField: ['react-currency-input-field'],
          reactIcons: ['@react-icons/all-files', 'react-icons'],
          reactNumberFormat: ['react-number-format'],
          reactPaginate: ['react-paginate'],
          reactRouterDom: ['react-router-dom'],
          reactSelect: ['react-select'],
          reactjsForms: ['reactjs-forms'],
          reactToPdf: ['react-to-pdf'],
          sweetalert2: ['sweetalert2', 'sweetalert2-react-content'],
          syncFusion: ['@syncfusion/ej2-react-splitbuttons'],
          flowbiteReact: ['flowbite-react'],
          validator: ['validator'],
        },
      },
    },
  },
});
