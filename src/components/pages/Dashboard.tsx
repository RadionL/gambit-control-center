// Gambit Navigation System Dashboard

import { useEffect, useState } from 'react';
import { Play, Square, RefreshCw, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { SystemHealth, Mission, Flight } from '@/types';
import { apiService } from '@/services/api';
import { wsService } from '@/services/websocket';
import FlightMap from '@/components/ui/FlightMap';

export function Dashboard() {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [mission, setMission] = useState<Mission | null>(null);
  const [lastFlight, setLastFlight] = useState<Flight | null>(null);
  const [flightPath, setFlightPath] = useState<any[]>([]);
  const [homePosition, setHomePosition] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [missionLoading, setMissionLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardData();
    
    // Subscribe to mission status updates
    const unsubscribeMission = wsService.onMissionStatus((data) => {
      setMission(data);
      if (data.status === 'RUNNING') {
        setMissionLoading(false);
      }
    });

    // Subscribe to indicators for position updates
    const unsubscribeIndicators = wsService.onIndicators((data) => {
      if (data.position) {
        // Add to flight path if we have a position
        setFlightPath(prev => [...prev.slice(-100), data.position]); // Keep last 100 points
      }
      if (data.home && data.home.set) {
        setHomePosition(data.home);
      }
    });

    return () => {
      unsubscribeMission();
      unsubscribeIndicators();
    };
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [healthData, missionData, flightsData] = await Promise.all([
        apiService.getHealth(),
        apiService.getMissionStatus(),
        apiService.getFlights({ limit: 1, order: 'desc' })
      ]);

      setHealth(healthData);
      setMission(missionData);
      setLastFlight(flightsData[0] || null);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStartMission = async () => {
    try {
      setMissionLoading(true);
      await apiService.startMission();
      toast({
        title: 'Mission Started',
        description: 'Mission has been initiated successfully',
      });
    } catch (error) {
      console.error('Failed to start mission:', error);
      toast({
        title: 'Error',
        description: 'Failed to start mission',
        variant: 'destructive',
      });
      setMissionLoading(false);
    }
  };

  const handleAbortMission = async () => {
    try {
      await apiService.abortMission();
      toast({
        title: 'Mission Aborted',
        description: 'Mission has been aborted',
        variant: 'destructive',
      });
    } catch (error) {
      console.error('Failed to abort mission:', error);
      toast({
        title: 'Error',
        description: 'Failed to abort mission',
        variant: 'destructive',
      });
    }
  };

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'HEALTHY':
        return 'text-success';
      case 'WARNING':
        return 'text-warning';
      case 'CRITICAL':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  const getHealthStatusIcon = (status: string) => {
    switch (status) {
      case 'HEALTHY':
        return <div className="status-indicator connected" />;
      case 'WARNING':
        return <div className="status-indicator warning" />;
      case 'CRITICAL':
        return <div className="status-indicator disconnected" />;
      default:
        return <div className="status-indicator" />;
    }
  };

  const getMissionStatusColor = (status: string) => {
    switch (status) {
      case 'RUNNING':
        return 'text-success';
      case 'IDLE':
        return 'text-muted-foreground';
      case 'COMPLETED':
        return 'text-success';
      case 'ABORTED':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Full-Screen Flight Map */}
      <FlightMap 
        currentPosition={health?.latitude && health?.longitude ? {
          latitude: health.latitude,
          longitude: health.longitude,
          altitude: health.altitude || 0,
          heading: health.heading || 0,
          speed: health.speed || 0,
          timestamp: health.timestamp
        } : undefined}
        homePosition={homePosition}
        flightPath={flightPath}
        className="w-full h-full"
      />

      {/* Top Header Overlay */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-background/90 backdrop-blur-sm border-b">
        <div className="flex items-center justify-between p-4">
          <div>
            <h1 className="text-xl font-bold text-foreground">Mission Control Dashboard</h1>
            <p className="text-sm text-muted-foreground">User can update the starting point on this map</p>
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={() => {
                // Add logic to update starting point
                console.log('Update starting point clicked');
              }}
              variant="default"
              size="sm"
              className="flex items-center space-x-2"
            >
              <span>Update Starting Point</span>
            </Button>
            <Button
              onClick={loadDashboardData}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </Button>
          </div>
        </div>
      </div>

      {/* System Health Overlay - Top Right */}
      <Card className="absolute top-24 right-4 z-10 bg-background/90 backdrop-blur-sm w-72">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-sm">
            {health && getHealthStatusIcon(health.status)}
            <span>System Health</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {health ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Status</span>
                <span className={`text-sm font-medium ${getHealthStatusColor(health.status)}`}>
                  {health.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="text-muted-foreground">CPU</div>
                  <div className="font-mono">{health.cpu}%</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Temp</div>
                  <div className="font-mono">{health.temp}°C</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Memory</div>
                  <div className="font-mono">{health.memory}%</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Battery</div>
                  <div className="font-mono">{health.battery}%</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-muted-foreground text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>Health data unavailable</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mission Control Overlay - Bottom Center */}
      <Card className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 bg-background/90 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-1">Mission Status</div>
              <div className={`text-sm font-medium ${getMissionStatusColor(mission?.status || 'IDLE')}`}>
                {mission?.status || 'IDLE'}
              </div>
            </div>
            
            {mission?.started_at && (
              <div className="text-center">
                <div className="text-xs text-muted-foreground mb-1">Started</div>
                <div className="text-xs font-mono">
                  {new Date(mission.started_at).toLocaleTimeString()}
                </div>
              </div>
            )}

            <div className="flex space-x-2">
              {mission?.status !== 'RUNNING' ? (
                <Button
                  onClick={handleStartMission}
                  disabled={missionLoading}
                  size="sm"
                  className="mission-button start flex items-center space-x-2"
                >
                  <Play className="w-4 h-4" />
                  <span>{missionLoading ? 'Starting...' : 'Start Mission'}</span>
                </Button>
              ) : (
                <Button
                  onClick={handleAbortMission}
                  size="sm"
                  className="mission-button abort flex items-center space-x-2"
                >
                  <Square className="w-4 h-4" />
                  <span>Abort Mission</span>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Last Flight Summary Overlay - Top Left */}
      {lastFlight && (
        <Card className="absolute top-24 left-4 z-10 bg-background/90 backdrop-blur-sm w-64">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Last Flight</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Flight ID</span>
                <span className="font-mono">{lastFlight.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Duration</span>
                <span className="font-mono">{formatDuration(lastFlight.duration)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className={`font-medium ${
                  lastFlight.status === 'COMPLETED' ? 'text-success' : 'text-destructive'
                }`}>
                  {lastFlight.status}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}