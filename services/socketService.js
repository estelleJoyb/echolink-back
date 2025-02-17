const jwt = require('jsonwebtoken');

class SocketService {
    constructor() {
        this.io = null;
        this.connectedUsers = new Map();
        this.connectedForumUsers = new Map();
    }

    init(server) {
        this.io = require('socket.io')(server, {
            cors: {
                origin: 'http://localhost:5173',
                methods: ["GET", "POST"],
                credentials: true
            },
            transports: ['websocket', 'polling']
        });

        // Middleware for authentication
        this.io.use(async (socket, next) => {
            try {
                const token = socket.handshake.auth.token;
                
                if (!token) {
                    return next(new Error('No token provided'));
                }

                // Verify token using your JWT_SECRET
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                
                // Attach user data to socket
                socket.userId = decoded.user.id;
                socket.user = decoded.user;
                
                next();
            } catch (err) {
                console.error('Socket authentication error:', err.message);
                next(new Error('Authentication error: ' + err.message));
            }
        });

        this.io.on('connection', (socket) => {
            console.log(`User connected: ${socket.userId}`);
            this.connectedUsers.set(socket.userId, socket.id);

            // Join user's own room
            socket.join(socket.userId);

            socket.on('disconnect', () => {
                console.log(`User disconnected: ${socket.userId}`);
                this.connectedUsers.delete(socket.userId);
            });

            // Handle joining conversation rooms
            socket.on('join_conversation', (conversationId) => {
                socket.join(conversationId);
                console.log(`User ${socket.userId} joined conversation ${conversationId}`);
            });

            socket.on('leave_conversation', (conversationId) => {
                socket.leave(conversationId);
                console.log(`User ${socket.userId} left conversation ${conversationId}`);
            });
        });

        this.io.on('connectionForum', (socket) => {
            console.log(`User connected: ${socket.userId}`);
            this.connectedForumUsers.set(socket.userId, socket.id);

            // Join user's own room
            socket.join(socket.userId);

            socket.on('disconnect', () => {
                console.log(`User disconnected: ${socket.userId}`);
                this.connectedForumUsers.delete(socket.userId);
            });

            // Handle joining forum rooms
            socket.on('join_forum', (forumId) => {
                socket.join(forumId);
                console.log(`User ${socket.userId} joined forum ${forumId}`);
            });

            socket.on('leave_forum', (forumId) => {
                socket.leave(forumId);
                console.log(`User ${socket.userId} left forum ${forumId}`);
            });
        });

        console.log("WebSocket server initialized with authentication");
    }

    // Get socket instance
    getIO() {
        if (!this.io) {
            throw new Error("Socket.io not initialized.");
        }
        return this.io;
    }

    // Send message to specific user
    sendToUser(userId, event, data) {
        const socketId = this.connectedUsers.get(userId);
        if (socketId) {
            this.io.to(socketId).emit(event, data);
        }
    }

    // Send message to multiple users
    sendToUsers(userIds, event, data) {
        userIds.forEach(userId => {
            this.sendToUser(userId, event, data);
        });
    }

    // Join conversation room
    joinConversation(userId, conversationId) {
        const socketId = this.connectedUsers.get(userId);
        if (socketId) {
            this.io.sockets.sockets.get(socketId)?.join(conversationId);
        }
    }
}

const socketService = new SocketService();
module.exports = socketService;