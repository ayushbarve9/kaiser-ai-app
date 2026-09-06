import React from "react";
import { FloatingDock, FloatingDockItem } from "./ui/floating-dock";
import {
  Home,
  LayoutDashboard,
  MapPin,
  ShieldCheck,
  PlusCircle,
  Award,
  Github,
  Search,
  Sparkles
} from "lucide-react";

export function FloatingDockDemo() {
  const links: FloatingDockItem[] = [
    {
      title: "Home",
      icon: <Home className="h-full w-full text-white" />,
      href: "/",
    },
    {
      title: "Grievances",
      icon: <LayoutDashboard className="h-full w-full text-white" />,
      href: "/dashboard",
    },
    {
      title: "Ward Map",
      icon: <MapPin className="h-full w-full text-white" />,
      href: "/map",
    },
    {
      title: "Officers",
      icon: <Award className="h-full w-full text-white" />,
      href: "/officers",
    },
    {
      title: "Control Room",
      icon: <ShieldCheck className="h-full w-full text-white" />,
      href: "/admin",
    },
    {
      title: "File Grievance",
      icon: <PlusCircle className="h-full w-full text-[#cfdaf5]" />,
      href: "/report",
    },
    {
      title: "GitHub Repo",
      icon: <Github className="h-full w-full text-white" />,
      href: "https://github.com/ayushbarve9/kaiser-ai-app",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center py-6 w-full max-w-7xl mx-auto px-4">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#cfdaf5] text-[#2b59d1] font-mono text-[10px] uppercase tracking-wider border border-[#2b59d1]/20 mb-3">
        <Sparkles className="w-3.5 h-3.5 text-[#2b59d1]" />
        <span>Aceternity UI Interactive Dock Bar</span>
      </div>
      <FloatingDock items={links} />
    </div>
  );
}
