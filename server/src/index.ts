import { Server } from "socket.io";
import Controller from "./controller";

const PORT = 8000;
const io = new Server(PORT, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => new Controller(socket));

console.log(`Server started on port ${PORT}`);
