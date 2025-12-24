const config = {
  baseUrl: import.meta.env.VITE_API_BASE_URL,
};

export default config;

// Export Mapbox configuration
export * from "./mapbox-config";

export const demoCredentials = {
  driver: { email: import.meta.env.VITE_DEMO_DRIVER_EMAIL, password: import.meta.env.VITE_DEMO_DRIVER_PASSWORD },
  rider: { email: import.meta.env.VITE_DEMO_RIDER_EMAIL, password: import.meta.env.VITE_DEMO_RIDER_PASSWORD },
  admin: { email: import.meta.env.VITE_DEMO_ADMIN_EMAIL, password: import.meta.env.VITE_DEMO_ADMIN_PASSWORD },
};
