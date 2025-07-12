import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Compass, 
  Camera, 
  Video, 
  Play,
  Square,
  RotateCcw, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  Settings,
  Crosshair
} from 'lucide-react';

export function Calibration() {
  const [calibrationStatus, setCalibrationStatus] = useState({
    magnetometer: 'pending',
    boresight: 'pending',
    camera: 'pending'
  });
  const [calibrationProgress, setCalibrationProgress] = useState(0);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [activeTab, setActiveTab] = useState('magnetometer');
  const [isStreaming, setIsStreaming] = useState(false);

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

  const calibrationComponents = [
    {
      id: 'magnetometer',
      name: 'Magnetometer',
      description: 'Magnetic field sensor calibration',
      icon: Compass,
      status: calibrationStatus.magnetometer
    },
    {
      id: 'boresight',
      name: 'Boresight',
      description: 'Camera alignment calibration',
      icon: Crosshair,
      status: calibrationStatus.boresight
    },
    {
      id: 'camera',
      name: 'Camera',
      description: 'Camera intrinsic parameters',
      icon: Camera,
      status: calibrationStatus.camera
    }
  ];

  const handleStreamToggle = () => {
    setIsStreaming(!isStreaming);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Calibration Panel</h1>
          <p className="text-muted-foreground">Magnetometer, Boresight, Camera, and Live Video Stream</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="magnetometer">Magnetometer</TabsTrigger>
          <TabsTrigger value="boresight">Boresight</TabsTrigger>
          <TabsTrigger value="camera">Camera</TabsTrigger>
          <TabsTrigger value="stream">Live Video</TabsTrigger>
        </TabsList>

        <TabsContent value="magnetometer" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <Compass className="w-6 h-6 text-primary" />
                <span>Magnetometer Calibration</span>
                {getStatusIcon(calibrationStatus.magnetometer)}
              </CardTitle>
              <CardDescription>Calibrate magnetic field sensor for accurate heading</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Status:</span>
                    {getStatusBadge(calibrationStatus.magnetometer)}
                  </div>
                  <Button
                    onClick={() => startCalibration('magnetometer')}
                    disabled={isCalibrating}
                    variant={calibrationStatus.magnetometer === 'completed' ? "outline" : "default"}
                  >
                    {calibrationStatus.magnetometer === 'completed' ? 'Recalibrate' : 'Start Calibration'}
                  </Button>
                </div>
                {isCalibrating && activeTab === 'magnetometer' && (
                  <div className="space-y-2">
                    <Progress value={calibrationProgress} className="w-full" />
                    <p className="text-sm text-muted-foreground text-center">
                      Rotate the device in figure-8 patterns - {calibrationProgress}% Complete
                    </p>
                  </div>
                )}
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Instructions:</h4>
                  <ol className="text-sm text-muted-foreground space-y-1">
                    <li>1. Move away from metal objects and electrical devices</li>
                    <li>2. Hold the device firmly and rotate in figure-8 patterns</li>
                    <li>3. Rotate around all three axes (X, Y, Z)</li>
                    <li>4. Continue until calibration is complete</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="boresight" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <Crosshair className="w-6 h-6 text-primary" />
                <span>Boresight Calibration</span>
                {getStatusIcon(calibrationStatus.boresight)}
              </CardTitle>
              <CardDescription>Align camera optical axis with vehicle reference frame</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Status:</span>
                    {getStatusBadge(calibrationStatus.boresight)}
                  </div>
                  <Button
                    onClick={() => startCalibration('boresight')}
                    disabled={isCalibrating}
                    variant={calibrationStatus.boresight === 'completed' ? "outline" : "default"}
                  >
                    {calibrationStatus.boresight === 'completed' ? 'Recalibrate' : 'Start Calibration'}
                  </Button>
                </div>
                {isCalibrating && activeTab === 'boresight' && (
                  <div className="space-y-2">
                    <Progress value={calibrationProgress} className="w-full" />
                    <p className="text-sm text-muted-foreground text-center">
                      Align camera with reference targets - {calibrationProgress}% Complete
                    </p>
                  </div>
                )}
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Instructions:</h4>
                  <ol className="text-sm text-muted-foreground space-y-1">
                    <li>1. Position vehicle at a known reference point</li>
                    <li>2. Point camera at calibration targets</li>
                    <li>3. Ensure targets are clearly visible in frame</li>
                    <li>4. Follow on-screen alignment guides</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="camera" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <Camera className="w-6 h-6 text-primary" />
                <span>Camera Calibration</span>
                {getStatusIcon(calibrationStatus.camera)}
              </CardTitle>
              <CardDescription>Calibrate camera intrinsic parameters and distortion</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Status:</span>
                    {getStatusBadge(calibrationStatus.camera)}
                  </div>
                  <Button
                    onClick={() => startCalibration('camera')}
                    disabled={isCalibrating}
                    variant={calibrationStatus.camera === 'completed' ? "outline" : "default"}
                  >
                    {calibrationStatus.camera === 'completed' ? 'Recalibrate' : 'Start Calibration'}
                  </Button>
                </div>
                {isCalibrating && activeTab === 'camera' && (
                  <div className="space-y-2">
                    <Progress value={calibrationProgress} className="w-full" />
                    <p className="text-sm text-muted-foreground text-center">
                      Capturing calibration images - {calibrationProgress}% Complete
                    </p>
                  </div>
                )}
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Instructions:</h4>
                  <ol className="text-sm text-muted-foreground space-y-1">
                    <li>1. Use a checkerboard calibration pattern</li>
                    <li>2. Position pattern at various distances and angles</li>
                    <li>3. Ensure pattern fills different areas of the frame</li>
                    <li>4. Capture multiple images as instructed</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stream" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <Video className="w-6 h-6 text-primary" />
                <span>Live Video Stream</span>
              </CardTitle>
              <CardDescription>Real-time video feed from camera</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Stream Status:</span>
                    <Badge variant={isStreaming ? "default" : "secondary"}>
                      {isStreaming ? "Live" : "Offline"}
                    </Badge>
                  </div>
                  <Button
                    onClick={handleStreamToggle}
                    variant={isStreaming ? "destructive" : "default"}
                    className="flex items-center space-x-2"
                  >
                    {isStreaming ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>{isStreaming ? 'Stop Stream' : 'Start Stream'}</span>
                  </Button>
                </div>
                
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  {isStreaming ? (
                    <div className="text-center">
                      <Video className="w-16 h-16 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">Live video feed would appear here</p>
                      <p className="text-xs text-muted-foreground mt-1">Camera stream active</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Camera className="w-16 h-16 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">Video stream is offline</p>
                      <p className="text-xs text-muted-foreground mt-1">Click Start Stream to begin</p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="font-medium">Resolution</div>
                    <div className="text-muted-foreground">1920x1080</div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="font-medium">Frame Rate</div>
                    <div className="text-muted-foreground">30 FPS</div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="font-medium">Codec</div>
                    <div className="text-muted-foreground">H.264</div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="font-medium">Bitrate</div>
                    <div className="text-muted-foreground">5 Mbps</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}