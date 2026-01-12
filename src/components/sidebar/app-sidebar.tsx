"use client";

import { LayoutDashboard, FileText, Settings, Stethoscope } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { CardDescription } from "../ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";

export function AppSidebar() {
  const { open } = useSidebar();
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";

  const menuItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      adminOnly: false,
    },
    {
      title: "Form Aduan ",
      url: "/request",
      icon: FileText,
      adminOnly: false,
    },
    {
      title: "Kelola Data",
      url: "/dashboard/manage",
      icon: Settings,
      adminOnly: true,
    },
  ];

  const visibleMenuItems = menuItems.filter(
    (item) => !item.adminOnly || isAdmin
  );

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader
        className={cn(
          "overflow-hidden transition-all duration-500 ease-in-out",
          open
            ? "px-4 pt-4 block opacity-100"
            : "px-2 pt-4 flex items-center justify-center opacity-100"
        )}
      >
        <SidebarMenu>
          <SidebarMenuButton asChild className="hover:bg-accent/50 h-full">
            {open ? (
              <div className="flex items-center gap-3 w-full px-2">
                <Stethoscope className="h-6 w-6 text-primary-600 dark:text-primary-300 shrink-0" />
                <div className="flex flex-col items-start overflow-hidden">
                  <p className="text-lg font-bold text-primary-600 dark:text-primary-300 truncate">
                    SIMPKES
                  </p>
                  <CardDescription className="text-xs text-wrap w-full">
                    Sistem Informasi Manajemen Pemeliharaan Alat Kesehatan
                  </CardDescription>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center w-full">
                <Stethoscope className="h-6 w-6 text-primary-600 dark:text-primary-300" />
              </div>
            )}
          </SidebarMenuButton>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent
        className={cn(
          "flex flex-col gap-4 transition-all duration-300",
          open ? "px-4 py-2" : "px-2 pt-4"
        )}
      >
        <SidebarMenu>
          <SidebarGroup>
            <SidebarGroupContent className="space-y-1">
              {visibleMenuItems.map((item) => (
                <SidebarMenuButton
                  key={item.title}
                  asChild
                  isActive={pathname === item.url}
                >
                  <Link
                    href={item.url}
                    className={cn(!open && "justify-center px-2")}
                  >
                    <item.icon className={cn(!open && "h-5 w-5")} />
                    {open && <span>{item.title}</span>}
                  </Link>
                </SidebarMenuButton>
              ))}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter
        className={cn(
          "w-full bg-accent/50 backdrop-blur supports-backdrop-filter:bg-background/60 transition-all duration-300",
          open ? "p-4" : "p-2"
        )}
      >
        {open ? (
          <p className="text-sm text-center">
            Made by <br />
            <Link href={"https://github.com/illufoxKusanagi"}>
              <span className="hover:underline text-primary-600 dark:text-primary-300">
                Illufox Kusanagi
              </span>
            </Link>
          </p>
        ) : (
          <div className="flex items-center justify-center">
            <Link href={"https://github.com/illufoxKusanagi"}>
              <span className="text-xl">Love</span>
            </Link>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
