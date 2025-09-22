import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/

const replacePlugin = (mode) => {
  return {
    name: "html-inject-env",
    transformIndexHtml: (html) => {
      if (mode === "production") {
        return html.replace(
          "<!-- react_env -->",
          `<script src="./config/front.env.js"></script>
            <script src="./config/version.env.js"></script>
`
        );
      }
      return null;
    },
  };
};
export default defineConfig(({ mode }) => ({
  plugins: [react(), replacePlugin(mode), tailwindcss()],
}));

