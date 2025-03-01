import { Request } from "express";
import { Types } from "mongoose";
import { Server } from "socket.io";

const emitEvent = (
  req: Request,
  event: string,
  users: Types.ObjectId[],
  data: any
) => {
  const io = req.app.get("io") as Server;

  for (const user of users) {
    io.to(user.toString()).emit(event, data);
  }
};

export { emitEvent };
