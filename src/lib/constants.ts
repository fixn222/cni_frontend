import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  PlusCircle,
  MessageSquare,
  Globe,
  Mail,
  MessageCircle,
} from "lucide-react";


import { ROUTES } from "./routes";

export const ADMIN_NAV = [
  {
    title: "Dashboard",
    href: ROUTES.ADMIN.ROOT,
    icon: LayoutDashboard,
  },
  {
    title: "Applications",
    href: ROUTES.ADMIN.APPLICATIONS,
    icon: FileText,
  },
  {
    title: "Users",
    href: ROUTES.ADMIN.USERS,
    icon: Users,
  },
  {
    title: "Settings",
    href: ROUTES.ADMIN.SETTINGS,
    icon: Settings,
  },
];

export const CLIENT_NAV = [
  {
    title: "Dashboard",
    href: ROUTES.CLIENT.ROOT,
    icon: LayoutDashboard,
  },
  {
    title: "My Applications",
    href: ROUTES.CLIENT.APPLICATIONS,
    icon: FileText,
  },
  {
    title: "New Application",
    href: ROUTES.CLIENT.NEW_APPLICATION,
    icon: PlusCircle,
  },
  {
    title: "Messages",
    href: ROUTES.CLIENT.MESSAGES,
    icon: MessageSquare,
  },
];
export const THEME = {
  colors: {
    primary: "from-blue-600 to-purple-600",
    background: "bg-neutral-950",
    card: "bg-white/5 backdrop-blur",
    border: "border-white/10",
  },

  radius: {
    lg: "rounded-2xl",
    md: "rounded-xl",
  },

  shadow: {
    soft: "shadow-lg shadow-black/20",
  },
};
export const SERVICES = [
  {
    id: "visa_processing",
    title: "Visa Processing",
    description:
      "Fast, expert handling of tourist, student, business, and work visas with complete transparency.",
    icon: Globe ,
    highlight: true,
  },
  {
    id: "document_preparation",
    title: "Document Preparation",
    description:
      "AI-powered document validation and preparation to ensure accuracy and reduce rejection risk.",
    icon: FileText,
  },
  {
    id: "email_automation",
    title: "Email Automation",
    description:
      "Automatically process client emails and extract structured visa data instantly using AI.",
    icon: Mail,
  },
  {
    id: "whatsapp_updates",
    title: "WhatsApp Updates",
    description:
      "Receive real-time updates and notifications directly on WhatsApp throughout the process.",
    icon: MessageCircle,
  },

];
export const API_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") ?? "http://localhost:8000";
