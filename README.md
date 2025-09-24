# DeMeet - Enhanced Security And Blockchain Based Online Meeting Platform

A modern, decentralized video conferencing platform built with React, Express.js, and blockchain technology. DeMeet offers secure, encrypted video calls with Web3 integration for organizational access control.

## 🚀 Features

- **Secure Video Conferencing**: End-to-end encrypted video/audio calls
- **Blockchain Integration**: Solana wallet authentication for organizations
- **Real-time Communication**: WebRTC-based peer-to-peer connections
- **Smart Scheduling**: Calendar integration with notifications
- **Screen Sharing**: Share your screen during meetings
- **Role-based Access**: Blockchain-based identity verification
- **Google OAuth**: Sign in with Google account
- **Responsive Design**: Dark/light theme support
<!-- - **Meeting Recording**: Secure storage of meeting logs -->

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite
- **Tailwind CSS** for styling
- **Shadcn/UI** components
- **React Router** for navigation
- **TanStack Query** for data fetching
- **Zustand** for state management
- **Socket.io Client** for real-time communication
- **PeerJS** for WebRTC connections
- **Solana Wallet Adapter** for Web3 integration

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **Socket.io** for real-time features
- **JWT** authentication
- **Passport.js** with Google OAuth
- **Cloudinary** for file storage
- **Winston** for logging

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Google OAuth credentials (for authentication)
- Cloudinary account (for file uploads)

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd DeMeet
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the server directory:

```env
# Database
MONGO_DB_URL=mongodb://localhost:27017/demeet

# JWT Secrets
ACCESS_TOKEN_SECRET=your-access-token-secret
REFRESH_TOKEN_SECRET=your-refresh-token-secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_EXPIRY=7d

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:8000/api/users/auth/google/callback

# Session
SESSION_SECRET=your-session-secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-secret

# Client URL
CLIENT_URL=http://localhost:5173

# Server Port
PORT=8000
```

### 3. Frontend Setup

```bash
cd client
npm install
```

Create a `.env` file in the client directory:

```env
VITE_API_URL=http://localhost:8000/api
VITE_SOCKET_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

### 4. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized origins: `http://localhost:5173`
6. Add redirect URIs: `http://localhost:8000/api/users/auth/google/callback`

## 🚀 Running the Application

### Development Mode

1. **Start the Backend Server:**
   ```bash
   cd server
   npm run api
   ```
   The API server will run on `http://localhost:8000`

2. **Start the Video Server (Socket.io):**
   ```bash
   cd server
   npm run video
   ```

3. **Start the Frontend:**
   ```bash
   cd client
   npm run dev
   ```
   The client will run on `http://localhost:5173`

### Production Build

1. **Build the Frontend:**
   ```bash
   cd client
   npm run build
   ```

2. **Start the Backend:**
   ```bash
   cd server
   npm start
   ```

## 📁 Project Structure

```
DeMeet/
├── client/                 # React frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── ui/       # UI components (Radix UI)
│   │   │   ├── auth/     # Authentication components
│   │   │   ├── HomePage/ # Landing page components
│   │   │   └── Room/     # Video room components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   ├── hooks/        # Custom React hooks
│   │   ├── contexts/     # React contexts
│   │   ├── store/        # Zustand stores
│   │   └── lib/          # Utilities
│   ├── package.json
│   └── vite.config.js
├── server/                # Express backend
│   ├── src/
│   │   ├── controllers/  # Route controllers
│   │   ├── models/       # MongoDB models
│   │   ├── services/     # Business logic
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Custom middleware
│   │   ├── config/       # Configuration files
│   │   └── utils/        # Utility functions
│   └── package.json
└── README.md
```

## 🔐 Authentication

DeMeet supports multiple authentication methods:

1. **Email/Password**: Traditional registration and login
2. **Google OAuth**: Sign in with Google account
3. **Solana Wallet**: Web3 authentication for organizations

## 🎥 Using the Platform

### Creating a Meeting
1. Sign up/Login to your account
2. Go to Dashboard
3. Click "Create Room" for personal meetings
4. Click "Create Solana Room" for organization meetings (requires wallet)

### Joining a Meeting
1. Use the meeting ID/code provided by the host
2. Enter through the "Join Meeting" option
3. For organization meetings, connect your Solana wallet

### Meeting Features
- **Video/Audio Controls**: Mute/unmute, camera on/off
- **Screen Sharing**: Share your screen with participants
- **Chat**: Real-time text messaging
- **Copy Room ID**: Share meeting access with others

## 🐛 Troubleshooting

### Common Issues

1. **Backend Dependencies Missing:**
   ```bash
   cd server
   npm install passport passport-google-oauth20 express-session googleapis
   ```

2. **MongoDB Connection Issues:**
   - Ensure MongoDB is running locally or check cloud connection string
   - Verify the `MONGO_DB_URL` in your `.env` file

3. **Google OAuth Not Working:**
   - Check Google Cloud Console configuration
   - Verify redirect URIs match your environment
   - Ensure client ID is correctly set in both frontend and backend

4. **Video/Audio Issues:**
   - Check browser permissions for camera/microphone
   - Ensure HTTPS in production (required for WebRTC)
   - Verify firewall settings for peer connections

## 📜 Available Scripts

### Backend (server/)
- `npm run api` - Start API server with nodemon
- `npm run video` - Start video server with socket.io
- `npm run format` - Format code with Prettier

### Frontend (client/)
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👥 Authors

- **Yashasvi Saxena** - Backend Development
- **Contributors** - Frontend & Integration

## 🆘 Support

For support and questions:
1. Check the troubleshooting section above
2. Create an issue in the repository
3. Review the [Google OAuth Implementation Guide](GOOGLE_OAUTH_IMPLEMENTATION.md)

---

**Note**: This project is in active development. Some features may be experimental or under testing.