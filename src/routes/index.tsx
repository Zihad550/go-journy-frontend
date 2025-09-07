import App from "@/App";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Role } from "@/constants";
import { withAuth } from "@/lib/withAuth";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import FAQ from "@/pages/FAQ";
import Features from "@/pages/Features";
import ForgotPassword from "@/pages/ForgotPassword";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Profile from "@/pages/Profile";
import Register from "@/pages/Register";
import ResetPassword from "@/pages/ResetPassword";
import { generateRoutes } from "@/utils/generateRoutes";
import { createBrowserRouter, Navigate } from "react-router";
import { adminSidebarItems } from "./adminSidebarItems";
import { driverSidebarItems } from "./driverSidebarItemsk";
import { riderSidebarItems } from "./riderSidebarItems";

export const router = createBrowserRouter([
  {
    Component: App,
    path: "/",
    children: [
      {
        Component: Home,
        index: true,
      },
      {
        Component: About,
        path: "about",
      },
      {
        Component: Features,
        path: "features",
      },
      {
        Component: Contact,
        path: "contact",
      },
      {
        Component: FAQ,
        path: "faq",
      },
    ],
  },
  {
    Component: withAuth(DashboardLayout, Role.SUPER_ADMIN),
    path: "/admin",
    children: [
      { index: true, element: <Navigate to="/admin/analytics" /> },
      ...generateRoutes(adminSidebarItems),
    ],
  },
  {
    Component: withAuth(DashboardLayout, Role.ADMIN),
    path: "/admin",
    children: [
      { index: true, element: <Navigate to="/admin/analytics" /> },
      ...generateRoutes(adminSidebarItems),
    ],
  },
  {
    Component: withAuth(DashboardLayout, Role.RIDER),
    path: "/rider",
    children: [
      { index: true, element: <Navigate to="/rider/ride-history" /> },
      ...generateRoutes(riderSidebarItems),
    ],
  },
  {
    Component: withAuth(DashboardLayout, Role.DRIVER),
    path: "/driver",
    children: [
      { index: true, element: <Navigate to="/driver/ride-history" /> },
      ...generateRoutes(driverSidebarItems),
    ],
  },
  {
    Component: Login,
    path: "/login",
  },
  {
    Component: Register,
    path: "/register",
  },
  {
    Component: ForgotPassword,
    path: "/forgot-password",
  },
  {
    Component: ResetPassword,
    path: "/reset-password",
  },
  {
    Component: Profile,
    path: "/profile",
  },
]);
