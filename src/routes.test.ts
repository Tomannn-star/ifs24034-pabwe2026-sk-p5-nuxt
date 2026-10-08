import { describe, it, expect, beforeEach, vi } from "vitest";
import routes, { setupAuthGuard } from "./routes";
import * as apiHelper from "./helpers/apiHelper";

describe("routes and authGuard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should define all expected routes", () => {
    expect(routes.length).toBeGreaterThanOrEqual(3);
    const authRoute = routes.find((r) => r.path === "/auth");
    const dashboardRoute = routes.find((r) => r.path === "/");
    expect(authRoute).toBeDefined();
    expect(dashboardRoute).toBeDefined();
  });

  it("should redirect unauthenticated users to /auth/login", () => {
    vi.spyOn(apiHelper, "getAccessToken").mockReturnValue(null);

    let guardFn: any = null;
    const mockRouter = {
      beforeEach: vi.fn((fn) => {
        guardFn = fn;
      }),
    };

    setupAuthGuard(mockRouter);
    expect(mockRouter.beforeEach).toHaveBeenCalled();

    const redirect = guardFn({ path: "/" });
    expect(redirect).toBe("/auth/login");
  });

  it("should redirect authenticated users to / when accessing auth routes", () => {
    vi.spyOn(apiHelper, "getAccessToken").mockReturnValue("valid-token");

    let guardFn: any = null;
    const mockRouter = {
      beforeEach: vi.fn((fn) => {
        guardFn = fn;
      }),
    };

    setupAuthGuard(mockRouter);
    const redirect = guardFn({ path: "/auth/login" });
    expect(redirect).toBe("/");
  });

  it("should allow authenticated users to access protected routes", () => {
    vi.spyOn(apiHelper, "getAccessToken").mockReturnValue("valid-token");

    let guardFn: any = null;
    const mockRouter = {
      beforeEach: vi.fn((fn) => {
        guardFn = fn;
      }),
    };

    setupAuthGuard(mockRouter);
    const redirect = guardFn({ path: "/users" });
    expect(redirect).toBeUndefined();
  });
});

