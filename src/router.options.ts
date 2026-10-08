import type { RouterConfig } from "@nuxt/schema";
import routes, { setupAuthGuard } from "./routes";

export default <RouterConfig>{
  routes: (_routes) => routes,
};

