const AuthLayout = () => import("./features/auth/layouts/AuthLayout.vue");
const LoginPage = () => import("./features/auth/pages/LoginPage.vue");
const RegisterPage = () => import("./features/auth/pages/RegisterPage.vue");

const CashFlowLayout = () => import("./features/cashflows/layouts/CashFlowLayout.vue");
const HomePage = () => import("./features/cashflows/pages/HomePage.vue");
const DetailPage = () => import("./features/cashflows/pages/DetailPage.vue");

const UsersPage = () => import("./features/users/pages/UsersPage.vue");
const ProfilePage = () => import("./features/users/pages/ProfilePage.vue");

const NotFoundPage = () => import("./features/common/pages/NotFoundPage.vue");
import { getAccessToken } from "./helpers/apiHelper";

const routes = [
  {
    path: "/auth",
    component: AuthLayout,
    children: [
      {
        path: "login",
        name: "login",
        component: LoginPage,
      },
      {
        path: "register",
        name: "register",
        component: RegisterPage,
      },
    ],
  },
  {
    path: "/",
    component: CashFlowLayout,
    children: [
      {
        path: "",
        name: "home",
        component: HomePage,
      },
      {
        path: "cash-flows/:cashFlowId",
        name: "cashflow-detail",
        component: DetailPage,
      },
      {
        path: "users",
        name: "users",
        component: UsersPage,
      },
      {
        path: "profile",
        name: "profile",
        component: ProfilePage,
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: NotFoundPage,
  },
];

export function setupAuthGuard(router: any) {
  router.beforeEach((to: any) => {
    const token = getAccessToken();
    const isAuthRoute = to.path.startsWith("/auth");

    if (!token && !isAuthRoute) {
      return "/auth/login";
    }

    if (token && isAuthRoute) {
      return "/";
    }
  });
}

export default routes;

