import * as React from "react";
import { cn } from "./cn"; // adjust import path if needed

// Context
const SidebarContext = React.createContext(null);

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }
  return context;
}

export function SidebarProvider({ children }) {
  const [open, setOpen] = React.useState(true);

  const value = React.useMemo(
    () => ({
      open,
      setOpen,
    }),
    [open]
  );

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}

// Components
export function Sidebar({ className, ...props }) {
  return (
    <aside
      data-slot="sidebar"
      className={cn(
        "flex h-full w-64 flex-col border-r bg-background text-foreground",
        className
      )}
      {...props}
    />
  );
}

export function SidebarHeader({ className, ...props }) {
  return (
    <div
      data-slot="sidebar-header"
      className={cn("flex items-center p-4", className)}
      {...props}
    />
  );
}

export function SidebarFooter({ className, ...props }) {
  return (
    <div
      data-slot="sidebar-footer"
      className={cn("mt-auto flex items-center p-4", className)}
      {...props}
    />
  );
}

export function SidebarContent({ className, ...props }) {
  return (
    <div
      data-slot="sidebar-content"
      className={cn("flex-1 overflow-y-auto", className)}
      {...props}
    />
  );
}

export function SidebarGroup({ className, ...props }) {
  return (
    <div
      data-slot="sidebar-group"
      className={cn("space-y-1 p-2", className)}
      {...props}
    />
  );
}

export function SidebarGroupLabel({ className, ...props }) {
  return (
    <div
      data-slot="sidebar-group-label"
      className={cn("px-2 py-1 text-sm font-semibold", className)}
      {...props}
    />
  );
}

export function SidebarGroupContent({ className, ...props }) {
  return (
    <div
      data-slot="sidebar-group-content"
      className={cn("space-y-1", className)}
      {...props}
    />
  );
}

export function SidebarMenu({ className, ...props }) {
  return (
    <ul
      data-slot="sidebar-menu"
      className={cn("space-y-1", className)}
      {...props}
    />
  );
}

export function SidebarMenuItem({ className, ...props }) {
  return (
    <li
      data-slot="sidebar-menu-item"
      className={cn("group relative", className)}
      {...props}
    />
  );
}

export function SidebarMenuButton({ className, ...props }) {
  return (
    <button
      data-slot="sidebar-menu-button"
      className={cn(
        "flex w-full items-center rounded px-3 py-2 text-left text-sm hover:bg-accent",
        className
      )}
      {...props}
    />
  );
}

export function SidebarMenuBadge({ className, ...props }) {
  return (
    <span
      data-slot="sidebar-menu-badge"
      className={cn(
        "ml-auto inline-flex items-center rounded bg-primary px-2 py-0.5 text-xs text-primary-foreground",
        className
      )}
      {...props}
    />
  );
}
