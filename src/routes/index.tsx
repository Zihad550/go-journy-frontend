import App from "@/app";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Role } from "@/constants";
import { withAuth } from "@/lib/with-auth";
import About from "@/pages/about";
import BookRide from "@/pages/rider/book-ride";
import Contact from "@/pages/contact";
import DriverRegistration from "@/pages/driver-registration";
import Features from "@/pages/features";
import Help from "@/pages/help";
import ForgotPassword from "@/pages/forgot-password";
import Home from "@/pages/home";
import Login from "@/pages/login";
import PaymentCancel from "@/pages/payment-cancel";
import PaymentFail from "@/pages/payment-fail";
import PaymentSuccess from "@/pages/payment-success";
import Privacy from "@/pages/privacy";
import Profile from "@/pages/profile";
import Register from "@/pages/register";
import ResetPassword from "@/pages/reset-password";
import VerifyOtp from "@/pages/verify-otp";
import { generateRoutes } from "@/utils/generate-routes";
import { createBrowserRouter, Navigate } from "react-router";
import { adminSidebarItems } from "./admin-sidebar-items";
import { driverSidebarItems } from "./driver-sidebar-itemsk";
import { riderSidebarItems } from "./rider-sidebar-items";

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
        Component: Privacy,
        path: "privacy",
      },
      {
        Component: Help,
        path: "help",
      },
      {
        Component: BookRide,
        path: "book-ride",
      },
    ],
  },
  {
    Component: withAuth(DashboardLayout, [Role.ADMIN, Role.SUPER_ADMIN]),
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
      { index: true, element: <Navigate to="/rider/analytics" /> },
      ...generateRoutes(riderSidebarItems),
    ],
  },
  {
    Component: withAuth(DashboardLayout, Role.DRIVER),
    path: "/driver",
    children: [
      { index: true, element: <Navigate to="/driver/analytics" /> },
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
    Component: VerifyOtp,
    path: "/verify-otp",
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
  {
    Component: withAuth(DriverRegistration),
    path: "/driver-registration",
  },
  {
    Component: PaymentSuccess,
    path: "/payment/success",
  },
  {
    Component: PaymentFail,
    path: "/payment/fail",
  },
  {
    Component: PaymentCancel,
    path: "/payment/cancel",
  },
]);
