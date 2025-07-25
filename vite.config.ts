import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { tempo } from "tempo-devtools/dist/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tempo()],
  server: {
    proxy: {
      "/api": {
        target: "http://35.225.173.123:8000", // Ensure port 8000 is explicitly specified
        changeOrigin: true,
        rewrite: (path) => {
          console.log(`[Proxy Rewrite] Original Path: ${path}`);
          const rewrittenPath = path.replace(/^\/api/, "");
          console.log(`[Proxy Rewrite] Rewritten Path: ${rewrittenPath}`);
          return rewrittenPath;
        },
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq, req) => {
            console.log(`[Proxy Request] URL: ${req.url}`);
            console.log(`[Proxy Request] Headers:`, req.headers);
            
            // Ensure Authorization header is properly forwarded
            const authHeader = req.headers['authorization'];
            if (authHeader) {
              console.log(`[Proxy Request] Forwarding Authorization header: ${authHeader}`);
              proxyReq.setHeader('Authorization', authHeader);
            }
          });
          proxy.on("proxyRes", (proxyRes, req) => {
            console.log(`[Proxy Response] URL: ${req.url}`);
            console.log(`[Proxy Response] Status Code: ${proxyRes.statusCode}`);
            if (proxyRes.statusCode && proxyRes.statusCode >= 400) {
              console.log(`[Proxy Response Error] Headers:`, proxyRes.headers);
            }
          });
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
