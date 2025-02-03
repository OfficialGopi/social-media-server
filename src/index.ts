import { httpServer } from "./app.js";
import { port } from "./constants/env.constants.js";
import { mongoConnect } from "./utils/monogo.connect.js";

mongoConnect();

import { io, initializeIo } from "./socket.js";

initializeIo(io);

httpServer.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
