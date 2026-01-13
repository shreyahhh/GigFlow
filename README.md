# GigFlow

A modern, full-stack freelancing marketplace platform built with the MERN stack. GigFlow enables fluid user roles where any user can post gigs (as a client) or bid on gigs (as a freelancer).

## 🚀 Features

- **User Authentication**: Secure JWT-based authentication with HTTP-Only cookies
- **Gig Management**: Post, browse, and search gigs with real-time updates
- **Bidding System**: Submit bids with messages and pricing
- **Hiring Logic**: Atomic transaction-based hiring system with race condition prevention
- **Real-time Notifications**: Socket.io-powered instant notifications
- **Dark Theme UI**: Modern, responsive black/charcoal theme
- **My Bids Dashboard**: Track all your bids and their statuses

## 🛠️ Tech Stack

### Frontend
- **React 18** with **Vite** - Fast development and build
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Socket.io Client** - Real-time communication
- **Axios** - HTTP client
- **React Toastify** - Notifications

### Backend
- **Node.js** with **Express.js** - RESTful API
- **MongoDB** with **Mongoose** - Database and ODM
- **JWT** - Authentication tokens
- **Socket.io** - Real-time server
- **Bcryptjs** - Password hashing
- **Cookie Parser** - HTTP cookie handling

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas account)
- npm or yarn

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd serviceHive
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```
   This installs dependencies for root, server, and client.

3. **Set up environment variables**
   
   Create a `.env` file in the `server` directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   PORT=5000
   NODE_ENV=development
   ```
   
   For MongoDB Atlas:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/gigflow?retryWrites=true&w=majority
   ```
   
   For local MongoDB:
   ```
   MONGODB_URI=mongodb://localhost:27017/gigflow
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

   This starts both frontend and backend concurrently:
   - **Frontend**: http://localhost:5173
   - **Backend**: http://localhost:5000

## 📁 Project Structure

```
serviceHive/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── auth/      # Authentication components
│   │   │   ├── bids/      # Bidding components
│   │   │   ├── gigs/      # Gig management components
│   │   │   ├── layout/    # Layout components
│   │   │   ├── routing/   # Route protection
│   │   │   └── socket/   # Socket.io connection
│   │   ├── store/         # Redux store and slices
│   │   ├── App.jsx        # Main app component
│   │   ├── main.jsx       # Entry point
│   │   └── index.css      # Global styles
│   ├── index.html
│   └── package.json
│
├── server/                 # Express backend application
│   ├── middleware/         # Custom middleware
│   │   └── auth.js        # JWT authentication
│   ├── models/           # Mongoose models
│   │   ├── User.js
│   │   ├── Gig.js
│   │   └── Bid.js
│   ├── routes/            # API routes
│   │   ├── auth.js        # Authentication routes
│   │   ├── gigs.js        # Gig routes
│   │   └── bids.js        # Bid routes
│   ├── server.js         # Express server setup
│   ├── .env.example       # Environment variables template
│   └── package.json
│
├── .gitignore
├── package.json           # Root package.json with scripts
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Gigs
- `GET /api/gigs` - Get all gigs (with optional search and status filter)
- `POST /api/gigs` - Create a new gig (protected)

### Bids
- `POST /api/bids` - Submit a bid (protected)
- `GET /api/bids/:gigId` - Get bids for a specific gig (owner only)
- `GET /api/bids/my/bids` - Get current user's bids
- `PATCH /api/bids/:bidId/hire` - Hire a freelancer (atomic transaction)

## 🎯 Key Features Explained

### Atomic Hiring Transaction
The hiring process uses MongoDB transactions to ensure data consistency:
- Updates gig status from "open" to "assigned"
- Marks selected bid as "hired"
- Automatically rejects all other bids for that gig
- Prevents race conditions with transaction isolation

### Real-time Notifications
- Socket.io integration for instant updates
- Freelancers receive notifications when hired
- No page refresh required

### Security
- JWT tokens stored in HTTP-Only cookies
- Password hashing with bcrypt
- Protected routes with authentication middleware
- CORS configured for secure cross-origin requests

## 🧪 Development Scripts

### Root Level
- `npm run dev` - Start both frontend and backend
- `npm run server` - Start only backend server
- `npm run client` - Start only frontend client
- `npm run install-all` - Install all dependencies

### Server
- `npm run dev` - Start server with nodemon/watch mode

### Client
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🚢 Deployment

### Quick Deploy to Vercel

**Frontend (Vercel):**
1. Push code to GitHub
2. Import project in Vercel dashboard
3. Set root directory to `client`
4. Add environment variables:
   - `VITE_API_URL` = Your backend URL
   - `VITE_SOCKET_URL` = Your backend URL
5. Deploy!

**Backend (Railway/Render):**
1. Deploy `server` folder
2. Add environment variables (see DEPLOYMENT.md)
3. Update `FRONTEND_URL` with your Vercel URL

📖 **Full deployment guide**: See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## 📝 Environment Variables

See `server/.env.example` for required environment variables.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is part of a Full Stack Development Internship Assignment.

## 👤 Author

Built as part of the ServiceHive internship program.

## 📧 Contact

For questions or issues, please contact:
- Email: ritik.yadav@servicehive.tech
- CC: hiring@servicehive.tech

---

**Note**: This is a demonstration project showcasing full-stack development skills including authentication, database relationships, state management, and real-time features.
