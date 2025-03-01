import { mongoConnect } from "./utils/monogo.connect.js";

mongoConnect();

import { httpServer } from "./app.js";

import { socketIo } from "./socket.js";
socketIo();

import { port } from "./constants/env.constants.js";

httpServer.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
