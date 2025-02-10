import { Server, Socket } from "socket.io";
import { httpServer } from "./app.js";
import { crossOrigin } from "./constants/env.constants.js";
import {
  EVENT_NEW_MESSAGE,
  EVENT_USER_ID,
} from "./constants/socketEvents.constants.js";
import { UserModel } from "./models/user.model.js";

const io = new Server(httpServer, {
  cors: {
    origin: crossOrigin,
    credentials: true,
  },
});

const initializeIo = (io: Server) => () => {
  const socketToUserMap = new Map<string, string>();
  const userToSocketMap = new Map<string, string>();

  io.on("connection", async (socket: Socket) => {
    socket.on(EVENT_USER_ID, async (payload: { userId: string }) => {
      const { userId } = payload;
      try {
        const user = await UserModel.findById(userId);

        if (!user) {
          io.emit(EVENT_USER_ID, {
            success: false,
            error: "User not found",
          });
        } else {
          socketToUserMap.set(socket.id, userId);
          userToSocketMap.set(userId, socket.id);

          io.emit(EVENT_USER_ID, {
            success: true,
            message: "User connected to socket server",
          });
        }
      } catch (error) {
        io.emit(EVENT_USER_ID, {
          success: false,
          error: "User not found",
        });
      }
    });

    socket.on(
      EVENT_NEW_MESSAGE,
      async (payload: { message: string; receiver: string }) => {
        const { message, receiver } = payload;
        const receiverSocket = userToSocketMap.get(receiver);

        if (!receiverSocket) {
          console.log("Receiver not active right now");
        } else {
        }
      }
    );

    socket.on("disconnect", (ev, description) => {
      console.log(ev);
    });
  });
};

const socketIo = initializeIo(io);

export { socketIo };
