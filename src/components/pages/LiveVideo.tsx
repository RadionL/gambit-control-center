// Gambit Navigation System Live Video

import { useEffect, useRef, useState } from 'react';
import { Play, Pause, Circle, Square, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { RecordStatus } from '@/types';
import { apiService } from '@/services/api';
import { wsService } from '@/services/websocket';

export function LiveVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [recordStatus, setRecordStatus] = useState<RecordStatus>({ recording: false, duration: 0 });
  const [videoError, setVideoError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Subscribe to recording status updates
    const unsubscribeRecord = wsService.onRecordStatus((data) => {
      setRecordStatus(data);
    });

    // Subscribe to recording completion
    const unsubscribeRecordDone = wsService.onRecordDone((data) => {
      toast({
        title: 'Recording Complete',
        description: (
          <div className="space-y-2">
            <p>Recording saved successfully</p>
            <a 
              href={`${apiService.getVideoStreamUrl().replace('/index.m3u8', '')}/${data.path}`}
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download Recording
            </a>
          </div>
        ),
        duration: 10000,
      });
    });

    return () => {
      unsubscribeRecord();
      unsubscribeRecordDone();
    };
  }, [toast]);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleStartRecording = async () => {
    try {
      await apiService.startRecording();
      toast({
        title: 'Recording Started',
        description: 'Video recording has begun',
      });
    } catch (error) {
      console.error('Failed to start recording:', error);
      toast({
        title: 'Error',
        description: 'Failed to start recording',
        variant: 'destructive',
      });
    }
  };

  const handleStopRecording = async () => {
    try {
      await apiService.stopRecording();
      toast({
        title: 'Recording Stopped',
        description: 'Video recording has been stopped',
      });
    } catch (error) {
      console.error('Failed to stop recording:', error);
      toast({
        title: 'Error',
        description: 'Failed to stop recording',
        variant: 'destructive',
      });
    }
  };

  const handleVideoError = () => {
    setVideoError('Failed to load video stream');
    setIsPlaying(false);
  };

  const handleVideoLoad = () => {
    setVideoError(null);
  };

  const formatRecordingTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const streamUrl = apiService.getVideoStreamUrl();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Live Video Feed</h1>
          <p className="text-muted-foreground">Real-time video streaming and recording</p>
        </div>
        
        {/* Recording Status */}
        <div className="flex items-center space-x-4">
          {recordStatus.recording && (
            <div className="flex items-center space-x-2">
              <div className="status-indicator recording animate-pulse" />
              <span className="text-sm font-medium">
                REC {formatRecordingTime(recordStatus.duration)}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Video Player */}
        <Card className="xl:col-span-3">
          <CardHeader>
            <CardTitle>Live Stream</CardTitle>
            <CardDescription>HLS video stream from navigation system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              {videoError ? (
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <div className="text-lg font-semibold mb-2">Video Stream Unavailable</div>
                    <div className="text-sm">{videoError}</div>
                  </div>
                </div>
              ) : (
                <video
                  ref={videoRef}
                  className="w-full h-full object-contain"
                  autoPlay
                  muted={isMuted}
                  playsInline
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onError={handleVideoError}
                  onLoadStart={handleVideoLoad}
                >
                  <source src={streamUrl} type="application/x-mpegURL" />
                  Your browser does not support HLS video streaming.
                </video>
              )}
              
              {/* Video Controls Overlay */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handlePlayPause}
                    disabled={!!videoError}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleMuteToggle}
                    disabled={!!videoError}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </Button>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="text-sm text-white bg-black/50 px-2 py-1 rounded">
                    LIVE
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recording Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Recording Controls</CardTitle>
            <CardDescription>Video recording management</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status</span>
                <span className={`text-sm font-semibold ${recordStatus.recording ? 'text-destructive' : 'text-muted-foreground'}`}>
                  {recordStatus.recording ? 'Recording' : 'Stopped'}
                </span>
              </div>
              
              {recordStatus.recording && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Duration</span>
                  <span className="text-sm font-mono">
                    {formatRecordingTime(recordStatus.duration)}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              {!recordStatus.recording ? (
                <Button
                  onClick={handleStartRecording}
                  className="w-full bg-gradient-danger hover:shadow-danger"
                  disabled={!!videoError}
                >
                  <Circle className="w-4 h-4 mr-2" />
                  Start Recording
                </Button>
              ) : (
                <Button
                  onClick={handleStopRecording}
                  variant="outline"
                  className="w-full"
                >
                  <Square className="w-4 h-4 mr-2" />
                  Stop Recording
                </Button>
              )}
            </div>

            <div className="text-xs text-muted-foreground">
              <p>• Recording will be saved automatically</p>
              <p>• Download link will appear when complete</p>
              <p>• Maximum recording time: 2 hours</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}