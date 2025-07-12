import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Calendar, 
  Clock, 
  MapPin,
  Activity,
  Eye,
  Download
} from 'lucide-react';

export function FlightReports() {
  const [selectedFlight, setSelectedFlight] = useState<string>('');
  const [reportData, setReportData] = useState<string>('');

  // Mock data for demonstration
  const flights = [
    {
      id: 'flight_001',
      name: 'Survey Mission Alpha',
      date: '2024-01-15',
      time: '14:30:22',
      duration: '00:12:45',
      status: 'completed',
      location: 'Area A - North Field',
      waypoints: 25,
      distance: '2.3 km'
    },
    {
      id: 'flight_002',
      name: 'Inspection Route Beta',
      date: '2024-01-14',
      time: '09:15:10',
      duration: '00:08:32',
      status: 'completed',
      location: 'Area B - Power Lines',
      waypoints: 18,
      distance: '1.8 km'
    },
    {
      id: 'flight_003',
      name: 'Mapping Mission Gamma',
      date: '2024-01-13',
      time: '16:45:55',
      duration: '00:18:20',
      status: 'partial',
      location: 'Area C - Construction Site',
      waypoints: 42,
      distance: '3.1 km'
    }
  ];

  const generateMockReport = (flightId: string) => {
    const flight = flights.find(f => f.id === flightId);
    if (!flight) return '';

    return `
<!DOCTYPE html>
<html>
<head>
    <title>Flight Report - ${flight.name}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background-color: #f0f0f0; padding: 20px; border-radius: 8px; }
        .section { margin: 20px 0; }
        .metric { display: inline-block; margin: 10px; padding: 10px; background-color: #f9f9f9; border-radius: 4px; }
        .table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        .table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .table th { background-color: #f2f2f2; }
        .chart { height: 200px; background-color: #f5f5f5; display: flex; align-items: center; justify-content: center; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Flight Report: ${flight.name}</h1>
        <p><strong>Date:</strong> ${flight.date} ${flight.time}</p>
        <p><strong>Duration:</strong> ${flight.duration}</p>
        <p><strong>Location:</strong> ${flight.location}</p>
        <p><strong>Status:</strong> ${flight.status.toUpperCase()}</p>
    </div>

    <div class="section">
        <h2>Flight Summary</h2>
        <div class="metric">
            <strong>Total Distance:</strong><br>${flight.distance}
        </div>
        <div class="metric">
            <strong>Waypoints:</strong><br>${flight.waypoints}
        </div>
        <div class="metric">
            <strong>Average Speed:</strong><br>12.5 m/s
        </div>
        <div class="metric">
            <strong>Max Altitude:</strong><br>120 m
        </div>
    </div>

    <div class="section">
        <h2>System Performance</h2>
        <table class="table">
            <tr>
                <th>Parameter</th>
                <th>Average</th>
                <th>Maximum</th>
                <th>Minimum</th>
                <th>Status</th>
            </tr>
            <tr>
                <td>Battery Level</td>
                <td>65%</td>
                <td>98%</td>
                <td>32%</td>
                <td>Good</td>
            </tr>
            <tr>
                <td>GPS Signal</td>
                <td>14 satellites</td>
                <td>16 satellites</td>
                <td>12 satellites</td>
                <td>Excellent</td>
            </tr>
            <tr>
                <td>CPU Usage</td>
                <td>45%</td>
                <td>78%</td>
                <td>23%</td>
                <td>Normal</td>
            </tr>
            <tr>
                <td>Temperature</td>
                <td>38°C</td>
                <td>42°C</td>
                <td>35°C</td>
                <td>Normal</td>
            </tr>
        </table>
    </div>

    <div class="section">
        <h2>Flight Path Analysis</h2>
        <div class="chart">
            [Altitude Chart Would Appear Here]
        </div>
        <div class="chart">
            [Speed Chart Would Appear Here]
        </div>
    </div>

    <div class="section">
        <h2>Waypoint Log</h2>
        <table class="table">
            <tr>
                <th>Waypoint</th>
                <th>Time</th>
                <th>Latitude</th>
                <th>Longitude</th>
                <th>Altitude</th>
                <th>Status</th>
            </tr>
            <tr>
                <td>WP001</td>
                <td>14:30:22</td>
                <td>40.7128</td>
                <td>-74.0060</td>
                <td>50m</td>
                <td>Reached</td>
            </tr>
            <tr>
                <td>WP002</td>
                <td>14:31:15</td>
                <td>40.7138</td>
                <td>-74.0070</td>
                <td>55m</td>
                <td>Reached</td>
            </tr>
            <tr>
                <td>WP003</td>
                <td>14:32:08</td>
                <td>40.7148</td>
                <td>-74.0080</td>
                <td>60m</td>
                <td>Reached</td>
            </tr>
        </table>
    </div>

    <div class="section">
        <h2>Anomalies and Warnings</h2>
        <ul>
            <li>No critical anomalies detected</li>
            <li>Minor GPS signal fluctuation at 14:35:12 (resolved automatically)</li>
            <li>Wind speed exceeded 15 m/s briefly at waypoint 15</li>
        </ul>
    </div>

    <div class="section">
        <h2>Media Captured</h2>
        <ul>
            <li>Photos: 156 images</li>
            <li>Video: 12 minutes 45 seconds</li>
            <li>Thermal data: Available</li>
            <li>LiDAR data: 2.3 GB</li>
        </ul>
    </div>
</body>
</html>
    `;
  };

  const handleFlightSelection = (flightId: string) => {
    setSelectedFlight(flightId);
    const report = generateMockReport(flightId);
    setReportData(report);
  };

  const handleDownloadReport = () => {
    if (!reportData) return;
    
    const blob = new Blob([reportData], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flight_report_${selectedFlight}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-success text-success-foreground">Completed</Badge>;
      case 'partial':
        return <Badge variant="secondary">Partial</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Flight Reports</h1>
          <p className="text-muted-foreground">Select a flight to view detailed logs and analysis</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Flight Selection Panel */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <FileText className="w-6 h-6 text-primary" />
              <span>Available Flights</span>
            </CardTitle>
            <CardDescription>Select a flight to generate report</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Select value={selectedFlight} onValueChange={handleFlightSelection}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a flight..." />
                </SelectTrigger>
                <SelectContent>
                  {flights.map((flight) => (
                    <SelectItem key={flight.id} value={flight.id}>
                      {flight.name} - {flight.date}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="space-y-2">
                {flights.map((flight) => (
                  <div
                    key={flight.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedFlight === flight.id 
                        ? 'bg-primary/10 border-primary' 
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => handleFlightSelection(flight.id)}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-sm">{flight.name}</div>
                        {getStatusBadge(flight.status)}
                      </div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{flight.date}</span>
                          <Clock className="w-3 h-3 ml-2" />
                          <span>{flight.time}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3" />
                          <span>{flight.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Activity className="w-3 h-3" />
                          <span>{flight.duration} • {flight.distance}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Report Display Panel */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Eye className="w-6 h-6 text-primary" />
                <span>Flight Report</span>
              </div>
              {selectedFlight && (
                <Button 
                  onClick={handleDownloadReport}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download HTML</span>
                </Button>
              )}
            </CardTitle>
            <CardDescription>
              {selectedFlight 
                ? 'Generated HTML report with flight analysis and logs'
                : 'Select a flight from the left panel to view its report'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedFlight && reportData ? (
              <div className="h-96 border rounded-lg overflow-hidden">
                <iframe
                  srcDoc={reportData}
                  className="w-full h-full border-0"
                  title="Flight Report"
                />
              </div>
            ) : (
              <div className="h-96 border rounded-lg flex items-center justify-center text-center">
                <div className="space-y-2">
                  <FileText className="w-16 h-16 text-muted-foreground mx-auto" />
                  <p className="text-muted-foreground">No flight selected</p>
                  <p className="text-xs text-muted-foreground">
                    Choose a flight from the list to generate and view its detailed report
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}