// Gambit Navigation System API Service

import { 
  SystemHealth, 
  Flight, 
  Mission, 
  Setting, 
  AuthResponse, 
  ApiResponse, 
  ErrorResponse,
  User
} from '@/types';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('access_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error: ErrorResponse = await response.json().catch(() => ({
        detail: 'Network error',
        code: 'NETWORK_ERROR',
        timestamp: new Date().toISOString(),
      }));
      throw new Error(error.detail || 'Request failed');
    }

    return response.json();
  }

  // Authentication
  async login(username: string, password: string): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    
    this.token = response.access_token;
    localStorage.setItem('access_token', response.access_token);
    
    return response;
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('access_token');
  }

  // System Health
  async getHealth(): Promise<SystemHealth> {
    return this.request<SystemHealth>('/health');
  }

  // Mission Control
  async startMission(): Promise<Mission> {
    return this.request<Mission>('/mission/start', { method: 'POST' });
  }

  async abortMission(): Promise<Mission> {
    return this.request<Mission>('/mission/abort', { method: 'POST' });
  }

  async getMissionStatus(): Promise<Mission> {
    return this.request<Mission>('/mission/status');
  }

  // Flights
  async getFlights(params: { limit?: number; offset?: number; order?: 'asc' | 'desc' } = {}): Promise<Flight[]> {
    const queryParams = new URLSearchParams();
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.offset) queryParams.append('offset', params.offset.toString());
    if (params.order) queryParams.append('order', params.order);
    
    const query = queryParams.toString();
    return this.request<Flight[]>(`/flights${query ? `?${query}` : ''}`);
  }

  async getFlightReport(id: string): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/flights/${id}/report`, {
      headers: this.token ? { Authorization: `Bearer ${this.token}` } : {},
    });
    return response.text();
  }

  async downloadFlightLogs(id: string): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/flights/${id}/logs`, {
      headers: this.token ? { Authorization: `Bearer ${this.token}` } : {},
    });
    return response.blob();
  }

  // Video Recording
  async startRecording(): Promise<void> {
    await this.request<void>('/video/record/start', { method: 'POST' });
  }

  async stopRecording(): Promise<void> {
    await this.request<void>('/video/record/stop', { method: 'POST' });
  }

  // Settings
  async getSettings(): Promise<Setting[]> {
    return this.request<Setting[]>('/settings');
  }

  async updateSetting(key: string, value: string | number | boolean): Promise<Setting> {
    return this.request<Setting>(`/settings/${key}`, {
      method: 'PATCH',
      body: JSON.stringify({ value }),
    });
  }

  // File Upload
  async uploadFile(file: File, onProgress?: (progress: number) => void): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    const xhr = new XMLHttpRequest();
    
    return new Promise((resolve, reject) => {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable && onProgress) {
          onProgress((e.loaded / e.total) * 100);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          resolve(response.upload_id);
        } else {
          reject(new Error('Upload failed'));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'));
      });

      xhr.open('POST', `${API_BASE_URL}/upload`);
      if (this.token) {
        xhr.setRequestHeader('Authorization', `Bearer ${this.token}`);
      }
      xhr.send(formData);
    });
  }

  async getUploadStatus(uploadId: string): Promise<{ status: string; progress: number }> {
    return this.request<{ status: string; progress: number }>(`/upload/${uploadId}/status`);
  }

  // User Management
  async getCurrentUser(): Promise<User> {
    return this.request<User>('/user/me');
  }

  getVideoStreamUrl(): string {
    return `${API_BASE_URL}/video/live/index.m3u8`;
  }
}

export const apiService = new ApiService();