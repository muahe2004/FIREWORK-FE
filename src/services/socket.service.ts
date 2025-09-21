import { io } from "socket.io-client";
import { Socket } from "socket.io-client";

import storage from "@/utils/storage";

// const host = import.meta.env.VITE_CHAT_URL;
// const host = "https://co-dev.aiacademy.edu.vn/api-chat";
// const host = "http://localhost:6007";

export const connectionSocket = () => {
  const socket = io({
    extraHeaders: {
      authorization: `${storage.getToken()}`,
    },
    path: "/socket",
  });
  return socket;
};

export const emitSocket = (event: string, data: any) => {
  const socket = connectionSocket();
  socket.emit(event, data);
  // socket.disconnect();
};

export const disconnectSocket = (socket: Socket) => {
  socket.disconnect();
};
