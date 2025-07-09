// Gambit Navigation System Missions

import { useEffect, useState } from 'react';
import { RefreshCw, FileText, Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Flight } from '@/types';
import { apiService } from '@/services/api';
import { useNavigate } from 'react-router-dom';

export function Missions() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadFlights();
  }, []);

  const loadFlights = async () => {
    try {
      setLoading(true);
      const data = await apiService.getFlights({ order: 'desc' });
      setFlights(data);
    } catch (error) {
      console.error('Failed to load flights:', error);
      toast({
        title: 'Error',
        description: 'Failed to load flight data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewReport = (flightId: string) => {
    navigate(`/reports?flight=${flightId}`);
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 60 / 60);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'ABORTED':
      case 'FAILED':
        return <XCircle className="w-4 h-4 text-destructive" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'text-success';
      case 'ABORTED':
      case 'FAILED':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mission History</h1>
          <p className="text-muted-foreground">Flight records and mission data</p>
        </div>
        <Button
          onClick={loadFlights}
          variant="outline"
          size="sm"
          className="flex items-center space-x-2"
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Flight Records</span>
          </CardTitle>
          <CardDescription>
            Complete history of all flights and missions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : flights.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No flight records found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Flight ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {flights.map((flight) => (
                  <TableRow 
                    key={flight.id} 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleViewReport(flight.id)}
                  >
                    <TableCell className="font-mono">{flight.id}</TableCell>
                    <TableCell className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{new Date(flight.date).toLocaleDateString()}</span>
                      <span className="text-muted-foreground text-sm">
                        {new Date(flight.date).toLocaleTimeString()}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono">
                      {formatDuration(flight.duration)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(flight.status)}
                        <span className={`font-medium ${getStatusColor(flight.status)}`}>
                          {flight.status}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewReport(flight.id);
                        }}
                      >
                        View Report
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}