// Gambit Navigation System Types

export interface SystemHealth {
  cpu: number;
  temp: number;
  disk: number;
  memory: number;
  battery: number;
  sat_fix: number;
  fps: number;
  latitude?: number;
  longitude?: number;
  status: 'HEALTHY' | 'WARNING' | 'CRITICAL';
  timestamp: string;
}

export interface SystemIndicators {
  cpu: number;
  temp: number;
  disk: number;
  mem: number;
  battery: number;
  sat: number;
  fps: number;
  connected: boolean;
}

export interface Mission {
  id: string;
  status: 'IDLE' | 'RUNNING' | 'COMPLETED' | 'ABORTED';
  created_at: string;
  started_at?: string;
  completed_at?: string;
  duration?: number;
}

export interface Flight {
  id: string;
  date: string;
  duration: number;
  status: 'COMPLETED' | 'ABORTED' | 'FAILED';
}

export interface RecordStatus {
  recording: boolean;
  duration: number;
  file_path?: string;
}

export interface Setting {
  key: string;
  value: string | number | boolean;
  type: 'string' | 'number' | 'boolean' | 'select';
  label: string;
  description?: string;
  options?: string[];
  is_critical: boolean;
}

export interface UploadProgress {
  id: string;
  filename: string;
  progress: number;
  status: 'UPLOADING' | 'VERIFYING' | 'COMPLETED' | 'FAILED';
  checksum?: string;
}

export interface User {
  id: string;
  username: string;
  role: 'operator' | 'admin';
  permissions: string[];
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

export interface WSMessage {
  event: string;
  data: any;
  timestamp: string;
}

export interface WSIndicatorsMessage extends WSMessage {
  event: 'indicators';
  data: SystemIndicators;
}

export interface WSRecordStatusMessage extends WSMessage {
  event: 'record_status';
  data: RecordStatus;
}

export interface WSMissionStatusMessage extends WSMessage {
  event: 'mission_status';
  data: Mission;
}

export interface WSRecordDoneMessage extends WSMessage {
  event: 'record_done';
  data: {
    path: string;
    duration: number;
    size: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface ErrorResponse {
  detail: string;
  code: string;
  timestamp: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  roles: ('operator' | 'admin')[];
}