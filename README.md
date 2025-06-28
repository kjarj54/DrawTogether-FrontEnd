# DrawTogether Frontend

A real-time collaborative drawing application built with React, TypeScript, and WebSockets. Users can create or join drawing rooms and collaborate in real-time on a shared canvas.

![React](https://img.shields.io/badge/React-19.1.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)
![Vite](https://img.shields.io/badge/Vite-6.3.5-purple)

## ✨ Features

- **Real-time Collaboration**: Multiple users can draw simultaneously on the same canvas
- **Room Management**: Create and join drawing rooms with unique codes
- **Drawing Tools**: 
  - Brush tool with customizable colors and sizes
  - Eraser tool
  - Clear canvas functionality
  - Undo/Redo operations
- **User Management**: Simple user setup with username and avatar selection
- **Participants Panel**: See who's currently in the room
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Updates**: Instant synchronization of all drawing actions

## 🚀 Tech Stack

- **React 19.1.0** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Zustand** - State management
- **WebSockets** - Real-time communication
- **Tailwind CSS** - Styling (via index.css)
- **Lucide React** - Icons
- **Immer** - Immutable state updates

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- DrawTogether Backend running on port 8080

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd drawtogether-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory (optional):
   ```env
   VITE_WS_URL=ws://localhost:8080
   ```
   If not specified, it defaults to `ws://localhost:8080`

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🎮 Usage

### Getting Started
1. **User Setup**: Enter your username and select an avatar
2. **Lobby**: Create a new room or join an existing one with a room code
3. **Drawing Room**: Start collaborating on the shared canvas

### Drawing Controls
- **Brush Tool**: Select colors and adjust brush size
- **Eraser**: Remove parts of the drawing
- **Clear Canvas**: Clear the entire canvas (synced with all users)
- **Undo/Redo**: Navigate through drawing history

### Room Features
- **Participants Panel**: View all users currently in the room
- **Leave Room**: Return to lobby
- **Logout**: Return to user setup

## 📜 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── drawing/        # Drawing-related components
│   │   ├── DrawingCanvas.tsx
│   │   └── ToolPanel.tsx
│   ├── room/           # Room management components
│   │   └── ParticipantsPanel.tsx
│   └── ui/             # Basic UI components
│       ├── Button.tsx
│       ├── Input.tsx
│       └── Modal.tsx
├── hooks/              # Custom React hooks
│   ├── useCanvas.ts    # Canvas drawing logic
│   ├── useUser.ts      # User management
│   └── useWebSocket.ts # WebSocket connection
├── pages/              # Main application pages
│   ├── Login.tsx       # User setup page
│   ├── Lobby.tsx       # Room selection page
│   └── Room.tsx        # Drawing room page
├── services/           # External services
│   └── WebSocketService.ts
├── store/              # State management
│   ├── useAppStore.ts     # App-wide state
│   └── useDrawingStore.ts # Drawing state
├── types/              # TypeScript type definitions
│   └── types.d.ts
├── constants/          # App constants
│   └── Constants.ts
└── utils/              # Utility functions
```

## 🔌 WebSocket Integration

The frontend connects to the backend via WebSockets for real-time features:

- **Connection**: Automatically connects when entering a room
- **Events**: Handles drawing events, user joins/leaves, room updates
- **Reconnection**: Automatic reconnection on connection loss

### WebSocket Events
- `STROKE_START` - Begin drawing stroke
- `STROKE_MOVE` - Continue drawing stroke
- `STROKE_END` - End drawing stroke
- `CLEAR_CANVAS` - Clear canvas
- `UNDO` - Undo last action
- `REDO` - Redo last undone action

## 🎨 Customization

### Adding New Drawing Tools
1. Add tool constants in `src/constants/Constants.ts`
2. Implement tool logic in `src/hooks/useCanvas.ts`
3. Add UI controls in `src/components/drawing/ToolPanel.tsx`

### Styling
The application uses a CSS-in-JS approach with Tailwind-like classes. Main styles are in:
- `src/index.css` - Global styles
- `src/App.css` - App-specific styles
- Component-level className props

## 🌐 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🐛 Troubleshooting

### Common Issues

**WebSocket Connection Failed**
- Ensure the backend server is running on port 8080
- Check if the WebSocket URL is correct in constants
- Verify firewall settings

**Canvas Not Responding**
- Clear browser cache
- Check browser console for errors
- Ensure touch-action CSS is properly set

**Build Errors**
- Delete `node_modules` and run `npm install` again
- Check TypeScript errors with `npm run lint`
- Ensure Node.js version compatibility

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section above
- Review the browser console for error messages