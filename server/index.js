const { Server, Socket } = require("socket.io");

const io = new Server(3001, {
  cors: true,
});

const EmailToSocketId = new Map();
const SocketIdToEmail = new Map();

io.on("connection", (socket) => {
  console.log("Socket Connected", socket.id);

  socket.on("room:join", (data) => {
    const { email, room } = data;

    EmailToSocketId.set(email, socket.id);
    SocketIdToEmail.set(socket.id, email);

    io.to(room).emit("user:joined", { email, id: socket.id });
    socket.join(room);

    io.to(socket.id).emit("room:join", data);
  });
});
