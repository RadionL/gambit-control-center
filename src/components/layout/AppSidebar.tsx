// Gambit Navigation System Sidebar

import { useState } from 'react';
import { 
  Home, 
  Video, 
  Plane, 
  Download, 
  FileText, 
  Settings, 
  Upload,
  ChevronRight,
  Map
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar 
} from '@/components/ui/sidebar';
import { NavigationItem } from '@/types';

const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'Home',
    path: '/',
    roles: ['operator', 'admin'],
  },
  {
    id: 'calibration',
    label: 'Calibration',
    icon: 'Video',
    path: '/calibration',
    roles: ['operator', 'admin'],
  },
  {
    id: 'logs',
    label: 'Logs',
    icon: 'Download',
    path: '/logs',
    roles: ['operator', 'admin'],
  },
  {
    id: 'reports',
    label: 'Flight Reports',
    icon: 'FileText',
    path: '/reports',
    roles: ['operator', 'admin'],
  },
  {
    id: 'maps',
    label: 'Maps',
    icon: 'Map',
    path: '/maps',
    roles: ['operator', 'admin'],
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: 'Settings',
    path: '/settings',
    roles: ['admin'],
  },
];

const iconMap = {
  Home,
  Video,
  Plane,
  Download,
  FileText,
  Settings,
  Upload,
  Map,
};

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === 'collapsed';

  // For now, assume admin role - later this will come from auth context
  const userRole = 'admin';

  const filteredItems = navigationItems.filter(item => 
    item.roles.includes(userRole as 'operator' | 'admin')
  );

  const isActive = (path: string) => {
    if (path === '/') return currentPath === '/';
    return currentPath.startsWith(path);
  };

  const getNavClassName = (path: string) => {
    const active = isActive(path);
    return active 
      ? 'bg-sidebar-accent text-sidebar-primary font-medium shadow-glow' 
      : 'hover:bg-sidebar-accent/50 text-sidebar-foreground';
  };

  return (
    <Sidebar className={collapsed ? 'w-16' : 'w-64'} collapsible="icon">
      <SidebarContent className="bg-sidebar border-r border-sidebar-border">
        {/* Logo/Brand */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">G</span>
            </div>
            {!collapsed && (
              <div>
                <h1 className="text-lg font-bold text-sidebar-foreground">Gambit</h1>
                <p className="text-xs text-sidebar-foreground/70">Navigation Control</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70">
            {!collapsed && 'Navigation'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item) => {
                const Icon = iconMap[item.icon as keyof typeof iconMap];
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.path} 
                        className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-smooth ${getNavClassName(item.path)}`}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        {!collapsed && (
                          <>
                            <span className="flex-1">{item.label}</span>
                            {isActive(item.path) && (
                              <ChevronRight className="w-4 h-4" />
                            )}
                          </>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* System Status */}
        <div className="mt-auto p-4 border-t border-sidebar-border">
          <div className="flex items-center space-x-2">
            <div className="status-indicator connected"></div>
            {!collapsed && (
              <span className="text-sm text-sidebar-foreground/70">System Online</span>
            )}
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}