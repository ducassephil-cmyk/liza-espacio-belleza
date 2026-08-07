import { Layout } from "@/components/Layout";
import { DashboardPage } from "@/pages/Dashboard";
import { HomePage } from "@/pages/Home";
import { PagoExitosoPage } from "@/pages/PagoExitoso";
import { ServiciosPage } from "@/pages/Servicios";
import { UnetePage } from "@/pages/Unete";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

// Root with no wrapper — each branch opts into its own shell
const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// Public site: Layout (nav + footer)
const publicRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "public",
  component: Layout,
});

const homeRoute = createRoute({
  getParentRoute: () => publicRoute,
  path: "/",
  component: HomePage,
});

const serviciosRoute = createRoute({
  getParentRoute: () => publicRoute,
  path: "/servicios",
  component: ServiciosPage,
});

const uneteRoute = createRoute({
  getParentRoute: () => publicRoute,
  path: "/unete",
  component: UnetePage,
});

const pagoExitosoRoute = createRoute({
  getParentRoute: () => publicRoute,
  path: "/pago-exitoso",
  component: PagoExitosoPage,
});

// Dashboard: no public Layout
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: DashboardPage,
});

const routeTree = rootRoute.addChildren([
  publicRoute.addChildren([homeRoute, serviciosRoute, uneteRoute, pagoExitosoRoute]),
  dashboardRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
