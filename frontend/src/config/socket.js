import { io } from "socket.io-client";

export const socket = io(import.meta.env.VITE_SOCKET_URL, {
  autoConnect: false,
  withCredentials: true,
});

export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
    console.log("Socket connected:", socket.id);
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
    console.log("Socket disconnected");
  }
};
