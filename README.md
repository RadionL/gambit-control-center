# Gambit Navigation System

A modern, operator-facing web GUI for the Gambit navigation system built with React, TypeScript, and Tailwind CSS.

## Features

- **Mission Control Dashboard** - System health monitoring and mission control
- **Live Video Streaming** - HLS video feed with recording capabilities
- **Flight Management** - Mission history and flight record management
- **Real-time Indicators** - WebSocket-based status updates
- **Authentication** - JWT-based user authentication
- **Responsive Design** - Optimized for 1280×800 to 1920×1080 displays
- **Dark Theme** - Professional mission control interface

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **UI Components**: Shadcn/UI component library
- **State Management**: TanStack Query
- **Routing**: React Router v6
- **WebSocket**: Real-time data streaming
- **Build Tool**: Vite

## Prerequisites

- Node.js 18+ and npm
- Backend FastAPI server running at `http://localhost:8000`
- WebSocket server at `ws://localhost:8000/ws/indicators`

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd gambit-navigation-ui
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (optional):
```bash
# Create .env file for custom API endpoints
REACT_APP_API_BASE_URL=http://localhost:8000
REACT_APP_WS_URL=ws://localhost:8000
```

4. Start the development server:
```bash
npm run dev
```

## Building for Production

```bash
npm run build
npm run preview
```

## Docker Deployment

```bash
# Build the application
npm run build

# Create Docker image
docker build -t gambit-navigation-ui .

# Run container
docker run -p 3000:3000 gambit-navigation-ui
```

## Architecture

### Core Components

- **StatusBar** - Real-time system indicators
- **AppSidebar** - Navigation menu with role-based access
- **Dashboard** - Mission control center
- **LiveVideo** - HLS video streaming with recording
- **Missions** - Flight history and management

### Services

- **ApiService** - REST API communication
- **WebSocketService** - Real-time data streaming
- **Authentication** - JWT token management

### API Endpoints

- `GET /health` - System health status
- `POST /mission/start` - Start mission
- `POST /mission/abort` - Abort mission
- `GET /flights` - Flight history
- `POST /video/record/start` - Start recording
- `POST /video/record/stop` - Stop recording
- `GET /video/live/index.m3u8` - HLS video stream

### WebSocket Events

- `indicators` - System metrics (CPU, memory, battery, etc.)
- `mission_status` - Mission state changes
- `record_status` - Recording status updates
- `record_done` - Recording completion

## User Roles

- **Operator** - Dashboard, video, missions, logs access
- **Admin** - All operator permissions + settings, firmware upload

## Security

- JWT bearer token authentication
- Role-based access control
- Secure WebSocket connections
- Input validation and sanitization

## Performance

- Lighthouse score target: ≥90
- Accessibility score: ≥85
- Mobile responsive (600px breakpoint)
- Optimized for mission-critical environments

## Development

### Code Structure

```
src/
├── components/
│   ├── layout/          # Layout components
│   ├── pages/           # Page components
│   └── ui/              # UI components
├── services/            # API and WebSocket services
├── types/               # TypeScript interfaces
├── hooks/               # Custom React hooks
└── assets/              # Static assets
```

### Design System

- **Colors**: Mission control dark theme with blue accents
- **Typography**: Inter for UI, JetBrains Mono for data
- **Components**: Consistent styling with CSS variables
- **Animations**: Smooth transitions and status indicators

## Troubleshooting

### Common Issues

1. **WebSocket Connection Failed**
   - Check backend server is running
   - Verify WebSocket URL configuration
   - Ensure proper authentication token

2. **Video Stream Not Loading**
   - Confirm HLS stream endpoint is accessible
   - Check browser HLS support
   - Verify network connectivity

3. **Build Errors**
   - Clear node_modules and reinstall
   - Check TypeScript configuration
   - Verify all imports are correct

## Contributing

1. Follow TypeScript best practices
2. Use semantic commit messages
3. Ensure all tests pass
4. Update documentation for new features

## License

Proprietary - Authorized personnel only