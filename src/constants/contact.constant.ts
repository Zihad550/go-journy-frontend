import { type QuickActionCardProps } from "@/components/contact/QuickActionCard";
// Contains contact information used across the application
export const CONTACT_INFO = {
  email: "jehadhossain008@gmail.com",
};

export const contactQuickActions: QuickActionCardProps[] = [
  {
    id: "safety-issue",
    title: "Report Safety Issue",
    description: "Immediate safety concerns during rides or with drivers",
    colorTheme: "red",
  },
  {
    id: "driver-registration",
    title: "Driver Registration",
    description: "Questions about becoming a driver or driver account issues",
    colorTheme: "blue",
  },
  {
    id: "payment-billing",
    title: "Payment & Billing",
    description: "Issues with payments, refunds, or billing inquiries",
    colorTheme: "green",
  },
];
