import { Check, Form, Home } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "dashboard",
    icon: Home,
  },
  {
    title: "Form",
    url: "request",
    icon: Form,
  },
  {
    title: "Cek Status",
    url: "status",
    icon: Check,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
// "use client";
// import {
//   Building,
//   Calendar,
//   Calendar1,
//   ChevronDown,
//   Code,
//   Cog,
//   Database,
//   DatabaseIcon,
//   DatabaseZap,
//   HelpCircle,
//   Home,
//   LayoutDashboard,
//   Network,
//   PersonStandingIcon,
//   Pin,
//   Server,
//   Ticket,
//   TicketCheck,
// } from "lucide-react";

// import {
//   Sidebar,
//   SidebarContent,
//   SidebarFooter,
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarHeader,
//   SidebarMenu,
//   SidebarMenuButton,
//   useSidebar,
// } from "@/components/ui/sidebar";
// import { cn } from "@/lib/utils";
// import Link from "next/link";
// import {
//   Collapsible,
//   CollapsibleContent,
//   CollapsibleTrigger,
// } from "../ui/collapsible";
// import { CardDescription } from "../ui/card";
// // import { useAuth } from "@/app/context/auth-context";
// import { usePathname } from "next/navigation";

// export function AppSidebar() {
//   const { open } = useSidebar();
//   // const { isAuthenticated } = useAuth();
//   const pathname = usePathname();

//   const user = {
//     name: "arief",
//     email: "ariefsatria@gmail.com",
//     avatar: "",
//   };

//   const tikItems = [
//     {
//       title: "Dashboard",
//       url: "/dashboard",
//       icon: LayoutDashboard,
//       adminOnly: false,
//     },
//     {
//       title: "Penanggung-Jawab",
//       url: "/admins",
//       icon: PersonStandingIcon,
//       adminOnly: true,
//     },
//     {
//       title: "Lokasi",
//       url: "/locations",
//       icon: Pin,
//       adminOnly: true,
//     },
//     {
//       title: "Config",
//       url: "/data-config",
//       icon: Cog,
//       adminOnly: true,
//     },
//   ];

//   const dataCentralItem = [
//     {
//       title: "Dashboard",
//       url: "/data-central-dashboard",
//       icon: LayoutDashboard,
//       adminOnly: false,
//     },
//     {
//       title: "Manajemen Server",
//       url: "/server-management",
//       icon: Server,
//       adminOnly: false,
//     },
//   ];

//   const ticketItems = [
//     {
//       title: "Form Tiket",
//       url: "/tickets",
//       icon: Ticket,
//       adminOnly: false,
//     },
//     {
//       title: "Help desk",
//       url: "/tickets/help-desk",
//       icon: HelpCircle,
//       adminOnly: true,
//     },
//   ];

//   const calendarItem = [
//     {
//       title: "Kalender Kegiatan",
//       url: "/activity-calendar",
//       icon: Calendar1,
//       adminOnly: false,
//     },
//   ];

//   // const visibleTikItems = tikItems.filter(
//   //   (item) => !item.adminOnly || isAuthenticated
//   // );

//   // const visibleDataCentralItems = dataCentralItem.filter(
//   //   (item) => !item.adminOnly || isAuthenticated
//   // );

//   // const visibleCalendarItems = calendarItem.filter(
//   //   (item) => !item.adminOnly || isAuthenticated
//   // );

//   // const visibleTicketItems = ticketItems.filter(
//   //   (item) => !item.adminOnly || isAuthenticated
//   // );

//   return (
//     <Sidebar variant="floating" collapsible="icon">
//       <SidebarHeader
//         className={cn(
//           "overflow-hidden transition-all duration-500 ease-in-out",
//           open
//             ? "px-4 pt-4 block opacity-100"
//             : "px-2 pt-4 flex items-center justify-center opacity-100"
//         )}
//       >
//         <SidebarMenu>
//           <SidebarMenuButton asChild className="hover:bg-accent/50 h-full">
//             {open ? (
//               <div className="flex items-center gap-3 w-full px-2">
//                 <Network className="h-6 w-6 text-primary-600 dark:text-primary-300 shrink-0" />
//                 <div className="flex flex-col items-start overflow-hidden">
//                   <p className="body-big-bold text-primary-600 dark:text-primary-300 truncate">
//                     SATE-ITIK
//                   </p>
//                   <CardDescription className="text-xs text-wrap w-full">
//                     Sistem Akses Terpadu Infrastruktur Jaringan TIK
//                   </CardDescription>
//                 </div>
//               </div>
//             ) : (
//               <div className="flex items-center justify-center w-full">
//                 <Network className="h-6 w-6 text-primary-600 dark:text-primary-300" />
//               </div>
//             )}
//           </SidebarMenuButton>
//         </SidebarMenu>
//       </SidebarHeader>

//       <SidebarContent
//         className={cn(
//           "flex flex-col gap-4 transition-all duration-300",
//           open ? "px-4 py-2" : "px-2 pt-4"
//         )}
//       >
//         <SidebarMenu>
//           <SidebarGroup>
//             <SidebarGroupContent className="space-y-1">
//               <Collapsible defaultOpen className="group/collapsible">
//                 <SidebarMenuButton asChild>
//                   <CollapsibleTrigger
//                     className={cn(
//                       "w-full text-primary-600 dark:text-primary-300 hover:text-primary-500 transition-colors",
//                       !open && "justify-center px-2"
//                     )}
//                   >
//                     <Building className={cn(!open && "h-5 w-5")} />
//                     {open && "Jaringan Intra Pemerintah"}
//                     {open && (
//                       <ChevronDown className="ml-auto transition-transform duration-300 group-data-[state=open]/collapsible:rotate-180" />
//                     )}
//                   </CollapsibleTrigger>
//                 </SidebarMenuButton>
//                 <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
//                   <div className="mt-1 space-y-1">
//                     {visibleTikItems.map((item) => (
//                       <SidebarMenuButton
//                         key={item.title}
//                         asChild
//                         isActive={pathname === item.url}
//                       >
//                         <Link
//                           href={item.url}
//                           className={cn(!open && "justify-center px-2")}
//                         >
//                           <item.icon className={cn(!open && "h-5 w-5")} />
//                           {open && <span>{item.title}</span>}
//                         </Link>
//                       </SidebarMenuButton>
//                     ))}
//                   </div>
//                 </CollapsibleContent>
//               </Collapsible>
//             </SidebarGroupContent>
//           </SidebarGroup>
//         </SidebarMenu>
//         {isAuthenticated && (
//           <SidebarGroup>
//             <SidebarGroupContent className="space-y-1">
//               <Collapsible defaultOpen className="group/collapsible">
//                 <SidebarMenuButton asChild>
//                   <CollapsibleTrigger
//                     className={cn(
//                       "w-full text-primary-600 dark:text-primary-300 hover:text-primary-500 transition-colors",
//                       !open && "justify-center px-2"
//                     )}
//                   >
//                     <Database className={cn(!open && "h-5 w-5")} />
//                     {open && "Pusat Data Pemerintah"}
//                     {open && (
//                       <ChevronDown className="ml-auto transition-transform duration-300 group-data-[state=open]/collapsible:rotate-180" />
//                     )}
//                   </CollapsibleTrigger>
//                 </SidebarMenuButton>
//                 <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
//                   <div className="mt-1 space-y-1">
//                     {visibleDataCentralItems.map((item) => (
//                       <SidebarMenuButton
//                         key={item.title}
//                         asChild
//                         isActive={pathname === item.url}
//                       >
//                         <Link
//                           href={item.url}
//                           className={cn(!open && "justify-center px-2")}
//                         >
//                           <item.icon className={cn(!open && "h-5 w-5")} />
//                           {open && <span>{item.title}</span>}
//                         </Link>
//                       </SidebarMenuButton>
//                     ))}
//                   </div>
//                 </CollapsibleContent>
//               </Collapsible>
//             </SidebarGroupContent>
//           </SidebarGroup>
//         )}
//         <SidebarGroup>
//           <SidebarGroupContent className="space-y-1">
//             <Collapsible defaultOpen className="group/collapsible">
//               <SidebarMenuButton asChild>
//                 <CollapsibleTrigger
//                   className={cn(
//                     "w-full text-primary-600 dark:text-primary-300 hover:text-primary-500 transition-colors",
//                     !open && "justify-center px-2"
//                   )}
//                 >
//                   <Ticket className={cn(!open && "h-5 w-5")} />
//                   {open && "E-Ticketing"}
//                   {open && (
//                     <ChevronDown className="ml-auto transition-transform duration-300 group-data-[state=open]/collapsible:rotate-180" />
//                   )}
//                 </CollapsibleTrigger>
//               </SidebarMenuButton>
//               <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
//                 <div className="mt-1 space-y-1">
//                   {visibleTicketItems.map((item) => (
//                     <SidebarMenuButton
//                       key={item.title}
//                       asChild
//                       isActive={pathname === item.url}
//                     >
//                       <Link
//                         href={item.url}
//                         className={cn(!open && "justify-center px-2")}
//                       >
//                         <item.icon className={cn(!open && "h-5 w-5")} />
//                         {open && <span>{item.title}</span>}
//                       </Link>
//                     </SidebarMenuButton>
//                   ))}
//                 </div>
//               </CollapsibleContent>
//             </Collapsible>
//           </SidebarGroupContent>
//         </SidebarGroup>
//         <SidebarGroup>
//           <SidebarGroupContent className="space-y-1">
//             <Collapsible defaultOpen className="group/collapsible">
//               <SidebarMenuButton asChild>
//                 <CollapsibleTrigger
//                   className={cn(
//                     "w-full text-primary-600 dark:text-primary-300 hover:text-primary-500 transition-colors",
//                     !open && "justify-center px-2"
//                   )}
//                 >
//                   <Calendar className={cn(!open && "h-5 w-5")} />
//                   {open && "Agenda"}
//                   {open && (
//                     <ChevronDown className="ml-auto transition-transform duration-300 group-data-[state=open]/collapsible:rotate-180" />
//                   )}
//                 </CollapsibleTrigger>
//               </SidebarMenuButton>
//               <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
//                 <div className="mt-1 space-y-1">
//                   {visibleCalendarItems.map((item) => (
//                     <SidebarMenuButton
//                       key={item.title}
//                       asChild
//                       isActive={pathname === item.url}
//                     >
//                       <Link
//                         href={item.url}
//                         className={cn(!open && "justify-center px-2")}
//                       >
//                         <item.icon className={cn(!open && "h-5 w-5")} />
//                         {open && <span>{item.title}</span>}
//                       </Link>
//                     </SidebarMenuButton>
//                   ))}
//                 </div>
//               </CollapsibleContent>
//             </Collapsible>
//           </SidebarGroupContent>
//         </SidebarGroup>
//       </SidebarContent>
//       <SidebarFooter
//         className={cn(
//           "w-full bg-accent/50 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300",
//           open ? "p-4" : "p-2"
//         )}
//       >
//         {open ? (
//           <p className="body-small-bold text-center">
//             Made with ❤️ by <br />
//             <Link href={"https://github.com/illufoxKusanagi"}>
//               <span className="hover:underline text-primary-600 dark:text-primary-300">
//                 Illufox Kasunagi
//               </span>
//             </Link>
//           </p>
//         ) : (
//           <div className="flex items-center justify-center">
//             <Link href={"https://github.com/illufoxKusanagi"}>
//               <span className="text-xl">❤️</span>
//             </Link>
//           </div>
//         )}
//       </SidebarFooter>
//     </Sidebar>
//   );
// }
