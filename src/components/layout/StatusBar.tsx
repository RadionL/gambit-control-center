// Gambit Navigation System Status Bar

import { useEffect, useState } from 'react';
import { Wifi, WifiOff, Circle, Battery, HardDrive, Cpu, Thermometer, Video, Menu } from 'lucide-react';
import { SystemIndicators } from '@/types';
import { wsService } from '@/services/websocket';
import { SidebarTrigger } from '@/components/ui/sidebar';

export function StatusBar() {
  const [indicators, setIndicators] = useState<SystemIndicators>({
    cpu: 0,
    temp: 0,
    disk: 0,
    mem: 0,
    battery: 0,
    sat: 0,
    fps: 0,
    connected: false,
  });

  useEffect(() => {
    const unsubscribeIndicators = wsService.onIndicators((data) => {
      setIndicators(data);
    });

    const unsubscribeConnection = wsService.onConnection((data) => {
      setIndicators(prev => ({ ...prev, connected: data.connected }));
    });

    return () => {
      unsubscribeIndicators();
      unsubscribeConnection();
    };
  }, []);

  const getSatFixStatus = (satCount: number) => {
    if (satCount >= 8) return 'connected';
    if (satCount >= 3) return 'warning';
    return 'disconnected';
  };

  const getValueColor = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return 'text-destructive';
    if (value >= thresholds.warning) return 'text-warning';
    return 'text-success';
  };

  const formatValue = (value: number, unit: string, precision: number = 0) => {
    return `${value.toFixed(precision)}${unit}`;
  };

  return (
    <div className="h-12 bg-card border-b border-border flex items-center justify-between px-4 shadow-sm">
      <div className="flex items-center space-x-6">
        {/* Sidebar Toggle */}
        <SidebarTrigger className="hover:bg-accent hover:text-accent-foreground p-1 rounded" />
        
        {/* Connection Status */}
        <div className="flex items-center space-x-2">
          {indicators.connected ? (
            <Wifi className="w-4 h-4 text-success" />
          ) : (
            <WifiOff className="w-4 h-4 text-destructive" />
          )}
          <span className="text-sm font-medium">
            {indicators.connected ? 'Connected' : 'Disconnected'}
          </span>
        </div>

        {/* Video FPS */}
        <div className="flex items-center space-x-2">
          <Video className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-mono">
            {formatValue(indicators.fps, ' FPS')}
          </span>
        </div>

        {/* Disk Space */}
        <div className="flex items-center space-x-2">
          <HardDrive className="w-4 h-4 text-muted-foreground" />
          <span className={`text-sm font-mono ${getValueColor(100 - indicators.disk, { warning: 20, critical: 10 })}`}>
            {formatValue(indicators.disk, ' GB')}
          </span>
        </div>

        {/* CPU Usage */}
        <div className="flex items-center space-x-2">
          <Cpu className="w-4 h-4 text-muted-foreground" />
          <span className={`text-sm font-mono ${getValueColor(indicators.cpu, { warning: 70, critical: 90 })}`}>
            {formatValue(indicators.cpu, '%')}
          </span>
        </div>

        {/* Temperature */}
        <div className="flex items-center space-x-2">
          <Thermometer className="w-4 h-4 text-muted-foreground" />
          <span className={`text-sm font-mono ${getValueColor(indicators.temp, { warning: 70, critical: 85 })}`}>
            {formatValue(indicators.temp, '°C')}
          </span>
        </div>

        {/* Memory Usage */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-muted-foreground">MEM</span>
          <span className={`text-sm font-mono ${getValueColor(indicators.mem, { warning: 80, critical: 95 })}`}>
            {formatValue(indicators.mem, '%')}
          </span>
        </div>

        {/* Battery */}
        <div className="flex items-center space-x-2">
          <Battery className="w-4 h-4 text-muted-foreground" />
          <span className={`text-sm font-mono ${getValueColor(100 - indicators.battery, { warning: 30, critical: 15 })}`}>
            {formatValue(indicators.battery, '%')}
          </span>
        </div>

        {/* Satellite Fix */}
        <div className="flex items-center space-x-2">
          <Circle className={`w-3 h-3 status-indicator ${getSatFixStatus(indicators.sat)}`} />
          <span className="text-sm font-medium text-muted-foreground">SAT</span>
          <span className={`text-sm font-mono ${
            indicators.sat >= 8 ? 'text-success' : 
            indicators.sat >= 3 ? 'text-warning' : 
            'text-destructive'
          }`}>
            {indicators.sat}
          </span>
        </div>
      </div>

      {/* Timestamp */}
      <div className="text-sm text-muted-foreground font-mono">
        {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
}