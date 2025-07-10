import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Compass, 
  Gauge, 
  Navigation, 
  RotateCcw, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  Settings
} from 'lucide-react';

export function Calibration() {
  const [calibrationStatus, setCalibrationStatus] = useState({
    accelerometer: 'pending',
    gyroscope: 'pending',
    magnetometer: 'pending',
    barometer: 'pending'
  });
  const [calibrationProgress, setCalibrationProgress] = useState(0);
  const [isCalibrating, setIsCalibrating] = useState(false);

  const startCalibration = (sensor: string) => {
    setIsCalibrating(true);
    setCalibrationProgress(0);
    
    // Simulate calibration progress
    const interval = setInterval(() => {
      setCalibrationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setCalibrationStatus(current => ({
            ...current,
            [sensor]: 'completed'
          }));
          setIsCalibrating(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-destructive" />;
      case 'pending':
        return <AlertTriangle className="w-5 h-5 text-warning" />;
      default:
        return <Settings className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-success text-success-foreground">Calibrated</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const calibrationSensors = [
    {
      id: 'accelerometer',
      name: 'Accelerometer',
      description: 'Measures linear acceleration',
      icon: Gauge,
      status: calibrationStatus.accelerometer
    },
    {
      id: 'gyroscope',
      name: 'Gyroscope',
      description: 'Measures angular velocity',
      icon: RotateCcw,
      status: calibrationStatus.gyroscope
    },
    {
      id: 'magnetometer',
      name: 'Magnetometer',
      description: 'Measures magnetic field',
      icon: Compass,
      status: calibrationStatus.magnetometer
    },
    {
      id: 'barometer',
      name: 'Barometer',
      description: 'Measures atmospheric pressure',
      icon: Navigation,
      status: calibrationStatus.barometer
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Sensor Calibration</h1>
          <p className="text-muted-foreground">Calibrate system sensors for optimal performance</p>
        </div>
      </div>

      {/* Calibration Progress */}
      {isCalibrating && (
        <Card>
          <CardHeader>
            <CardTitle>Calibration in Progress</CardTitle>
            <CardDescription>Please follow the on-screen instructions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={calibrationProgress} className="w-full" />
              <p className="text-sm text-muted-foreground text-center">
                {calibrationProgress}% Complete
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sensor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {calibrationSensors.map((sensor) => {
          const IconComponent = sensor.icon;
          return (
            <Card key={sensor.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <IconComponent className="w-6 h-6 text-primary" />
                    <span>{sensor.name}</span>
                  </div>
                  {getStatusIcon(sensor.status)}
                </CardTitle>
                <CardDescription>{sensor.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Status:</span>
                    {getStatusBadge(sensor.status)}
                  </div>
                  <Button
                    onClick={() => startCalibration(sensor.id)}
                    disabled={isCalibrating}
                    variant={sensor.status === 'completed' ? "outline" : "default"}
                    size="sm"
                  >
                    {sensor.status === 'completed' ? 'Recalibrate' : 'Calibrate'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Calibration Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Calibration Instructions</CardTitle>
          <CardDescription>Follow these steps for accurate sensor calibration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center space-x-2">
                  <Gauge className="w-4 h-4" />
                  <span>Accelerometer</span>
                </h4>
                <p className="text-sm text-muted-foreground">
                  Place the device on a level surface and keep it stationary during calibration.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center space-x-2">
                  <RotateCcw className="w-4 h-4" />
                  <span>Gyroscope</span>
                </h4>
                <p className="text-sm text-muted-foreground">
                  Keep the device completely still. Do not move or vibrate during calibration.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center space-x-2">
                  <Compass className="w-4 h-4" />
                  <span>Magnetometer</span>
                </h4>
                <p className="text-sm text-muted-foreground">
                  Rotate the device in figure-8 patterns away from metal objects.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center space-x-2">
                  <Navigation className="w-4 h-4" />
                  <span>Barometer</span>
                </h4>
                <p className="text-sm text-muted-foreground">
                  Ensure stable environmental conditions during pressure calibration.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}