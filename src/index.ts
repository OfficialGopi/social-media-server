import { mongoConnect } from "./utils/monogo.connect.js";

mongoConnect();

import { socketIo } from "./socket.js";

socketIo();

import { port } from "./constants/env.constants.js";
import { httpServer } from "./app.js";

httpServer.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
