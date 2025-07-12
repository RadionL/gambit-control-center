import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Settings as SettingsIcon, 
  Anchor, 
  Satellite, 
  Video,
  Save,
  RotateCcw,
  Wifi,
  HardDrive,
  Camera
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function Settings() {
  const [settings, setSettings] = useState({
    useAnchor: false,
    fuseGPS: true,
    recordRawVideo: false,
    videoQuality: 'high',
    videoFramerate: '30',
    gpsSampleRate: '10',
    anchorTimeout: '30',
    storageLocation: '/data/flight_logs',
    wifiChannel: 'auto',
    transmissionPower: 'medium'
  });

  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    setHasChanges(true);
  };

  const handleSaveSettings = () => {
    // Simulate saving settings
    console.log('Saving settings:', settings);
    setHasChanges(false);
    toast({
      title: 'Settings Saved',
      description: 'All settings have been saved successfully',
    });
  };

  const handleResetSettings = () => {
    setSettings({
      useAnchor: false,
      fuseGPS: true,
      recordRawVideo: false,
      videoQuality: 'high',
      videoFramerate: '30',
      gpsSampleRate: '10',
      anchorTimeout: '30',
      storageLocation: '/data/flight_logs',
      wifiChannel: 'auto',
      transmissionPower: 'medium'
    });
    setHasChanges(false);
    toast({
      title: 'Settings Reset',
      description: 'All settings have been reset to defaults',
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Configure system parameters and preferences</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={handleResetSettings}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </Button>
          <Button 
            onClick={handleSaveSettings}
            disabled={!hasChanges}
            className="flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="navigation" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="navigation">Navigation</TabsTrigger>
          <TabsTrigger value="video">Video</TabsTrigger>
          <TabsTrigger value="storage">Storage</TabsTrigger>
          <TabsTrigger value="wireless">Wireless</TabsTrigger>
        </TabsList>

        <TabsContent value="navigation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <Satellite className="w-6 h-6 text-primary" />
                <span>Navigation Settings</span>
              </CardTitle>
              <CardDescription>Configure GPS and positioning system parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="flex items-center space-x-2">
                    <Anchor className="w-4 h-4" />
                    <span>Use Anchor System</span>
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Enable anchor-based positioning for enhanced accuracy
                  </p>
                </div>
                <Switch
                  checked={settings.useAnchor}
                  onCheckedChange={(checked) => handleSettingChange('useAnchor', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="flex items-center space-x-2">
                    <Satellite className="w-4 h-4" />
                    <span>Fuse GPS</span>
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Combine multiple GPS sources for improved reliability
                  </p>
                </div>
                <Switch
                  checked={settings.fuseGPS}
                  onCheckedChange={(checked) => handleSettingChange('fuseGPS', checked)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gpsSampleRate">GPS Sample Rate (Hz)</Label>
                  <Input
                    id="gpsSampleRate"
                    type="number"
                    value={settings.gpsSampleRate}
                    onChange={(e) => handleSettingChange('gpsSampleRate', e.target.value)}
                    min="1"
                    max="20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="anchorTimeout">Anchor Timeout (seconds)</Label>
                  <Input
                    id="anchorTimeout"
                    type="number"
                    value={settings.anchorTimeout}
                    onChange={(e) => handleSettingChange('anchorTimeout', e.target.value)}
                    min="5"
                    max="120"
                    disabled={!settings.useAnchor}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="video" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <Video className="w-6 h-6 text-primary" />
                <span>Video Settings</span>
              </CardTitle>
              <CardDescription>Configure video recording and streaming parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="flex items-center space-x-2">
                    <Camera className="w-4 h-4" />
                    <span>Record Raw Video</span>
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Save uncompressed video data for post-processing
                  </p>
                </div>
                <Switch
                  checked={settings.recordRawVideo}
                  onCheckedChange={(checked) => handleSettingChange('recordRawVideo', checked)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="videoQuality">Video Quality</Label>
                  <Select
                    value={settings.videoQuality}
                    onValueChange={(value) => handleSettingChange('videoQuality', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low (720p)</SelectItem>
                      <SelectItem value="medium">Medium (1080p)</SelectItem>
                      <SelectItem value="high">High (1440p)</SelectItem>
                      <SelectItem value="ultra">Ultra (4K)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="videoFramerate">Frame Rate (FPS)</Label>
                  <Select
                    value={settings.videoFramerate}
                    onValueChange={(value) => handleSettingChange('videoFramerate', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 FPS</SelectItem>
                      <SelectItem value="24">24 FPS</SelectItem>
                      <SelectItem value="30">30 FPS</SelectItem>
                      <SelectItem value="60">60 FPS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Recording Impact</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• Raw video: ~{settings.recordRawVideo ? '2-8' : '0.5-2'} GB per minute</p>
                  <p>• Quality setting affects compression and file size</p>
                  <p>• Higher frame rates require more storage and processing power</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="storage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <HardDrive className="w-6 h-6 text-primary" />
                <span>Storage Settings</span>
              </CardTitle>
              <CardDescription>Configure data storage and logging parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="storageLocation">Storage Location</Label>
                <Input
                  id="storageLocation"
                  value={settings.storageLocation}
                  onChange={(e) => handleSettingChange('storageLocation', e.target.value)}
                  placeholder="/data/flight_logs"
                />
                <p className="text-sm text-muted-foreground">
                  Directory path for storing flight logs and recorded data
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
                <div className="text-center">
                  <div className="text-lg font-semibold">1.2 TB</div>
                  <div className="text-sm text-muted-foreground">Available</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold">0.8 TB</div>
                  <div className="text-sm text-muted-foreground">Used</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold">2.0 TB</div>
                  <div className="text-sm text-muted-foreground">Total</div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Auto-cleanup Settings</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Delete logs older than</Label>
                    <Select defaultValue="30">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">7 days</SelectItem>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="never">Never</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Compress old logs after</Label>
                    <Select defaultValue="7">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 day</SelectItem>
                        <SelectItem value="7">7 days</SelectItem>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="never">Never</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wireless" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <Wifi className="w-6 h-6 text-primary" />
                <span>Wireless Settings</span>
              </CardTitle>
              <CardDescription>Configure WiFi and communication parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="wifiChannel">WiFi Channel</Label>
                  <Select
                    value={settings.wifiChannel}
                    onValueChange={(value) => handleSettingChange('wifiChannel', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Auto</SelectItem>
                      <SelectItem value="1">Channel 1</SelectItem>
                      <SelectItem value="6">Channel 6</SelectItem>
                      <SelectItem value="11">Channel 11</SelectItem>
                      <SelectItem value="36">Channel 36 (5GHz)</SelectItem>
                      <SelectItem value="149">Channel 149 (5GHz)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="transmissionPower">Transmission Power</Label>
                  <Select
                    value={settings.transmissionPower}
                    onValueChange={(value) => handleSettingChange('transmissionPower', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low (10 mW)</SelectItem>
                      <SelectItem value="medium">Medium (100 mW)</SelectItem>
                      <SelectItem value="high">High (1000 mW)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Connection Status</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-medium">Signal Strength</div>
                    <div className="text-muted-foreground">-45 dBm (Excellent)</div>
                  </div>
                  <div>
                    <div className="font-medium">Data Rate</div>
                    <div className="text-muted-foreground">150 Mbps</div>
                  </div>
                  <div>
                    <div className="font-medium">Connected Devices</div>
                    <div className="text-muted-foreground">2 devices</div>
                  </div>
                  <div>
                    <div className="font-medium">Network Mode</div>
                    <div className="text-muted-foreground">802.11ac</div>
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