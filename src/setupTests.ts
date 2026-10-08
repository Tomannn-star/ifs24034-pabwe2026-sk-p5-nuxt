import "@testing-library/jest-dom";
import { vi } from "vitest";

(globalThis as any).DELCOM_BASEURL = "https://open-api.delcom.org/api/v1";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

window.scrollTo = () => {};

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = String(value);
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
  writable: true,
});

vi.mock("sweetalert2", () => ({
  default: {
    fire: vi.fn().mockResolvedValue({ isConfirmed: true, isDenied: false, isDismissed: false }),
  },
}));

if (typeof window.URL.createObjectURL === "undefined") {
  window.URL.createObjectURL = vi.fn(() => "blob:mock-url");
}

const defaultResponse = {
  ok: true,
  status: 200,
  headers: {
    get: (name: string) => (name.toLowerCase() === "content-type" ? "application/json" : null),
  },
  json: async () => ({ success: true, data: {} }),
  text: async () => "{}",
};

global.fetch = vi.fn().mockResolvedValue(defaultResponse);
