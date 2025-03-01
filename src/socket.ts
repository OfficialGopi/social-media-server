import { Server, Socket } from "socket.io";
import { io } from "./app.js";
import {
  EVENT_NEW_MESSAGE,
  EVENT_USER_ID,
} from "./constants/socketEvents.constants.js";
import { UserModel } from "./models/user.model.js";

const initializeIo = (io: Server) => () => {
  io.on("connection", async (socket: Socket) => {
    socket.on(EVENT_USER_ID, async (payload: { userId: string }) => {
      socket.join(payload.userId);
    });

    socket.on("disconnect", (ev, description) => {
      console.log(ev);
    });
  });
};

const socketIo = initializeIo(io);

export { socketIo, io };
