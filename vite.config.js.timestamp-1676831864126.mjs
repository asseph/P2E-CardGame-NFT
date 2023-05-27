// vite.config.js
import { defineConfig } from "file:///C:/Users/Chrigeeel/shuffle/frontend_rewrite/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/Chrigeeel/shuffle/frontend_rewrite/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { NodeGlobalsPolyfillPlugin } from "file:///C:/Users/Chrigeeel/shuffle/frontend_rewrite/node_modules/@esbuild-plugins/node-globals-polyfill/dist/index.js";
var vite_config_default = defineConfig({
  plugins: [
    react({
      include: "**/*.jsx"
    })
  ],
  define: {
    "process.env": {}
  },
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: "globalThis"
      },
      // Enable esbuild polyfill plugins
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true
        })
      ]
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxDaHJpZ2VlZWxcXFxcc2h1ZmZsZVxcXFxmcm9udGVuZF9yZXdyaXRlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxDaHJpZ2VlZWxcXFxcc2h1ZmZsZVxcXFxmcm9udGVuZF9yZXdyaXRlXFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9DaHJpZ2VlZWwvc2h1ZmZsZS9mcm9udGVuZF9yZXdyaXRlL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCByZWFjdCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3RcIjtcblxuaW1wb3J0IHsgTm9kZUdsb2JhbHNQb2x5ZmlsbFBsdWdpbiB9IGZyb20gXCJAZXNidWlsZC1wbHVnaW5zL25vZGUtZ2xvYmFscy1wb2x5ZmlsbFwiO1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcblx0cGx1Z2luczogW1xuXHRcdHJlYWN0KHtcblx0XHRcdGluY2x1ZGU6IFwiKiovKi5qc3hcIixcblx0XHR9KSxcblx0XSxcblx0ZGVmaW5lOiB7XG5cdFx0XCJwcm9jZXNzLmVudlwiOiB7fSxcblx0fSxcblx0b3B0aW1pemVEZXBzOiB7XG5cdFx0ZXNidWlsZE9wdGlvbnM6IHtcblx0XHRcdC8vIE5vZGUuanMgZ2xvYmFsIHRvIGJyb3dzZXIgZ2xvYmFsVGhpc1xuXHRcdFx0ZGVmaW5lOiB7XG5cdFx0XHRcdGdsb2JhbDogXCJnbG9iYWxUaGlzXCIsXG5cdFx0XHR9LFxuXHRcdFx0Ly8gRW5hYmxlIGVzYnVpbGQgcG9seWZpbGwgcGx1Z2luc1xuXHRcdFx0cGx1Z2luczogW1xuXHRcdFx0XHROb2RlR2xvYmFsc1BvbHlmaWxsUGx1Z2luKHtcblx0XHRcdFx0XHRidWZmZXI6IHRydWUsXG5cdFx0XHRcdH0pLFxuXHRcdFx0XSxcblx0XHR9LFxuXHR9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTZULFNBQVMsb0JBQW9CO0FBQzFWLE9BQU8sV0FBVztBQUVsQixTQUFTLGlDQUFpQztBQUcxQyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMzQixTQUFTO0FBQUEsSUFDUixNQUFNO0FBQUEsTUFDTCxTQUFTO0FBQUEsSUFDVixDQUFDO0FBQUEsRUFDRjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ1AsZUFBZSxDQUFDO0FBQUEsRUFDakI7QUFBQSxFQUNBLGNBQWM7QUFBQSxJQUNiLGdCQUFnQjtBQUFBO0FBQUEsTUFFZixRQUFRO0FBQUEsUUFDUCxRQUFRO0FBQUEsTUFDVDtBQUFBO0FBQUEsTUFFQSxTQUFTO0FBQUEsUUFDUiwwQkFBMEI7QUFBQSxVQUN6QixRQUFRO0FBQUEsUUFDVCxDQUFDO0FBQUEsTUFDRjtBQUFBLElBQ0Q7QUFBQSxFQUNEO0FBQ0QsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
