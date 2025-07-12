import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Download, 
  Upload, 
  Trash2, 
  FileText, 
  Map, 
  Calendar,
  HardDrive,
  AlertTriangle
} from 'lucide-react';

export function ManagedLogsAndMaps() {
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Mock data for demonstration
  const flightLogs = [
    {
      id: 'log_001',
      name: 'Flight_2024-01-15_14-30-22.log',
      date: '2024-01-15',
      time: '14:30:22',
      size: '2.4 MB',
      duration: '00:12:45',
      status: 'completed'
    },
    {
      id: 'log_002',
      name: 'Flight_2024-01-14_09-15-10.log',
      date: '2024-01-14',
      time: '09:15:10',
      size: '1.8 MB',
      duration: '00:08:32',
      status: 'completed'
    },
    {
      id: 'log_003',
      name: 'Flight_2024-01-13_16-45-55.log',
      date: '2024-01-13',
      time: '16:45:55',
      size: '3.1 MB',
      duration: '00:18:20',
      status: 'error'
    }
  ];

  const orthofotoMaps = [
    {
      id: 'map_001',
      name: 'Area_A_Survey_2024-01-15.tif',
      date: '2024-01-15',
      size: '45.2 MB',
      resolution: '5cm/px',
      area: '2.3 km²'
    },
    {
      id: 'map_002',
      name: 'Area_B_Survey_2024-01-10.tif',
      date: '2024-01-10',
      size: '38.7 MB',
      resolution: '5cm/px',
      area: '1.8 km²'
    }
  ];

  const handleFileSelection = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const handleDownloadSelected = () => {
    console.log('Downloading files:', selectedFiles);
    // Implement download logic
  };

  const handleDeleteSelected = () => {
    console.log('Deleting files:', selectedFiles);
    setSelectedFiles([]);
    // Implement delete logic
  };

  const handleUploadOrthofoto = () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-success text-success-foreground">Complete</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      case 'processing':
        return <Badge variant="secondary">Processing</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Managed Logs / Maps</h1>
          <p className="text-muted-foreground">Download flight logs, upload orthofoto maps, and manage flight data</p>
        </div>
      </div>

      <Tabs defaultValue="logs" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="logs">Flight Logs</TabsTrigger>
          <TabsTrigger value="maps">Orthofoto Maps</TabsTrigger>
        </TabsList>

        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <FileText className="w-6 h-6 text-primary" />
                <span>Flight Logs</span>
              </CardTitle>
              <CardDescription>Download and manage flight log files</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">
                      {selectedFiles.length} file(s) selected
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleDownloadSelected}
                      disabled={selectedFiles.length === 0}
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Selected</span>
                    </Button>
                    <Button
                      onClick={handleDeleteSelected}
                      disabled={selectedFiles.length === 0}
                      variant="destructive"
                      size="sm"
                      className="flex items-center space-x-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete Selected</span>
                    </Button>
                  </div>
                </div>

                {/* Log Files List */}
                <div className="space-y-2">
                  {flightLogs.map((log) => (
                    <div
                      key={log.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedFiles.includes(log.id) 
                          ? 'bg-primary/10 border-primary' 
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => handleFileSelection(log.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={selectedFiles.includes(log.id)}
                            onChange={() => handleFileSelection(log.id)}
                            className="w-4 h-4"
                          />
                          <FileText className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{log.name}</div>
                            <div className="text-sm text-muted-foreground flex items-center space-x-4">
                              <span className="flex items-center space-x-1">
                                <Calendar className="w-3 h-3" />
                                <span>{log.date} {log.time}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <HardDrive className="w-3 h-3" />
                                <span>{log.size}</span>
                              </span>
                              <span>Duration: {log.duration}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(log.status)}
                          {log.status === 'error' && (
                            <AlertTriangle className="w-4 h-4 text-destructive" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maps" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <Map className="w-6 h-6 text-primary" />
                <span>Orthofoto Maps</span>
              </CardTitle>
              <CardDescription>Upload and manage orthofoto map files</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Upload Section */}
                <div className="p-4 border-2 border-dashed border-muted rounded-lg">
                  <div className="text-center space-y-4">
                    <Upload className="w-12 h-12 text-muted-foreground mx-auto" />
                    <div>
                      <h3 className="font-medium">Upload Orthofoto Map</h3>
                      <p className="text-sm text-muted-foreground">
                        Drag and drop your .tif files here or click to browse
                      </p>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <Input
                        type="file"
                        accept=".tif,.tiff"
                        className="w-64"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handleUploadOrthofoto();
                          }
                        }}
                      />
                      <Button onClick={handleUploadOrthofoto} disabled={isUploading}>
                        {isUploading ? 'Uploading...' : 'Upload'}
                      </Button>
                    </div>
                    {isUploading && (
                      <div className="w-full max-w-md mx-auto">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Uploading...</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Existing Maps */}
                <div className="space-y-4">
                  <h3 className="font-medium">Existing Maps</h3>
                  <div className="space-y-2">
                    {orthofotoMaps.map((map) => (
                      <div
                        key={map.id}
                        className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Map className="w-5 h-5 text-muted-foreground" />
                            <div>
                              <div className="font-medium">{map.name}</div>
                              <div className="text-sm text-muted-foreground flex items-center space-x-4">
                                <span className="flex items-center space-x-1">
                                  <Calendar className="w-3 h-3" />
                                  <span>{map.date}</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                  <HardDrive className="w-3 h-3" />
                                  <span>{map.size}</span>
                                </span>
                                <span>Resolution: {map.resolution}</span>
                                <span>Area: {map.area}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
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
