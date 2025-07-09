// Gambit Navigation System Dashboard

import { useEffect, useState } from 'react';
import { Play, Square, RefreshCw, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { SystemHealth, Mission, Flight } from '@/types';
import { apiService } from '@/services/api';
import { wsService } from '@/services/websocket';

export function Dashboard() {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [mission, setMission] = useState<Mission | null>(null);
  const [lastFlight, setLastFlight] = useState<Flight | null>(null);
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

    return () => {
      unsubscribeMission();
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
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mission Control Dashboard</h1>
          <p className="text-muted-foreground">Gambit Navigation System</p>
        </div>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* System Health Card */}
        <Card className="metric-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {health && getHealthStatusIcon(health.status)}
              <span>System Health</span>
            </CardTitle>
            <CardDescription>Current system status and metrics</CardDescription>
          </CardHeader>
          <CardContent>
            {health ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="metric-label">Status</span>
                  <span className={`metric-value text-lg ${getHealthStatusColor(health.status)}`}>
                    {health.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="metric-label">CPU Usage</div>
                    <div className="metric-value">{health.cpu}%</div>
                  </div>
                  <div>
                    <div className="metric-label">Temperature</div>
                    <div className="metric-value">{health.temp}°C</div>
                  </div>
                  <div>
                    <div className="metric-label">Memory</div>
                    <div className="metric-value">{health.memory}%</div>
                  </div>
                  <div>
                    <div className="metric-label">Battery</div>
                    <div className="metric-value">{health.battery}%</div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  Last updated: {new Date(health.timestamp).toLocaleString()}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-muted-foreground">
                <AlertTriangle className="w-4 h-4" />
                <span>Health data unavailable</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Last Flight Summary */}
        <Card className="metric-card">
          <CardHeader>
            <CardTitle>Last Flight Summary</CardTitle>
            <CardDescription>Most recent flight information</CardDescription>
          </CardHeader>
          <CardContent>
            {lastFlight ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="metric-label">Flight ID</span>
                  <span className="font-mono text-sm">{lastFlight.id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="metric-label">Date</span>
                  <span className="font-mono text-sm">
                    {new Date(lastFlight.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="metric-label">Duration</span>
                  <span className="font-mono text-sm">{formatDuration(lastFlight.duration)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="metric-label">Status</span>
                  <span className={`font-semibold ${
                    lastFlight.status === 'COMPLETED' ? 'text-success' : 'text-destructive'
                  }`}>
                    {lastFlight.status}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-muted-foreground">
                <AlertTriangle className="w-4 h-4" />
                <span>No flight data available</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Mission Control */}
      <Card className="metric-card">
        <CardHeader>
          <CardTitle>Mission Control</CardTitle>
          <CardDescription>Current mission status and controls</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="metric-label">Mission Status</div>
              <div className={`metric-value ${getMissionStatusColor(mission?.status || 'IDLE')}`}>
                {mission?.status || 'IDLE'}
              </div>
            </div>
            {mission?.started_at && (
              <div>
                <div className="metric-label">Started</div>
                <div className="font-mono text-sm">
                  {new Date(mission.started_at).toLocaleString()}
                </div>
              </div>
            )}
          </div>

          <div className="flex space-x-4">
            {mission?.status !== 'RUNNING' ? (
              <Button
                onClick={handleStartMission}
                disabled={missionLoading}
                className="mission-button start flex items-center space-x-2"
              >
                <Play className="w-5 h-5" />
                <span>{missionLoading ? 'Starting...' : 'Start Mission'}</span>
              </Button>
            ) : (
              <Button
                onClick={handleAbortMission}
                className="mission-button abort flex items-center space-x-2"
              >
                <Square className="w-5 h-5" />
                <span>Abort Mission</span>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}