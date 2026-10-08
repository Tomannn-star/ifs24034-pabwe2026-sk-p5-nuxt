import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { createRouter, createMemoryHistory } from "vue-router";
import routes from "./routes";

export function createMockPinia(initialState = {}) {
  const pinia = createPinia();
  setActivePinia(pinia);
  Object.entries(initialState).forEach(([storeId, state]) => {
    pinia.state.value[storeId] = { ...(state as any) };
  });
  return pinia;
}

export function renderWithProviders(component: any, options: Record<string, any> = {}) {
  const {
    initialState = {},
    initialRoute = "/",
    props = {},
    slots = {},
    global = {},
    ...mountOptions
  } = options;

  const pinia = options.pinia || createMockPinia(initialState);
  const router = options.router || createRouter({
    history: createMemoryHistory(),
    routes: routes as any,
  });

  router.push(initialRoute);

  const wrapper = mount(component, {
    props,
    slots,
    global: {
      ...global,
      plugins: [pinia, router, ...(global.plugins || [])],
      stubs: {
        teleport: true,
        RouterLink: { template: "<a><slot /></a>" },
        ...(global.stubs || {}),
      },
      mocks: {
        ...(global.mocks || {}),
      },
    },
    ...mountOptions,
  });

  return Object.assign(wrapper, {
    pinia,
    router,
  });
}
