import { Server, Socket } from "socket.io";
import { httpServer } from "./app.js";
import { crossOrigin } from "./constants/env.constants.js";

const io = new Server(httpServer, {
  cors: {
    origin: crossOrigin,
    credentials: true,
  },
});

io.on("connection", (socket: Socket) => {
  console.log("User connected : ", socket.id);

  // socket.on(newMessage, (data) => {});

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

export { io };
