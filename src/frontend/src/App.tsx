import { Layout } from "@/components/Layout";
import { HomePage } from "@/pages/Home";
import { PagoExitosoPage } from "@/pages/PagoExitoso";
import { ServiciosPage } from "@/pages/Servicios";
import { UnetePage } from "@/pages/Unete";
import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

const rootRoute = createRootRoute({
  component: Layout,
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const serviciosRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/servicios",
  component: ServiciosPage,
});

const uneteRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/unete",
  component: UnetePage,
});

const pagoExitosoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/pago-exitoso",
  component: PagoExitosoPage,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  serviciosRoute,
  uneteRoute,
  pagoExitosoRoute,
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
